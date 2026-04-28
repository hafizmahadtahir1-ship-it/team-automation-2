"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    setError("Check your email to confirm your account!");
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) { setError("Enter your email first"); return; }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `https://teamautomation.app/reset-password`,
    });
    if (error) { setError(error.message); }
    else { setError("✅ Reset link sent — check your email!"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-mono flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-tight text-lg">
              Team<span className="text-emerald-400">Automation</span>
            </span>
          </div>
          <p className="text-white/40 text-sm">
            {mode === "login" ? "Sign in to your dashboard" : "Reset your password"}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {mode === "login" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-white/40">Password</label>
                <button
                  type="button"
                  onClick={() => { setMode("forgot"); setError(""); }}
                  className="text-xs text-white/30 hover:text-emerald-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {mode === "login" ? (
            <>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
              <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full bg-white/5 hover:bg-white/10 text-white/60 text-sm py-3 rounded-lg transition-all border border-white/10"
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                onClick={() => { setMode("login"); setError(""); }}
                className="w-full bg-white/5 hover:bg-white/10 text-white/60 text-sm py-3 rounded-lg transition-all border border-white/10"
              >
                ← Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
