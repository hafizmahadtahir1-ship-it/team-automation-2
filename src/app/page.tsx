"use client";
import React, { useState, useEffect, useRef } from 'react';

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onToggle }) => (
  <div className="faq-item">
    <button className="faq-q" onClick={onToggle} aria-expanded={isOpen}>
      <span>{question}</span>
      <span className="faq-toggle">{isOpen ? '-' : '+'}</span>
    </button>
    <div
      className="faq-a"
      style={{
        maxHeight: isOpen ? 500 : 0,
        opacity: isOpen ? 1 : 0,
        transition:
          "max-height 0.3s cubic-bezier(.4,0,.2,1),opacity 0.3s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <p>{answer}</p>
    </div>
  </div>
);

interface Stat {
  label: string;
  suffix?: string;
  prefix?: string;
  countTo: number;
  duration: number;
}

interface Feature {
  icon: React.ReactNode;
  label: string;
  desc: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const TYPING_PHRASES = [
  "No more approval bottlenecks.",
  "Automate directly in Slack.",
  "Ship faster, always tracked.",
  "Built for real teams.",
];

// UPDATED STATS ARRAY
const STATS: Stat[] = [
  { label: "Setup Time", countTo: 5, duration: 1100, suffix: " min" },
  { label: "Free Trial", countTo: 14, duration: 1200, suffix: "-day" },
  { label: "Slack-Native", countTo: 100, duration: 1200, suffix: "%" },
  { label: "Starting Price", countTo: 49, duration: 1300, prefix: "$", suffix: "/mo" },
];

const HOW_STEPS: [string, string, string][] = [
  [
    "Connect Slack",
    "Authorize TeamAutomation to your Slack workspace in a single click.",
    "🔗",
  ],
  [
    "Define Workflows",
    "Use templates or custom triggers — code or no-code.",
    "🛠️",
  ],
  [
    "Automate Approvals",
    "Approve requests where your team works: right inside Slack.",
    "⚡",
  ],
];

// UPDATED FEATURES ARRAY
const FEATURES: Feature[] = [
  {
    icon: <span className="ibox">⚡</span>,
    label: "Instant Slack Cards",
    desc: "Approval requests appear as rich interactive Slack messages. One click to approve or reject.",
  },
  {
    icon: <span className="ibox">🔔</span>,
    label: "Smart Nudges",
    desc: "Auto reminders on Day 1, 3, and 7 if a request is pending. Zero forgotten approvals.",
  },
  {
    icon: <span className="ibox">📋</span>,
    label: "Full Audit Trail",
    desc: "Every action logged with timestamp and user. Always compliant, exportable to CSV.",
  },
  {
    icon: <span className="ibox">🔀</span>,
    label: "Delegate Approvals",
    desc: "Use /approve-delegate to hand off authority instantly when out of office.",
  },
  {
    icon: <span className="ibox">📊</span>,
    label: "Dashboard & Export",
    desc: "See all requests in one view. Filter, search, and export CSV in real time.",
  },
  {
    icon: <span className="ibox">🔒</span>,
    label: "Secure by Default",
    desc: "Slack signature verification, Supabase RLS, full isolation. Enterprise-grade from day one.",
  },
];

// UPDATED PRICING ARRAY
const PRICING = [
  {
    label: "Starter",
    price: 49,
    features: [
      "Up to 10 members",
      "Unlimited requests",
      "Smart nudges",
      "30-day audit trail",
      "Dashboard + CSV",
      "Email support",
    ],
    cta: "Start free trial",
    featured: false,
  },
  {
    label: "Growth",
    price: 149,
    features: [
      "Up to 50 members",
      "Unlimited requests",
      "Multi-level chains",
      "1-year audit trail",
      "Analytics",
      "Priority support",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    label: "Scale",
    price: 499,
    features: [
      "Unlimited members",
      "Custom workflows",
      "SSO & security",
      "Unlimited audit trail",
      "Dedicated manager",
      "SLA guarantee",
    ],
    cta: "Contact us",
    featured: false,
  },
];

// UPDATED TESTIMONIALS
const TESTIMONIALS: Testimonial[] = [
  {
    quote: "We used to lose track of purchase approvals constantly. TeamAutomation fixed that in one afternoon.",
    name: "Sarah K.",
    role: "Ops Manager, Series A startup",
  },
  {
    quote: "The audit trail alone is worth it. Finance stopped asking for screenshots of every approval.",
    name: "Marcus T.",
    role: "Team Lead, 40-person agency",
  },
  {
    quote: "Setup was genuinely 5 minutes. Our whole approval process now lives in Slack.",
    name: "Priya N.",
    role: "Head of Ops, SaaS company",
  },
];

// UPDATED FAQ
const FAQ: [string, string][] = [
  [
    "Do I need to know how to code?",
    "Not at all. Installs like any Slack app — click, authorize, done.",
  ],
  [
    "Does my team need to download anything?",
    "No. Everything happens inside Slack.",
  ],
  [
    "What's included in the free trial?",
    "Full access for 14 days. No credit card. Cancel anytime.",
  ],
  [
    "How does the audit trail work?",
    "Every action logged with timestamp and user. Exportable as CSV.",
  ],
  [
    "Can I delegate when out of office?",
    "Yes. /approve-delegate assigns a temporary approver instantly.",
  ],
  [
    "What happens when my trial ends?",
    "App pauses on day 12 reminder. No data lost. Resume anytime.",
  ],
];

// Mouse glow
function useMouseGlow(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      if (!el || !document.body.contains(el)) return;
      el.style.transform = `translate(${e.clientX - 60}px, ${e.clientY - 60}px)`;
    };
    window.addEventListener(
      "mousemove",
      handler as EventListener,
      { passive: true },
    );
    return () =>
      window.removeEventListener("mousemove", handler as EventListener);
  }, [ref]);
}

// Typing animation for hero
function useTypingAnimation(phrases: string[]) {
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!deleting && charIdx < phrases[phraseIdx].length) {
      timeout = setTimeout(
        () => setCharIdx((i) => i + 1),
        42,
      );
      setText(phrases[phraseIdx].slice(0, charIdx + 1));
    } else if (!deleting && charIdx === phrases[phraseIdx].length) {
      timeout = setTimeout(() => setDeleting(true), 1250);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(
        () => setCharIdx((i) => i - 1),
        18,
      );
      setText(phrases[phraseIdx].slice(0, charIdx - 1));
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx((idx) => (idx + 1) % phrases.length);
    }
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [charIdx, deleting, phrases, phraseIdx]);
  return text;
}

// Intersection observer for counter animations and scroll reveals
function useReveal(ref: React.RefObject<HTMLDivElement | null>, cb: () => void) {
  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry && entry.isIntersecting) cb();
      },
      { threshold: 0.42 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, cb]);
}

// StatCounter with new stat format (prefix/suffix/label)
function StatCounter({ to, duration, prefix, suffix }: { to: number; duration: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  const refed = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useReveal(refed, () => {
    if (!done) {
      let start: number | null = null;
      let animframe: number;
      const step = (ts: number) => {
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        setVal(Math.floor(progress * to));
        if (progress < 1) {
          animframe = window.requestAnimationFrame(step);
        } else {
          setVal(to);
          setDone(true);
        }
      };
      animframe = window.requestAnimationFrame(step);
      return () => window.cancelAnimationFrame(animframe);
    }
  });

  return (
    <div ref={refed} className="stat-val">
      {`${prefix ?? ""}${val}${suffix ?? ""}`}
    </div>
  );
}

// Slack demo card
type SlackStatus = "idle" | "approved" | "rejected";
function SlackDemoCard() {
  const [status, setStatus] = useState<SlackStatus>("idle");
  return (
    <div className="slack-card" aria-live="polite">
      <div className="slack-header">
        <span className="slack-dot" />
        <span>Approval Request</span>
        <span className="slack-btn" aria-label="More">
          ⋮
        </span>
      </div>
      <div className="slack-msg">
        <span className="slack-user-ic">🧑‍💻</span>
        <div>
          <div className="slack-user-name">Mahad • 2m ago</div>
          <div className="slack-req">
            {status === "idle"
              ? "Approve deployment of production?"
              : status === "approved"
                ? "Request approved 🎉"
                : "Request rejected 👎"}
          </div>
        </div>
      </div>
      {status === "idle" && (
        <div className="slack-actions">
          <button className="btn-gold" onClick={() => setStatus("approved")}>
            Approve
          </button>
          <button className="btn-ghost" onClick={() => setStatus("rejected")}>
            Reject
          </button>
        </div>
      )}
      {status !== "idle" && (
        <div className="slack-result">
          <button className="btn-ghost" onClick={() => setStatus("idle")}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default function Page(): React.ReactNode {
  // Mouse glow
  const glowRef = useRef<HTMLDivElement>(null);
  useMouseGlow(glowRef);

  // Hamburger nav
  const [navOpen, setNavOpen] = useState(false);
  const navBtnRef = useRef<HTMLButtonElement>(null);

  // FAQ
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Waitlist form
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [formMsg, setFormMsg] = useState<string>("");

  const handleScrollToCta = () => {
    const el = document.getElementById("cta");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // trap body scroll on nav open
  useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  // nav click outside close
  useEffect(() => {
    if (!navOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        navBtnRef.current &&
        !navBtnRef.current.contains(e.target as Node)
      ) {
        setNavOpen(false);
      }
    };
    window.addEventListener("mousedown", handler as EventListener);
    return () =>
      window.removeEventListener("mousedown", handler as EventListener);
  }, [navOpen]);

  // Typing animation
  const typedPhrase = useTypingAnimation(TYPING_PHRASES);

  // Waitlist handler
  const submitWaitlist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || formStatus === "loading") return;
    setFormStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormMsg("You’re added! Watch your inbox 🎉");
        setEmail("");
      } else {
        setFormStatus("error");
        setFormMsg("Oops! Try again or email hi@teamautomation.co");
      }
    } catch {
      setFormStatus("error");
      setFormMsg("Oops! Try again or email hi@teamautomation.co");
    }
  };

  return (
    <div className="root-wrap">
      {/* Mouse Glow */}
      <div ref={glowRef} className="bglow" />
      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          Team<span style={{ color: "#D4AF37" }}>Automation</span>
        </div>
        <div className={`nav-center ${navOpen ? "nav-mobile-show" : ""}`}>
          <a
            href="#features"
            className="nav-link"
            tabIndex={navOpen ? 0 : -1}
          >
            Features
          </a>
          <a
            href="#how"
            className="nav-link"
            tabIndex={navOpen ? 0 : -1}
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="nav-link"
            tabIndex={navOpen ? 0 : -1}
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="nav-link"
            tabIndex={navOpen ? 0 : -1}
          >
            FAQ
          </a>
        </div>
        <div className="nav-end">
          <button
            className="btn-ghost nav-cta"
            style={{ display: "none" }}
            onClick={handleScrollToCta}
          >
            Login
          </button>
          <button
            className="btn-gold nav-cta"
            style={{ display: "none" }}
            onClick={handleScrollToCta}
          >
            Get Early Access
          </button>
          <button
            ref={navBtnRef}
            className={`nav-ham${navOpen ? " nav-ham-open" : ""}`}
            aria-label="Open Navigation"
            aria-controls="nav"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        {/* Desktop nav CTAs */}
        <div className="nav-right-desktop">
          <button className="btn-ghost" onClick={handleScrollToCta}>
            Login
          </button>
          <button className="btn-gold" onClick={handleScrollToCta}>
            Get Early Access
          </button>
        </div>
      </nav>
      {/* HERO */}
      <header className="section hero">
        <div className="section-inner hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">FOR PRODUCT & DEV TEAMS</div>
            <h1>
              <span className="shimmer">Slack-native</span> approvals that{" "}
              <span className="gold-txt">just happen</span>
            </h1>
            <div className="hero-typed">
              <span className="typed-anim">
                {typedPhrase}
                <span className="blink">|</span>
              </span>
            </div>
            <div className="hero-actions">
              <button className="btn-gold" onClick={handleScrollToCta}>
                Get Early Access
              </button>
              <button className="btn-ghost" onClick={handleScrollToCta}>
                See how it works
              </button>
            </div>
          </div>
          <div className="hero-card-wrap">
            <div className="hero-card">
              <SlackDemoCard />
            </div>
          </div>
        </div>
      </header>
      {/* STATS */}
      <section className="section stats" id="stats">
        <div className="section-inner stat-row">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="stat-box">
              <StatCounter
                to={stat.countTo}
                duration={stat.duration}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="section-inner">
          <div className="h2">How it works</div>
          <div className="grid-3">
            {HOW_STEPS.map(([title, desc, icon], idx) => (
              <div className="card how-step" key={title}>
                <div className="ibox how-icon">{icon}</div>
                <div className="how-title">{title}</div>
                <div className="how-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FEATURES */}
      <section className="section" id="features">
        <div className="section-inner">
          <div className="h2">Features</div>
          <div className="grid-3">
            {FEATURES.map((f) => (
              <div className="card card-feature" key={f.label}>
                {f.icon}
                <div className="feature-label">{f.label}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* PRICING */}
      <section className="section" id="pricing">
        <div className="section-inner">
          <div className="h2">Pricing</div>
          <div className="pricing-row">
            {PRICING.map((plan, i) => (
              <div
                className={`card pricing-card${plan.featured ? " featured" : ""}`}
                key={plan.label}
                style={
                  plan.featured
                    ? {
                        border: '2px solid #D4AF37',
                        background: 'linear-gradient(145deg, rgba(22,16,6,0.98), rgba(12,8,2,0.99))',
                        transform: 'scale(1.047)',
                        boxShadow: '0 6px 44px -7px #8B6914',
                        zIndex: 2,
                      }
                    : undefined
                }
              >
                <div className="pricing-label">{plan.label}</div>
                <div className="pricing-price">
                  ${plan.price}
                  <span className="mo">/mo</span>
                </div>
                <ul className="pricing-list">
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <button className={`btn-${plan.featured ? "gold" : "ghost"}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* TESTIMONIALS */}
      <section className="section" id="testimonials">
        <div className="section-inner">
          <div className="h2">Loved by teams</div>
          <div className="testi-row">
            {TESTIMONIALS.map((t) => (
              <div className="card testi-card" key={t.name}>
                <div className="testi-quote">“{t.quote}”</div>
                <div className="testi-user">
                  <div
                    style={{
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      background: "#D4AF37",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.7rem",
                      marginRight: 2,
                      color: "#12111a",
                      fontWeight: 700,
                    }}
                    aria-hidden="true"
                  >
                    👤
                  </div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-company">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section className="section" id="faq">
        <div className="section-inner">
          <div className="h2">FAQ</div>
          <div className="faq-list">
            {FAQ.map(([q, a], i) => (
              <FaqItem
                key={q}
                question={q}
                answer={a}
                isOpen={faqOpen === i}
                onToggle={() => setFaqOpen(faqOpen === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="section cta" id="cta">
        <div className="section-inner cta-inner">
          <div className="h2">Join the waitlist</div>
          <form
            className="cta-form"
            onSubmit={submitWaitlist}
            autoComplete="off"
          >
            <input
              required
              type="email"
              name="email"
              placeholder="Enter your work email"
              autoComplete="email"
              aria-label="Your work email"
              value={email}
              disabled={formStatus === "loading" || formStatus === "success"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            <button
              type="submit"
              className="btn-gold"
              disabled={formStatus === "loading" || formStatus === "success"}
            >
              {formStatus === "loading" ? "Submitting..." : "Join Waitlist"}
            </button>
          </form>
          {formMsg && (
            <div className={`cta-msg cta-${formStatus}`}>{formMsg}</div>
          )}
        </div>
      </section>
      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            Team<span style={{ color: "#D4AF37" }}>Automation</span>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href="mailto:hi@teamautomation.co">Contact</a>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} TeamAutomation. All rights reserved.
          </div>
        </div>
      </footer>

      {/* STYLE — ALL CSS & GOOGLE FONTS IMPORT */}
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400&display=swap');
      :root {
        --bg: #04040a;
        --gold: #D4AF37;
        --gold-dark: #8B6914;
        --card: #12111a;
        --shadow: 0 4px 24px 0 rgba(8,7,19,0.14);
        --radius: 18px;
        --pad: clamp(16px, 5vw, 48px);
        --syne: 'Syne', sans-serif;
        --body: 'DM Sans', sans-serif;
      }
      html, body, .root-wrap {
        min-height: 100vh;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        background: var(--bg);
        color: #fff;
        font-family: var(--body);
      }
      .root-wrap { position: relative; overflow-x: hidden; }
      .bglow {
        position: fixed;
        top: 0; left: 0;
        width: 120px; height: 120px;
        background: radial-gradient(ellipse 65% 70% at 50% 70%, #D4AF3780 0%, transparent 100%);
        pointer-events: none;
        z-index: 1;
        border-radius: 50%;
        transition: background 240ms;
        will-change: transform;
        mix-blend-mode: lighten;
      }
      .nav {
        z-index: 12;
        position: fixed;
        top: 0; left: 0; right: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(4,4,10,0.95);
        height: 56px;
        padding: 0 var(--pad);
        box-shadow: 0 2px 8px 0 #0004;
      }
      .nav-logo {
        font-family: var(--syne);
        font-size: clamp(1.2rem,4vw,2rem);
        font-weight: 800;
        letter-spacing: -0.04em;
        color: #fff;
      }
      .nav-center {
        flex: 1;
        display: flex; justify-content: center; align-items: center;
        gap: 18px;
        transition: all .3s cubic-bezier(.4,0,.2,1);
      }
      .nav-link {
        font-family: var(--syne);
        font-weight: 700;
        color: #fff;
        text-decoration: none;
        font-size: clamp(.95rem,3vw,1.1rem);
        opacity: 0.84;
        transition: color .2s;
        border-bottom: 2px solid transparent;
        padding: 4px 0;
      }
      .nav-link:hover,
      .nav-link:focus {
        color: var(--gold);
        border-bottom: 2px solid var(--gold);
      }
      .nav-end { display: flex; align-items: center; gap: 12px; }
      .nav-ham {
        display: flex;
        width: 34px; height: 34px;
        background: transparent;
        border: none;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
        z-index: 16;
        margin-left: 18px;
      }
      .nav-ham span {
        display: block;
        width: 100%; height: 3px; border-radius: 3px;
        background: #fff;
        margin: 0;
        transition: all 0.24s cubic-bezier(.4,0,.2,1);
      }
      .nav-ham.nav-ham-open span:nth-child(1) { transform: translateY(6px) rotate(45deg);}
      .nav-ham.nav-ham-open span:nth-child(2) { opacity: 0;}
      .nav-ham.nav-ham-open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg);}
      .nav-right-desktop {
        display: flex;
        gap: 9px;
        margin-left: 16px;
      }
      @media (max-width: 768px) {
        .nav-center {
          position: fixed;
          left: 0; top: 0; right: 0;
          flex-direction: column;
          justify-content: flex-start;
          background: #202033ee;
          padding-top: 65px;
          height: 100vh;
          gap: 16px;
          opacity: 0; pointer-events: none;
          transform: translateX(-100%);
          transition: all .33s cubic-bezier(.4,0,.2,1);
          z-index: 19;
        }
        .nav-center.nav-mobile-show {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(0);
        }
        .nav-right-desktop {
          display: none;
        }
        .nav-cta { display: none !important;}
      }
      @media (min-width: 769px) {
        .nav-ham { display: none; }
      }
      .section {
        width: 100%;
        padding: clamp(44px, 9vw, 124px) 0 0 0;
        background: none;
      }
      .section-inner {
        width: 100%;
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 var(--pad);
        position: relative;
      }
      .hero {
        min-height: 600px;
        display: flex; align-items: center;
        justify-content: center;
        width: 100%; background: none;
        padding-bottom: 0;
      }
      .hero-inner {
        display: flex;
        flex-direction: column-reverse;
        gap: 36px;
      }
      .hero-copy {
        flex: 1;
        min-width: 0;
      }
      .eyebrow {
        color: var(--gold);
        font-family: var(--syne); font-weight: 800;
        font-size: clamp(.89rem,2.7vw,1.04rem);
        letter-spacing: .13em;
        text-transform: uppercase;
        margin-bottom: 7px;
      }
      h1 {
        font-size: clamp(2.1rem,7vw,3.9rem);
        font-family: var(--syne); font-weight: 800; line-height: 1.08;
        margin: 0 0 11px 0;
      }
      .hero-typed {
        font-size: clamp(.93em,2.3vw,1.46em);
        font-family: var(--body);
        opacity: 0.82;
        min-height: 34px;
        margin-bottom: 19px;
      }
      .typed-anim { font-weight: 400;}
      .blink {
        opacity: 1; animation: blink .95s steps(1) infinite;
      }
      @keyframes blink { 45% {opacity: 1;} 54%{opacity:0;} 100%{opacity:0;} }
      .shimmer {
        display: inline-block;
        background: linear-gradient(90deg, var(--gold) 18%, #fff 73%, var(--gold) 90%);
        background-size: 220% 100%;
        background-position: 0 0;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        animation: shimmer 2.2s infinite linear;
      }
      @keyframes shimmer {
        0% { background-position: -110% 0; }
        100% { background-position: 210% 0; }
      }
      .gold-txt { color: var(--gold);}
      .hero-actions {
        display: flex;
        gap: 13px;
        margin-bottom: 0;
      }
      .hero-card-wrap {
        flex: 1;
        display: flex;
        align-items: center; justify-content: center;
        min-width: 0;
      }
      .hero-card {
        display: none;
      }
      @media (min-width: 900px) {
        .hero-inner {
          flex-direction: row;
          align-items: center;
        }
        .hero-card { display: block; }
      }
      .slack-card {
        width: 310px;
        background: #161620;
        box-shadow: 0 6px 32px 0 #0003;
        border-radius: 18px;
        font-family: var(--body);
        overflow: hidden;
        position: relative;
        border: 1.5px solid #272742;
        padding: 0 0 10px 0;
        margin: 0 auto;
      }
      .slack-header {
        display: flex; align-items: center;
        gap: 12px;
        height: 46px;
        background: #202037;
        font-family: var(--syne);
        font-weight: 700;
        letter-spacing: .04em;
        font-size: 1em;
        padding: 0 16px;
        border-bottom: 1.5px solid #292948;
      }
      .slack-dot {
        width: 9px; height: 9px;
        background: #2bff2b; border-radius: 50%;
        margin-right: 2px;
        box-shadow: 0 0 4px #2bff2b66;
        display: inline-block;
      }
      .slack-btn {
        margin-left: auto;
        opacity: 0.54;
        cursor: pointer;
        border: none; background: none;
        font-size: 20px;
      }
      .slack-msg {
        display: flex; align-items: flex-start; gap: 10px;
        padding: 16px;
      }
      .slack-user-ic {
        font-size: 2rem;
        display: flex; align-items: center;
        padding-right: 3px;
      }
      .slack-user-name {
        color: #bbb;
        font-weight: 700;
        font-size: .99em;
        margin-bottom: 3px;
      }
      .slack-req { font-size: 1.06em; }
      .slack-actions {
        display: flex; gap: 9px; justify-content: flex-end;
        padding: 0 16px 5px 0;
      }
      .slack-result {
        text-align: right;
        padding: 0 16px 5px 0;
      }
      .btn-gold {
        background: var(--gold);
        color: #15132a;
        font-family: var(--syne);
        font-weight: 800;
        border: none;
        border-radius: 99px;
        font-size: clamp(1rem,2.1vw,1.19rem);
        padding: 8px 22px;
        box-shadow: 0 2px 8px 0 #D4AF3716;
        cursor: pointer;
        transition: box-shadow .18s,filter .18s;
        filter: drop-shadow(0 1px 6px #D4AF3740);
      }
      .btn-gold:hover, .btn-gold:focus {
        filter: drop-shadow(0 4px 16px #D4AF3740) brightness(1.095);
        background: linear-gradient(90deg, #D4AF37 92%, #efd789 100%);
      }
      .btn-ghost {
        background: none;
        color: #fff;
        font-family: var(--syne);
        font-weight: 800;
        border: 1.5px solid var(--gold);
        border-radius: 99px;
        font-size: clamp(1rem,2vw,1.19rem);
        padding: 8px 22px;
        opacity: 0.78;
        transition: border .19s,opacity .19s,color .19s;
        cursor: pointer;
      }
      .btn-ghost:hover, .btn-ghost:focus {
        color: var(--gold);
        border: 1.5px solid #ebc884;
        opacity: 1;
      }
      .card {
        background: var(--card);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        padding: clamp(19px,3vw,31px);
        position: relative;
        transition: transform 220ms cubic-bezier(.45,0,.2,1), box-shadow 140ms;
        will-change: transform, box-shadow;
      }
      .card:hover {
        transform: translateY(-9px) scale(1.018);
        box-shadow: 0 7px 34px #0007;
      }
      .ibox {
        --size: clamp(41px,3.7vw,55px);
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(140deg, #232235, #232248 90%);
        color: var(--gold);
        width: var(--size); height: var(--size);
        border-radius: 13px;
        font-size: clamp(2rem,4vw,2.7rem);
        margin-bottom: 13px;
        box-shadow: 0 3px 23px 0 #D4AF3724;
        font-family: var(--syne);
      }
      .card:hover .ibox {
        color: #fff;
        background: var(--gold);
        box-shadow: 0 0 0 0 #D4AF371c;
      }
      .h2 {
        font-family: var(--syne);
        font-weight: 800;
        font-size: clamp(1.4rem,5vw,2.6rem);
        margin-bottom: clamp(18px,3vw,34px);
        letter-spacing: -.03em;
        color: #fff;
      }
      .grid-3 {
        display: grid;
        gap: clamp(23px,4vw,41px);
        grid-template-columns: 1fr;
      }
      @media (min-width: 700px) {
        .grid-3 {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      .stat-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 38px 18px;
        background: none;
        justify-content: center;
        padding: 0;
      }
      .stat-box {
        text-align: center;
      }
      .stat-val {
        font-size: clamp(1.7rem,6vw,2.3rem);
        font-family: var(--syne);
        font-weight: 800;
        color: var(--gold);
        margin-bottom: 8px;
        letter-spacing: -.02em;
      }
      .stat-label {
        font-size: clamp(1rem,2.5vw,1.05rem);
        opacity: 0.8;
      }
      @media (min-width: 900px) {
        .stat-row {
          grid-template-columns: repeat(4,1fr);
          gap: 24px 41px;
        }
      }
      /* Pricing */
      .pricing-row {
        display: flex;
        gap: 24px;
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        margin: 0 auto;
      }
      .pricing-card {
        min-width: 0;
        text-align: center;
        background: linear-gradient(130deg,#191924, #1a1430 86%);
        border: 2px solid #181822;
        transition: border 190ms,box-shadow 140ms;
        margin-bottom: 11px;
      }
      .pricing-card.featured {
        /* styles are overridden inline for correct gold background */
      }
      .pricing-label {
        font-family: var(--syne);
        font-weight: 800;
        color: #fff;
        font-size: 1.27em;
        margin-bottom: 7px;
        margin-top: 7px;
      }
      .pricing-price {
        font-family: var(--syne);
        font-size: 2.3em;
        color: var(--gold);
        font-weight: 800;
        margin-bottom: 4px;
      }
      .pricing-price .mo {
        font-weight: 400;
        font-size: .42em;
        color: #adb1be;
        margin-left: 4px;
      }
      .pricing-list {
        list-style: none;
        margin: 9px 0 18px 0;
        padding: 0;
        text-align: left;
        font-size: 1.06em;
        color: #e2e0ff;
      }
      .pricing-list li {
        margin-bottom: 4px;
        opacity: .7;
      }
      .pricing-card .btn-gold, .pricing-card .btn-ghost {
        width: 100%;
        margin: 0 auto;
        margin-top: 8px;
      }
      @media(min-width: 900px) {
        .pricing-row {
          flex-direction: row;
          justify-content: center;
          align-items: flex-end;
        }
        .pricing-card { min-width: 270px; }
      }
      /* Features */
      .feature-label {
        font-family: var(--syne);
        font-weight: 800;
        font-size: 1.17em;
        color: var(--gold);
        margin-bottom: 5px;
        letter-spacing: -.01em;
      }
      .feature-desc {
        font-size: 1.02em;
        opacity: 0.78;
        margin-bottom: 0;
        color: #daebff;
      }
      /* How Steps */
      .how-step {
        text-align: center;
      }
      .how-title {
        font-family: var(--syne);
        font-weight: 800;
        color: #fff;
        font-size: 1.17em;
        margin-bottom: 3px;
      }
      .how-desc {
        font-size: 1.07em;
        opacity: 0.73;
        margin-bottom: 0;
      }
      /* Testimonials */
      .testi-row {
        display: flex;
        flex-direction: column;
        gap: 27px;
        margin-bottom: 3px;
      }
      @media (min-width: 900px){
        .testi-row {
          flex-direction: row;
        }
      }
      .testi-card {
        padding: clamp(22px,2.1vw,41px);
        min-width: 0;
        display: flex;
        gap: 18px;
        flex-direction: column;
        justify-content: flex-start;
      }
      .testi-quote {
        font-size: clamp(1.05rem,2vw,1.19rem);
        margin-bottom: 11px;
        font-weight: 500;
        color: #fff;
        opacity: 0.93;
      }
      .testi-user {
        display: flex;
        gap: 11px;
        align-items: center;
        margin-top: auto;
      }
      .testi-img {
        border-radius: 50%;
        width: 40px; height: 40px;
        object-fit: cover;
        border: 2.5px solid var(--gold-dark);
      }
      .testi-name { font-family: var(--syne); color: #fff; font-weight: 800; font-size: 1.06em;}
      .testi-company { color: var(--gold); font-size: .98em; opacity: .87;}
      /* FAQ */
      .faq-list { max-width: 800px; margin: 0 auto;}
      .faq-item { border-bottom: 1px solid #22223d; }
      .faq-q {
        background: none;
        color: #fff;
        font-family: var(--syne);
        font-weight: 800;
        font-size: 1.11em;
        border: none;
        width: 100%;
        text-align: left;
        padding: 18px 2px 16px 2px;
        transition: color .18s;
        display: flex; justify-content: space-between; align-items: center;
        cursor: pointer;
        outline: none;
      }
      .faq-q:focus { color: var(--gold);}
      .faq-toggle {
        font-size: 1.5em;
        color: var(--gold);
      }
      .faq-a {
        overflow: hidden;
        transition: max-height 0.26s cubic-bezier(.4,0,.2,1), opacity 0.22s cubic-bezier(.3,0,.2,1);
        opacity: 0.76;
        line-height: 1.68;
        background: none;
        padding-left: 1px;
      }
      .faq-a p { margin: 0 0 13px 0; }
      /* CTA FORM */
      .cta {
        background: linear-gradient(108deg,#181824 56%, #121124 100%);
        padding: clamp(49px,6vw,89px) 0;
      }
      .cta-inner { text-align: center;}
      .cta-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 13px;
        margin: 0 auto;
        max-width: 410px;
      }
      .cta-form input[type="email"] {
        background: #23223a;
        border: 1.9px solid #323267;
        border-radius: 14px;
        padding: 13px 19px;
        font-size: 1.1rem;
        color: #fff;
        font-family: var(--body);
        outline: none;
        margin-bottom: 2px;
        width: 100%;
        transition: border .18s;
      }
      .cta-form input:focus {
        border: 1.9px solid var(--gold);
      }
      .cta-form button {
        width: 100%;
        font-size: 1.11rem;
      }
      .cta-msg {
        font-size: 1.08em;
        margin-top: 12px;
      }
      .cta-success { color: var(--gold);}
      .cta-error { color: #ff3939;}
      /* Footer */
      .footer {
        margin-top: 0;
        padding: clamp(44px,6vw,61px) 0 19px 0;
        background: #130f1e;
      }
      .footer-inner {
        max-width: 1000px;
        margin: 0 auto; padding: 0 var(--pad);
        display: flex;
        flex-direction: column;
        gap: 13px;
      }
      .footer-logo {
        font-family: var(--syne); font-weight: 800; font-size: clamp(1.11rem,3vw,1.5rem);
        letter-spacing: -.03em;
        margin-bottom: 3px;
      }
      .footer-links {
        display: flex; flex-wrap: wrap; gap: 13px;
        margin-bottom: 4px;
        font-family: var(--body);
        font-size: 1.04em;
      }
      .footer-links a {
        color: var(--gold); text-decoration: none; opacity: 0.81; transition: color .15s,opacity .2s;
      }
      .footer-links a:hover { color: #fff; opacity: 1;}
      .footer-copy {
        font-size: .97em;
        opacity: .64;
      }
      /* Animations */
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 var(--gold-dark);}
        70% { box-shadow: 0 0 0 17px #D4AF3718; }
        100% { box-shadow: 0 0 0 0 var(--gold-dark);}
      }
      @keyframes bglow {
        0% { opacity: 0.85; }
        50%{ opacity: 0.98;}
        100%{ opacity: 0.85;}
      }
      @keyframes tglow {
        0% { text-shadow: 0 0 0 #D4AF37;}
        60%{ text-shadow: 0 0 8px var(--gold); }
        100%{ text-shadow: 0 0 0 #D4AF37;}
      }
      @keyframes float {
        0%{ transform:translateY(0);}
        45%{ transform: translateY(-6px);}
        90%{ transform: translateY(0);}
      }
      @keyframes spinCW {
        to { transform: rotate(1turn);}
      }
      @keyframes spinCCW {
        to { transform: rotate(-1turn);}
      }
      @keyframes orbmove {
        0% { transform: scale(1) translateY(0);}
        35%{transform: scale(1.09) translateY(-15px);}
        57%{transform: scale(1.01) translateY(-8px);}
        89%{transform: scale(1.11) translateY(-11px);}
        100%{transform: scale(1) translateY(0);}
      }
      /* Responsive small */
      @media (max-width: 1100px) { .section-inner { max-width: 97vw; }}
      @media (max-width: 700px) {
        .section-inner { padding: 0 7vw;}
        .hero-inner { flex-direction: column-reverse;}
        .hero-card { display: none; }
        .stat-row { grid-template-columns: 1fr 1fr; }
        .testi-row { flex-direction: column;}
        .grid-3 { grid-template-columns: 1fr; }
        .pricing-row{ flex-direction: column;}
      }
      `}</style>
    </div>
  );
}
