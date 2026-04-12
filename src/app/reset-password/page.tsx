"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleReset = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2000);
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
          <p className="text-white/40 text-sm">Set new password</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          {success ? (
            <p className="text-emerald-400 text-sm text-center">
              ✅ Password updated! Redirecting...
            </p>
          ) : (
            <>
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}