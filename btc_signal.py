#!/usr/bin/env python3
"""
Bitcoin Gerçek Zamanlı Teknik Analiz & Sinyal Sistemi
Binomo demo hesabı için karar destek aracı
"""

import requests
import pandas as pd
import ta
from datetime import datetime, timezone
import time
import sys

# ═══════════════════════════════════════════════════════════════
#  VERİ ÇEKME - Binance API (Gerçek piyasa verisi)
# ═══════════════════════════════════════════════════════════════

def get_btc_data(interval="1m", limit=200):
    """Binance'den BTC/USDT mum verisi çeker"""
    url = "https://api.binance.com/api/v3/klines"
    params = {
        "symbol": "BTCUSDT",
        "interval": interval,
        "limit": limit
    }
    try:
        r = requests.get(url, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        print(f"  ❌ Veri çekme hatası: {e}")
        return None

    df = pd.DataFrame(data, columns=[
        "open_time", "open", "high", "low", "close", "volume",
        "close_time", "quote_vol", "trades", "taker_buy_base",
        "taker_buy_quote", "ignore"
    ])

    for col in ["open", "high", "low", "close", "volume"]:
        df[col] = df[col].astype(float)

    df["time"] = pd.to_datetime(df["open_time"], unit="ms")
    return df


# ═══════════════════════════════════════════════════════════════
#  TEKNİK ANALİZ
# ═══════════════════════════════════════════════════════════════

def calculate_indicators(df):
    """Tüm teknik indikatörleri hesaplar"""

    # RSI (14 periyot)
    df["rsi"] = ta.momentum.RSIIndicator(df["close"], window=14).rsi()

    # MACD
    macd = ta.trend.MACD(df["close"], window_slow=26, window_fast=12, window_sign=9)
    df["macd"] = macd.macd()
    df["macd_signal"] = macd.macd_signal()
    df["macd_hist"] = macd.macd_diff()

    # Bollinger Bands
    bb = ta.volatility.BollingerBands(df["close"], window=20, window_dev=2)
    df["bb_upper"] = bb.bollinger_hband()
    df["bb_lower"] = bb.bollinger_lband()
    df["bb_mid"] = bb.bollinger_mavg()

    # EMA (Exponential Moving Average)
    df["ema_9"] = ta.trend.EMAIndicator(df["close"], window=9).ema_indicator()
    df["ema_21"] = ta.trend.EMAIndicator(df["close"], window=21).ema_indicator()
    df["ema_50"] = ta.trend.EMAIndicator(df["close"], window=50).ema_indicator()

    # Stochastic RSI
    stoch = ta.momentum.StochRSIIndicator(df["close"], window=14)
    df["stoch_k"] = stoch.stochrsi_k()
    df["stoch_d"] = stoch.stochrsi_d()

    # ADX (Trend gücü)
    adx = ta.trend.ADXIndicator(df["high"], df["low"], df["close"], window=14)
    df["adx"] = adx.adx()

    # ATR (Volatilite)
    df["atr"] = ta.volatility.AverageTrueRange(df["high"], df["low"], df["close"], window=14).average_true_range()

    # Volume SMA
    df["vol_sma"] = df["volume"].rolling(window=20).mean()

    return df


# ═══════════════════════════════════════════════════════════════
#  SİNYAL SİSTEMİ - Çoklu onay
# ═══════════════════════════════════════════════════════════════

def generate_signal(df):
    """Birden fazla indikatörü birleştirerek sinyal üretir"""

    last = df.iloc[-1]
    prev = df.iloc[-2]
    signals = {}
    score = 0  # pozitif = YUKARI, negatif = AŞAĞI

    # ── 1. RSI Analizi ──
    rsi = last["rsi"]
    if rsi < 30:
        signals["RSI"] = ("YUKARI ↑", "Aşırı satım bölgesi - toparlanma beklenir")
        score += 2
    elif rsi < 40:
        signals["RSI"] = ("YUKARI ↑", "Satım bölgesine yakın")
        score += 1
    elif rsi > 70:
        signals["RSI"] = ("AŞAĞI ↓", "Aşırı alım bölgesi - düşüş beklenir")
        score -= 2
    elif rsi > 60:
        signals["RSI"] = ("AŞAĞI ↓", "Alım bölgesine yakın")
        score -= 1
    else:
        signals["RSI"] = ("NÖTR ─", "Nötr bölge")

    # ── 2. MACD Analizi ──
    if last["macd"] > last["macd_signal"] and prev["macd"] <= prev["macd_signal"]:
        signals["MACD"] = ("YUKARI ↑", "Bullish crossover! Güçlü alım sinyali")
        score += 3
    elif last["macd"] < last["macd_signal"] and prev["macd"] >= prev["macd_signal"]:
        signals["MACD"] = ("AŞAĞI ↓", "Bearish crossover! Güçlü satım sinyali")
        score -= 3
    elif last["macd"] > last["macd_signal"]:
        signals["MACD"] = ("YUKARI ↑", "MACD sinyal çizgisinin üstünde")
        score += 1
    elif last["macd"] < last["macd_signal"]:
        signals["MACD"] = ("AŞAĞI ↓", "MACD sinyal çizgisinin altında")
        score -= 1
    else:
        signals["MACD"] = ("NÖTR ─", "Nötr")

    # ── 3. Bollinger Bands ──
    price = last["close"]
    if price <= last["bb_lower"]:
        signals["BOLLINGER"] = ("YUKARI ↑", "Alt banda dokundu - sıçrama beklenir")
        score += 2
    elif price >= last["bb_upper"]:
        signals["BOLLINGER"] = ("AŞAĞI ↓", "Üst banda dokundu - geri çekilme beklenir")
        score -= 2
    elif price < last["bb_mid"]:
        signals["BOLLINGER"] = ("AŞAĞI ↓", "Orta bandın altında")
        score -= 0.5
    else:
        signals["BOLLINGER"] = ("YUKARI ↑", "Orta bandın üstünde")
        score += 0.5

    # ── 4. EMA Trend ──
    if last["ema_9"] > last["ema_21"] > last["ema_50"]:
        signals["EMA TREND"] = ("YUKARI ↑", "Güçlü yükseliş trendi (9>21>50)")
        score += 2
    elif last["ema_9"] < last["ema_21"] < last["ema_50"]:
        signals["EMA TREND"] = ("AŞAĞI ↓", "Güçlü düşüş trendi (9<21<50)")
        score -= 2
    elif last["ema_9"] > last["ema_21"]:
        signals["EMA TREND"] = ("YUKARI ↑", "Kısa vadeli yükseliş")
        score += 1
    elif last["ema_9"] < last["ema_21"]:
        signals["EMA TREND"] = ("AŞAĞI ↓", "Kısa vadeli düşüş")
        score -= 1
    else:
        signals["EMA TREND"] = ("NÖTR ─", "Kararsız")

    # ── 5. Stochastic RSI ──
    if last["stoch_k"] < 0.2 and last["stoch_k"] > last["stoch_d"]:
        signals["STOCH RSI"] = ("YUKARI ↑", "Aşırı satımdan çıkış")
        score += 2
    elif last["stoch_k"] > 0.8 and last["stoch_k"] < last["stoch_d"]:
        signals["STOCH RSI"] = ("AŞAĞI ↓", "Aşırı alımdan çıkış")
        score -= 2
    elif last["stoch_k"] > last["stoch_d"]:
        signals["STOCH RSI"] = ("YUKARI ↑", "K çizgisi D'nin üstünde")
        score += 1
    else:
        signals["STOCH RSI"] = ("AŞAĞI ↓", "K çizgisi D'nin altında")
        score -= 1

    # ── 6. Hacim Analizi ──
    if last["volume"] > last["vol_sma"] * 1.5:
        signals["HACİM"] = ("GÜÇLÜ", "Normalin 1.5x üstünde hacim - sinyal güçlü")
        score = score * 1.3  # Hacim sinyali güçlendirir
    elif last["volume"] > last["vol_sma"]:
        signals["HACİM"] = ("NORMAL", "Ortalama hacim")
    else:
        signals["HACİM"] = ("ZAYIF", "Düşük hacim - sinyal zayıf olabilir")
        score = score * 0.7  # Düşük hacim sinyali zayıflatır

    # ── 7. ADX (Trend gücü) ──
    adx_val = last["adx"]
    if adx_val > 25:
        signals["TREND GÜCÜ"] = ("GÜÇLÜ", f"ADX: {adx_val:.1f} - Güçlü trend mevcut")
    else:
        signals["TREND GÜCÜ"] = ("ZAYIF", f"ADX: {adx_val:.1f} - Zayıf trend, dikkatli ol")
        score = score * 0.6

    return signals, score, last


# ═══════════════════════════════════════════════════════════════
#  SONUÇ GÖSTERİMİ
# ═══════════════════════════════════════════════════════════════

def display_result(signals, score, last, interval):
    """Sonuçları güzel formatta gösterir"""

    now = datetime.now(timezone.utc).strftime("%H:%M:%S UTC")
    price = last["close"]

    print("\n" + "═" * 60)
    print(f"  🔷 BTC/USDT TEKNİK ANALİZ - {now}")
    print(f"  📊 Zaman Dilimi: {interval} | Fiyat: ${price:,.2f}")
    print("═" * 60)

    for name, (direction, detail) in signals.items():
        print(f"  {name:15s} │ {direction:10s} │ {detail}")

    print("─" * 60)

    # Karar
    abs_score = abs(score)
    if abs_score < 2:
        confidence = "DÜŞÜK"
        emoji = "⚪"
    elif abs_score < 4:
        confidence = "ORTA"
        emoji = "🟡"
    elif abs_score < 6:
        confidence = "YÜKSEK"
        emoji = "🟢"
    else:
        confidence = "ÇOK YÜKSEK"
        emoji = "🔥"

    if score > 1.5:
        decision = "YUKARI ↑ (YEŞİL BUTON)"
        color_hint = "🟢"
    elif score < -1.5:
        decision = "AŞAĞI ↓ (KIRMIZI BUTON)"
        color_hint = "🔴"
    else:
        decision = "BEKLEMEDESİN - İŞLEM YAPMA"
        color_hint = "⏸️"

    print(f"\n  {color_hint} KARAR: {decision}")
    print(f"  {emoji} Güven: {confidence} (Skor: {score:+.1f})")
    print(f"  📈 RSI: {last['rsi']:.1f} | MACD Hist: {last['macd_hist']:.2f}")
    print(f"  📉 BB Alt: ${last['bb_lower']:,.2f} | BB Üst: ${last['bb_upper']:,.2f}")

    if abs_score < 2:
        print(f"\n  ⚠️  SİNYAL ZAYIF - Bu işlemi geçmeni öneririm!")

    print("═" * 60)
    return decision


# ═══════════════════════════════════════════════════════════════
#  ANA DÖNGÜ
# ═══════════════════════════════════════════════════════════════

def run_once(interval="1m"):
    """Tek seferlik analiz"""
    df = get_btc_data(interval=interval, limit=200)
    if df is None:
        return
    df = calculate_indicators(df)
    signals, score, last = generate_signal(df)
    display_result(signals, score, last, interval)


def run_loop(interval="1m", refresh=30):
    """Sürekli analiz döngüsü"""
    print(f"\n  🚀 Bitcoin Sinyal Sistemi Başlatıldı!")
    print(f"  ⏱️  Her {refresh} saniyede bir güncellenir")
    print(f"  📊 Zaman dilimi: {interval}")
    print(f"  ❌ Durdurmak için Ctrl+C\n")

    try:
        while True:
            run_once(interval)
            print(f"\n  ⏳ {refresh}sn sonra güncelleniyor...")
            time.sleep(refresh)
    except KeyboardInterrupt:
        print("\n\n  🛑 Sistem durduruldu. İyi işlemler!")


if __name__ == "__main__":
    interval = sys.argv[1] if len(sys.argv) > 1 else "1m"
    mode = sys.argv[2] if len(sys.argv) > 2 else "once"

    if mode == "loop":
        run_loop(interval=interval, refresh=30)
    else:
        run_once(interval=interval)
