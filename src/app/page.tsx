"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  MouseEvent,
  KeyboardEvent,
  FormEvent,
  MutableRefObject,
} from "react";

interface NavLink {
  label: string;
  href: string;
}

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration: number;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface Testimonial {
  author: string;
  position: string;
  avatar: string;
  quote: string;
}

interface PriceTier {
  name: string;
  price: string;
  period: string;
  featured?: boolean;
  features: readonly string[];
  cta: string;
}

interface FaqItemProps {
  idx: number;
  q: string;
  a: React.ReactNode;
  open: boolean;
  onToggle: (idx: number) => void;
}

const NAV_LINKS: readonly NavLink[] = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const HERO_TYPING: readonly string[] = [
  "Approve requests right in Slack.",
  "Automate every workflow.",
  "No code. No meetings.",
  "Instant onboarding.",
];

const STATS: readonly Stat[] = [
  {
    label: "Setup in",
    value: 5,
    suffix: "min",
    duration: 1800,
  },
  {
    label: "Free trial",
    value: 14,
    suffix: "-day",
    duration: 1300,
  },
  {
    label: "SLA Uptime",
    value: 100,
    suffix: "%",
    decimals: 0,
    duration: 1700,
  },
  {
    label: "From",
    value: 49,
    prefix: "$",
    suffix: "/mo",
    duration: 1500,
  },
];

const HOW_STEPS: readonly { icon: React.ReactNode; title: string; desc: string }[] = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="3" y="3" width="26" height="26" rx="6" stroke="#D4AF37" strokeWidth="2" />
        <path d="M10 16H22M16 10V22" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Connect Slack",
    desc: "OAuth in seconds, zero config context-aware workflows auto-detected.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="13" stroke="#D4AF37" strokeWidth="2" />
        <path d="M10 16h4l2 6 2-12 2 6h2" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    title: "Define Approvers",
    desc: "Granular rules for any Slack channel, user, or approval flow. Stay in control.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="7" y="7" width="18" height="18" rx="5" stroke="#D4AF37" strokeWidth="2" />
        <path d="M14 19l3-3 5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Automate Requests",
    desc: "Approve, reject, audit all in Slack — fully secure, infinitely scalable.",
  }
];

const FEATURES: readonly Feature[] = [
  {
    icon: (
      <svg width="28" height="28" fill="none">
        <rect width="28" height="28" rx="8" stroke="#D4AF37" strokeWidth="2"/>
        <path d="M7 14h14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="14" cy="8" r="1.5" fill="#fff"/>
        <circle cx="14" cy="20" r="1.5" fill="#fff"/>
      </svg>
    ),
    title: "Zero-code Setup",
    desc: "Plug & play with Slack. No dev cycles. Go live in minutes.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="6" stroke="#D4AF37" strokeWidth="2"/>
        <path d="M9 15l4 4 6-7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Enterprise-grade Security",
    desc: "SOC2 ready. All approvals logged, fully auditable.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none">
        <rect x="2" y="2" width="24" height="24" rx="7" stroke="#D4AF37" strokeWidth="2"/>
        <path d="M13 8v7a1 1 0 001 1h7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Instant Slack Actions",
    desc: "Approve or reject instantly from anywhere in Slack.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="5" stroke="#D4AF37" strokeWidth="2"/>
        <path d="M14 9v10M9 14h10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Granular Permissions",
    desc: "Customizable rules for teams, managers, and workflows.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none">
        <rect x="6" y="6" width="16" height="16" rx="4" stroke="#D4AF37" strokeWidth="2"/>
        <path d="M10 18l4-8 4 8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "No Vendor Lock-in",
    desc: "Export data at any time. You own your approvals.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none">
        <ellipse cx="14" cy="14" rx="12" ry="12" stroke="#D4AF37" strokeWidth="2"/>
        <path d="M8 16l4 4 8-8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Guaranteed Uptime",
    desc: "100% SLA. Battle-tested for mission-critical teams.",
  },
];

const PRICING: readonly PriceTier[] = [
  {
    name: "Starter",
    price: "$49",
    period: "per month",
    features: [
      "Unlimited workflows",
      "Slack + Teams integration",
      "3 Approver roles",
      "2 weeks history",
      "Basic reporting",
      "Standard SLA",
    ] as const,
    cta: "Start Free Trial",
  },
  {
    name: "Growth",
    price: "$149",
    period: "per month",
    features: [
      "Everything in Starter",
      "Advanced rules engine",
      "Unlimited approvers",
      "Full audit logs",
      "Custom branding",
      "Priority support",
    ] as const,
    featured: true,
    cta: "Get Started",
  },
  {
    name: "Scale",
    price: "$499",
    period: "per month",
    features: [
      "Everything in Growth",
      "SAML SSO",
      "Enterprise reporting",
      "Custom integrations",
      "VIP success manager",
      "Dedicated SLA",
    ] as const,
    cta: "Contact Us",
  },
];

const TESTIMONIALS: readonly Testimonial[] = [
  {
    author: "Mikayla T.",
    position: "Head of People, Parallel",
    avatar: "/avatar1.png",
    quote:
      "TeamAutomation cut our approvals from days to minutes. 100% adoption, zero onboarding required.",
  },
  {
    author: "Vik Rao",
    position: "COO, Helio Networks",
    avatar: "/avatar2.png",
    quote:
      "Loved by IT and managers alike. Our Slack feels calmer and our audit trails are air-tight.",
  },
  {
    author: "Jared V.",
    position: "VP Finance, Carbonix",
    avatar: "/avatar3.png",
    quote:
      "No more 'just ping me' DMs. Approvals now happen fast, securely, exactly where work happens.",
  },
];

const FAQS: readonly { q: string; a: React.ReactNode }[] = [
  {
    q: "Is TeamAutomation actually secure?",
    a: (
      <>
        Yes. All actions are cryptographically signed, stored, and auditable. We’re built for compliance and regularly undergo third-party audits.
      </>
    ),
  },
  {
    q: "Do you offer a free trial?",
    a: (
      <>
        Every plan comes with a 14-day free trial — no credit card required.
      </>
    ),
  },
  {
    q: "Does this work with Microsoft Teams?",
    a: (
      <>
        Yes, Teams integration is supported starting from the Growth tier.
      </>
    ),
  },
  {
    q: "Can I export/export my data?",
    a: (
      <>
        Absolutely. Your data is yours — export at any time from your dashboard.
      </>
    ),
  },
  {
    q: "What if I need a custom integration?",
    a: (
      <>
        We can help — contact us for Enterprise options and custom workflows.
      </>
    ),
  },
];

function cn(...args: (string | boolean | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

function useScrollReveal(ref: MutableRefObject<HTMLDivElement | null>, from?: number) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let ignore = false;
    const handler = (entries: IntersectionObserverEntry[]) => {
      const showed = entries[0]?.isIntersecting;
      if (showed && !ignore) setVisible(true);
    };
    const observer = new window.IntersectionObserver(handler, {
      threshold: from == null ? 0.12 : from,
    });
    observer.observe(node);
    return () => {
      ignore = true;
      observer.disconnect();
    };
  }, [ref, from]);
  return visible;
}

const MouseGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function move(e: MouseEvent) {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${e.clientX - 100}px, ${e.clientY - 100}px, 0)`;
      }
    }
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div ref={glowRef} className="cursor-glow" aria-hidden />
  );
};

const Counter: React.FC<{ value: number; prefix?: string; suffix?: string; decimals?: number; duration: number }> = ({
  value,
  prefix,
  suffix,
  decimals,
  duration,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current || started) return;
    let frame: number;
    let start: number;
    setDisplayed(0);
    const animate = (ts: number) => {
      if (start === undefined) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const next = progress * value;
      setDisplayed(v => (progress < 1 ? next : value));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) {
        setStarted(true);
        frame = requestAnimationFrame(animate);
        io.disconnect();
      }
    }, { threshold: 0.7 });
    io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ref, value, duration, started]);
  const val = decimals ? displayed.toFixed(decimals) : Math.round(displayed).toString();
  return (
    <span ref={ref}>
      <span>{prefix}</span>
      <span aria-live="polite">{val}</span>
      <span>{suffix}</span>
    </span>
  );
};

const FaqItem: React.FC<FaqItemProps> = ({ idx, q, a, open, onToggle }) => {
  return (
    <div className={cn("faq-item", open && "open")}>
      <button
        type="button"
        className="faq-q"
        aria-expanded={open}
        aria-controls={`faq-content-${idx}`}
        onClick={() => onToggle(idx)}
      >
        <span>{q}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <rect className="faq-bar" x={5} y={9} width={10} height={2} rx={1} fill="#fff"/>
          <rect className="faq-plus" x={9} y={5} width={2} height={10} rx={1} fill="#fff"/>
        </svg>
      </button>
      <div
        className="faq-a"
        id={`faq-content-${idx}`}
        style={{
          maxHeight: open ? 340 : 0,
          opacity: open ? 1 : 0,
          paddingTop: open ? '0.75rem' : 0,
          transition: open
            ? "max-height 0.34s cubic-bezier(.4,1,.6,1), opacity 0.2s, padding 0.22s"
            : "max-height 0.26s cubic-bezier(.4,1,.6,1), opacity 0.16s, padding 0.17s",
        }}
      >
        {a}
      </div>
    </div>
  );
};

const SlackCard: React.FC = () => {
  type CardState = "idle" | "approved" | "rejected";
  const [state, setState] = useState<CardState>("idle");
  const [showAnim, setShowAnim] = useState(false);
  function handleClick(newState: CardState) {
    setShowAnim(true);
    setTimeout(() => {
      setState(newState);
      setShowAnim(false);
    }, 650);
  }
  return (
    <div className={cn("slack-card", showAnim && "anim")}>
      <div className="slack-avatar">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="12" fill="#22212b"/>
          <text x="50%" y="63%" textAnchor="middle" fontFamily="Syne" fontWeight="800" fontSize="16" fill="#D4AF37">TA</text>
        </svg>
      </div>
      <div className="slack-meta">
        <span className="slack-name">TeamAutomation</span>
        <span className="slack-time">Now • Approval</span>
      </div>
      <div className="slack-msg">
        <b>New Request</b> from <span style={{color:'#D4AF37'}}>@jordan</span> to deploy to production.<br/>
        <span className="slack-label">Please review:</span>
      </div>
      <div className="slack-actions">
        {state === "idle" ? (
          <>
            <button className="btn-gold" aria-label="Approve" onClick={() => handleClick("approved")}>Approve</button>
            <button className="btn-ghost" aria-label="Reject" onClick={() => handleClick("rejected")}>Reject</button>
          </>
        ) : state === "approved" ? (
          <span className="slack-approved">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#1f2c18"/>
              <path d="M6 10.5l3 3 5-5" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Approved!
          </span>
        ) : (
          <span className="slack-rejected">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#2c1818"/>
              <path d="M7 7l6 6M13 7l-6 6" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Rejected.
          </span>
        )}
      </div>
    </div>
  );
};

const WaitlistForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === "loading" || state === "done") return;
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setState("done");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };
  return (
    <form className="waitlist-form" method="POST" action="/api/waitlist" onSubmit={onSubmit} autoComplete="on">
      {state === "done" ? (
        <div className="waitlist-success">You're on the waitlist! 🎉</div>
      ) : (
        <>
          <input
            ref={inputRef}
            required
            autoCapitalize="off"
            autoComplete="email"
            type="email"
            name="email"
            placeholder="you@company.com"
            className="waitlist-input"
            aria-label="Enter your email for the waitlist"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") (inputRef.current as HTMLInputElement).form?.requestSubmit();
            }}
            disabled={state === "loading"}
          />
          <button type="submit" className="btn-gold" disabled={state === "loading"}>
            {state === "loading" ? (
              <span className="waitlist-spinner" />
            ) : (
              "Join Waitlist"
            )}
          </button>
        </>
      )}
      {state === "error" && <div className="waitlist-fail">Oops! Try again or email us at founders@teamautomation.com.</div>}
    </form>
  );
};

// Typing Animation Hook
function useTypingPhrases(phrases: readonly string[], speed: number, pause: number) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [forward, setForward] = useState(true);

  useEffect(() => {
    let timeout: number;
    const cur = phrases[phraseIdx];
    if (forward) {
      if (typed.length < cur.length) {
        timeout = window.setTimeout(() => setTyped(cur.slice(0, typed.length + 1)), speed);
      } else {
        timeout = window.setTimeout(() => setForward(false), pause);
      }
    } else {
      if (typed.length > 0) {
        timeout = window.setTimeout(() => setTyped(cur.slice(0, typed.length - 1)), Math.max(50, speed/2));
      } else {
        setPhraseIdx(i => (i + 1) % phrases.length);
        setForward(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [phrases, phraseIdx, typed, forward, speed, pause]);

  return typed;
}

export default function Page(): React.ReactNode {
  // Nav
  const [navOpen, setNavOpen] = useState(false);
  // Hero
  const typing = useTypingPhrases(HERO_TYPING, 34, 1400);
  // Scroll to section
  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setNavOpen(false);
    }
  }, []);
  // Stats
  const statsRef = useRef<HTMLDivElement>(null);
  const statsVisible = useScrollReveal(statsRef);

  // How
  const howRef = useRef<HTMLDivElement>(null);
  const howVisible = useScrollReveal(howRef);

  // Features
  const featureRef = useRef<HTMLDivElement>(null);
  const featureVisible = useScrollReveal(featureRef);

  // Pricing
  const pricingRef = useRef<HTMLDivElement>(null);
  const pricingVisible = useScrollReveal(pricingRef);

  // Testimonials
  const testiRef = useRef<HTMLDivElement>(null);
  const testiVisible = useScrollReveal(testiRef);

  // FAQ
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  // CTA
  const ctaRef = useRef<HTMLDivElement>(null);

  // Hamburger trap
  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if ((e as unknown as KeyboardEvent).key === "Escape") setNavOpen(false);
    }
    if (navOpen) document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [navOpen]);

  return (
    <>
      <MouseGlow />
      {/* Blurred background blobs */}
      <div className="bg-orb orb1"/>
      <div className="bg-orb orb2"/>
      <div className="bg-orb orb3"/>
      <div className="bg-orb orb4"/>
      <div className="bg-orb orb5"/>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <button className="logo-btn" onClick={() => window.scrollTo({top:0,left:0,behavior:"smooth"})} aria-label="TeamAutomation Home">
            <span className="logo-pulse">
              <svg width="44" height="38" viewBox="0 0 44 38" fill="none">
                <rect x="3" y="3" width="38" height="32" rx="12" stroke="#D4AF37" strokeWidth="3"/>
                <text x="50%" y="62%" textAnchor="middle" fontFamily="Syne" fontWeight="800" fontSize="18" fill="#D4AF37">TA</text>
              </svg>
            </span>
            <span className="logo-text">TeamAutomation</span>
          </button>
          <button className="nav-hamburger" aria-label="Open menu" aria-expanded={navOpen} aria-controls="mobile-menu"
            onClick={() => setNavOpen(v=>!v)}>
            <span />
            <span />
            <span />
          </button>
          <ul className="nav-links">
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <button className="nav-link" onClick={() => scrollToId(l.href.substr(1))}>{l.label}</button>
              </li>
            ))}
            <li>
              <button className="btn-gold nav-link-cta" onClick={() => scrollToId("cta")}>Join Waitlist</button>
            </li>
          </ul>
        </div>
        <div
          id="mobile-menu"
          className={cn("nav-mobile", navOpen && "nav-mobile-open")}
          tabIndex={navOpen ? 0 : -1}
        >
          <div className="nav-mobile-inner">
            {NAV_LINKS.map(l => (
              <button
                key={l.href}
                className="nav-link"
                onClick={() => scrollToId(l.href.substr(1))}
              >
                {l.label}
              </button>
            ))}
            <button className="btn-gold nav-link-cta" onClick={() => scrollToId("cta")}>
              Join Waitlist
            </button>
          </div>
        </div>
      </nav>
      {/* HERO */}
      <section className="section hero">
        <div className="section-inner hero-inner">
          <div className="hero-content">
            <div className="eyebrow">Slack-native Approvals</div>
            <h1 className="hero-h1 h2">
              Approval{" "}
              <span className="gold-shimmer">automation</span>
              {" "}for elite teams
            </h1>
            <h2 className="hero-typing" aria-live="polite">
              {typing}
              <span className="typing-cursor">|</span>
            </h2>
            <div className="hero-btns">
              <button className="btn-gold" onClick={()=>scrollToId("cta")}>Join Waitlist</button>
              <button className="btn-ghost" onClick={()=>scrollToId("how")}>How it works</button>
            </div>
          </div>
          <div className="hero-card">
            <SlackCard />
          </div>
        </div>
      </section>
      {/* STATS */}
      <section className="section statsbar" aria-label="Product stats">
        <div className="section-inner statsbar-inner" ref={statsRef}>
          <div className="stats-grid">
            {STATS.map(stat => (
              <div className="stats-card" key={stat.label}>
                <div className="stats-value">
                  <Counter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    duration={stat.duration}
                  />
                </div>
                <div className="stats-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* HOW */}
      <section id="how" className="section" aria-label="How it works">
        <div className="section-inner" ref={howRef} style={{
          opacity: howVisible ? 1 : 0,
          transform: howVisible ? "none" : "translateY(50px)",
          transition: "opacity 0.8s cubic-bezier(.4,1,.6,1), transform 0.7s",
        }}>
          <h2 className="h2">How it works</h2>
          <div className="how-grid">
            {HOW_STEPS.map((s, i) => (
              <div className="card how-card" key={s.title}>
                <div className="ibox">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FEATURES */}
      <section id="features" className="section" aria-label="Features">
        <div className="section-inner" ref={featureRef} style={{
          opacity: featureVisible ? 1 : 0,
          transform: featureVisible ? "none" : "translateY(42px)",
          transition: "opacity 0.8s cubic-bezier(.4,1,.6,1), transform 0.7s",
        }}>
          <h2 className="h2">Features</h2>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div className="card feature-card" key={f.title}>
                <div className="ibox">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* PRICING */}
      <section id="pricing" className="section" aria-label="Pricing">
        <div className="section-inner" ref={pricingRef} style={{
          opacity: pricingVisible ? 1 : 0,
          transform: pricingVisible ? "none" : "translateY(42px)",
          transition: "opacity 0.8s cubic-bezier(.4,1,.6,1), transform 0.7s",
        }}>
          <h2 className="h2">Pricing</h2>
          <div className="pricing-grid">
            {PRICING.map(tier => (
              <div
                className={cn("card pricing-card", tier.featured && "pricing-featured")}
                key={tier.name}
                aria-label={tier.featured ? "Featured plan" : undefined}
              >
                {tier.featured && <div className="pricing-badge">Most Popular</div>}
                <div className="pricing-name">{tier.name}</div>
                <div className="pricing-price">
                  <span>{tier.price}</span>
                  <span className="pricing-period">/mo</span>
                </div>
                <ul className="pricing-list">
                  {tier.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <button className="btn-gold pricing-cta" onClick={()=>scrollToId("cta")}>{tier.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* TESTIMONIALS */}
      <section id="testimonials" className="section testimonials" aria-label="Testimonials">
        <div className="section-inner" ref={testiRef} style={{
          opacity: testiVisible ? 1 : 0,
          transform: testiVisible ? "none" : "translateY(40px)",
          transition: "opacity 0.8s cubic-bezier(.4,1,.6,1), transform 0.7s",
        }}>
          <h2 className="h2">Teams win with TeamAutomation</h2>
          <div className="testi-grid">
            {TESTIMONIALS.map(item => (
              <div className="card testi-card" key={item.author}>
                <div className="testi-quote">“{item.quote}”</div>
                <div className="testi-meta">
                  <img src={item.avatar} className="testi-avatar" alt="" />
                  <span>
                    <b>{item.author}</b> <span className="testi-title">{item.position}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section id="faq" className="section faq" aria-label="FAQ">
        <div className="section-inner">
          <h2 className="h2">Frequently Asked</h2>
          <div className="faq-list">
            {FAQS.map((item, i) => (
              <FaqItem
                key={item.q}
                idx={i}
                q={item.q}
                a={item.a}
                open={faqOpen === i}
                onToggle={idx => setFaqOpen(o => (o === idx ? null : idx))}
              />
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section id="cta" className="section cta-section" aria-label="Waitlist">
        <div className="section-inner cta-inner" ref={ctaRef}>
          <div className="cta-card">
            <h2>
              <span className="gold-shimmer">Join the private beta</span> — own your team's approvals in Slack
            </h2>
            <p>Early access, bonuses, and a personal onboarding call — strictly invite-only.</p>
            <WaitlistForm />
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <svg width="32" height="28" viewBox="0 0 44 38" fill="none">
              <rect x="3" y="3" width="38" height="32" rx="12" stroke="#D4AF37" strokeWidth="2"/>
              <text x="50%" y="62%" textAnchor="middle" fontFamily="Syne" fontWeight="800" fontSize="13" fill="#D4AF37">TA</text>
            </svg>
            <span className="footer-logo-text">TeamAutomation</span>
          </div>
          <div className="footer-links">
            <a className="footer-link" href="#how">How it works</a>
            <a className="footer-link" href="#features">Features</a>
            <a className="footer-link" href="#pricing">Pricing</a>
            <a className="footer-link" href="#faq">FAQ</a>
            <a className="footer-link" href="mailto:founders@teamautomation.com">Contact</a>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} TeamAutomation. All rights reserved.
          </div>
        </div>
      </footer>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap');

/* RESET */
html { box-sizing: border-box; }
*,*:before,*:after { box-sizing: inherit; }
body {
  margin: 0; background: #04040a; color: #fff;
  font-family: 'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  line-height: 1.6; font-weight: 400;
  min-height: 100vh; width: 100vw;
}

a { color: inherit; text-decoration: none; }
button { font-family: 'DM Sans',sans-serif; }
:focus { outline: 2px solid #D4AF3790; outline-offset: 2px; }

.logo-btn, .nav-link, .btn-gold, .btn-ghost {
  transition: filter .16s, box-shadow .18s, color .16s, background .18s;
}
.btn-gold, .btn-ghost {
  font-family: 'Syne',sans-serif;
  font-size: clamp(1rem,2vw,1.13rem);
  font-weight: 700;
  border-radius: 12px;
  padding: clamp(0.6rem,1.4vw,0.88rem) clamp(1rem,3.1vw,1.6rem);
  letter-spacing: .01em;
  box-shadow: 0 2px 16px rgba(212,175,55,0.07);
  border: 2px solid #D4AF37;
  user-select: none;
  cursor: pointer;
  display: inline-block;
  min-width: 0;
}
.btn-gold {
  background: linear-gradient(98deg,#D4AF37 40%,#e9d377 110%);
  color: #04040a;
  box-shadow: 0 2px 16px #D4AF3740;
}
.btn-gold:hover, .btn-gold:focus { filter: brightness(1.06) drop-shadow(0 0 2px #D4AF37); }
.btn-ghost {
  background: transparent;
  color: #D4AF37;
  border: 2px solid #32322e;
  box-shadow: none;
}
.btn-ghost:hover, .btn-ghost:focus { background: #181813; color: #fff; }
.nav-link {
  background: none; border: none; padding: 0.3rem 0.9rem; color: #fff;
  font: 600 clamp(1rem,2vw,1.09rem) 'DM Sans',sans-serif;
  cursor: pointer;
}
.nav-link:hover, .nav-link:focus { color: #D4AF37; }
.nav-link-cta {
  margin-left: 0.6rem;
  font-family: 'Syne',sans-serif;
}

.logo-btn { background:none;border:none;display:flex;align-items:center;gap:0.6em;cursor:pointer;padding:0;}
.logo-pulse { display:inline-flex; animation: pulse 2.1s infinite both; }
.logo-text { font-family:'Syne',sans-serif; font-weight:700; font-size:clamp(1.13rem,2.7vw,1.6rem); color:#fff; }
.logo-btn:hover .logo-text { color: #D4AF37; }

/* NAV */
.nav {
  position:fixed;top:0;left:0;z-index:90;width:100%;
  height:62px;backdrop-filter:blur(10.5px);background:rgba(8,10,20,0.62);
  box-shadow:0 1px 12px #0002;
  border-bottom: 1.5px solid #25252a;
  display: flex;align-items:center;
}
.nav-inner {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(1.1rem, 5vw, 2.3rem);
}
.nav-hamburger {
  width:44px;height:44px;background:none;border:none;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:0.25em;cursor:pointer;z-index:91;-webkit-tap-highlight-color:transparent;
}
.nav-hamburger span {
  display:block;width:28px;height:3.2px;border-radius:2px;background:#fff;transition:background 0.14s,transform 0.28s;
}
.nav-mobile {
  position:fixed;top:62px;left:0;width:100vw;height:0;z-index:92;pointer-events:none;overflow:hidden;
  background:rgba(8,6,19,0.97);backdrop-filter:blur(14px);transition:max-height 0.41s cubic-bezier(.51,1.12,.51,1.02);
}
.nav-mobile-open { height: 320px; max-height: 100vh; pointer-events: auto; }
.nav-mobile-inner { display:flex;flex-direction:column;align-items:center;gap:1.1em;padding:2.1em 1em; }
.nav-mobile .nav-link, .nav-mobile .btn-gold { font-size:1.19rem;width:100%;text-align:center; }
.nav-links { display:none; }

@media (min-width:768px) {
  .nav-hamburger { display:none; }
  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.14em;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nav-mobile { display:none !important; }
}

/* HERO */
.hero {
  padding-top: 82px;
  padding-bottom: clamp(2.2rem,8vw,6.3rem);
}
.hero-inner {
  display: flex;
  gap: clamp(2.1rem, 7vw, 7.6rem);
  flex-direction: column;
}
.hero-content {
  flex: 1 1 0;
  max-width: 552px;
}
.eyebrow {
  color: #D4AF37;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: 'Syne',sans-serif;
  font-weight: 700;
  font-size: clamp(0.89rem, 1vw, 1.04rem);
  margin-bottom: 0.2em;
}
.hero-h1 {
  font-family: 'Syne',sans-serif;
  font-weight: 800;
  font-size: clamp(2.14rem, 6vw, 3.98rem);
  margin: 0 0 0.16em -2px;
  color: #fff;
}
.gold-shimmer {
  color: #D4AF37;
  background: linear-gradient(90deg,#D4AF37 40%,#fffbe6 60%,#D4AF37 99%);
  background-size: 240% 100%; background-clip:text;-webkit-background-clip:text;color:transparent;-webkit-text-fill-color:transparent;
  animation: shimmer 2s infinite linear;
}
@keyframes shimmer {
  0%{background-position:220% 0;}
  100%{background-position:-120% 0;}
}
.hero-typing {
  font-family: 'DM Sans',sans-serif;
  font-weight:500;
  font-size:clamp(1.22rem,2.6vw,1.59rem);
  color:#fffce0;
  margin:0.22em 0 1.2em 0;
  min-height: 2.35em;
  letter-spacing: 0.001em;
  white-space: pre;
}
.typing-cursor {
  display: inline-block;
  width: 1ch;
  color: #D4AF37;
  opacity: .87;
  animation: blink .98s steps(1) infinite;
}
@keyframes blink {
  0%,100%{opacity:1;}
  55%,70%{opacity:0;}
}
.hero-btns { display:flex;gap:1.15em;margin-top:1.16em;margin-bottom:0.2em;flex-wrap:wrap;}
.hero-card { display:none; }

@media (min-width:900px) {
  .hero-inner { flex-direction: row; align-items: center; }
  .hero-content { flex:1;min-width:0; }
  .hero-card {
    display:block;
    min-width:340px;
    flex:0 1 440px;
    margin-right:2vw;
  }
}

/* Slack Card Demo */
.slack-card {
  background:linear-gradient(115deg,#0c0c14 92%,#1a181a 98%);
  border-radius:16px;
  border:2.5px solid #181813;
  box-shadow:0 6px 60px #0d0e1880, 0 0px 0px #14121430;
  max-width: 356px; padding:1.6em 1.6em 1.28em 1.4em;
  position: relative; display: flex; flex-direction:column; gap:0.99em;
  overflow: hidden; min-height: 210px;
  transition: transform .38s cubic-bezier(.4,1,.6,1), box-shadow .26s;
}
.slack-card.anim { animation: tglow 0.52s; }
@keyframes tglow {
  0%{ filter: drop-shadow(0 0 0 #D4AF37); }
  30%{ filter: drop-shadow(0 0 12px #D4AF37a0); }
  100%{ filter: none;}
}
.slack-avatar { position: absolute;top:20px;left: -12px;}
.slack-meta {
  margin-left: 34px;
  font-family: 'DM Sans',sans-serif;
  color:#999; font-size: 0.96em; font-weight:500;line-height:1.22;display:flex;gap:8px;align-items:center;
}
.slack-meta .slack-name {color:#D4AF37;}
.slack-meta .slack-time {font-size:0.9em;}
.slack-msg {
  color:#fffbe6;
  font-size:1.07em;
  margin: 0.7em 0 0.3em 0;
}
.slack-label { color:#D4AF37;font-family:'Syne',sans-serif;font-size:0.99em; }
.slack-actions { display:flex;gap:1em;align-items:center;margin-top:0.6em;}
.slack-approved, .slack-rejected { font-family:'Syne';font-size:1.13em;color:#D4AF37;display:flex;align-items:center;gap:0.5em;}
.slack-rejected { color:#ffcbcb;}
.slack-approved svg,.slack-rejected svg{display:inline-block;vertical-align:bottom;}
/* Stats Bar */
.statsbar { background:rgba(40,33,10,0.04);padding: clamp(1.8rem,4vw,3.1rem) 0; }
.statsbar-inner { max-width:1160px;width:100%;margin:0 auto; }
.stats-grid { display:grid;gap:2.5rem 0;grid-template-columns:1fr 1fr;}
.stats-card {display: flex;flex-direction:column;align-items: center;}
.stats-value {
  font-family:'Syne',sans-serif;
  color:#D4AF37;
  font-size:clamp(2.2rem,5vw,2.91rem);
  font-weight: 800;
  letter-spacing: 0.014em;
}
.stats-label {
  color: #fffbe6; font-size: 1.14em;opacity:0.68;
  font-family:'DM Sans';
  margin-top:0.23em;text-shadow:0 2px 4px #08050720;
}
@media (min-width:768px) {
  .stats-grid { grid-template-columns: repeat(4,1fr);}
}

/* HOW */
.how-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.2em 1.3em;
  margin-top: 1.5em;
}
@media (min-width:820px) { .how-grid { grid-template-columns: repeat(3,1fr); } }
.how-card, .feature-card {
  text-align:left;
}
.card {
  background: linear-gradient(111deg,#0a0b12 83%,#262620 100%);
  border-radius: 17px;
  border: 1.8px solid #201608;
  box-shadow: 0 7px 32px #00020c0b, 0 1.5px 3.5px #19191821;
  padding: clamp(1.25rem,2.5vw,1.88rem) clamp(1.13rem,2vw,1.4rem);
  transition: box-shadow .21s, border .23s, transform .23s;
  position: relative; overflow: visible; z-index: 3;
}
.card:hover, .card:focus-within {
  border-color: #D4AF37;
  box-shadow: 0 8px 45px #D4AF3740, 0 2px 5px #19191870;
  transform: translateY(-4px) scale(1.012);
}
.ibox {
  background:#181813;
  border-radius: 13px;
  box-shadow:0 3px 18px #D4AF3725;
  padding:0.7em 0.75em;margin-bottom:1em;display:inline-block;
  border: 1.2px solid #D4AF37;  
}
.card:hover .ibox, .card:focus-within .ibox {
  filter: drop-shadow(0 0 8px #D4AF37cc);
}
.card h3 {
  margin: 0.1em 0 0.42em 0;
  font-family: 'Syne',sans-serif;
  font-weight: 700;
  color: #fff;
  font-size: clamp(1.19rem,1.7vw,1.54rem);
}
.card p { margin: 0; color: #eaeaea; font-size: 1.03em;}
/* Features */
.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.2em 1.2em;
  margin-top: 1.3em;
}
@media (min-width:880px) {
  .features-grid { grid-template-columns: repeat(3,1fr);}
}
/* Pricing */
.pricing-grid {
  display:grid;
  grid-template-columns:1fr;
  gap:2.2em 1.29em;
  margin-top:1.6em;
  align-items: stretch;
}
@media (min-width:900px) {
  .pricing-grid { grid-template-columns: repeat(3,1fr);}
}
.pricing-card {
  border: 1.7px solid #221c07!important;
  text-align: left;
  padding-top:2.25em;
  position:relative;
  box-shadow:0 2px 26px #22190019;
}
.pricing-featured {
  background: linear-gradient(111deg,#171315 58%,#D4AF37 106%);
  border: 2px solid #D4AF37!important;
  box-shadow: 0 15px 83px #D4AF373d,0 1.5px 3.5px #19191823;
  z-index: 4;
  transform: scale(1.045);
}
.pricing-badge {
  background: #D4AF37;
  color: #04040a;
  font-family: 'Syne',sans-serif;
  font-weight: 700; font-size: 1.0em;
  padding: 0.14em 0.98em;
  border-radius: 8px 8px 8px 0;
  position: absolute; top: 1.09em; left: 1.18em; z-index: 7;
  box-shadow: 0 2px 9px #D4AF3744;
}
.pricing-name {
  font-family:'Syne',sans-serif;
  font-weight:700;
  font-size:clamp(1.17rem,2vw,1.43rem);
  margin-bottom:0.17em;
  color:#fff;
}
.pricing-price {
  font-family:'Syne',sans-serif;
  font-weight:800;
  font-size:clamp(2.1rem,3.9vw,2.61rem);
  color: #D4AF37;
  margin:0.13em 0 0.58em 0;
  line-height:1.1;
}
.pricing-period {
  color:#fffbe6; font-size:0.69em;margin-left:0.41em;
}
.pricing-list { margin:0 0 1.51em 0;padding:0;list-style:none; }
.pricing-list li {
  margin-bottom:0.59em;
  font-family:'DM Sans',sans-serif; font-size:1.01rem; color:#fff; opacity:0.76; position:relative; padding-left:1.18em;
}
.pricing-list li:before {
  content:"›"; color:#D4AF37;font-family:'Syne',sans-serif;font-weight:900;position:absolute;left:0;
}
.pricing-cta { width:100%;margin-top:0.44em;font-size:1.04em;}
/* Testimonials */
.testimonials { background:rgba(40,33,10,0.023); }
.testi-grid {
  display:grid;
  grid-template-columns:1fr;
  gap:2.2em 1.4em;
  margin-top:2.1em;
}
@media (min-width:900px) {
  .testi-grid { grid-template-columns:repeat(3,1fr);}
}
.testi-card {
  position: relative;
  padding-top:2em;
  min-height:180px;
}
.testi-quote {
  font-family:'Syne',sans-serif;
  color: #fffbe6;
  font-size:clamp(1.15rem,2vw,1.23rem);
  font-weight:600;
  letter-spacing:.01em;
}
.testi-meta {
  margin-top: 1.44em;
  display: flex;gap:1em;align-items: center;
}
.testi-avatar {
  border-radius: 99px;
  width: 43px;
  height: 43px;
  object-fit: cover;
  border: 2.2px solid #D4AF37;
  background: #181813;
}
.testi-title {
  color:#D4AF37;font-style:italic;font-weight:400;font-size:0.92em;
  margin-left:0.23em;
}

/* FAQ */
.faq-list { margin-top:2em; }
.faq-item {
  background:#14131b;
  border:1.1px solid #19180c;
  border-radius:14px;
  margin-bottom:1em;
  padding:0.2em 1em 0.09em 1em;
  box-shadow:0 1px 6px #0302060b;
  transition:box-shadow .19s, border .17s, background .19s;
}
.faq-item.open {
  border:1.5px solid #D4AF37;
  background:#181814;
  box-shadow:0 3px 13px #D4AF3761;
}
.faq-q {
  background:none;border:none;display:flex;align-items:center;width:100%;font-family:'Syne',sans-serif;
  font-size:clamp(1.09rem,1.5vw,1.17rem);font-weight:700;justify-content:space-between;cursor:pointer;padding:1.1em 0;}
.faq-q svg{margin-left:0.6em;}
.faq-bar{transition:.28s;}
.faq-item:not(.open) .faq-plus{opacity:1;}
.faq-item.open .faq-plus{opacity:0;}
.faq-a { font-family:'DM Sans',sans-serif; font-size:1.03em; color:#f7efd9; line-height:1.75; overflow:hidden;}
/* CTA */
.cta-section {
  background: linear-gradient(126deg,#0a0b12 81%,#141215 100%);
  padding: clamp(2.7rem,7vw,5.48rem) 0 clamp(2.6rem,7vw,5.14rem) 0;
}
.cta-inner {max-width:490px;width:100%;margin:0 auto;}
.cta-card {
  border: 2.4px solid #D4AF37;
  border-radius: 24px;
  padding: clamp(2.1rem,4vw,4.4rem) clamp(1.7rem,2.2vw,2.7rem);
  background:rgba(24,24,22,0.97);
  box-shadow:0 7px 40px #D4AF3745,0 2px 6px #1f1a0720;
  text-align:center;
}
.cta-card h2 {
  margin:0 0 0.43em 0;
  font-family:'Syne',sans-serif;
  font-weight:800;
  font-size:clamp(1.58rem,2.4vw,2.11rem);
  color:#D4AF37;
}
.cta-card p {
  font-family:'DM Sans',sans-serif;
  font-size:1.08em;
  color:#fffbe6;
}
.waitlist-form {
  display:flex;flex-direction:column;gap:1em;margin-top:1.4em;
  max-width: 350px; margin-left:auto;margin-right:auto;
}
.waitlist-input {
  font-size:clamp(1rem,2vw,1.13rem);
  border:2px solid #D4AF37;
  border-radius:9px;
  padding:0.8em 1.18em;
  background:transparent;
  font-family:'DM Sans',sans-serif;
  color:#fff;
  text-align:left;
  outline:0;
  box-shadow:none;
}
.waitlist-input:focus { border-color:#fffbe6; }
.waitlist-success {
  font-family:'Syne',sans-serif;
  font-weight:700;
  color:#D4AF37;
  text-align:center;
  font-size:1.08em;
}
.waitlist-fail {
  color:#ff7b7b;font-family:'DM Sans',sans-serif;font-size:1.02em;margin-top:0.4em;text-align:center;
}
.waitlist-spinner {
  width: 1.7em; height: 1.7em; border: 2.7px solid #D4AF37; border-right: 2.7px solid #080503; border-radius: 99px;
  display: inline-block; vertical-align: middle; animation: spinCW 0.78s infinite linear;
}
@keyframes spinCW { 100% { transform: rotate(360deg); } }

/* SECTION/GRID */
.section { padding: clamp(2.2rem,8vw,5.8rem) 0;}
.section-inner { max-width:1160px;width:100%;margin:0 auto;padding:0 clamp(1.0rem,5vw,2.2rem);}
.h2 {
  font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(1.58rem,2.7vw,2.29rem);margin:0 0 0.71em 0;color:#fff;
}
.grid-3 { display:grid; grid-template-columns:1fr; gap:2.2em 1.1em;}
@media (min-width:880px){ .grid-3 { grid-template-columns:repeat(3,1fr); } }

/* BG ORBS */
.bg-orb {
  position:fixed;z-index:-2;pointer-events:none;filter:blur(44px) brightness(1.18);
  opacity:.39; border-radius:50%;mix-blend-mode: lighten;
  animation: orbmove 27s var(--del,0s) infinite linear alternate;
}
.orb1 { top:-240px;left:-140px;width:430px;height:430px;background:#D4AF37; --del: 2s;opacity:.18; animation-duration:25s; }
.orb2 { bottom:11vh; left:3vw; width:355px;height:410px; background:#fff; opacity:.11; --del:4s; }
.orb3 { bottom: -130px; right: -170px; width: 581px; height: 520px; background: #D4AF37; opacity:.22; --del:13s; animation-duration:24s;}
.orb4 { top:88vh; left:67vw; width:310px; height:350px; background:#fffbe6; opacity:.10; --del:20s; }
.orb5 { top:19vh; right:-120px; width:345px; height:346px; background:#886100; opacity:.11; --del:3s;}
@keyframes orbmove {
  0%{transform:translateY(0) scale(1);}
  30%{transform:translateY(-10vw) scale(1.07);}
  57%{transform:translateY(4vw) scale(0.99);}
  100%{transform:translateY(-13vw) scale(1);}
}

/* Mouse Cursor Glow */
.cursor-glow {
  pointer-events: none;
  position: fixed;
  top: 0; left: 0;
  width: 200px; height: 200px;
  z-index: 88;
  border-radius: 50%;
  background: radial-gradient(90% 90% at 60% 50%, #D4AF37bb 60%, #fffbe600 95%);
  filter: blur(22px) brightness(1.12);
  opacity: .21;
  mix-blend-mode: lighten;
  transition: background .21s, filter .2s;
  will-change: transform;
}

/* FOOTER */
.footer {
  background: #07070d;
  border-top:1.7px solid #222113;
  padding:clamp(2.7rem,4vw,4.6rem) 0 1.32rem 0;
}
.footer-inner {
  max-width:1160px; margin:0 auto;
  display:flex; flex-direction:column; align-items:center; gap:1.5em;
  padding:0 clamp(1.2rem,3vw,2.2rem);
}
.footer-logo {
  display:flex;align-items:center;gap:0.78em;color:#D4AF37;
  font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(1.2rem,2vw,1.34rem);
}
.footer-links {
  display:flex;gap:2.1em;flex-wrap:wrap;justify-content:center;margin:0.6em 0 0.2em 0;
}
.footer-link {
  color:#fffbe6;font-family:'DM Sans',sans-serif;font-size:1.03em;opacity:0.76;transition:color 0.16s;
}
.footer-link:hover { color:#D4AF37;opacity:1; }
.footer-copy {
  color: #8a887a; opacity: 0.62; font-size: 0.97em;
}

@media (max-width: 700px) {
  .footer-inner { padding-left:0.6em;padding-right:0.6em;}
  .footer-links { gap:0.7em; }
}
/* Media Queries */
@media (max-width:720px) {
  .section-inner { padding-left:0.7em; padding-right:0.7em; }
  .nav-inner { padding-left:0.3em; padding-right:0.7em;}
  .cta-card { padding-left:1em; padding-right:1em;}
}
@media (max-width:560px) {
  .hero-h1 { font-size:1.62rem;}
  .section { padding-left:0.3em; padding-right:0.3em;}
}
      `}</style>
    </>
  );
}
