"use client";

import { useState } from "react";
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
    if (!password || password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", padding: "20px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input::placeholder{color:rgba(255,255,255,0.25);}
        @keyframes gpulse{0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.4)}70%{box-shadow:0 0 0 8px rgba(212,175,55,0)}}
        @keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      `}</style>

      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <a href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg,#D4AF37,#8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", animation: "gpulse 2.8s ease infinite" }}>⚡</div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "18px", fontWeight: 800, color: "#fff" }}>Team<span style={{ color: "#D4AF37" }}>Automation</span></span>
          </a>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", marginTop: "8px" }}>Set your new password</p>
        </div>

        {/* Card */}
        <div style={{ background: "linear-gradient(145deg,rgba(14,14,20,0.95),rgba(7,7,12,0.98))", border: "1px solid rgba(212,175,55,0.18)", borderRadius: "24px", padding: "32px", boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" }}>

          {success ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>✦</div>
              <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'Syne',sans-serif", fontSize: "16px", marginBottom: "6px" }}>Password updated!</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>Redirecting to dashboard...</div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>New Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  onKeyDown={e => e.key === "Enter" && handleReset()}
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "13px 16px", fontSize: "15px", color: "#fff", outline: "none" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", color: "#ef4444", fontSize: "13px" }}>
                  {error}
                </div>
              )}

              <button onClick={handleReset} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", background: "linear-gradient(135deg,#D4AF37 0%,#f5e070 38%,#D4AF37 68%,#8B6914 100%)", backgroundSize: "260% 260%", animation: "shimmer 3.5s ease infinite", fontWeight: 700, fontSize: "15px", color: "#0a0a0a", fontFamily: "'Syne',sans-serif", letterSpacing: "0.04em", boxShadow: "0 6px 24px rgba(212,175,55,0.35)", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>
          <a href="/login" style={{ color: "rgba(212,175,55,0.5)", textDecoration: "none" }}>← Back to Sign In</a>
        </p>
      </div>
    </div>
  );
}
