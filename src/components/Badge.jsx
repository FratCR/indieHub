export default function Badge({ children, onClick, active = false, className = "" }) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition select-none";
  const style = active
    ? "border-indigo-400/40 bg-indigo-500/20 text-indigo-200"
    : "border-white/10 bg-white/5 text-zinc-200";
  const clickable = onClick ? "cursor-pointer hover:bg-white/10" : "";

  return (
    <span
      className={[base, style, clickable, className].join(" ")}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </span>
  );
}
