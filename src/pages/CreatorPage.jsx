import { useState } from "react";

export default function CreatorPage({ user, onAuthClick }) {
  const [tab, setTab] = useState("overview");

  if (!user) {
    return (
      <>
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="text-5xl">🛠</div>
          <h2 className="mt-4 text-lg font-semibold text-zinc-200">Yapımcı Paneli</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Oyunlarını yayınlamak için giriş yapman gerekiyor.
          </p>
          <button
            type="button"
            onClick={onAuthClick}
            className="mt-4 rounded-xl bg-indigo-500/90 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Giriş Yap
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="p-4">
        {/* Sekmeler */}
        <div className="mb-6 flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          {[
            { id: "overview", label: "Genel Bakış" },
            { id: "upload", label: "Oyun Yükle" },
            { id: "stats", label: "Satış İstatistikleri" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={[
                "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition",
                tab === t.id ? "bg-white/10 text-zinc-50" : "text-zinc-400 hover:text-zinc-200",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && <OverviewTab />}
        {tab === "upload" && <UploadTab />}
        {tab === "stats" && <StatsTab />}
      </section>
    </>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
      <div className="p-4">
        <div className="text-[11px] uppercase tracking-wider text-zinc-500">Yapımcı Paneli</div>
        <h1 className="text-xl font-semibold text-zinc-50">Oyunlarını Yayınla</h1>
      </div>
    </header>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Toplam Satış" value="0" subtitle="Henüz satış yok" icon="💰" />
        <StatCard title="Toplam Gelir" value="₺0" subtitle="%10 komisyon sonrası" icon="📊" />
        <StatCard title="Yayınlanan Oyun" value="0" subtitle="Oyun yükle!" icon="🎮" />
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-sm font-semibold text-zinc-200">Nasıl Çalışır?</h3>
        <div className="mt-3 space-y-3 text-sm text-zinc-400">
          <div className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">1</span>
            <span>Oyununu "Oyun Yükle" sekmesinden yükle ve bilgilerini doldur.</span>
          </div>
          <div className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">2</span>
            <span>Oyunun incelendikten sonra mağazada yayınlanır.</span>
          </div>
          <div className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">3</span>
            <span>Her satıştan sadece %10 komisyon alınır, %90 senin!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <div className="text-[11px] uppercase tracking-wider text-zinc-500">{title}</div>
      </div>
      <div className="mt-2 text-2xl font-bold text-zinc-100">{value}</div>
      <div className="mt-1 text-xs text-zinc-500">{subtitle}</div>
    </div>
  );
}

function UploadTab() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-lg font-semibold text-zinc-100">Yeni Oyun Yükle</h3>
      <p className="mt-1 text-sm text-zinc-400">
        Oyununu indieHub'da yayınla. Sadece %10 komisyon!
      </p>

      <div className="mt-6 space-y-4">
        <FormField label="Oyun Adı" placeholder="Oyunun adı" />
        <FormField label="Stüdyo / Yapımcı" placeholder="Stüdyo adın" />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Fiyat (₺)" placeholder="0" type="number" />
          <FormField label="İndirimli Fiyat (₺)" placeholder="Opsiyonel" type="number" />
        </div>

        <FormField label="Açıklama" placeholder="Oyunun hakkında kısa bir açıklama..." textarea />
        <FormField label="Etiketler" placeholder="RPG, Indie, Roguelite (virgülle ayır)" />

        <div>
          <label className="block text-sm font-medium text-zinc-200">Kapak Görseli</label>
          <div className="mt-1 flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/5 text-sm text-zinc-500 transition hover:border-white/20 cursor-pointer">
            📷 Görsel sürükle veya tıkla
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-200">Ekran Görüntüleri (en az 2)</label>
          <div className="mt-1 flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/5 text-sm text-zinc-500 transition hover:border-white/20 cursor-pointer">
            🖼 Ekran görüntülerini sürükle
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-200">Oyun Dosyası (.zip)</label>
          <div className="mt-1 flex h-20 items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/5 text-sm text-zinc-500 transition hover:border-white/20 cursor-pointer">
            📦 .zip dosyasını sürükle veya tıkla
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">
          ⚠️ Oyunun yüklendikten sonra inceleme sürecine alınacaktır. Onaylandıktan sonra mağazada yayınlanır.
        </div>

        <button
          type="button"
          className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-400 active:scale-[0.98]"
        >
          Oyunu Yayınla
        </button>
      </div>
    </div>
  );
}

function FormField({ label, placeholder, type = "text", textarea = false }) {
  const cls =
    "mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20";
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-200">{label}</label>
      {textarea ? (
        <textarea placeholder={placeholder} rows={3} className={cls + " resize-none"} />
      ) : (
        <input type={type} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

function StatsTab() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
      <div className="text-4xl">📊</div>
      <h3 className="mt-3 text-lg font-semibold text-zinc-200">İstatistikler</h3>
      <p className="mt-1 text-sm text-zinc-500">
        İlk oyununu yayınladığın zaman burada satış verilerini göreceksin.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-zinc-500">Bu Ay</div>
          <div className="mt-1 text-xl font-bold text-zinc-200">₺0</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-zinc-500">Toplam</div>
          <div className="mt-1 text-xl font-bold text-zinc-200">₺0</div>
        </div>
      </div>
    </div>
  );
}
