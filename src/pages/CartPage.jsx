import React, { useState } from "react";
import Badge from "../components/Badge";

const CartPage = ({
  cart,
  onRemove,
  onClear,
  onGoToStore,
  showToast,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode);
      setCouponCode("");
      if (showToast) {
        showToast("Kupon uygulandı!", "success");
      }
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  const discountAmount = appliedCoupon ? 0 : 0;
  const total = subtotal - discountAmount;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold mb-2">Sepet Boş</h2>
          <p className="text-zinc-400 mb-6">Henüz oyun eklemedin</p>
          <button
            onClick={() => onGoToStore()}
            className="bg-indigo-500/90 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Mağazaya Git
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-8 mb-8">
        <h1 className="text-4xl font-bold">Alışveriş Sepeti</h1>
      </div>

      <div className="px-8 max-w-6xl mx-auto pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 flex gap-4"
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-24 h-24 bg-zinc-800 rounded overflow-hidden">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-3">
                      {item.studio}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      {item.original_price && item.original_price > item.price ? (
                        <>
                          <span className="text-sm text-zinc-500 line-through">
                            ₺{item.original_price.toFixed(2)}
                          </span>
                          <span className="text-lg font-bold text-emerald-400">
                            ₺{item.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold">
                          {item.price === 0 ? "Ücretsiz" : `₺${item.price.toFixed(2)}`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemove(item.id)}
                    className="flex-shrink-0 text-rose-400 hover:text-rose-300 font-semibold transition-colors py-2 px-4 h-fit"
                  >
                    Kaldır
                  </button>
                </div>
              ))}
            </div>

            {/* Coupon Section */}
            <div className="mt-8 bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Kupon Kodu</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  placeholder="Kupon kodunu gir..."
                  className="flex-1 bg-white/5 border border-white/10 rounded px-4 py-2 text-white placeholder-zinc-500 outline-none focus:border-indigo-400/50"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-indigo-500/90 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded transition-colors"
                >
                  Uygula
                </button>
              </div>
              {appliedCoupon && (
                <div className="text-emerald-400 text-sm">Kupon uygulandı!</div>
              )}
            </div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold mb-4">Özet</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                {/* Item Count */}
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Ürün Sayısı</span>
                  <span className="text-white">{cart.length}</span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Ara Toplam</span>
                  <span className="text-white">₺{subtotal.toFixed(2)}</span>
                </div>

                {/* Discount */}
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Kupon İndirimi</span>
                    <span className="text-emerald-400">-₺0</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg font-bold">Toplam</span>
                  <span className="text-2xl font-bold text-indigo-400">
                    ₺{total.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">KDV dahil</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => onClear()}
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Sepeti Temizle
                </button>
                <button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded transition-colors text-lg"
                >
                  Satın Al — ₺{total.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
