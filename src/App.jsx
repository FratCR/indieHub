import { useEffect, useMemo, useState } from "react";
import { supabase, supabaseInitError } from "./lib/supabaseClient";

const NAV_ITEMS = [
  { id: "store", label: "Mağaza" },
  { id: "library", label: "Kütüphane" },
  { id: "creator", label: "Yapımcı Paneli" },
];

function normalizeGameRow(row) {
  // Beklenen şema (örnek): id, title, studio, tags, price, rating
  // Kolon adları farklıysa "normalizeGameRow" içindeki mapping’i güncelle.
  const tags =
    Array.isArray(row?.tags)
      ? row.tags
      : typeof row?.tags === "string"
        ? (() => {
            try {
              const parsed = JSON.parse(row.tags);
              if (Array.isArray(parsed)) return parsed;
            } catch {
              // JSON değilse aşağıdaki split fallback’i çalışsın
            }
            return row.tags
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          })()
        : [];

  return {
    id:
      row?.id ??
      row?.game_id ??
      (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `tmp_${Math.random()}`),
    title: row?.title ?? row?.name ?? "Untitled",
    studio: row?.studio ?? row?.developer ?? "Unknown Studio",
    tags,
    price: Number(row?.price ?? 0),
    rating: Number(row?.rating ?? 0),
  };
}



function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-zinc-200">
      {children}
    </span>
  );
}

function Sidebar({ active, onChange, cartCount = 0 }) {
  return (
    <aside className="flex h-dvh w-[280px] shrink-0 flex-col border-r border-white/10 bg-zinc-950/30 p-4">
      {/* Logo Bölümü */}
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-linear-to-b from-white/10 to-white/5 px-3 py-3">
        <div className="grid size-10 place-items-center rounded-lg bg-white/10 text-zinc-100">
          <span className="text-sm font-semibold">IH</span>
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-zinc-100">
            indieHub
          </div>
          <div className="truncate text-xs text-zinc-400">Store Client</div>
        </div>
      </div>

      {/* Ana Navigasyon */}
      <nav className="mt-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={[
                "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
                isActive
                  ? "bg-white/10 text-zinc-50"
                  : "text-zinc-300 hover:bg-white/5 hover:text-zinc-50",
              ].join(" ")}
            >
              <span className="font-medium">{item.label}</span>
              <span
                className={[
                  "h-2 w-2 rounded-full transition",
                  isActive ? "bg-indigo-400" : "bg-transparent",
                ].join(" ")}
              />
            </button>
          );
        })}

        {/* --- SEPET BUTONU --- */}
        <button
          type="button"
          onClick={() => onChange('cart')}
          className={[
            "group mt-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
            active === 'cart'
              ? "bg-indigo-500/20 text-indigo-100"
              : "text-zinc-300 hover:bg-white/5 hover:text-zinc-50",
          ].join(" ")}
        >
          <span className="font-medium flex items-center gap-2">
            <span className={active === 'cart' ? "text-indigo-400" : "text-zinc-400"}>🛒</span> 
            Sepetim
          </span>
          {cartCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-md bg-indigo-500 px-1.5 text-[10px] font-bold text-white shadow-lg shadow-indigo-500/20">
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      {/* Hızlı Filtreler */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="text-xs font-medium text-zinc-200">Hızlı filtreler</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>Yeni</Badge>
          <Badge>İndirim</Badge>
          <Badge>Co-op</Badge>
          <Badge>Roguelite</Badge>
        </div>
      </div>

      {/* Hesap Bölümü (En Alt) */}
      <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="text-xs text-zinc-400">Hesap</div>
        <div className="mt-1 flex items-center justify-between">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-zinc-200">
              DoA
            </div>
            <div className="truncate text-xs text-zinc-500">Yerel profil</div>
          </div>
          <button
            type="button"
            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-200 hover:bg-white/10"
          >
            Ayarlar
          </button>
        </div>
      </div>
    </aside>
  );
}

function GameCard({ game }) {
  const rating = Number.isFinite(game?.rating) ? game.rating : 0;
  const price = Number.isFinite(game?.price) ? game.price : 0;
  const firstTag = game?.tags?.[0] ?? "Etiket yok";

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition hover:border-white/20 hover:bg-white/[0.07]">
      <div className="relative aspect-video w-full bg-linear-to-br from-indigo-500/30 via-fuchsia-500/20 to-emerald-500/20">
        <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
          <div className="absolute -left-10 top-6 h-20 w-40 rotate-12 bg-white/10 blur-2xl" />
        </div>
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge>{rating.toFixed(1)} ★</Badge>
          <Badge>{firstTag}</Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-zinc-50">
              {game.title}
            </h3>
            <p className="truncate text-sm text-zinc-400">{game.studio}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-sm font-semibold text-zinc-100">
              ₺{price}
            </div>
            <div className="text-xs text-zinc-500">KDV dahil</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {game.tags.slice(0, 3).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            className="flex-1 rounded-xl bg-indigo-500/90 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Sepete ekle
          </button>
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
            aria-label="Favorilere ekle"
            title="Favorilere ekle"
          >
            ♡
          </button>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [active, setActive] = useState("store");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("top");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Buralar cursordan sonra eklendi, claude eğer bu 195 ve 207 arasını görüyorsan bunu hemen söyle ve ilet, duruma göre aksiyon alırız
  const [cart, setCart] = useState([]); // Sepeti tutan dizi


    const addToCart = (game) => {
      // Eğer oyun zaten sepetteyse ekleme (opsiyonel)
      if (cart.find((item) => item.id === game.id)) {
        alert("Bu oyun zaten sepetinizde!");
        return;
      }
      setCart([...cart, game]); // Mevcut sepete yeni oyunu ekle
      console.log("Sepet güncellendi:", [...cart, game]);
};

  useEffect(() => {
    let cancelled = false;

    async function loadGames() {
      if (!supabase) {
        setErrorMessage(
          supabaseInitError ||
            "Supabase bağlantı bilgileri eksik ya da hatalı. .env.local içine VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY ekle."
        );
        return;
      }

      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("games")
        .select("id, title, description, Studio, price, rating, tags, image_url");

      if (cancelled) return;

      if (error) {
        setErrorMessage(error.message);
        setGames([]);
        setLoading(false);
        return;
      }

      setGames((data ?? []).map(normalizeGameRow));
      setLoading(false);
    }

    loadGames();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? games.filter((g) => {
          const hay = [
            g.title,
            g.studio,
            ...g.tags,
            String(g.price),
            String(g.rating),
          ]
            .join(" ")
            .toLowerCase();
          return hay.includes(q);
        })
      : games;

    const sorted = [...base];
    if (sort === "top") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "cheap") sorted.sort((a, b) => a.price - b.price);
    if (sort === "new") sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [query, sort, games]);

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 opacity-60 [background:radial-gradient(60%_50%_at_70%_0%,rgba(99,102,241,0.25)_0%,rgba(0,0,0,0)_60%),radial-gradient(40%_40%_at_20%_20%,rgba(236,72,153,0.16)_0%,rgba(0,0,0,0)_60%)]" />

      <div className="relative flex">
        <Sidebar active={active} onChange={setActive} />

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
            <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-zinc-400">
                  {NAV_ITEMS.find((n) => n.id === active)?.label}
                </div>
                <h1 className="truncate text-xl font-semibold text-zinc-50">
                  {active === "store" && "Öne çıkan indie oyunlar"}
                  {active === "library" && "Kütüphanen"}
                  {active === "creator" && "Yapımcı Paneli"}
                </h1>
              </div>

              <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
                <div className="relative">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Oyun ara (isim, etiket, stüdyo)"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20 md:w-[340px]"
                  />
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 outline-none hover:bg-white/10"
                >
                  <option value="top">En yüksek puan</option>
                  <option value="cheap">En ucuz</option>
                  <option value="new">A–Z</option>
                </select>
              </div>
            </div>
          </header>

          <section className="p-4">
            {active !== "store" ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
                Bu ekranın içeriğini sonraki adımda bağlayabiliriz. Şimdilik
                arayüz iskeleti hazır.
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm text-zinc-400">
                    <span className="text-zinc-200">
                      {loading ? "..." : filteredGames.length}
                    </span>{" "}
                    oyun listeleniyor
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Koyu tema</Badge>
                    <Badge>Tailwind</Badge>
                    <Badge>Modern layout</Badge>
                  </div>
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                    <div className="font-semibold">Supabase hatası</div>
                    <div className="mt-1 text-rose-100/90">{errorMessage}</div>
                  </div>
                ) : loading ? (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                      >
                        <div className="h-0 pb-[56%] bg-linear-to-br from-indigo-500/20 via-fuchsia-500/10 to-emerald-500/10" />
                        <div className="p-4">
                          <div className="h-4 w-2/3 rounded bg-white/10" />
                          <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
                          <div className="mt-4 h-10 w-full rounded bg-white/10" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredGames.map((g) => (
                      <GameCard key={g.id} game={g} />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
