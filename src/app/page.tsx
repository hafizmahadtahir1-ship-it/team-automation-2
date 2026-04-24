"use client";
import React, { useRef, useState, useEffect, useCallback, FormEvent, KeyboardEvent, MouseEvent } from "react";

const NAV_HEIGHT = 62;

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  label: string;
}

const COUNTER_DATA: readonly CounterProps[] = [
  { value: 5, suffix: " min", label: "Setup" },
  { value: 14, suffix: "-day", label: "Free Trial" },
  { value: 100, suffix: "%", label: "Approval Rate" },
  { value: 49, prefix: "$", suffix: "/mo", label: "Starting At" },
] as const;

interface Stat {
  id: number;
  icon: React.ReactNode;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

interface Step {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface PricingTier {
  price: string;
  name: string;
  features: readonly string[];
  featured?: boolean;
}

interface Testimonial {
  avatar: string;
  name: string;
  role: string;
  quote: string;
}

interface FaqItemProps {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}

const TYPING_PHRASES = [
  "Slack Approvals. Automated.",
  "No-code Workflows. Instant.",
  "Enterprise-grade Security.",
  "Ship Ops Faster, Together.",
] as const;

const HOW_STEPS: readonly Step[] = [
  {
    title: "Connect Slack",
    desc: "Integrate with your workspace in seconds — no code, no hassle.",
    icon: (
      <svg width={32} height={32} fill="none" aria-hidden><rect width={32} height={32} rx={8} fill="#D4AF37" /><path d="M16 8v16" stroke="#04040a" strokeWidth={2} strokeLinecap="round" /><path d="M8 16h16" stroke="#04040a" strokeWidth={2} strokeLinecap="round" /></svg>
    ),
  },
  {
    title: "Configure Approval",
    desc: "Define multi-step logic with our visual builder — automate recurring tasks.",
    icon: (
      <svg width={32} height={32} fill="none" aria-hidden><rect width={32} height={32} rx={8} fill="#D4AF37" /><circle cx={16} cy={16} r={8} stroke="#04040a" strokeWidth={2} /><path d="M16 9v7l5 5" stroke="#04040a" strokeWidth={2} strokeLinecap="round" /></svg>
    ),
  },
  {
    title: "Launch In Slack",
    desc: "Your team approves in-channel, instantly – no context switching.",
    icon: (
      <svg width={32} height={32} fill="none" aria-hidden><rect width={32} height={32} rx={8} fill="#D4AF37" /><path d="M10 16h12" stroke="#04040a" strokeWidth={2} strokeLinecap="round" /><path d="M16 10v12" stroke="#04040a" strokeWidth={2} strokeLinecap="round" /></svg>
    ),
  },
] as const;

const FEATURES: readonly Feature[] = [
  {
    icon: (
      <svg width={32} height={32} fill="none" aria-hidden><circle cx={16} cy={16} r={16} fill="#D4AF37" /><path d="M10 16h12M16 10v12" stroke="#04040a" strokeWidth={2} strokeLinecap="round" /></svg>
    ),
    title: "Slack Native UX",
    desc: "All interaction happens in Slack — nothing for users to learn.",
  },
  {
    icon: (
      <svg width={32} height={32} fill="none" aria-hidden><circle cx={16} cy={16} r={16} fill="#D4AF37" /><rect x={10} y={10} width={12} height={12} stroke="#04040a" strokeWidth={2} rx={3} /></svg>
    ),
    title: "No-Code Builder",
    desc: "Create and test workflows visually — zero engineering hours required.",
  },
  {
    icon: (
      <svg width={32} height={32} fill="none" aria-hidden><circle cx={16} cy={16} r={16} fill="#D4AF37" /><path d="M16 8v8l6 6" stroke="#04040a" strokeWidth={2} strokeLinecap="round" /></svg>
    ),
    title: "Multi-Step Logic",
    desc: "Build sequential, conditional, and parallel approvals that adapt as you scale.",
  },
  {
    icon: (
      <svg width={32} height={32} fill="none" aria-hidden><circle cx={16} cy={16} r={16} fill="#D4AF37" /><path d="M16 23a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" fill="#04040a" /></svg>
    ),
    title: "Slack Identity",
    desc: "No new passwords, SSO-ready. All actions are authenticated via Slack.",
  },
  {
    icon: (
      <svg width={32} height={32} fill="none" aria-hidden><circle cx={16} cy={16} r={16} fill="#D4AF37" /><path d="M12 20l4-8 4 8" stroke="#04040a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
    title: "Audit Logging",
    desc: "Every step is logged & exportable — complete trails for compliance.",
  },
  {
    icon: (
      <svg width={32} height={32} fill="none" aria-hidden><circle cx={16} cy={16} r={16} fill="#D4AF37" /><path d="M10 22l12-12" stroke="#04040a" strokeWidth={2} strokeLinecap="round" /></svg>
    ),
    title: "Instant Setup",
    desc: "Go from signup to working approval flows in under 5 minutes.",
  },
] as const;


const PRICING: readonly PricingTier[] = [
  {
    price: "$49",
    name: "Starter",
    features: [
      "Unlimited Flows",
      "Unlimited Slack Users",
      "Single Team",
      "Zapier Integration",
      "Email Support",
    ] as const,
  },
  {
    price: "$149",
    name: "Growth",
    features: [
      "Everything in Starter",
      "Multiple Teams",
      "Custom Workflows",
      "Audit Exports",
      "Priority Support",
    ] as const,
    featured: true,
  },
  {
    price: "$499",
    name: "Scale",
    features: [
      "Everything in Growth",
      "SAML SSO",
      "SOC2/ISO Compliance",
      "Custom Integrations",
      "Dedicated Manager",
    ] as const,
  },
] as const;

const TESTIMONIALS: readonly Testimonial[] = [
  {
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    name: "Arjun Patel",
    role: "VP Engineering, SVX",
    quote:
      "My team loves how approvals now just happen in Slack — we ship faster and forget the manual busywork.",
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/74.jpg",
    name: "Sophia Kim",
    role: "COO, Boundless",
    quote:
      "Setup was instant. We designed our first workflow in 10 minutes. Approvals, automated; results, real.",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    name: "Jack Huang",
    role: "IT Lead, Forage",
    quote:
      "Security and audit needs? Solved. Our teams get flexibility, and I sleep at night. Win-win.",
  },
] as const;

const FAQS = [
  {
    q: "How secure is TeamAutomation?",
    a: "All data is encrypted in transit & at rest. You own your data. No third-party processors.",
  },
  {
    q: "Does this replace Slack Workflow Builder?",
    a: "We supercharge it. Build approval logic workflows, integrate with tools, ship faster — all in Slack.",
  },
  {
    q: "What if someone leaves the company?",
    a: "Ownership and steps automatically reassign to your admin users. No stuck flows.",
  },
  {
    q: "Can I integrate with other apps?",
    a: "Use Zapier, native integrations, and our REST API (Growth+) to hook into your stack.",
  },
  {
    q: "Is there a free trial?",
    a: "Enjoy a risk-free 14-day trial. Cancel anytime, no credit card required.",
  },
  {
    q: "How fast is support?",
    a: "Under 5-minute median response times during business hours for all customers.",
  },
] as const;


// Background Glow Animation Blurs
function AnimatedBackground() {
  // Positions are fixed since just CSS animates them
  return (
    <div aria-hidden style={{ zIndex: -1, position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div className="bglow bglow1" />
      <div className="bglow bglow2" />
      <div className="bglow bglow3" />
      <div className="bglow bglow4" />
      <div className="bglow bglow5" />
    </div>
  );
}

// Cursor Glow
function useCursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function mouseMove(e: MouseEvent) {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX - 60}px,${e.clientY - 60}px)`;
      }
    }
    window.addEventListener("mousemove", mouseMove as EventListener);
    return () => window.removeEventListener("mousemove", mouseMove as EventListener);
  }, []);
  return glowRef;
}

function CursorGlow() {
  const glowRef = useCursorGlow();
  return <div ref={glowRef} className="tglow" aria-hidden />;
}


// IntersectionObserver reveal utility
function useReveal(ref: React.RefObject<HTMLElement>, deps: unknown[] = []) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (show) return;
    let obs: IntersectionObserver | null = null;
    Promise.resolve().then(() => {
      obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShow(true);
            if (obs) obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(node);
    });
    return () => obs?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return show;
}

// Animated Counter
function Counter({ value, prefix = "", suffix = "", duration = 1000, label }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref, []);
  useEffect(() => {
    if (!revealed) return;
    let frame: number;
    let start: number | null = null;
    function animate(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.round(progress * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
      else setCount(value);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, revealed]);
  return (
    <div ref={ref} className="ibox">
      <div
        className="stat-value"
        style={{
          color: "#fff",
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(2rem,6vw,3.5rem)",
          lineHeight: 1.1,
        }}
      >
        {prefix}
        {count}
        {suffix}
      </div>
      <span className="stat-label">{label}</span>
    </div>
  );
}

// NavBar
function Navbar() {
  const [open, setOpen] = useState(false);
  const navLinks = [
    { label: "How it works", href: "#how" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ] as const;

  // Disable scroll on menu open mobile
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav
      className="navbar"
      style={{
        height: NAV_HEIGHT,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 51,
        backdropFilter: "blur(12px)",
        background:
          "linear-gradient(165deg, rgba(4,4,10,0.96) 60%, rgba(4,4,10,0.48) 100%)",
        borderBottom: "1px solid rgba(212,175,55,0.10)",
        display: "flex",
        alignItems: "center",
        padding: "0 clamp(24px,8vw,92px)",
      }}
    >
      <a
        href="#"
        style={{
          color: "#D4AF37",
          fontWeight: 800,
          fontFamily: "Syne, sans-serif",
          fontSize: "clamp(1.3rem,2vw,1.7rem)",
          letterSpacing: ".01em",
          display: "inline-flex",
          alignItems: "center",
          gap: "9px",
        }}
        className="gold-pulse"
      >
        <span style={{ fontWeight: 800, fontSize: "1.8em" }}>⬤</span>
        TeamAutomation
      </a>
      <div style={{ flexGrow: 1 }} />
      {/* Desktop links */}
      <div className="nav-links-desktop">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="nav-link"
            style={{
              fontFamily: "DM Sans, sans-serif",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {link.label}
          </a>
        ))}
        <a href="#cta" className="btn-gold nav-cta">
          Join Waitlist
        </a>
      </div>
      {/* Mobile hamburger */}
      <button
        className="hamburger"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: 44,
          width: 44,
          border: "none",
          background: "transparent",
          marginLeft: "4px",
          cursor: "pointer",
          zIndex: 200,
        }}
      >
        <span
          style={{
            display: "block",
            width: 28,
            height: 3,
            background: open ? "#D4AF37" : "#fff",
            borderRadius: 3,
            transition: "all .3s cubic-bezier(.7,0,.2,1)",
            transform: open ? "rotate(43deg) translateY(9px)" : "none",
            marginBottom: 6,
          }}
        />
        <span
          style={{
            display: "block",
            width: 22,
            height: 3,
            background: "#fff",
            borderRadius: 3,
            opacity: open ? 0 : 1,
            transition: "all .2s",
            marginBottom: 5,
          }}
        />
        <span
          style={{
            display: "block",
            width: 28,
            height: 3,
            background: open ? "#D4AF37" : "#fff",
            borderRadius: 3,
            transition: "all .3s cubic-bezier(.7,0,.2,1)",
            transform: open ? "rotate(-43deg) translateY(-9px)" : "none",
          }}
        />
      </button>
      {/* Mobile dropdown */}
      <div
        id="mobile-menu"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          top: NAV_HEIGHT,
          height: open ? "calc(100dvh - 62px)" : 0,
          background: "rgba(4,4,10,.97)",
          zIndex: 199,
          overflow: "hidden",
          transition: "height .25s cubic-bezier(.7,0,.2,1)",
          pointerEvents: open ? "auto" : "none",
          boxShadow: open ? "0 8px 42px rgba(0,0,0,0.22)" : "none",
          borderBottom: open ? "1px solid rgba(212,175,55,0.10)" : "none",
          display: "flex",
          flexDirection: "column",
        }}
        aria-hidden={!open}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            marginTop: 44,
            alignItems: "center",
            opacity: open ? 1 : 0,
            transition: "opacity .24s .12s",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              style={{
                fontSize: "1.18rem",
              }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#cta"
            className="btn-gold"
            style={{
              width: 210,
              textAlign: "center",
              fontSize: "1.1rem",
            }}
            onClick={() => setOpen(false)}
          >
            Join Waitlist
          </a>
        </div>
      </div>
    </nav>
  );
}

// Hero Section
function Hero() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref, []);
  const phrases = TYPING_PHRASES;
  // Typing animation with fixed pace
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (typing) {
      if (displayed.length < phrases[phraseIdx].length) {
        interval = setTimeout(() => {
          setDisplayed(
            phrases[phraseIdx].slice(0, displayed.length + 1)
          );
        }, 48);
      } else {
        setTyping(false);
        interval = setTimeout(() => {
          setTyping(false);
        }, 1600);
      }
    } else {
      interval = setTimeout(() => {
        setDisplayed("");
        setPhraseIdx((i) => (i + 1) % phrases.length);
        setTyping(true);
      }, 1200);
    }
    return () => clearTimeout(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed, typing, phraseIdx]);
  return (
    <header
      ref={ref}
      className="section"
      id="hero"
      style={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        paddingTop: "clamp(88px,8vw,220px)",
        paddingBottom: "clamp(48px,10vw,180px)",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(32px)",
        transition: "opacity .8s cubic-bezier(.7,0,.2,1),transform .8s cubic-bezier(.7,0,.2,1)",
      }}
    >
      <div className="section-inner hero-grid">
        <div style={{ minWidth: 0 }}>
          <div className="eyebrow">Slack-native Approval Automation</div>
          <h1 className="h2"
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              lineHeight: 1.13,
              marginBottom: "clamp(10px,2vw,18px)",
              color: "#fff",
            }}
          >
            <span>
              Ship faster, with absolute <span className="shimmer-gold" style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>confidence</span>
            </span>
          </h1>
          <div className="typing-sub"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              color: "#fff",
              minHeight: 36,
              fontSize: "clamp(1.13rem,3.6vw,1.42rem)",
              marginBottom: "clamp(30px,4vw,38px)",
              letterSpacing: "-.01em"
            }}
            aria-label={phrases[phraseIdx]}
          >
            {displayed}
            <span className="typed-cursor" aria-hidden>
              {typing && <>&#x258B;</>}
            </span>
          </div>
          <div style={{ display: "flex", gap: 17, flexWrap: "wrap" }}>
            <a
              href="#cta"
              className="btn-gold"
              style={{ fontSize: "clamp(1.08rem,2.6vw,1.19rem)" }}
            >
              Join Waitlist
            </a>
            <a
              href="#how"
              className="btn-ghost"
              style={{ fontSize: "clamp(1.08rem,2.6vw,1.19rem)" }}
            >
              How it works
            </a>
          </div>
        </div>
        {/* Hide Slack Card on mobile, show on desktop */}
        <div className="slackcard-wrapper">
          <SlackCard />
        </div>
      </div>
    </header>
  );
}

// Slack Approver Card Demo
function SlackCard() {
  const [state, setState] = useState<"idle"|"approved"|"rejected">("idle");

  const handle = useCallback(
    (result: "approved"|"rejected") => {
      setState(result);
      setTimeout(() => setState("idle"), 1800);
    },
    []
  );
  return (
    <div className="slackcard">
      <div className="slackcard-header">
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={{marginRight:8}}>
          <rect width={20} height={20} rx={5} fill="#D4AF37" />
          <path d="M5.5 13l3.5 3.25 5.5-6.5" stroke="#04040a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Approve New Vendor
      </div>
      <div className="slackcard-body">
        <div style={{marginBottom:18,lineHeight:1.42}}>Request by <span style={{color:"#fff",fontWeight:700}}>sophia.kim</span> via <span style={{color:"#D4AF37",fontWeight:600}}>Slack</span></div>
        <div className="slackcard-actions">
          {state === "idle" ? (
            <>
              <button
                className="btn-gold"
                type="button"
                style={{ minWidth: 125 }}
                onClick={() => handle("approved")}
                tabIndex={0}
              >
                Approve
              </button>
              <button
                className="btn-ghost"
                type="button"
                onClick={() => handle("rejected")}
                style={{ minWidth: 125 }}
              >
                Reject
              </button>
            </>
          ) : (
            <span
              aria-live="polite"
              className={`slackcard-result${state === "approved" ? " approved" : " rejected"}`}
            >
              <svg width={32} height={32} viewBox="0 0 32 32" fill="none" style={{verticalAlign:"-7px",marginRight:5}}>
                {state === "approved" ? (
                  <>
                    <circle cx={16} cy={16} r={16} fill="#D4AF37" />
                    <path d="M10 17l4 4 8-8" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  </>
                ) : (
                  <>
                    <circle cx={16} cy={16} r={16} fill="#222" />
                    <path d="M11 21l10-10M21 21L11 11" stroke="#C65656" strokeWidth={2.5} strokeLinecap="round" />
                  </>
                )}
              </svg>
              {state === "approved" ? "Approved" : "Rejected"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


// Stats Bar
function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref, []);
  return (
    <section
      ref={ref}
      className="section"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(40px)",
        transition: "opacity .8s cubic-bezier(.7,0,.2,1),transform .8s cubic-bezier(.7,0,.2,1)",
        paddingBlock: "0 clamp(22px,3vw,24px)",
        marginBottom: "clamp(9px,2vw,18px)"
      }}
      aria-label="Stats"
    >
      <div className="stats-grid">
        {COUNTER_DATA.map((stat, i) => (
          <Counter
            key={stat.label}
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            duration={910 + i*170}
            label={stat.label}
          />
        ))}
      </div>
    </section>
  );
}

function HowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref, []);
  return (
    <section
      ref={ref}
      id="how"
      className="section"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(40px)",
        transition: "opacity .8s cubic-bezier(.7,0,.2,1),transform .8s cubic-bezier(.7,0,.2,1)",
      }}
    >
      <div className="section-inner">
        <div className="eyebrow">How It Works in 3 Steps</div>
        <div className="grid-hows">
          {HOW_STEPS.map((step, i) => (
            <div className="card how-card" key={step.title}>
              <div className="ibox" style={{ marginBottom: 19, alignItems:"center" }}>{step.icon}</div>
              <h3
                className="h3"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.18rem,2.5vw,1.35rem)",
                  color: "#fff",
                  marginBottom: 8,
                  letterSpacing: "-0.01em",
                }}
              >
                {i+1}. {step.title}
              </h3>
              <div style={{
                fontSize: "clamp(1.02rem,2vw,1.13rem)",
                color:"#fff",
                fontFamily:"DM Sans, sans-serif",
                lineHeight:1.55,
                opacity:.77
              }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref, []);
  return (
    <section
      ref={ref}
      className="section"
      id="features"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(48px)",
        transition: "opacity .8s cubic-bezier(.7,0,.2,1),transform .8s cubic-bezier(.7,0,.2,1)",
      }}
    >
      <div className="section-inner">
        <div className="eyebrow">Features</div>
        <div className="grid-3 features-grid">
          {FEATURES.map((feat) => (
            <div className="card feat-card" key={feat.title}>
              <div className="ibox" style={{ marginBottom: 20 }}>{feat.icon}</div>
              <h4
                className="h4"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: "clamp(1.12rem,2vw,1.22rem)",
                  letterSpacing: "-.01em",
                  marginBottom: 7
                }}
              >
                {feat.title}
              </h4>
              <div style={{ color: "#fff", opacity: .72, fontSize:"clamp(.99rem,2vw,1.09rem)", fontFamily:"DM Sans,sans-serif",lineHeight:1.54 }}>{feat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref, []);
  return (
    <section
      ref={ref}
      className="section"
      id="pricing"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(54px)",
        transition: "opacity .8s cubic-bezier(.7,0,.2,1),transform .8s cubic-bezier(.7,0,.2,1)",
      }}>
      <div className="section-inner">
        <div className="eyebrow">Pricing</div>
        <div className="pricing-grid">
          {PRICING.map((tier) => (
            <div
              key={tier.name}
              className={`card pricing-card${tier.featured ? " featured" : ""}`}
              style={{
                border: tier.featured ? "2px solid #D4AF37" : "1.5px solid #26262e",
              }}>
              <div className="ibox"
                style={{
                  marginBottom: 17,
                  gap:6,
                  alignItems:"center"
                }}>
                <span style={{
                  fontFamily:"Syne, sans-serif",
                  fontWeight:800,
                  fontSize:"clamp(2.1rem,4vw,2.45rem)",
                  color: "#fff"
                }}>
                  {tier.price}
                </span>
                <span style={{
                  color:"#D4AF37",
                  fontFamily:"Syne, sans-serif",
                  fontSize:"clamp(.95rem,2vw,1.10rem)",
                  fontWeight:700,
                  letterSpacing:".005em",
                  marginLeft:8
                }}>{tier.name}</span>
              </div>
              <ul style={{ marginBottom: 18, paddingLeft: 19, color: "#fff", opacity: .89, fontSize:"clamp(.98rem,2vw,1.13rem)",fontFamily:"DM Sans, sans-serif",lineHeight:1.6 }}>
                {tier.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <a
                href="#cta"
                className={`btn-gold${tier.featured ? " btn-featured" : ""}`}
                style={{ width: "100%", fontSize:"clamp(1.08rem,2vw,1.16rem)", fontWeight: 700, marginBlock:2}}
              >
                Join Waitlist
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref, []);
  return (
    <section
      ref={ref}
      className="section"
      id="testimonials"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(48px)",
        transition: "opacity .8s cubic-bezier(.7,0,.2,1),transform .8s cubic-bezier(.7,0,.2,1)",
      }}
    >
      <div className="section-inner">
        <div className="eyebrow">What Teams Say</div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div className="card testimonial-card" key={t.name}>
              <div style={{display:"flex",alignItems:"center",marginBottom:14,gap:11}}>
                <img src={t.avatar} width={44} height={44}
                  style={{
                    borderRadius:"50%",
                    border:"2.5px solid #D4AF37",
                    objectFit:"cover",
                    aspectRatio:"1/1",
                    background:"#222",
                  }}
                  alt={`Avatar of ${t.name}`}
                />
                <div style={{display:"flex",flexDirection:"column"}}>
                  <strong style={{fontFamily:"Syne, sans-serif",fontWeight:800,letterSpacing:".01em",color:"#fff",fontSize:"clamp(1rem,2vw,1.12rem)"}}>{t.name}</strong>
                  <span style={{opacity:.69,color:"#fff",fontFamily:"DM Sans, sans-serif",fontSize:"clamp(.98rem,2vw,1.09rem)"}}>{t.role}</span>
                </div>
              </div>
              <div style={{color:"#fff",opacity:.82,fontWeight:600,fontSize:"clamp(1.03rem,2vw,1.13rem)",fontFamily:"DM Sans, sans-serif",lineHeight:1.57}}>
                “{t.quote}”
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a, open, onToggle }: FaqItemProps) {
  return (
    <div className="card faq-card" style={{marginBottom:14}}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="faq-trigger"
        style={{
          background:"none",
          border:"none",
          outline:"none",
          width:"100%",
          textAlign:"left",
          display:"flex",
          alignItems:"center",
          padding:"13px 4px",
          fontFamily:"Syne, sans-serif",
          fontWeight:700,
          color:"#fff",
          fontSize:"clamp(1.09rem,2vw,1.15rem)",
          cursor:"pointer",
          gap:11
        }}>
        <span style={{
          display:"inline-block",
          transition:".26s transform cubic-bezier(.7,0,.2,1)",
          transform: open ? "rotate(90deg)" : "rotate(0deg)"
        }}>
          ▶
        </span>
        {q}
      </button>
      <div
        className="faq-body"
        style={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
          overflow: "hidden",
          fontFamily:"DM Sans, sans-serif",
          fontSize:"clamp(.99rem,2vw,1.09rem)",
          color:"#fff",
          transition: "opacity .32s, height .27s cubic-bezier(.7,0,.2,1)",
          paddingLeft: 35,
          paddingBottom: open ? 12 : 0,
          lineHeight:1.67,
          maxWidth: "90vw"
        }}
      >
        {open ? a : null}
      </div>
    </div>
  );
}

function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref, []);
  return (
    <section
      ref={ref}
      className="section"
      id="faq"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(44px)",
        transition: "opacity .8s cubic-bezier(.7,0,.2,1),transform .8s cubic-bezier(.7,0,.2,1)",
        marginBottom: "clamp(28px,4vw,44px)"
      }}
    >
      <div className="section-inner">
        <div className="eyebrow">FAQ</div>
        <div className="faq-grid">
          {FAQS.map((f, i) => (
            <FaqItem
              key={f.q}
              q={f.q}
              a={f.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref, []);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (loading || !email) return;
    setLoading(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [email, loading]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <section
      ref={ref}
      className="section"
      id="cta"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(44px)",
        transition: "opacity .8s cubic-bezier(.7,0,.2,1),transform .8s cubic-bezier(.7,0,.2,1)",
        marginBottom: "clamp(14px,4vw,28px)"
      }}
    >
      <div className="section-inner">
        <div className="waitlist-card" style={{
          border:"2px solid #D4AF37",borderRadius:23,padding:"clamp(30px,7vw,62px)",background:"rgba(212,175,55,.055)", boxShadow:"0 2px 32px #D4AF3780"
        }}>
          <div className="eyebrow" style={{color:"#D4AF37"}}>Join Waitlist</div>
          <div
            className="h2"
            style={{
              color: "#fff",
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.6rem,4vw,2.2rem)",
              marginBottom: 12
            }}>Be First to Ship Faster with Automated Slack Approvals</div>
          <div style={{
            color: "#fff",
            fontFamily: "DM Sans, sans-serif",
            opacity: .88,
            lineHeight: 1.63,
            fontSize: "clamp(1.05rem,2vw,1.17rem)",
            marginBottom: 26,
            maxWidth:"43em"
          }}>
            Enter your email. We'll send a no-spam invite and exclusive launch perks.
          </div>
          {sent ? (
            <div
              style={{
                color: "#D4AF37",
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.13rem,2vw,1.3rem)",
                lineHeight: 1.48,
              }}
            >
              Thank you! You're on the waitlist 🙌<br />Check your inbox soon.
            </div>
          ) : (
            <form
              style={{
                display:"flex",
                flexDirection:"column",
                alignItems:"flex-start",
                gap:11,
                width:"100%",
                maxWidth:440
              }}
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <label htmlFor="waitlist-email" style={{
                fontFamily:"Syne, sans-serif",
                fontWeight:700,
                color:"#fff",
                fontSize:"1.05em",
                marginBottom: 5
              }}>
                Email
              </label>
              <input
                ref={inputRef}
                autoFocus
                type="email"
                id="waitlist-email"
                name="email"
                required
                minLength={4}
                maxLength={74}
                inputMode="email"
                autoComplete="email"
                placeholder="your@email.com"
                className="waitlist-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  padding: "clamp(9px,2vw,13px) clamp(15px,2vw,22px)",
                  fontSize:"clamp(1.09rem,2vw,1.18rem)",
                  borderRadius: 11,
                  border: "1.7px solid #D4AF3766",
                  fontFamily: "DM Sans, sans-serif",
                  width: "100%",
                  outline: "none",
                  marginBottom: 9,
                  background: "rgba(4,4,10,0.86)",
                  color: "#fff",
                  transition: "border .19s cubic-bezier(.7,0,.2,1),box-shadow .19s cubic-bezier(.7,0,.2,1)",
                  boxShadow: "0 1px 7px #D4AF3720"
                }}
                disabled={loading}
              />
              <button
                className="btn-gold"
                type="submit"
                style={{
                  fontSize:"clamp(1.11rem,2vw,1.22rem)",
                  fontWeight:700,
                  width: 160,
                  height: 45
                }}
                disabled={loading}
              >
                {loading ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: "#D4AF37",
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(.95rem,2vw,1.22rem)",
        }}>
          <span style={{ fontWeight: 800, fontSize: "1.4em" }}>⬤</span> TeamAutomation
        </div>
        <div className="footer-links">
          <a href="#how" className="footer-link">How it works</a>
          <a href="#features" className="footer-link">Features</a>
          <a href="#pricing" className="footer-link">Pricing</a>
          <a href="#faq" className="footer-link">FAQ</a>
        </div>
        <div style={{
          color: "#fff",
          opacity: 0.62,
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 500,
          fontSize: "clamp(.93rem,2vw,1.11rem)",
        }}>
          © {new Date().getFullYear()} TeamAutomation. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <>
      <style>{`
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap');

:root {
  --bg: #04040a;
  --gold: #D4AF37;
  --text: #fff;
  --gold-shadow: 0 2px 32px #D4AF3742, 0 1px 8px #d4af3772;
}

html,body,#__next {
  height: 100%;
  min-height: 100%;
  width: 100vw;
  background: var(--bg);
  color: var(--text);
  scroll-behavior: smooth;
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
}

body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  overflow-x: hidden;
}

*{box-sizing:border-box;}

a {color:inherit;text-decoration:none;}

::-webkit-scrollbar { background: #1f1f2a;width:11px }
::-webkit-scrollbar-thumb {background:#15151d;border-radius:7px;}

.section {
  padding-left: clamp(12px,7vw,112px);
  padding-right: clamp(12px,7vw,112px);
  padding-top: clamp(31px,5vw,76px);
  padding-bottom: clamp(19px,3vw,39px);
  margin-inline:auto;
  max-width: 1740px;
  width:100%;
  position: relative;
  z-index: 9;
}
.section-inner {
  width: 100%;
  max-width: 1100px;
  margin-inline:auto;
}

.eyebrow {
  color: var(--gold);
  font-family: 'Syne',sans-serif;
