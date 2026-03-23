import Badge from "./Badge";

export default function GameCard({ game, onAddToCart, onAddToWishlist, onSelect, isInCart, isInWishlist }) {
  const rating = Number.isFinite(game?.rating) ? game.rating : 0;
  const price = Number.isFinite(game?.price) ? game.price : 0;
  const originalPrice = Number.isFinite(game?.original_price) ? game.original_price : 0;
  const hasDiscount = originalPrice > 0 && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round((1 - price / originalPrice) * 100) : 0;
  const firstTag = game?.tags?.[0] ?? "Indie";

  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition hover:border-white/20 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-indigo-500/5"
      onClick={() => onSelect?.(game)}
    >
      {/* Kapak Görseli */}
      <div className="relative aspect-video w-full overflow-hidden">
        {game.image_url ? (
          <img
            src={game.image_url}
            alt={game.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-indigo-500/30 via-fuchsia-500/20 to-emerald-500/20" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/60 to-transparent opacity-0 transition group-hover:opacity-100" />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge>{rating.toFixed(1)} ★</Badge>
          <Badge>{firstTag}</Badge>
        </div>
        {hasDiscount && (
          <div className="absolute right-3 top-3 rounded-full bg-rose-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
            -%{discountPercent}
          </div>
        )}
        {price === 0 && (
          <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
            ÜCRETSİZ
          </div>
        )}
      </div>

      {/* Bilgiler */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-zinc-50">
              {game.title}
            </h3>
            <p className="truncate text-sm text-zinc-400">{game.studio}</p>
          </div>
          <div className="shrink-0 text-right">
            {hasDiscount && (
              <div className="text-xs text-zinc-500 line-through">₺{originalPrice}</div>
            )}
            <div className={`text-sm font-semibold ${hasDiscount ? "text-emerald-400" : "text-zinc-100"}`}>
              {price === 0 ? "Ücretsiz" : `₺${price}`}
            </div>
            {price > 0 && <div className="text-[11px] text-zinc-500">KDV dahil</div>}
          </div>
        </div>

        {game.description && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-zinc-400">
            {game.description}
          </p>
        )}

        {game.review_count > 0 && (
          <div className="mt-2 text-[11px] text-zinc-500">
            {game.review_count} değerlendirme
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {game.tags.slice(0, 3).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onAddToCart?.(game)}
            disabled={isInCart}
            className={[
              "flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition",
              isInCart
                ? "bg-emerald-500/20 text-emerald-300 cursor-default"
                : "bg-indigo-500/90 text-white hover:bg-indigo-500 active:scale-[0.98]",
            ].join(" ")}
          >
            {isInCart ? "✓ Sepette" : "Sepete Ekle"}
          </button>
          <button
            type="button"
            onClick={() => onAddToWishlist?.(game)}
            className={[
              "rounded-xl border px-3 py-2 text-sm font-semibold transition",
              isInWishlist
                ? "border-pink-500/30 bg-pink-500/10 text-pink-300"
                : "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10",
            ].join(" ")}
            aria-label={isInWishlist ? "İstek listesinden çıkar" : "İstek listesine ekle"}
            title={isInWishlist ? "İstek listesinden çıkar" : "İstek listesine ekle"}
          >
            {isInWishlist ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </article>
  );
}
