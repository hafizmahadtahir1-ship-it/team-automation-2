"use client";
import React, { useState, useEffect, useRef } from "react";

/* ─── TYPES ─── */
interface FaqItemProps { q: string; a: string; }
interface CounterProps { to: number; prefix?: string; suffix?: string; label: string; }
interface SRProps { children: React.ReactNode; delay?: number; }

/* ─── FAQ ITEM ─── */
function FaqItem({ q, a }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", fontFamily: "'Syne',sans-serif", fontSize: "clamp(14px,1.5vw,16px)", fontWeight: 600, color: open ? "#D4AF37" : "rgba(255,255,255,0.82)", textAlign: "left", gap: "16px", transition: "color 0.25s" }}>
        <span>{q}</span>
        <span style={{ fontSize: "20px", color: "rgba(212,175,55,0.6)", transition: "transform 0.3s", transform: open ? "rotate(45deg)" : "rotate(0deg)", flexShrink: 0 }}>+</span>
      </button>
      <div style={{ maxHeight: open ? "200px" : "0", overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "14px", lineHeight: 1.8, paddingBottom: "18px" }}>{a}</p>
      </div>
    </div>
  );
}

/* ─── COUNTER ─── */
function Counter({ to, prefix = "", suffix = "", label }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let s = 0;
    const step = (ts: number) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / 1400, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, to]);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(28px,3.2vw,46px)", fontWeight: 800, lineHeight: 1, background: "linear-gradient(135deg,#D4AF37,#fff3a0 50%,#c49a20)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {prefix}{val}{suffix}
      </div>
      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "8px" }}>{label}</div>
    </div>
  );
}

/* ─── SCROLL REVEAL ─── */
function SR({ children, delay = 0 }: SRProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.05 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(30px)", transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── TYPING TEXT ─── */
function TypeText({ words }: { words: string[] }) {
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      if (!del) {
        if (ci < words[wi].length) setCi(c => c + 1);
        else { setTimeout(() => setDel(true), 1800); clearInterval(t); }
      } else {
        if (ci > 0) setCi(c => c - 1);
        else { setDel(false); setWi(w => (w + 1) % words.length); clearInterval(t); }
      }
    }, del ? 40 : 80);
    return () => clearInterval(t);
  }, [ci, del, wi, words]);
  useEffect(() => { const b = setInterval(() => setBlink(x => !x), 500); return () => clearInterval(b); }, []);
  return <span>{words[wi].slice(0, ci)}<span style={{ opacity: blink ? 1 : 0, color: "#D4AF37" }}>|</span></span>;
}

/* ─── SLACK DEMO CARD ─── */
function SlackCard() {
  const [state, setState] = useState<"idle" | "approved" | "rejected">("idle");
  return (
    <div style={{ background: "linear-gradient(145deg,rgba(14,12,22,0.97),rgba(7,6,12,0.99))", border: "1px solid rgba(212,175,55,0.22)", borderRadius: "24px", padding: "24px", width: "100%", maxWidth: "340px", boxShadow: "0 40px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "50%", height: "1px", background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)" }} />
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg,#D4AF37,#8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0, boxShadow: "0 4px 16px rgba(212,175,55,0.35)" }}>⚡</div>
        <div>
          <div style={{ color: "#fff", fontSize: "13px", fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>TeamAutomation</div>
          <div style={{ color: "rgba(212,175,55,0.5)", fontSize: "10px", letterSpacing: "0.05em" }}>APP · JUST NOW</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
          <span style={{ color: "rgba(34,197,94,0.7)", fontSize: "10px" }}>Live</span>
        </div>
      </div>
      {/* Request */}
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "14px", marginBottom: "14px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "8px" }}>
          <span style={{ color: "#D4AF37", fontWeight: 600 }}>@sarah_ops</span> · Purchase Request
        </div>
        <div style={{ color: "#fff", fontSize: "16px", fontWeight: 700, fontFamily: "'Syne',sans-serif", marginBottom: "4px" }}>MacBook Pro M4</div>
        <div style={{ color: "#D4AF37", fontSize: "20px", fontWeight: 800, fontFamily: "'Syne',sans-serif", marginBottom: "10px" }}>$1,200</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["Engineering", "Q2 Budget"].map(t => (
            <span key={t} style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.18)", borderRadius: "100px", padding: "2px 8px", fontSize: "10px", color: "rgba(212,175,55,0.7)" }}>{t}</span>
          ))}
        </div>
      </div>
      {/* Actions */}
      {state === "idle" && (
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setState("approved")} style={{ flex: 1, padding: "11px", borderRadius: "12px", border: "none", cursor: "pointer", background: "linear-gradient(135deg,#D4AF37,#8B6914)", fontWeight: 700, fontSize: "13px", color: "#0a0a0a", fontFamily: "'Syne',sans-serif", boxShadow: "0 4px 16px rgba(212,175,55,0.35)" }}>✓ Approve</button>
          <button onClick={() => setState("rejected")} style={{ flex: 1, padding: "11px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", background: "rgba(255,255,255,0.05)", fontSize: "13px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}>✕ Reject</button>
        </div>
      )}
      {state === "approved" && (
        <div style={{ textAlign: "center", padding: "14px", borderRadius: "12px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'Syne',sans-serif", marginBottom: "3px" }}>✦ Approved & logged</div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>Audit trail updated</div>
          <button onClick={() => setState("idle")} style={{ marginTop: "8px", background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: "10px", cursor: "pointer" }}>↩ reset</button>
        </div>
      )}
      {state === "rejected" && (
        <div style={{ textAlign: "center", padding: "14px", borderRadius: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <div style={{ color: "#ef4444", fontWeight: 700, fontFamily: "'Syne',sans-serif", marginBottom: "3px" }}>Rejected & notified</div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>@sarah_ops notified</div>
          <button onClick={() => setState("idle")} style={{ marginTop: "8px", background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: "10px", cursor: "pointer" }}>↩ reset</button>
        </div>
      )}
      <div style={{ marginTop: "12px", textAlign: "center", color: "rgba(255,255,255,0.08)", fontSize: "9px", letterSpacing: "0.1em" }}>POWERED BY <span style={{ color: "rgba(212,175,55,0.25)" }}>TEAMAUTOMATION</span></div>
    </div>
  );
}

/* ─── WAITLIST FORM ─── */
function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!email.includes("@")) return;
    setLoading(true);
    try { await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); } catch (_) {}
    setLoading(false); setSent(true);
  };
  if (sent) return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "100px", padding: "14px 28px" }}>
      <span style={{ color: "#D4AF37" }}>✦</span>
      <span style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>You&apos;re on the list!</span>
    </div>
  );
  return (
    <div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "12px" }}>
        <input
          type="email" value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") submit(); }}
          placeholder="your@company.com"
          style={{ flex: "1 1 200px", maxWidth: "260px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "100px", padding: "14px 22px", fontSize: "15px", color: "#fff", outline: "none", fontFamily: "'DM Sans',sans-serif" }}
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.08)"; }}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
        />
        <button onClick={submit} disabled={loading} style={{ padding: "14px 28px", borderRadius: "100px", border: "none", cursor: "pointer", background: "linear-gradient(135deg,#D4AF37 0%,#f5e070 40%,#D4AF37 70%,#8B6914 100%)", backgroundSize: "250% 250%", animation: "shimmer 3s ease infinite", fontWeight: 700, fontSize: "15px", color: "#0a0a0a", fontFamily: "'Syne',sans-serif", letterSpacing: "0.04em", boxShadow: "0 6px 24px rgba(212,175,55,0.35)", opacity: loading ? 0.7 : 1, whiteSpace: "nowrap" }}>
          {loading ? "..." : "Get Early Access →"}
        </button>
      </div>
      <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center" }}>Free 14-day trial · No credit card</div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onMouse = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + "px";
        glowRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMouse); };
  }, []);

  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  const NAV: [string, string][] = [["Features", "features"], ["How it works", "how"], ["Pricing", "pricing"], ["FAQ", "faq"]];

  const FEATURES = [
    { icon: "⚡", title: "Instant Slack Cards", desc: "Approval requests appear as rich interactive Slack messages. One click to approve or reject — right in your channel." },
    { icon: "🔔", title: "Smart Nudges", desc: "Auto reminders on Day 1, 3, and 7 if a request is pending. Zero forgotten approvals, ever." },
    { icon: "📋", title: "Full Audit Trail", desc: "Every action logged with timestamp and user. Always compliant, always exportable to CSV." },
    { icon: "🔀", title: "Delegate Approvals", desc: "Use /approve-delegate to hand off authority instantly when you're out of office." },
    { icon: "📊", title: "Dashboard & Export", desc: "See all requests in one view. Filter, search, and export CSV in real time." },
    { icon: "🔒", title: "Secure by Default", desc: "Slack signature verification, Supabase RLS, full request isolation. Enterprise-grade from day one." },
  ];

  const STEPS = [
    { n: "01", icon: "🔧", title: "Install in 5 min", desc: "Connect to your Slack workspace with one click. No dev required, no setup headache." },
    { n: "02", icon: "⚡", title: "Type /approve", desc: "Your team types the slash command and fills the request. Everything else is automated from there." },
    { n: "03", icon: "✦", title: "Approve anywhere", desc: "Approvers get a rich Slack card. One click approves or rejects with full audit trail." },
  ];

  const PRICING = [
    {
      name: "Starter", price: "$49", period: "mo", sub: "Up to 10 team members", featured: false, cta: "Start free trial", href: "/api/auth/slack",
      features: ["Up to 10 members", "Unlimited requests", "Smart nudges", "30-day audit trail", "Dashboard + CSV", "Email support"],
    },
    {
      name: "Growth", price: "$149", period: "mo", sub: "Up to 50 team members", featured: true, cta: "Start free trial", href: "/api/auth/slack",
      features: ["Up to 50 members", "Unlimited requests", "Multi-level chains", "1-year audit trail", "Analytics", "Priority support"],
    },
    {
      name: "Scale", price: "$499", period: "mo", sub: "Unlimited team size", featured: false, cta: "Contact us", href: "mailto:mahadbuilds289@gmail.com",
      features: ["Unlimited members", "Custom workflows", "SSO & security", "Unlimited audit trail", "Dedicated manager", "SLA guarantee"],
    },
  ];

  const TESTIMONIALS = [
    { q: "We used to lose track of purchase approvals constantly. TeamAutomation fixed that in one afternoon.", name: "Sarah K.", role: "Ops Manager, Series A startup" },
    { q: "The audit trail alone is worth it. Finance stopped asking for screenshots of every approval.", name: "Marcus T.", role: "Team Lead, 40-person agency" },
    { q: "Setup was genuinely 5 minutes. Our whole approval process now lives in Slack.", name: "Priya N.", role: "Head of Ops, SaaS company" },
  ];

  const FAQS: [string, string][] = [
    ["Do I need to know how to code?", "Not at all. Installs like any Slack app — click, authorize, done. Zero technical knowledge needed."],
    ["Does my team need to download anything?", "No. Everything happens inside Slack. Your team uses the same app they already have open all day."],
    ["What's included in the free trial?", "Full access to all features for 14 days. No credit card required. Cancel anytime."],
    ["How does the audit trail work?", "Every action logged with timestamp and user. Fully exportable as CSV."],
    ["Can I delegate when out of office?", "Yes. /approve-delegate assigns a temporary approver. Routes automatically until removed."],
    ["What happens when my trial ends?", "You get a reminder on day 12. App pauses if you don't upgrade — no data lost. Resume anytime."],
  ];

  return (
    <div style={{ background: "#04040a", minHeight: "100vh", color: "#fff", overflowX: "hidden", fontFamily: "'DM Sans',sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(212,175,55,0.2); color: #fff; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#D4AF37,#8B6914); border-radius: 2px; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        button { font-family: inherit; }

        @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes gpulse { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.45)} 70%{box-shadow:0 0 0 10px rgba(212,175,55,0)} }
        @keyframes bglow { 0%,100%{border-color:rgba(212,175,55,0.15)} 50%{border-color:rgba(212,175,55,0.42)} }
        @keyframes tglow { 0%,100%{text-shadow:0 0 40px rgba(212,175,55,0.15),0 0 80px rgba(212,175,55,0.05)} 50%{text-shadow:0 0 60px rgba(212,175,55,0.45),0 0 120px rgba(212,175,55,0.15)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes spinCW { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes spinCCW { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes orbmove { 0%,100%{transform:translate(0,0)} 33%{transform:translate(35px,25px)} 66%{transform:translate(-25px,45px)} }
        @keyframes divglow { 0%{opacity:0.3} 50%{opacity:1} 100%{opacity:0.3} }

        .card { background: linear-gradient(145deg,rgba(13,13,19,0.94),rgba(6,6,11,0.98)); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; transition: border-color 0.3s, transform 0.25s, box-shadow 0.25s; }
        .card:hover { border-color: rgba(212,175,55,0.26); transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.42); }
        .ibox { width: 46px; height: 46px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-size: 19px; background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.17); margin-bottom: 16px; transition: all 0.3s; }
        .card:hover .ibox { background: linear-gradient(135deg,#D4AF37,#8B6914); border-color: transparent; box-shadow: 0 6px 22px rgba(212,175,55,0.32); }
        .btn-gold { background: linear-gradient(135deg,#D4AF37 0%,#f5e070 38%,#D4AF37 68%,#8B6914 100%); background-size: 260% 260%; animation: shimmer 3.5s ease infinite; border: none; cursor: pointer; color: #0a0a0a; font-family: 'Syne',sans-serif; font-weight: 700; letter-spacing: 0.04em; transition: transform 0.3s, box-shadow 0.3s; }
        .btn-gold:hover { transform: scale(1.04); box-shadow: 0 8px 28px rgba(212,175,55,0.42); }
        .btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; color: rgba(255,255,255,0.5); transition: all 0.3s; font-family: 'DM Sans',sans-serif; }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.32); color: rgba(255,255,255,0.82); }
        .nav-link { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.32); font-size: 12px; letter-spacing: 0.07em; text-transform: uppercase; font-family: 'DM Sans',sans-serif; transition: color 0.25s; padding: 4px 0; white-space: nowrap; }
        .nav-link:hover { color: #D4AF37; }
        .section { padding: clamp(60px,8vw,100px) clamp(16px,4vw,32px); position: relative; z-index: 2; }
        .inner { max-width: 960px; margin: 0 auto; }
        .eyebrow { color: rgba(212,175,55,0.55); font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; margin-bottom: 12px; }
        .h2 { font-family: 'Syne',sans-serif; font-size: clamp(26px,3.5vw,46px); font-weight: 800; letter-spacing: -0.025em; line-height: 1.1; margin-bottom: 44px; }
        .h2 em { color: rgba(255,255,255,0.2); font-weight: 400; font-style: italic; }
        .grid3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }

        @media(max-width:768px) {
          .grid3 { grid-template-columns: 1fr; }
          .hero-wrap { flex-direction: column !important; }
          .hero-card { display: none !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .pricing-wrap { flex-direction: column !important; align-items: center !important; }
          .pricing-wrap > * { width: 100% !important; max-width: 400px !important; }
          nav { padding: 0 16px !important; }
          .nav-desktop { display: none !important; }
          .nav-mob-btn { display: flex !important; }
          .section { padding: clamp(48px,6vw,80px) 16px; }
        }
        @media(min-width:769px) {
          .nav-mob-btn { display: none !important; }
          .mob-menu { display: none !important; }
        }
        @media(max-width:480px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {/* ── BG ORBS ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        {[
          { w: 720, l: "-8%", t: "-8%", c: "212,175,55", op: 0.10, an: "orbmove 20s ease-in-out infinite" },
          { w: 580, l: "66%", t: "-12%", c: "80,40,200", op: 0.07, an: "orbmove 26s ease-in-out infinite reverse" },
          { w: 500, l: "32%", t: "46%", c: "212,175,55", op: 0.06, an: "orbmove 18s ease-in-out infinite" },
          { w: 440, l: "76%", t: "56%", c: "30,90,220", op: 0.06, an: "orbmove 23s ease-in-out infinite reverse" },
          { w: 360, l: "4%", t: "66%", c: "80,40,200", op: 0.05, an: "orbmove 15s ease-in-out infinite" },
        ].map((o, i) => (
          <div key={i} style={{ position: "absolute", left: o.l, top: o.t, width: o.w, height: o.w, borderRadius: "50%", background: `radial-gradient(ellipse at 33% 33%, rgba(${o.c},${o.op * 1.6}) 0%, rgba(${o.c},${o.op}) 40%, transparent 68%)`, filter: "blur(55px)", animation: o.an }} />
        ))}
        {/* grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)", backgroundSize: "64px 64px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 40%,black 30%,transparent 100%)" }} />
      </div>

      {/* ── CURSOR GLOW ── */}
      <div ref={glowRef} style={{ position: "fixed", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle,rgba(212,175,55,0.022) 0%,transparent 65%)", pointerEvents: "none", zIndex: 1, transform: "translate(-50%,-50%)", left: "-999px", top: "-999px", transition: "left 0.1s linear, top 0.1s linear" }} />

      {/* ── GEO SHAPES ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "4%", top: "8%", width: "110px", height: "110px", animation: "spinCW 26s linear infinite" }}>
          <div style={{ width: "100%", height: "100%", border: "1px solid rgba(212,175,55,0.08)", borderRadius: "4px" }} />
        </div>
        <div style={{ position: "absolute", left: "2%", bottom: "22%", width: "74px", height: "74px", animation: "spinCCW 20s linear infinite" }}>
          <div style={{ width: "100%", height: "100%", border: "1px solid rgba(80,40,200,0.1)", borderRadius: "50%" }} />
        </div>
        <div style={{ position: "absolute", right: "12%", top: "55%", width: "52px", height: "52px", animation: "spinCW 34s linear infinite" }}>
          <div style={{ width: "100%", height: "100%", border: "1px solid rgba(30,90,220,0.08)" }} />
        </div>
      </div>

      {/* ══ NAV ══ */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, height: "62px", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(4,4,10,0.95)" : "rgba(4,4,10,0.6)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.4s" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "9px", flexShrink: 0 }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg,#D4AF37,#8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", animation: "gpulse 2.8s ease infinite" }}>⚡</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "16px", fontWeight: 800 }}>Team<span style={{ color: "#D4AF37" }}>Automation</span></span>
        </div>
        {/* Desktop links */}
        <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "26px" }}>
          {NAV.map(([l, id]) => <button key={id} className="nav-link" onClick={() => go(id)}>{l}</button>)}
        </div>
        {/* Desktop CTAs */}
        <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button className="btn-ghost" onClick={() => window.location.href="/login"} style={{ padding: "8px 18px", borderRadius: "100px", fontSize: "13px" }}>Sign in</button>
          <button className="btn-gold" onClick={() => go("cta")} style={{ padding: "8px 18px", borderRadius: "100px", fontSize: "13px", boxShadow: "0 4px 16px rgba(212,175,55,0.3)" }}>Get Early Access</button>
        </div>
        {/* Mobile hamburger */}
        <button className="nav-mob-btn" onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", padding: "7px 10px", cursor: "pointer", color: "#fff", fontSize: "16px", display: "none", alignItems: "center" }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      <div className="mob-menu" style={{ position: "fixed", top: "62px", left: 0, right: 0, zIndex: 299, background: "rgba(4,4,10,0.98)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)", maxHeight: menuOpen ? "320px" : "0", overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "20px 24px" }}>
          {NAV.map(([l, id]) => (
            <button key={id} onClick={() => go(id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: "16px", fontFamily: "'Syne',sans-serif", fontWeight: 600, padding: "12px 0", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{l}</button>
          ))}
          <button className="btn-gold" onClick={() => go("cta")} style={{ marginTop: "12px", padding: "14px", borderRadius: "12px", fontSize: "15px", boxShadow: "0 4px 16px rgba(212,175,55,0.3)" }}>Get Early Access →</button>
        </div>
      </div>

      {/* ══ HERO ══ */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px clamp(16px,4vw,32px) 60px", position: "relative", zIndex: 2 }}>
        <div className="hero-wrap" style={{ maxWidth: "1060px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "48px" }}>
          {/* Left */}
          <div style={{ flex: "1 1 380px", maxWidth: "500px" }}>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.22)", borderRadius: "100px", padding: "6px 15px", marginBottom: "28px", animation: "bglow 3.5s ease infinite" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4AF37", boxShadow: "0 0 8px #D4AF37", animation: "gpulse 2.2s ease infinite" }} />
              <span style={{ color: "rgba(212,175,55,0.9)", fontSize: "11px", letterSpacing: "0.13em", textTransform: "uppercase", fontWeight: 600 }}>Slack-Native · Now in Beta</span>
            </div>
            {/* H1 */}
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(36px,5vw,66px)", fontWeight: 800, letterSpacing: "-0.032em", lineHeight: 1.07, marginBottom: "18px", animation: "tglow 4.5s ease infinite" }}>
              Approvals that{" "}
              <span style={{ background: "linear-gradient(135deg,#D4AF37,#fff0a0 45%,#C49A20)", backgroundSize: "280% 280%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s ease infinite" }}>actually work</span>
              {" "}in Slack
            </h1>
            {/* Typing */}
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(14px,1.8vw,20px)", color: "rgba(255,255,255,0.22)", lineHeight: 1.35, marginBottom: "20px", minHeight: "28px" }}>
              <TypeText words={["No more lost requests.", "No more Slack ping chaos.", "Full audit trail, zero effort.", "Your team, finally unblocked."]} />
            </div>
            {/* Desc */}
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "clamp(14px,1.6vw,16px)", lineHeight: 1.85, marginBottom: "36px", fontWeight: 300, maxWidth: "420px" }}>
              Structured approval workflows directly in Slack — with smart nudges, audit logs, and one-click delegation built in.
            </p>
            {/* CTAs */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
              <button className="btn-gold" onClick={() => go("cta")} style={{ padding: "14px clamp(20px,3vw,28px)", borderRadius: "100px", fontSize: "clamp(13px,1.5vw,15px)", boxShadow: "0 8px 28px rgba(212,175,55,0.38)" }}>Get Early Access →</button>
              <button className="btn-ghost" onClick={() => go("how")} style={{ padding: "14px clamp(16px,2.5vw,24px)", borderRadius: "100px", fontSize: "clamp(12px,1.4vw,14px)" }}>See how it works ↓</button>
            </div>
            <div style={{ color: "rgba(255,255,255,0.15)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Free 14-day trial · No credit card</div>
          </div>

          {/* Right — card + rings */}
          <div className="hero-card" style={{ flex: "1 1 320px", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", animation: "float 5.5s ease-in-out infinite" }}>
            {[440, 366, 292].map((s, i) => (
              <div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: s, height: s, borderRadius: "50%", transform: "translate(-50%,-50%)", border: `1px ${i === 2 ? "dashed" : "solid"} rgba(${i === 0 ? "212,175,55" : i === 1 ? "80,40,200" : "30,90,220"},${i === 0 ? 0.09 : 0.07})`, animation: `${i % 2 === 0 ? "spinCW" : "spinCCW"} ${22 + i * 9}s linear infinite`, pointerEvents: "none" }} />
            ))}
            <div style={{ position: "absolute", inset: "-20px", borderRadius: "50%", background: "radial-gradient(circle,rgba(212,175,55,0.06) 0%,transparent 65%)", pointerEvents: "none" }} />
            <SlackCard />
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{ padding: "0 clamp(16px,4vw,32px) 72px", position: "relative", zIndex: 2 }}>
        <SR>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(212,175,55,0.07)", borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(212,175,55,0.1)" }}>
              {[
                { to: 5, suffix: " min", label: "Setup Time" },
                { to: 14, suffix: "-day", label: "Free Trial" },
                { to: 100, suffix: "%", label: "Slack-Native" },
                { to: 49, prefix: "$", suffix: "/mo", label: "Starting Price" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "32px 16px", background: "rgba(4,4,10,0.92)" }}>
                  <Counter {...s} />
                </div>
              ))}
            </div>
          </div>
        </SR>
      </section>

      {/* divider */}
      <div style={{ maxWidth: "260px", margin: "0 auto 72px", height: "1px", background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.28),transparent)", animation: "divglow 3s ease infinite" }} />

      {/* ══ HOW IT WORKS ══ */}
      <section id="how" className="section">
        <div className="inner">
          <SR><div className="eyebrow">How It Works</div><h2 className="h2">Live in Slack <em>in minutes</em></h2></SR>
          <div className="grid3">
            {STEPS.map((s, i) => (
              <SR key={i} delay={i * 80}>
                <div className="card" style={{ padding: "26px 22px", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,#D4AF37,#8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "13px", color: "#0a0a0a", flexShrink: 0, boxShadow: "0 5px 18px rgba(212,175,55,0.3)" }}>{s.n}</div>
                    <span style={{ fontSize: "22px" }}>{s.icon}</span>
                  </div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "17px", marginBottom: "9px" }}>{s.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.36)", fontSize: "14px", lineHeight: 1.75 }}>{s.desc}</div>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" className="section">
        <div className="inner">
          <SR><div className="eyebrow">Features</div><h2 className="h2">Everything your team <em>actually needs</em></h2></SR>
          <div className="grid3">
            {FEATURES.map((f, i) => (
              <SR key={i} delay={(i % 3) * 70}>
                <div className="card" style={{ padding: "24px 20px", height: "100%" }}>
                  <div className="ibox">{f.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>{f.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.36)", fontSize: "13px", lineHeight: 1.75 }}>{f.desc}</div>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="pricing" className="section">
        <div className="inner">
          <SR>
            <div className="eyebrow">Pricing</div>
            <h2 className="h2">Simple, <em>transparent pricing</em></h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "16px", marginBottom: "44px", marginTop: "-28px" }}>14-day free trial on all plans. No credit card required.</p>
          </SR>
          <div className="pricing-wrap" style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            {PRICING.map((p, i) => (
              <SR key={i} delay={i * 70}>
                <div style={{ flex: "1 1 250px", maxWidth: "295px", background: p.featured ? "linear-gradient(145deg,rgba(22,16,5,0.98),rgba(12,8,2,0.99))" : "linear-gradient(145deg,rgba(11,11,17,0.96),rgba(5,5,9,0.99))", border: p.featured ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(255,255,255,0.07)", borderRadius: "22px", padding: "30px 24px", position: "relative", overflow: "hidden", boxShadow: p.featured ? "0 24px 70px rgba(212,175,55,0.14)" : "none", transition: "transform 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {p.featured && (
                    <>
                      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "45%", height: "1px", background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.65),transparent)" }} />
                      <div style={{ display: "inline-block", background: "linear-gradient(135deg,#D4AF37,#8B6914)", color: "#0a0a0a", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: "100px", padding: "3px 11px", marginBottom: "14px", fontFamily: "'Syne',sans-serif" }}>Most Popular</div>
                    </>
                  )}
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "17px", fontWeight: 700, marginBottom: "8px", color: p.featured ? "#D4AF37" : "rgba(255,255,255,0.75)" }}>{p.name}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "38px", fontWeight: 800, marginBottom: "3px" }}>
                    {p.price}<span style={{ fontSize: "14px", fontWeight: 400, color: "rgba(255,255,255,0.28)" }}>/{p.period}</span>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.28)", fontSize: "12px", marginBottom: "22px" }}>{p.sub}</div>
                  <ul style={{ listStyle: "none", marginBottom: "24px" }}>
                    {p.features.map((f, j) => (
                      <li key={j} style={{ color: "rgba(255,255,255,0.52)", fontSize: "13px", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "#D4AF37", fontWeight: 700, fontSize: "11px", flexShrink: 0 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <button className={p.featured ? "btn-gold" : "btn-ghost"} onClick={() => { window.location.href = p.href; }} style={{ width: "100%", padding: "12px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, fontFamily: "'Syne',sans-serif", ...(p.featured ? { boxShadow: "0 6px 22px rgba(212,175,55,0.36)" } : {}) }}>
                    {p.cta}
                  </button>
                </div>
              </SR>
            ))}
          </div>
          <SR delay={150}>
            <div style={{ marginTop: "22px", textAlign: "center", background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.13)", borderRadius: "12px", padding: "14px 20px", maxWidth: "440px", margin: "22px auto 0", animation: "bglow 5s ease infinite" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Save 32% — <span style={{ color: "#D4AF37", fontWeight: 600 }}>$399/year</span><span style={{ color: "rgba(255,255,255,0.25)" }}> · Contact us</span></span>
            </div>
          </SR>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="section">
        <div className="inner">
          <SR><div className="eyebrow">Early Feedback</div><h2 className="h2">Teams already <em>love it</em></h2></SR>
          <div className="grid3">
            {TESTIMONIALS.map((t, i) => (
              <SR key={i} delay={i * 70}>
                <div className="card" style={{ padding: "24px 20px", height: "100%" }}>
                  <div style={{ color: "#D4AF37", letterSpacing: "2px", marginBottom: "12px", fontSize: "12px" }}>★★★★★</div>
                  <p style={{ color: "rgba(255,255,255,0.66)", fontSize: "14px", lineHeight: 1.78, marginBottom: "16px", fontStyle: "italic" }}>&ldquo;{t.q}&rdquo;</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(212,175,55,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>👤</div>
                    <div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "13px", fontWeight: 700 }}>{t.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section id="faq" className="section">
        <div style={{ maxWidth: "660px", margin: "0 auto" }}>
          <SR><div className="eyebrow" style={{ textAlign: "center" }}>FAQ</div><h2 className="h2" style={{ textAlign: "center" }}>Questions <em>answered</em></h2></SR>
          {FAQS.map(([q, a], i) => <FaqItem key={i} q={q} a={a} />)}
        </div>
      </section>

      {/* ══ WAITLIST CTA ══ */}
      <section id="cta" className="section">
        <SR>
          <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ background: "linear-gradient(150deg,rgba(20,14,4,0.98),rgba(10,7,2,0.99))", border: "1px solid rgba(212,175,55,0.22)", borderRadius: "28px", padding: "clamp(40px,6vw,68px) clamp(20px,5vw,56px)", boxShadow: "0 40px 100px rgba(0,0,0,0.5)", position: "relative", overflow: "hidden", animation: "bglow 4s ease infinite" }}>
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "40%", height: "1px", background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.55),transparent)" }} />
              <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle,rgba(212,175,55,0.08),transparent 65%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "-50px", left: "-50px", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle,rgba(80,40,200,0.06),transparent 65%)", pointerEvents: "none" }} />
              <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", padding: "5px 14px", marginBottom: "22px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 7px #22c55e" }} />
                <span style={{ color: "rgba(34,197,94,0.75)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase" }}>Accepting beta users now</span>
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(24px,3.5vw,44px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "14px", animation: "tglow 4.5s ease infinite" }}>
                Stop losing approvals<br />
                <span style={{ background: "linear-gradient(135deg,#D4AF37,#fff0a0 45%,#C49A20)", backgroundSize: "280% 280%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s ease infinite" }}>in the Slack noise</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.33)", fontSize: "clamp(13px,1.5vw,15px)", lineHeight: 1.8, fontWeight: 300, maxWidth: "460px", margin: "0 auto 32px" }}>
                Join teams already using TeamAutomation to automate approvals, eliminate follow-ups, and maintain a clean audit trail — entirely inside Slack.
              </p>
              <WaitlistForm />
              <div style={{ marginTop: "22px", display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
                {["✓ No credit card", "✓ 14-day free trial", "✓ Cancel anytime"].map(s => (
                  <span key={s} style={{ color: "rgba(255,255,255,0.18)", fontSize: "11px", letterSpacing: "0.06em" }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </SR>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "32px clamp(16px,4vw,40px)", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: "linear-gradient(135deg,#D4AF37,#8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>⚡</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "14px", fontWeight: 700 }}>Team<span style={{ color: "#D4AF37" }}>Automation</span></span>
        </div>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {([["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Contact", "mailto:mahadbuilds289@gmail.com"]] as [string, string][]).map(([l, h]) => (
            <a key={l} href={h} style={{ color: "rgba(255,255,255,0.22)", fontSize: "12px", textDecoration: "none", transition: "color 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#D4AF37"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.22)"; }}
            >{l}</a>
          ))}
        </div>
        <div style={{ color: "rgba(255,255,255,0.13)", fontSize: "11px" }}>© 2025 TeamAutomation</div>
      </footer>

    </div>
  );
}
