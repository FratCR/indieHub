import { useState } from "react";
import Badge from "../components/Badge";

export default function LibraryPage({ library, onGoToStore }) {
  const [filter, setFilter] = useState("all"); // all | installed | notInstalled
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = library.filter((g) => {
    const matchSearch = !searchQuery || g.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "installed") return matchSearch && g.installed;
    if (filter === "notInstalled") return matchSearch && !g.installed;
    return matchSearch;
  });

  if (library.length === 0) {
    return (
      <>
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="text-5xl">📚</div>
          <h2 className="mt-4 text-lg font-semibold text-zinc-200">Kütüphanen boş</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Satın aldığın oyunlar burada görünecek.
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

  const installedCount = library.filter((g) => g.installed).length;
  const totalPlayTime = library.reduce((sum, g) => sum + (g.play_time_hours || 0), 0);

  return (
    <>
      <Header />
      <section className="p-4">
        {/* İstatistikler */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <StatCard label="Toplam Oyun" value={library.length} />
          <StatCard label="Yüklü" value={installedCount} />
          <StatCard label="Oynama Süresi" value={`${totalPlayTime.toFixed(1)} saat`} />
        </div>

        {/* Filtreler */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {[
              { id: "all", label: "Tümü" },
              { id: "installed", label: "Yüklü" },
              { id: "notInstalled", label: "Yüklenmemiş" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={[
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                  filter === f.id ? "bg-white/10 text-zinc-50" : "text-zinc-400 hover:text-zinc-200",
                ].join(" ")}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kütüphanede ara..."
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-indigo-400/60 sm:w-[240px]"
          />
        </div>

        {/* Oyun Listesi */}
        <div className="space-y-2">
          {filtered.map((game) => (
            <LibraryItem key={game.id} game={game} />
          ))}
          {filtered.length === 0 && (
            <div className="py-10 text-center text-sm text-zinc-500">
              Eşleşen oyun bulunamadı.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
      <div className="p-4">
        <div className="text-[11px] uppercase tracking-wider text-zinc-500">Kütüphanem</div>
        <h1 className="text-xl font-semibold text-zinc-50">Oyun Kütüphanem</h1>
      </div>
    </header>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
      <div className="text-lg font-bold text-zinc-100">{value}</div>
      <div className="text-[11px] text-zinc-500">{label}</div>
    </div>
  );
}

function LibraryItem({ game }) {
  const [installing, setInstalling] = useState(false);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/[0.07]">
      <div className="h-14 w-24 shrink-0 overflow-hidden rounded-lg">
        {game.image_url ? (
          <img src={game.image_url} alt={game.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-indigo-500/30 via-fuchsia-500/20 to-emerald-500/20" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-zinc-100">{game.title}</h3>
          {game.installed && (
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              Yüklü
            </span>
          )}
        </div>
        <p className="truncate text-[12px] text-zinc-400">{game.studio}</p>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-zinc-500">
          {game.play_time_hours > 0 && (
            <span>🕐 {game.play_time_hours.toFixed(1)} saat</span>
          )}
          {game.last_played && (
            <span>Son oynama: {game.last_played}</span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          if (!game.installed) {
            setInstalling(true);
            setTimeout(() => setInstalling(false), 2000);
          }
        }}
        disabled={installing}
        className={[
          "shrink-0 rounded-xl px-5 py-2 text-sm font-semibold transition",
          game.installed
            ? "bg-emerald-500/90 text-white hover:bg-emerald-500"
            : installing
              ? "bg-indigo-500/50 text-white/70 cursor-wait"
              : "bg-indigo-500/90 text-white hover:bg-indigo-500",
        ].join(" ")}
      >
        {game.installed ? "▶ Başlat" : installing ? "Yükleniyor..." : "⬇ Yükle"}
      </button>
    </div>
  );
}
