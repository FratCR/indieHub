import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import Badge from '../components/Badge';

// Simple SVG icon components to replace lucide-react
const ChevronLeft = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);
const ChevronRight = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);
const SearchIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);

const StorePage = ({
  games,
  loading,
  errorMessage,
  cart,
  wishlist,
  onAddToCart,
  onAddToWishlist,
  onSelectGame,
  query,
  onQueryChange,
  sort,
  onSortChange,
}) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [scrollPositions, setScrollPositions] = useState({});

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (games.length === 0) return;
    const featuredGames = games.slice(0, 4);
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featuredGames.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [games]);

  const handleCarouselPrev = () => {
    const featuredGames = games.slice(0, 4);
    setCarouselIndex((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);
  };

  const handleCarouselNext = () => {
    const featuredGames = games.slice(0, 4);
    setCarouselIndex((prev) => (prev + 1) % featuredGames.length);
  };

  const handleCategoryScroll = (categoryId, direction) => {
    const container = document.getElementById(`scroll-${categoryId}`);
    if (container) {
      const scrollAmount = 400;
      const newPosition = (scrollPositions[categoryId] || 0) + (direction === 'left' ? -scrollAmount : scrollAmount);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPositions({ ...scrollPositions, [categoryId]: newPosition });
    }
  };

  const calculateDiscount = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return null;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const getCategories = () => {
    return [
      {
        id: 'new-releases',
        label: 'Bu Hafta Yeni Çıkanlar',
        games: games.slice(0, 8),
      },
      {
        id: 'top-rated',
        label: 'En Çok Değerlendirilen',
        games: games.filter((g) => g.rating >= 4.5).slice(0, 8),
      },
      {
        id: 'free-games',
        label: 'Ücretsiz Oyunlar',
        games: games.filter((g) => g.price === 0).slice(0, 8),
      },
      {
        id: 'discounted',
        label: 'İndirimde',
        games: games.filter((g) => g.original_price && g.original_price > g.price).slice(0, 8),
      },
    ];
  };

  const getFilteredGames = () => {
    let filtered = games;

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(query.toLowerCase()) ||
          game.studio.toLowerCase().includes(query.toLowerCase()) ||
          (game.tags && game.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())))
      );
    }

    // Sort
    if (sort === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title, 'tr-TR'));
    }

    return filtered;
  };

  const featuredGames = games.slice(0, 4);
  const currentFeatured = featuredGames[carouselIndex] || null;
  const categories = getCategories();
  const filteredGames = getFilteredGames();

  const carouselDiscount = currentFeatured
    ? calculateDiscount(currentFeatured.original_price, currentFeatured.price)
    : null;

  if (loading && games.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton carousel */}
          <div className="mb-12 h-96 bg-zinc-800 rounded-lg animate-pulse"></div>

          {/* Skeleton categories */}
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="mb-8">
              <div className="h-6 w-40 bg-zinc-800 rounded animate-pulse mb-4"></div>
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-40 h-56 bg-zinc-800 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (errorMessage && games.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Hata Oluştu</h2>
          <p className="text-zinc-400">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Carousel Section */}
      {currentFeatured && (
        <div className="relative h-96 mb-12 overflow-hidden rounded-lg">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentFeatured.image_url})`,
              filter: 'brightness(0.4)',
            }}
          ></div>

          <div className="absolute inset-0 flex flex-col justify-between p-8">
            <div></div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-bold">{currentFeatured.title}</h2>
                {carouselDiscount && (
                  <Badge variant="danger" className="text-lg px-3 py-1">
                    -{carouselDiscount}%
                  </Badge>
                )}
              </div>

              <p className="text-zinc-300">{currentFeatured.studio}</p>

              <p className="text-zinc-200 max-w-2xl line-clamp-2">{currentFeatured.description}</p>

              <div className="flex gap-2 flex-wrap">
                {currentFeatured.tags &&
                  currentFeatured.tags.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-emerald-400">
                    {currentFeatured.price.toFixed(2)} ₺
                  </span>
                  {currentFeatured.original_price && currentFeatured.original_price > currentFeatured.price && (
                    <span className="text-lg text-zinc-400 line-through">
                      {currentFeatured.original_price.toFixed(2)} ₺
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onAddToCart(currentFeatured)}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition"
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <button
            onClick={handleCarouselPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 p-3 rounded-full z-10 transition"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleCarouselNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 p-3 rounded-full z-10 transition"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {featuredGames.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                className={`w-3 h-3 rounded-full transition ${
                  idx === carouselIndex ? 'bg-emerald-500' : 'bg-white/50 hover:bg-white/75'
                }`}
              ></button>
            ))}
          </div>
        </div>
      )}

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-6 mb-12 space-y-8">
        {categories.map((category) => (
          category.games.length > 0 && (
            <div key={category.id}>
              <h3 className="text-2xl font-bold mb-4">{category.label}</h3>

              <div className="relative">
                <div
                  id={`scroll-${category.id}`}
                  className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                >
                  {category.games.map((game) => (
                    <div key={game.id} className="flex-shrink-0 w-56">
                      <GameCard
                        game={game}
                        isInCart={cart.some((item) => item.id === game.id)}
                        isInWishlist={wishlist.some((item) => item.id === game.id)}
                        onAddToCart={() => onAddToCart(game)}
                        onAddToWishlist={() => onAddToWishlist(game)}
                        onSelect={() => onSelectGame(game)}
                      />
                    </div>
                  ))}
                </div>

                {/* Scroll Controls */}
                <button
                  onClick={() => handleCategoryScroll(category.id, 'left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-emerald-600 hover:bg-emerald-700 p-2 rounded-full z-10 transition hidden lg:flex"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() => handleCategoryScroll(category.id, 'right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-emerald-600 hover:bg-emerald-700 p-2 rounded-full z-10 transition hidden lg:flex"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Search and Sort Section */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <SearchIcon
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              placeholder="Oyun adı veya etiket ara..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
          >
            <option value="default">Sıralama Seçin</option>
            <option value="rating">En Yüksek Puan</option>
            <option value="price-asc">En Ucuz</option>
            <option value="price-desc">En Pahalı</option>
            <option value="title">A-Z</option>
          </select>
        </div>
      </div>

      {/* Game Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="space-y-4">
                <div className="w-full h-48 bg-zinc-800 rounded-lg animate-pulse"></div>
                <div className="h-4 bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isInCart={cart.some((item) => item.id === game.id)}
                isInWishlist={wishlist.some((item) => item.id === game.id)}
                onAddToCart={() => onAddToCart(game)}
                onAddToWishlist={() => onAddToWishlist(game)}
                onSelect={() => onSelectGame(game)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">
              {query ? 'Aramanızla eşleşen oyun bulunamadı.' : 'Oyun bulunamadı.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;
