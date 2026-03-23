import { useState } from 'react';
import Badge from '../components/Badge';

export default function GameDetailPage({
  game,
  onBack,
  onAddToCart,
  onAddToWishlist,
  isInCart,
  isInWishlist,
}) {
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);

  const mainImage = game.screenshots?.[selectedScreenshot] || game.image_url;

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return 'Çok Olumlu';
    if (rating >= 3.5) return 'Olumlu';
    if (rating >= 2.5) return 'Karışık';
    return 'Olumsuz';
  };

  const discountPercentage = game.original_price
    ? Math.round(((game.original_price - game.price) / game.original_price) * 100)
    : 0;

  const mockReviews = [
    {
      id: 1,
      username: 'Ahmet_Oyuncu',
      rating: 5,
      date: '15 Mart 2026',
      comment: 'Harika bir oyun! Grafikleri ve hikayesi gerçekten etkileyici. Saatler boyunca oynadım ve hiç sıkılmadım.',
    },
    {
      id: 2,
      username: 'Eylül_Gamer',
      rating: 4,
      date: '12 Mart 2026',
      comment: 'Çok eğlenceli ama biraz kısa. Fiyatına göre daha fazla içerik beklerdim. Yine de tavsiye ederim.',
    },
    {
      id: 3,
      username: 'Kaan_Oyuncu',
      rating: 4,
      date: '10 Mart 2026',
      comment: 'Teknik olarak çok iyi optimize edilmiş. Düşük sistem gereksinimlerine rağmen görünüş harika.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-800 to-zinc-950 text-zinc-100">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur border-b border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <span className="text-xl">←</span>
            <span>Geri</span>
          </button>
          <h1 className="text-3xl font-bold">{game.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="rounded-lg overflow-hidden">
              <img
                src={mainImage}
                alt={game.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Screenshot Gallery */}
            {game.screenshots && game.screenshots.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Ekran Görüntüleri</h2>
                <div className="grid grid-cols-4 gap-3">
                  {game.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedScreenshot(index)}
                      className={`rounded-lg overflow-hidden transition-all ${
                        selectedScreenshot === index
                          ? 'ring-2 ring-purple-500'
                          : 'hover:opacity-80'
                      }`}
                    >
                      <img
                        src={screenshot}
                        alt={`Ekran ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Game Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Oyun Hakkında</h2>
              <p className="text-zinc-300 leading-relaxed">{game.description}</p>
            </div>

            {/* Tags */}
            {game.tags && game.tags.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Etiketler</h2>
                <div className="flex flex-wrap gap-2">
                  {game.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* System Requirements */}
            {game.system_req && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Sistem Gereksinimleri</h2>
                <div className="grid grid-cols-2 gap-6">
                  {/* Minimum Requirements */}
                  <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                    <h3 className="text-lg font-semibold mb-4 text-purple-400">
                      Minimum
                    </h3>
                    <div className="space-y-3 text-sm">
                      {game.system_req.min_os && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">İşletim Sistemi:</span>
                          <span>{game.system_req.min_os}</span>
                        </div>
                      )}
                      {game.system_req.min_cpu && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">İşlemci:</span>
                          <span>{game.system_req.min_cpu}</span>
                        </div>
                      )}
                      {game.system_req.min_ram && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Bellek:</span>
                          <span>{game.system_req.min_ram}</span>
                        </div>
                      )}
                      {game.system_req.min_storage && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Depolama:</span>
                          <span>{game.system_req.min_storage}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommended Requirements */}
                  <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                    <h3 className="text-lg font-semibold mb-4 text-green-400">
                      Önerilen
                    </h3>
                    <div className="space-y-3 text-sm">
                      {game.system_req.rec_os && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">İşletim Sistemi:</span>
                          <span>{game.system_req.rec_os}</span>
                        </div>
                      )}
                      {game.system_req.rec_cpu && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">İşlemci:</span>
                          <span>{game.system_req.rec_cpu}</span>
                        </div>
                      )}
                      {game.system_req.rec_ram && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Bellek:</span>
                          <span>{game.system_req.rec_ram}</span>
                        </div>
                      )}
                      {game.system_req.rec_storage && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Depolama:</span>
                          <span>{game.system_req.rec_storage}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Reviews */}
            <div className="bg-zinc-800/30 rounded-lg p-8 border border-zinc-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Kullanıcı Değerlendirmeleri</h2>
                <button
                  disabled
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Değerlendirme Yaz
                </button>
              </div>

              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-purple-400">
                          {review.username}
                        </p>
                        <p className="text-xs text-zinc-500">{review.date}</p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < review.rating
                                ? 'text-yellow-400'
                                : 'text-zinc-600'
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Purchase Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-zinc-800/50 rounded-lg p-6 border border-zinc-700 space-y-6">
              {/* Rating */}
              {game.rating && (
                <div className="text-center pb-6 border-b border-zinc-700">
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < Math.round(game.rating)
                            ? 'text-2xl text-yellow-400'
                            : 'text-2xl text-zinc-600'
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-lg font-semibold text-purple-400">
                    {getRatingLabel(game.rating)}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {game.review_count || 0} değerlendirme
                  </p>
                </div>
              )}

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-purple-400">
                    ₺{game.price.toFixed(2)}
                  </span>
                  {game.original_price && game.original_price > game.price && (
                    <>
                      <span className="text-lg text-zinc-500 line-through">
                        ₺{game.original_price.toFixed(2)}
                      </span>
                      {discountPercentage > 0 && (
                        <Badge variant="danger">-%{discountPercentage}</Badge>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => onAddToCart(game)}
                disabled={isInCart}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  isInCart
                    ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                    : 'bg-indigo-500/90 text-white hover:bg-indigo-500 active:scale-[0.98]'
                }`}
              >
                {isInCart ? '✓ Sepette' : 'Sepete Ekle'}
              </button>

              {/* Add to Wishlist Button */}
              <button
                onClick={() => onAddToWishlist(game)}
                className={`w-full py-3 rounded-lg font-semibold transition-colors border ${
                  isInWishlist
                    ? 'bg-pink-600/20 border-pink-500 text-pink-300 hover:bg-pink-600/30'
                    : 'bg-zinc-900/50 border-zinc-600 text-zinc-300 hover:border-pink-500 hover:text-pink-300'
                }`}
              >
                {isInWishlist ? '♥ İstek Listesinde' : 'İstek Listesine Ekle'}
              </button>

              {/* Game Info */}
              <div className="space-y-3 pt-6 border-t border-zinc-700 text-sm">
                {game.developer && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Yapımcı</span>
                    <span className="font-semibold">{game.developer}</span>
                  </div>
                )}
                {game.genre && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Tür</span>
                    <span className="font-semibold">{game.genre}</span>
                  </div>
                )}
                {game.release_date && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Çıkış Tarihi</span>
                    <span className="font-semibold">
                      {new Date(game.release_date).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
