import { useEffect } from "react";

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const colors = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    error: "border-rose-500/30 bg-rose-500/10 text-rose-200",
    info: "border-indigo-500/30 bg-indigo-500/10 text-indigo-200",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  };

  return (
    <div
      className={`animate-slide-in rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${colors[toast.type] || colors.info}`}
    >
      {toast.message}
    </div>
  );
}
