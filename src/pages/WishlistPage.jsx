import GameCard from "../components/GameCard";

export default function WishlistPage({
  wishlist,
  cart,
  onAddToCart,
  onRemoveFromWishlist,
  onSelectGame,
  onGoToStore,
}) {
  if (wishlist.length === 0) {
    return (
      <>
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="text-5xl">💜</div>
          <h2 className="mt-4 text-lg font-semibold text-zinc-200">İstek listen boş</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Beğendiğin oyunları ♡ butonuyla istek listene ekle!
          </p>
          <button
            type="button"
            onClick={onGoToStore}
            className="mt-4 rounded-xl bg-indigo-500/90 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Mağazaya Git
          </button>
        </div>
      </>
    );
  }

  const totalValue = wishlist.reduce((sum, g) => sum + (g.price || 0), 0);
  const discountedCount = wishlist.filter((g) => g.original_price > 0 && g.original_price > g.price).length;

  return (
    <>
      <Header />
      <section className="p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-zinc-400">
            <span className="text-zinc-200">{wishlist.length}</span> oyun istek listende
            {discountedCount > 0 && (
              <span className="ml-2 text-emerald-400">• {discountedCount} tanesi indirimde!</span>
            )}
          </div>
          <div className="text-sm text-zinc-400">
            Toplam değer: <span className="font-semibold text-zinc-200">₺{totalValue.toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {wishlist.map((g) => (
            <GameCard
              key={g.id}
              game={g}
              onAddToCart={onAddToCart}
              onAddToWishlist={onRemoveFromWishlist}
              onSelect={onSelectGame}
              isInCart={cart.some((c) => c.id === g.id)}
              isInWishlist={true}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
      <div className="p-4">
        <div className="text-[11px] uppercase tracking-wider text-zinc-500">İstek Listem</div>
        <h1 className="text-xl font-semibold text-zinc-50">İstek Listesi</h1>
      </div>
    </header>
  );
}
