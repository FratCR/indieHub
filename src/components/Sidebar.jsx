import Badge from "./Badge";

const NAV_ITEMS = [
  { id: "store", label: "Mağaza", icon: "🏪" },
  { id: "library", label: "Kütüphanem", icon: "📚" },
  { id: "wishlist", label: "İstek Listem", icon: "💜" },
  { id: "discover", label: "Keşfet", icon: "🔍" },
  { id: "creator", label: "Yapımcı Paneli", icon: "🛠" },
];

const QUICK_FILTERS = ["Yeni", "İndirim", "Co-op", "Roguelite", "RPG", "Strateji", "Bulmaca", "Aksiyon"];

export default function Sidebar({
  active,
  onChange,
  cartCount = 0,
  wishlistCount = 0,
  activeFilter,
  onFilterChange,
  user,
  onLogout,
  onAuthClick,
  priceRange,
  onPriceRangeChange,
}) {
  return (
    <aside className="flex h-dvh w-[260px] shrink-0 flex-col border-r border-white/10 bg-zinc-950/30 p-3 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-linear-to-b from-white/10 to-white/5 px-3 py-3">
        <div className="grid size-10 place-items-center rounded-lg bg-indigo-500/20 text-indigo-300">
          <span className="text-sm font-bold">IH</span>
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-zinc-100">indieHub</div>
          <div className="truncate text-[11px] text-zinc-500">Indie Oyun Mağazası</div>
        </div>
      </div>

      {/* Navigasyon */}
      <nav className="mt-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === active;
          const count = item.id === "wishlist" ? wishlistCount : 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={[
                "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
                isActive
                  ? "bg-white/10 text-zinc-50"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
              ].join(" ")}
            >
              <span className="flex items-center gap-2 font-medium">
                <span className="text-base">{item.icon}</span>
                {item.label}
              </span>
              {count > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-md bg-indigo-500/30 px-1.5 text-[10px] font-bold text-indigo-300">
                  {count}
                </span>
              )}
              {!count && isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              )}
            </button>
          );
        })}

        {/* Sepet Butonu */}
        <button
          type="button"
          onClick={() => onChange("cart")}
          className={[
            "group mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
            active === "cart"
              ? "bg-indigo-500/20 text-indigo-100"
              : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
          ].join(" ")}
        >
          <span className="flex items-center gap-2 font-medium">
            <span className="text-base">🛒</span>
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
        <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          Hızlı Filtreler
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {QUICK_FILTERS.map((f) => (
            <Badge
              key={f}
              active={activeFilter === f}
              onClick={() => onFilterChange(activeFilter === f ? "" : f)}
            >
              {f}
            </Badge>
          ))}
        </div>
      </div>

      {/* Fiyat Aralığı Filtresi */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          Fiyat Aralığı
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={priceRange?.[0] ?? ""}
            onChange={(e) => onPriceRangeChange?.([Number(e.target.value) || 0, priceRange?.[1] ?? 9999])}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-indigo-400/50"
          />
          <span className="text-zinc-500 text-xs">—</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={priceRange?.[1] === 9999 ? "" : priceRange?.[1] ?? ""}
            onChange={(e) => onPriceRangeChange?.([priceRange?.[0] ?? 0, Number(e.target.value) || 9999])}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-indigo-400/50"
          />
        </div>
        <div className="mt-1.5 flex gap-1">
          {[
            { label: "Ücretsiz", range: [0, 0] },
            { label: "₺0-50", range: [0, 50] },
            { label: "₺50-100", range: [50, 100] },
            { label: "₺100+", range: [100, 9999] },
          ].map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onPriceRangeChange?.(p.range)}
              className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400 transition hover:bg-white/10 hover:text-zinc-200"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hesap */}
      <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-3">
        {user ? (
          <>
            <div className="text-[11px] text-zinc-500">Hesap</div>
            <div className="mt-1 flex items-center justify-between">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-zinc-200">
                  {user.email?.split("@")[0] || "Kullanıcı"}
                </div>
                <div className="truncate text-[11px] text-zinc-500">{user.email}</div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-zinc-300 hover:bg-white/10"
              >
                Çıkış
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={onAuthClick}
            className="w-full rounded-lg bg-indigo-500/90 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Giriş Yap / Kayıt Ol
          </button>
        )}
      </div>
    </aside>
  );
}
