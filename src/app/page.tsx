"use client";

import { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWaitlist = async () => {
  if (!email) return;
  setLoading(true);

  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (res.ok || res.status === 409) {
    setSubmitted(true);
  }
  setLoading(false);
};

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-mono overflow-hidden">
      {/* Grid Background */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-tight">
            Team<span className="text-emerald-400">Automation</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="/dashboard"
            className="text-xs text-white/50 hover:text-white transition-colors"
          >
            Dashboard →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 pt-24 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Now in Beta — Free 14-day trial
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          Approvals that
          <br />
          <span className="text-emerald-400">actually happen.</span>
        </h1>

        <p className="text-white/50 text-lg max-w-xl mx-auto mb-12">
          Stop chasing approvals on Slack. TeamAutomation turns{" "}
          <span className="text-white">/approve</span> into a full workflow —
          with nudges, digests, and delegation built in.
        </p>

        {/* Waitlist Form */}
        {!submitted ? (
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-6">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleWaitlist()}
              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            <button
              onClick={handleWaitlist}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm px-6 py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-6 py-4 rounded-lg max-w-md mx-auto mb-6">
            ✅ You're on the list! We'll reach out soon.
          </div>
        )}

        <p className="text-white/20 text-xs">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">
            How it works
          </p>
          <h2 className="text-2xl font-bold">3 steps. Zero friction.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Install in Slack",
              desc: "One click. No API keys. No webhook copying. Just click Add to Slack.",
              color: "text-emerald-400",
            },
            {
              step: "02",
              title: "Create a request",
              desc: 'Type /approve purchase "MacBook" $1200 @manager and hit enter.',
              color: "text-blue-400",
            },
            {
              step: "03",
              title: "It handles the rest",
              desc: "Nudges, digests, delegation — everything automated. You just approve.",
              color: "text-purple-400",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
            >
              <div className={`text-xs font-bold ${item.color} mb-3`}>
                {item.step}
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-white/40 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">
            Features
          </p>
          <h2 className="text-2xl font-bold">Everything your team needs.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              icon: "⚡",
              title: "Async Approvals",
              desc: "No timeouts. No lost requests. Every approval is processed in the background.",
            },
            {
              icon: "🔔",
              title: "Smart Nudges",
              desc: "Automatic reminders after 24 hours. Escalate to backup if ignored.",
            },
            {
              icon: "📋",
              title: "Daily Digest",
              desc: "Every morning at 9 AM, your team gets a summary of pending approvals.",
            },
            {
              icon: "🏖️",
              title: "Vacation Delegation",
              desc: "Going on leave? /approve-delegate @colleague 7d and you're done.",
            },
            {
              icon: "📊",
              title: "Audit Trail",
              desc: "Every approval logged with who, what, and when. Always compliant.",
            },
            {
              icon: "💳",
              title: "14-day Free Trial",
              desc: "No credit card needed. Try everything free, pay only when you love it.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all"
            >
              <span className="text-2xl">{f.icon}</span>
              <div>
                <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                <p className="text-white/40 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-2xl mx-auto px-8 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to fix approvals?
        </h2>
        <p className="text-white/40 text-sm mb-8">
          Join teams already automating their approval workflows.
        </p>
        <a
          href={`https://slack.com/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}&scope=commands,chat:write,users:read&redirect_uri=https://team-automation.vercel.app/api/auth/slack/callback`}
          className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm px-8 py-4 rounded-lg hover:bg-white/90 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
          </svg>
          Add to Slack — It's Free
        </a>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-8 py-6 text-center">
        <p className="text-white/20 text-xs">
          © 2026 TeamAutomation · Built for Slack teams ·{" "}
          <a href="/dashboard" className="hover:text-white/40 transition-colors">
            Dashboard
          </a>
          {" "}·{" "}
          <a href="/privacy" className="hover:text-white/40 transition-colors">
            Privacy Policy
          </a>
          {" "}·{" "}
          <a href="/terms" className="hover:text-white/40 transition-colors">
            Terms of Service
          </a>
        </p>
      </footer>
    </div>
  );
}
