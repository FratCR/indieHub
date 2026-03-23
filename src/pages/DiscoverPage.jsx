import React, { useMemo } from "react";
import GameCard from "../components/GameCard";
import Badge from "../components/Badge";

const DiscoverPage = ({
  games,
  wishlist,
  cart,
  onAddToCart,
  onAddToWishlist,
  onSelectGame,
  onGoToStore,
}) => {
  // Get recommendations based on wishlist tags
  const recommendations = useMemo(() => {
    if (wishlist.length === 0) return [];

    const wishlistTags = new Set();
    wishlist.forEach((item) => {
      if (item.tags) {
        item.tags.forEach((tag) => wishlistTags.add(tag));
      }
    });

    const wishlistIds = new Set(wishlist.map((item) => item.id));
    const cartIds = new Set(cart.map((item) => item.id));

    return games
      .filter((game) => {
        // Don't recommend if already in wishlist or cart
        if (wishlistIds.has(game.id) || cartIds.has(game.id)) return false;

        // Must share at least one tag with wishlist items
        if (!game.tags) return false;
        return game.tags.some((tag) => wishlistTags.has(tag));
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }, [games, wishlist, cart]);

  // Group games by tags
  const gamesByTag = useMemo(() => {
    const tagMap = {};

    games.forEach((game) => {
      if (game.tags) {
        game.tags.forEach((tag) => {
          if (!tagMap[tag]) {
            tagMap[tag] = [];
          }
          tagMap[tag].push(game);
        });
      }
    });

    // Sort tags by count descending, then alphabetically
    return Object.entries(tagMap)
      .sort(([, gamesA], [, gamesB]) => {
        const countDiff = gamesB.length - gamesA.length;
        return countDiff !== 0 ? countDiff : gamesA[0].tags[0].localeCompare(gamesB[0].tags[0]);
      })
      .reduce((acc, [tag, tagGames]) => {
        acc[tag] = tagGames;
        return acc;
      }, {});
  }, [games]);

  // Top 5 by rating
  const topRated = useMemo(() => {
    return [...games].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }, [games]);

  // Games sorted by release date (newest first)
  const newReleases = useMemo(() => {
    return [...games]
      .filter((game) => game.release_date)
      .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
      .slice(0, 10);
  }, [games]);

  const ScrollableRow = ({ children, className = "" }) => (
    <div className={`flex overflow-x-auto gap-4 pb-4 ${className}`}>
      {children}
    </div>
  );

  if (games.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Oyun Bulunamadı</h2>
          <p className="text-zinc-400">Lütfen daha sonra tekrar deneyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-8 mb-8">
        <h1 className="text-4xl font-bold mb-2">Keşfet</h1>
        <p className="text-zinc-400">Beğenebileceğin oyunları keşfet</p>
      </div>

      <div className="px-8 max-w-7xl mx-auto">
        {/* Personalized Recommendations */}
        {wishlist.length > 0 && recommendations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Senin İçin Öneriler</h2>
            <ScrollableRow>
              {recommendations.map((game) => (
                <div key={game.id} className="flex-shrink-0 w-56">
                  <GameCard
                    game={game}
                    isInWishlist={wishlist.some((item) => item.id === game.id)}
                    isInCart={cart.some((item) => item.id === game.id)}
                    onAddToCart={() => onAddToCart(game)}
                    onAddToWishlist={() => onAddToWishlist(game)}
                    onSelect={() => onSelectGame(game)}
                  />
                </div>
              ))}
            </ScrollableRow>
          </section>
        )}

        {/* Browse by Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Kategorilere Göz At</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Object.entries(gamesByTag).map(([tag, tagGames]) => (
              <button
                key={tag}
                onClick={() => onGoToStore({ filterTag: tag })}
                className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
              >
                <div className="font-semibold text-white mb-1">{tag}</div>
                <div className="text-sm text-zinc-400">
                  {tagGames.length} oyun
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Top Rated */}
        {topRated.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">En Yüksek Puanlılar</h2>
            <ScrollableRow>
              {topRated.map((game) => (
                <div key={game.id} className="flex-shrink-0 w-56">
                  <GameCard
                    game={game}
                    isInWishlist={wishlist.some((item) => item.id === game.id)}
                    isInCart={cart.some((item) => item.id === game.id)}
                    onAddToCart={() => onAddToCart(game)}
                    onAddToWishlist={() => onAddToWishlist(game)}
                    onSelect={() => onSelectGame(game)}
                  />
                </div>
              ))}
            </ScrollableRow>
          </section>
        )}

        {/* New Releases */}
        {newReleases.length > 0 && (
          <section className="mb-12 pb-8">
            <h2 className="text-2xl font-bold mb-4">Yeni Çıkanlar</h2>
            <ScrollableRow>
              {newReleases.map((game) => (
                <div key={game.id} className="flex-shrink-0 w-56">
                  <GameCard
                    game={game}
                    isInWishlist={wishlist.some((item) => item.id === game.id)}
                    isInCart={cart.some((item) => item.id === game.id)}
                    onAddToCart={() => onAddToCart(game)}
                    onAddToWishlist={() => onAddToWishlist(game)}
                    onSelect={() => onSelectGame(game)}
                  />
                </div>
              ))}
            </ScrollableRow>
          </section>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
