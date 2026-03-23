import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage({ onBack, onSuccess, showToast }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      showToast("Supabase bağlantısı kurulamadı!", "error");
      return;
    }
    if (!email || !password) {
      showToast("Email ve şifre gerekli!", "warning");
      return;
    }

    setLoading(true);

    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Kayıt başarılı! Giriş yapabilirsin.", "success");
        setMode("login");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Giriş başarılı! Hoş geldin!", "success");
        onSuccess(data.user);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="flex items-center gap-3 p-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-white/10"
          >
            ← Geri
          </button>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-500">Hesap</div>
            <h1 className="text-lg font-semibold text-zinc-50">
              {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
            </h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-xl bg-indigo-500/20 text-indigo-300">
              <span className="text-lg font-bold">IH</span>
            </div>
            <h2 className="mt-3 text-xl font-bold text-zinc-100">
              {mode === "login" ? "Tekrar Hoş Geldin!" : "indieHub'a Katıl!"}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              {mode === "login" ? "Hesabına giriş yap" : "Yeni bir hesap oluştur"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-200">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-200">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-400 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Yükleniyor..." : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-zinc-400">
            {mode === "login" ? "Hesabın yok mu? " : "Zaten hesabın var mı? "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-indigo-400 hover:text-indigo-300"
            >
              {mode === "login" ? "Kayıt Ol" : "Giriş Yap"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
