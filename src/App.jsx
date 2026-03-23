import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, supabaseInitError } from "./lib/supabaseClient";
import DEMO_GAMES from "./lib/demoGames";
import Sidebar from "./components/Sidebar";
import ToastContainer from "./components/Toast";
import StorePage from "./pages/StorePage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import LibraryPage from "./pages/LibraryPage";
import GameDetailPage from "./pages/GameDetailPage";
import CreatorPage from "./pages/CreatorPage";
import AuthPage from "./pages/AuthPage";
import DiscoverPage from "./pages/DiscoverPage";

/* ─── Data helpers ─── */

function normalizeGameRow(row) {
  const tags = Array.isArray(row?.tags)
    ? row.tags
    : typeof row?.tags === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(row.tags);
            if (Array.isArray(parsed)) return parsed;
          } catch { /* fallback to split */ }
          return row.tags.split(",").map((s) => s.trim()).filter(Boolean);
        })()
      : [];

  return {
    id: row?.id ?? row?.game_id ?? crypto.randomUUID?.() ?? `tmp_${Math.random()}`,
    title: row?.title ?? row?.name ?? "Untitled",
    studio: row?.studio ?? row?.Studio ?? row?.developer ?? "Unknown Studio",
    description: row?.description ?? "",
    image_url: row?.image_url ?? "",
    tags,
    price: Number(row?.price ?? 0),
    original_price: Number(row?.original_price ?? 0),
    rating: Number(row?.rating ?? 0),
    review_count: Number(row?.review_count ?? 0),
    release_date: row?.release_date ?? "",
    screenshots: Array.isArray(row?.screenshots) ? row.screenshots : [],
    system_req: row?.system_req ?? {},
  };
}

/* ─── App ─── */

export default function App() {
  // Navigation
  const [active, setActive] = useState("store");
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  // Data
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Search & filter
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("top");
  const [activeFilter, setActiveFilter] = useState("");

  // Price range filter
  const [priceRange, setPriceRange] = useState([0, 9999]);

  // Cart, Wishlist, Library
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [library] = useState([]); // Populated after purchases

  // Auth
  const [user, setUser] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ─── Load games from Supabase ─── */

  useEffect(() => {
    let cancelled = false;

    async function loadGames() {
      if (!supabase) {
        // No Supabase connection — use demo games so the UI is still usable
        setGames(DEMO_GAMES);
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("games")
        .select("id, title, description, Studio, price, original_price, rating, review_count, release_date, tags, image_url, screenshots, system_req");

      if (cancelled) return;

      if (error) {
        // On error, fall back to demo games
        console.warn("Supabase error, using demo games:", error.message);
        setGames(DEMO_GAMES);
      } else if (!data || data.length === 0) {
        // Empty table — show demos
        setGames(DEMO_GAMES);
      } else {
        setGames(data.map(normalizeGameRow));
      }
      setLoading(false);
    }

    loadGames();
    return () => { cancelled = true; };
  }, []);

  /* ─── Check existing session ─── */

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ─── Filter & Sort ─── */

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase();
    let base = games;

    // Text search
    if (q) {
      base = base.filter((g) => {
        const hay = [g.title, g.studio, ...g.tags, String(g.price), String(g.rating)]
          .join(" ").toLowerCase();
        return hay.includes(q);
      });
    }

    // Quick filter by tag
    if (activeFilter) {
      base = base.filter((g) =>
        g.tags.some((t) => t.toLowerCase() === activeFilter.toLowerCase())
      );
    }

    // Price range filter
    if (priceRange) {
      const [min, max] = priceRange;
      if (min === 0 && max === 0) {
        // "Ücretsiz" filter — only free games
        base = base.filter((g) => g.price === 0);
      } else {
        base = base.filter((g) => g.price >= min && (max >= 9999 || g.price <= max));
      }
    }

    // Sort
    const sorted = [...base];
    if (sort === "top") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "cheap") sorted.sort((a, b) => a.price - b.price);
    if (sort === "expensive") sorted.sort((a, b) => b.price - a.price);
    if (sort === "az") sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [query, sort, games, activeFilter, priceRange]);

  /* ─── Cart actions ─── */

  const addToCart = useCallback((game) => {
    if (!game || !game.id) return; // Güvenlik: geçersiz veri koruması (MouseEvent vs. game)
    setCart((prev) => {
      if (prev.find((item) => item.id === game.id)) {
        showToast("Bu oyun zaten sepetinde!", "warning");
        return prev;
      }
      showToast(`${game.title} sepete eklendi!`, "success");
      return [...prev, game];
    });
  }, [showToast]);

  const removeFromCart = useCallback((gameId) => {
    setCart((prev) => {
      const game = prev.find((g) => g.id === gameId);
      if (game) showToast(`${game.title} sepetten çıkarıldı.`, "info");
      return prev.filter((g) => g.id !== gameId);
    });
  }, [showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
    showToast("Sepet temizlendi.", "info");
  }, [showToast]);

  /* ─── Wishlist actions ─── */

  const toggleWishlist = useCallback((game) => {
    if (!game || !game.id) return; // Güvenlik: geçersiz veri koruması
    setWishlist((prev) => {
      const exists = prev.find((w) => w.id === game.id);
      if (exists) {
        showToast(`${game.title} istek listesinden çıkarıldı.`, "info");
        return prev.filter((w) => w.id !== game.id);
      }
      showToast(`${game.title} istek listesine eklendi!`, "success");
      return [...prev, game];
    });
  }, [showToast]);

  /* ─── Navigation helpers ─── */

  const goToStore = useCallback(() => {
    setActive("store");
    setSelectedGame(null);
    setShowAuth(false);
  }, []);

  const handleSelectGame = useCallback((game) => {
    setSelectedGame(game);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedGame(null);
  }, []);

  const handleNav = useCallback((id) => {
    setActive(id);
    setSelectedGame(null);
    setShowAuth(false);
  }, []);

  /* ─── Render ─── */

  // Determine which page to show
  const renderContent = () => {
    if (showAuth) {
      return (
        <AuthPage
          onBack={() => setShowAuth(false)}
          onSuccess={(u) => { setUser(u); setShowAuth(false); }}
          showToast={showToast}
        />
      );
    }

    if (selectedGame) {
      return (
        <GameDetailPage
          game={selectedGame}
          onBack={handleBack}
          onAddToCart={addToCart}
          onAddToWishlist={toggleWishlist}
          isInCart={cart.some((c) => c.id === selectedGame.id)}
          isInWishlist={wishlist.some((w) => w.id === selectedGame.id)}
        />
      );
    }

    switch (active) {
      case "store":
        return (
          <StorePage
            games={filteredGames}
            loading={loading}
            errorMessage={errorMessage}
            cart={cart}
            wishlist={wishlist}
            onAddToCart={addToCart}
            onAddToWishlist={toggleWishlist}
            onSelectGame={handleSelectGame}
            query={query}
            onQueryChange={setQuery}
            sort={sort}
            onSortChange={setSort}
          />
        );
      case "cart":
        return (
          <CartPage
            cart={cart}
            onRemove={removeFromCart}
            onClear={clearCart}
            onGoToStore={goToStore}
            showToast={showToast}
          />
        );
      case "wishlist":
        return (
          <WishlistPage
            wishlist={wishlist}
            cart={cart}
            onAddToCart={addToCart}
            onRemoveFromWishlist={toggleWishlist}
            onSelectGame={handleSelectGame}
            onGoToStore={goToStore}
          />
        );
      case "library":
        return <LibraryPage library={library} onGoToStore={goToStore} />;
      case "discover":
        return (
          <DiscoverPage
            games={games}
            wishlist={wishlist}
            cart={cart}
            onAddToCart={addToCart}
            onAddToWishlist={toggleWishlist}
            onSelectGame={handleSelectGame}
            onGoToStore={goToStore}
          />
        );
      case "creator":
        return <CreatorPage user={user} onAuthClick={() => setShowAuth(true)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 opacity-60 [background:radial-gradient(60%_50%_at_70%_0%,rgba(99,102,241,0.25)_0%,rgba(0,0,0,0)_60%),radial-gradient(40%_40%_at_20%_20%,rgba(236,72,153,0.16)_0%,rgba(0,0,0,0)_60%)]" />

      <div className="relative flex">
        <Sidebar
          active={active}
          onChange={handleNav}
          cartCount={cart.length}
          wishlistCount={wishlist.length}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          user={user}
          onLogout={async () => {
            if (supabase) await supabase.auth.signOut();
            setUser(null);
            showToast("Çıkış yapıldı.", "info");
          }}
          onAuthClick={() => setShowAuth(true)}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />

        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto h-dvh">
          {renderContent()}
        </main>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
