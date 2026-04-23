'use client';
import { useRef, useState, useEffect } from 'react';

type Feature = {
  title: string;
  description: string;
  icon: JSX.Element;
};

type PricingTier = {
  name: string;
  price: string;
  features: string[];
  featured?: boolean;
};

type Testimonial = {
  quote: string;
  name: string;
  title: string;
  avatar: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

const GOLD = '#D4AF37';
const DARK_BG = '#04040a';

const typingPhrases = [
  'No more approval headaches.',
  'Slack-first, zero email.',
  'Ship faster as a team.',
  'Easy, auditable, compliant.',
];

const features: Feature[] = [
  {
    title: 'Slack Native',
    description: 'Runs where your team works. No new app switching.',
    icon: (
      <svg width="28" height="28" fill="none"><circle cx="14" cy="14" r="13" stroke={GOLD} strokeWidth="2"/><path d="M9 14H19M14 9V19" stroke={GOLD} strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
  {
    title: '/approve Command',
    description: 'Initiate flows instantly from any Slack channel.',
    icon: (
      <svg width="28" height="28" fill="none"><circle cx="14" cy="14" r="13" stroke={GOLD} strokeWidth="2"/><path d="M8 14h12M14 8v12" stroke={GOLD} strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
  {
    title: 'Granular Permissions',
    description: 'Tightly control who can approve what.',
    icon: (
      <svg width="28" height="28" fill="none"><rect x="5" y="5" width="18" height="18" rx="4" stroke={GOLD} strokeWidth="2"/><path d="M9 14h10" stroke={GOLD} strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
  {
    title: 'Instant Slack Alerts',
    description: 'Real-time notifications of requests & approvals.',
    icon: (
      <svg width="28" height="28" fill="none"><ellipse cx="14" cy="14" rx="12" ry="8" stroke={GOLD} strokeWidth="2"/><circle cx="14" cy="14" r="3" stroke={GOLD} strokeWidth="2"/></svg>
    ),
  },
  {
    title: 'Audit Log',
    description: 'Automatic compliance and immutable record keeping.',
    icon: (
      <svg width="28" height="28" fill="none"><rect x="6" y="6" width="16" height="16" rx="3" stroke={GOLD} strokeWidth="2"/><path d="M10 18l4-4 4 4" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
  },
  {
    title: '14-day Free Trial',
    description: 'No card, unlimited users, try every feature.',
    icon: (
      <svg width="28" height="28" fill="none"><rect x="6" y="6" width="16" height="16" rx="3" stroke={GOLD} strokeWidth="2"/><path d="M10 14h8" stroke={GOLD} strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
];

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$49/mo',
    features: [
      'Unlimited requests',
      'Slack workspace integration',
      'Basic audit trail',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: '$149/mo',
    features: [
      'Everything in Starter',
      'Advanced permissioning',
      'Slack Enterprise Grid',
      'Priority support',
    ],
    featured: true,
  },
  {
    name: 'Scale',
    price: '$499/mo',
    features: [
      'Everything in Growth',
      'Custom workflows',
      'Dedicated onboarding',
      'Audit export API',
    ],
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "TeamAutomation changed how we approve everything. It's seamless and Slack-native — our team loves it.",
    name: 'Morgan J.',
    title: 'VP Engineering, Presto',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    quote:
      "The setup literally took 5 minutes. Now approvals don’t block shipping — super slick.",
    name: 'Aisha M.',
    title: 'CTO, ChartMint',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    quote:
      'Auditors loved the audit trail. No more digging in email. We’re staying forever.',
    name: 'Dylan R.',
    title: 'COO, Aurora Ops',
    avatar:
      'https://randomuser.me/api/portraits/men/74.jpg',
  },
];

const faq: FAQItem[] = [
  {
    question: 'Do I need to be an admin to install?',
    answer: 'Yes, a Slack workspace admin is required for installation.',
  },
  {
    question: 'Can I cancel at any time?',
    answer: 'Absolutely. Cancel anytime during your trial or paid subscription.',
  },
  {
    question: 'Do you support Slack Enterprise Grid?',
    answer: 'Yes! Growth and Scale tiers include full Grid support.',
  },
  {
    question: 'Is there an audit log?',
    answer: 'Yes, every approval is logged and exportable for compliance.',
  },
  {
    question: 'How is payment processed?',
    answer: 'We use Stripe for secure payment. Upgrade after your free trial.',
  },
  {
    question: 'Can I add my whole team?',
    answer: 'Yes. All plans include unlimited users and requests.',
  },
];

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

function useFontLoader() {
  useEffect(() => {
    const syne = document.createElement('link');
    syne.rel = 'stylesheet';
    syne.href =
      'https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@400;500;700&display=swap';
    document.head.appendChild(syne);
    return () => {
      document.head.removeChild(syne);
    };
  }, []);
}

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

function useScrollReveal<T extends HTMLElement>(options?: { threshold?: number }) {
  const ref = useRef<T|null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.classList.add('opacity-0', 'translate-y-8');

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-8');
          el.classList.add('opacity-100', 'translate-y-0');
          io.disconnect();
        }
      },
      { threshold: options?.threshold ?? 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function useCounter(start: number, end: number, duration: number = 800, trigger: boolean) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (!trigger) return;
    let raf: number;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.floor(start + (end - start) * progress));
      if (progress < 1) {
        raf = window.requestAnimationFrame(animate);
      }
    }

    raf = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(raf);
  }, [trigger, start, end, duration]);

  return value;
}

function HeroTyping() {
  const [current, setCurrent] = useState(0);
  const [rendered, setRendered] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pause' | 'erasing'>('typing');

  useEffect(() => {
    let to: NodeJS.Timeout;
    if (phase === 'typing') {
      if (rendered.length < typingPhrases[current].length) {
        to = setTimeout(() => {
          setRendered(typingPhrases[current].slice(0, rendered.length + 1));
        }, 48);
      } else {
        to = setTimeout(() => setPhase('pause'), 1500);
      }
    } else if (phase === 'pause') {
      to = setTimeout(() => setPhase('erasing'), 600);
    } else if (phase === 'erasing') {
      if (rendered.length > 0) {
        to = setTimeout(() => {
          setRendered(typingPhrases[current].slice(0, rendered.length - 1));
        }, 28);
      } else {
        setCurrent((p) => (p + 1) % typingPhrases.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(to);
  }, [rendered, phase, current]);

  return (
    <span
      aria-live="polite"
      className="inline-block min-h-[1em]">
      {rendered}
      <span className="inline-block w-[1.1ch] bg-white rounded-[1px] ml-px animate-blink" />
    </span>
  );
}

function SlackCard() {
  const [status, setStatus] = useState<'idle'|'approved'|'rejected'>('idle');
  return (
    <div
      className="backdrop-blur-lg bg-[#181825]/70 border border-[#222229] rounded-xl shadow-lg p-6 w-full max-w-xs mx-auto"
      style={{
        borderColor: status === 'approved'
          ? '#38e69e'
          : status === 'rejected'
          ? '#ff385c'
          : '#2d2d39',
        transition: 'border-color 0.18s',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-white rounded text-black text-xs font-semibold px-2 py-0.5">App</div>
        <span className="font-bold text-white/80 text-sm tracking-wide">/approve deploy prod</span>
      </div>
      <div className="mb-4 text-white/90 text-sm">
        Ahmed requests deployment to production.
      </div>
      <div className="flex gap-2">
        {status === 'idle' ? (
          <>
            <button
              aria-label="Approve"
              className="flex-1 text-[#090] border border-[#3ecf8e] rounded px-2 py-1 font-bold transition hover:bg-[#122619] hover:border-[#5fffb1] hover:shadow"
              onClick={() => setStatus('approved')}
              type="button"
            >
              Approve
            </button>
            <button
              aria-label="Reject"
              className="flex-1 text-[#d02c4a] border border-[#ff385c] rounded px-2 py-1 font-bold transition hover:bg-[#3a151d] hover:border-[#ff839a] hover:shadow"
              onClick={() => setStatus('rejected')}
              type="button"
            >
              Reject
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-center font-semibold text-base"
            style={{
              color:
                status === 'approved'
                  ? '#39ffa8'
                  : '#ff618b',
            }}>
            {status === 'approved' ? '✅ Approved!' : '❌ Rejected'}
          </div>
        )}
      </div>
    </div>
  );
}

function StatsBar() {
  const ref = useRef<HTMLDivElement|null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const stats = [
    { label: '5 min setup', value: 0, target: 5, suffix: 'min' },
    { label: '14-day trial', value: 0, target: 14, suffix: 'd' },
    { label: '100% Slack-native', value: 0, target: 100, suffix: '%' },
    { label: '$49/mo', value: 0, target: 49, prefix: '$' },
  ];

  return (
    <div
      ref={ref}
      className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-4 rounded-2xl bg-[#181823]/70 mx-auto py-4 px-2 mt-8 mb-12 gap-y-4 shadow-lg border border-[#26262a] backdrop-blur"
    >
      <div className="col-span-2 sm:col-span-1 flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-syne font-extrabold text-white tracking-wide">
          {useCounter(0, 5, 650, entered)}
          <span className="text-base font-medium text-[#d4af37] ml-1">min</span>
        </span>
        <span className="text-sm md:text-base text-white/60 mt-1 font-dm-sans">Setup</span>
      </div>
      <div className="col-span-2 sm:col-span-1 flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-syne font-extrabold text-white tracking-wide">
          {useCounter(0, 14, 800, entered)}
          <span className="text-base font-medium text-[#d4af37] ml-1">days</span>
        </span>
        <span className="text-sm md:text-base text-white/60 mt-1 font-dm-sans">Free Trial</span>
      </div>
      <div className="col-span-2 sm:col-span-1 flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-syne font-extrabold text-white tracking-wide">
          {useCounter(0, 100, 900, entered)}
          <span className="text-base font-medium text-[#d4af37] ml-1">Slack</span>
        </span>
        <span className="text-sm md:text-base text-white/60 mt-1 font-dm-sans">Native</span>
      </div>
      <div className="col-span-2 sm:col-span-1 flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-syne font-extrabold text-white tracking-wide">
          <span className="text-[#d4af37]">$</span>
          {useCounter(0, 49, 700, entered)}
          <span className="text-base font-medium text-[#d4af37] ml-1">/mo</span>
        </span>
        <span className="text-sm md:text-base text-white/60 mt-1 font-dm-sans">Flat Price</span>
      </div>
    </div>
  );
}

function HowItWorks() {
  const ref = useScrollReveal<HTMLDivElement>();
  const steps = [
    {
      title: 'Install',
      description: 'Add TeamAutomation to Slack in one click, workspace admin only.',
      icon: (
        <svg width="32" height="32" fill="none">
          <rect x="3" y="3" width="26" height="26" rx="6" stroke={GOLD} strokeWidth="2"/>
          <path d="M10 18l6-6 6 6" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: '/approve Command',
      description: 'Request and review approvals instantly from any channel.',
      icon: (
        <svg width="32" height="32" fill="none">
          <circle cx="16" cy="16" r="13" stroke={GOLD} strokeWidth="2"/>
          <path d="M11 16h10M16 11v10" stroke={GOLD} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: 'Approve Anywhere',
      description: 'Respond, approve and track history — all in Slack.',
      icon: (
        <svg width="32" height="32" fill="none">
          <ellipse cx="16" cy="16" rx="12" ry="7" stroke={GOLD} strokeWidth="2"/>
          <path d="M12 16l4 3 4-3" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];
  return (
    <section ref={ref} id="how-it-works" className="py-20 max-w-7xl mx-auto px-4" aria-label="How TeamAutomation Works">
      <h2 className="font-syne text-3xl md:text-4xl font-extrabold mb-10 text-white text-center tracking-tight">
        How it works
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, idx) => (
          <div
            key={step.title}
            className="bg-[#16161e]/60 backdrop-blur-xl border border-[#292933] rounded-2xl p-7 flex flex-col items-center shadow-lg transition hover:border-[#D4AF37] hover:-translate-y-1.5 hover:shadow-2xl"
            style={{
              transition: 'box-shadow 0.16s, border-color 0.16s, transform 0.16s',
            }}
          >
            <div className="mb-5">{step.icon}</div>
            <h3 className="font-syne font-extrabold text-xl text-white mb-2">{`${idx + 1}. ${step.title}`}</h3>
            <p className="text-white/70 text-center font-dm-sans">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <section ref={ref} id="features" className="py-20 max-w-7xl mx-auto px-4" aria-label="TeamAutomation Features">
      <h2 className="font-syne text-3xl md:text-4xl font-extrabold mb-10 text-white text-center tracking-tight">
        Features
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="bg-[#171721]/70 glass-card border border-[#292933] rounded-2xl p-7 flex flex-col items-center shadow-lg transition hover:border-[#D4AF37] hover:-translate-y-1 hover:shadow-2xl"
            style={{
              transition: 'box-shadow 0.16s, border-color 0.16s, transform 0.16s',
            }}
          >
            <div className="mb-5">{f.icon}</div>
            <h3 className="font-syne font-extrabold text-lg text-white mb-2">{f.title}</h3>
            <p className="text-white/70 text-center font-dm-sans">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <section ref={ref} id="pricing" className="py-20 max-w-7xl mx-auto px-4" aria-label="Pricing Tiers">
      <h2 className="font-syne text-3xl md:text-4xl font-extrabold mb-10 text-white text-center tracking-tight">
        Pricing
      </h2>
      <div className="w-full flex flex-col md:flex-row justify-center gap-8">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              'w-full md:w-1/3 bg-[#151519]/80 backdrop-blur-xl rounded-2xl border shadow-lg transition hover:border-[#D4AF37] hover:-translate-y-1.5 hover:shadow-2xl flex flex-col',
              tier.featured
                ? 'border-[#D4AF37] shadow-[0_6px_32px_#d4af3770] scale-[1.06]'
                : 'border-[#292933]'
            )}
            style={{
              transition: 'box-shadow 0.16s, border-color 0.16s, transform 0.16s',
            }}
          >
            <div className="px-9 py-8 flex-1 flex flex-col">
              <div className={cn(
                'font-syne font-extrabold text-xl mb-3',
                tier.featured ? 'text-[#D4AF37]' : 'text-white'
              )}>{tier.name}</div>
              <div className="font-syne text-3xl font-extrabold mb-2 text-white">
                {tier.price}
              </div>
              <ul className="mb-6 space-y-2 text-white/90 font-dm-sans">
                {tier.features.map((f, i) => (
                  <li key={f} className="flex items-center gap-2 ">
                    <span className="text-[#D4AF37] text-lg font-syne">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {tier.featured && (
                <span className="inline-flex bg-[#d4af3736] rounded px-2 py-1 self-start font-syne font-bold text-[#D4AF37] mb-2 text-xs tracking-wide uppercase border border-[#d4af3750]">Most Popular</span>
              )}
            </div>
            <div className="px-9 pb-8">
              <a
                href="#waitlist"
                className={cn(
                  'w-full block focus:outline-none gold-btn font-syne font-extrabold text-base px-5 py-3 rounded-xl border transition shadow-lg tracking-wide group',
                  tier.featured
                    ? 'border-[#D4AF37] bg-gradient-to-r from-[#d4af37] to-[#efd991] bg-[length:200%_200%] text-[#181818] animate-gold-shimmer'
                    : 'border-[#292933] bg-transparent text-[#D4AF37] hover:bg-[#00000033]'
                )}
              >
                Get Early Access
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <section ref={ref} id="testimonials" className="py-20 max-w-7xl mx-auto px-4" aria-label="Customer Testimonials">
      <h2 className="font-syne text-3xl md:text-4xl font-extrabold mb-10 text-white text-center tracking-tight">
        What our customers say
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div
            key={t.name}
            className="bg-[#16161e]/70 backdrop-blur-xl border border-[#292933] rounded-2xl p-7 shadow-lg transition hover:border-[#D4AF37] hover:-translate-y-1.5 hover:shadow-2xl flex flex-col"
            style={{
              transition: 'box-shadow 0.16s, border-color 0.16s, transform 0.16s',
            }}
          >
            <div className="flex-1 text-white/80 font-dm-sans mb-6">&ldquo;{t.quote}&rdquo;</div>
            <div className="flex items-center gap-3 mt-auto pt-3">
              <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full border-2 border-[#d4af37b3] object-cover"/>
              <div>
                <div className="font-syne font-extrabold text-white text-sm">{t.name}</div>
                <div className="text-xs text-white/50">{t.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQAccordion() {
  const ref = useScrollReveal<HTMLDivElement>();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section ref={ref} id="faq" className="py-20 px-4 max-w-4xl mx-auto" aria-label="Frequently Asked Questions">
      <h2 className="font-syne text-3xl md:text-4xl font-extrabold mb-10 text-white text-center tracking-tight">
        Frequently asked questions
      </h2>
      <div className="space-y-4">
        {faq.map((f, i) => (
          <div
            key={f.question}
            className={cn(
              'bg-[#181821]/70 border border-[#242428] rounded-xl px-6 py-4 shadow-md transition hover:border-[#D4AF37]',
              open === i && 'border-[#D4AF37]'
            )}
            style={{
              transition: 'box-shadow 0.16s, border-color 0.16s, transform 0.16s',
            }}
          >
            <button
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full justify-between items-center font-syne text-white font-bold text-base md:text-lg focus:outline-none"
            >
              <span>{f.question}</span>
              <svg
                className={cn('ml-2 transition-transform', open === i ? 'rotate-180' : '')}
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  d="M6 8l4 4 4-4"
                  stroke={GOLD}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              className={cn(
                'transition-all text-white/80 font-dm-sans mt-3 overflow-hidden',
                open === i
                  ? 'max-h-40 opacity-100'
                  : 'max-h-0 opacity-0 pointer-events-none'
              )}
              style={{
                transition: 'max-height 0.23s cubic-bezier(.4,0,.2,1), opacity 0.14s',
              }}
            >
              {f.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WaitlistSection() {
  const ref = useScrollReveal<HTMLDivElement>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!email || !/.+@.+\..+/.test(email)) {
      setError('Please enter a valid email.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      ref={ref}
      id="waitlist"
      className="py-24 px-4 flex flex-col items-center justify-center"
      aria-label="Join the TeamAutomation Waitlist"
    >
      <div
        className="w-full max-w-xl relative border-2 rounded-3xl border-[#D4AF37] bg-[#1d1d25]/70 shadow-xl p-8 md:p-14 flex flex-col items-center backdrop-blur-md"
        style={{
          boxShadow: `0 4px 48px #D4AF3740, 0 1px 0 #fff1`
        }}
      >
        <h3 className="font-syne text-2xl md:text-3xl font-extrabold text-center text-white tracking-tight mb-2">
          Get Early Access
        </h3>
        <p className="font-dm-sans text-white/80 text-center mb-8 max-w-xs">
          We&apos;ll invite you when we open up! No spam — ever.
        </p>
        {done ? (
          <div className="text-[#D4AF37] font-syne font-bold text-lg mt-4">You&apos;re on the waitlist! 🎉</div>
        ) : (
          <form className="w-full flex flex-col items-center" onSubmit={handleSubmit} autoComplete="off">
            <div className="flex w-full max-w-sm border border-[#D4AF37] rounded-xl overflow-hidden focus-within:shadow-[0_0_0_2px_#d4af37c2] mb-4">
              <input
                type="email"
                name="email"
                className="w-full py-3 px-4 font-dm-sans text-sm md:text-base bg-transparent text-white outline-none placeholder:text-[#eeddc3a4] border-0"
                placeholder="Enter your email"
                autoComplete="off"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="submit"
                className="gold-btn px-6 font-syne font-extrabold text-base outline-none transition border-l border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#efd991] bg-[length:200%_200%] text-[#181818] animate-gold-shimmer focus-visible:ring-2 focus-visible:ring-[#d4af37b4]"
                disabled={loading}
                style={{ minWidth: 128 }}
              >
                {loading ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
            {error && <div className="mt-1 text-red-400 font-dm-sans text-sm">{error}</div>}
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 border-t border-[#222227] bg-[#0a0a12] text-white/60 font-dm-sans text-center mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-syne font-extrabold text-lg text-[#D4AF37] tracking-widest">
          <svg width="22" height="22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#D4AF37" strokeWidth="2"/>
            <path d="M7 11h8M11 7v8" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          TeamAutomation
        </div>
        <div>
          &copy; {new Date().getFullYear()} TeamAutomation. All rights reserved.
        </div>
        <div className="flex gap-6 mt-2 md:mt-0 text-sm">
          <a href="#features" className="hover:text-[#D4AF37] transition">Features</a>
          <a href="#pricing" className="hover:text-[#D4AF37] transition">Pricing</a>
          <a href="#faq" className="hover:text-[#D4AF37] transition">FAQ</a>
        </div>
      </div>
    </footer>
  );
}

export default function Page() {
  useFontLoader();
  const heroRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const waitlistRef = useRef<HTMLElement>(null);

  // Smooth scroll handler
  useEffect(() => {
    function handleNav(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a[data-scroll]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href?.startsWith('#')) return;
      const section = document.querySelector(href);
      if (section) {
        e.preventDefault();
        (section as HTMLElement).scrollIntoView({ behavior: 'smooth' });
      }
    }
    document.addEventListener('click', handleNav);
    return () => document.removeEventListener('click', handleNav);
  }, []);

  // ---- Background mesh styling ----
  useEffect(() => {
    document.body.style.background = `linear-gradient(112deg, #020210 0%, #090914 100%)`;
    document.body.style.minHeight = "100vh";
    document.body.style.fontFamily = "'DM Sans', sans-serif";
    document.body.style.backgroundColor = DARK_BG;
  }, []);

  return (
    <div className="relative min-h-screen text-white font-dm-sans overflow-x-hidden" style={{ background: 'none', position: 'relative' }}>
      {/* --- BLURRED BACKGROUND MESH GRADIENTS --- */}
      <div className="pointer-events-none absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute top-[-100px] left-[-150px] w-[380px] h-[320px] bg-[#d4af37] opacity-15 rounded-full blur-3xl" />
        <div className="absolute bottom-[-180px] right-[0] w-[480px] h-[350px] bg-[#ffd700] opacity-10 rounded-full blur-2xl" />
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-[#b08d2b] opacity-15 rounded-full blur-[110px]" />
      </div>
      {/* --- FIXED NAVBAR --- */}
      <header
        className="fixed top-0 left-0 w-full flex items-center justify-between z-30 px-4 md:px-10 bg-[#04040ae1] backdrop-blur-[9px] border-b border-[#181821] h-16"
        style={{ boxShadow: '0 2px 24px #0004' }}
      >
        <div className="flex items-center gap-2 font-syne font-extrabold text-lg text-[#D4AF37] tracking-widest">
          <svg width="20" height="20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="#D4AF37" strokeWidth="2"/>
            <path d="M6 10h8M10 6v8" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          TeamAutomation
        </div>
        <nav className="hidden md:flex gap-10 items-center justify-center flex-1 font-dm-sans font-medium text-white/80 text-base">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} data-scroll className="hover:text-[#D4AF37] transition">{l.label}</a>
          ))}
        </nav>
        <div className="flex-1 flex items-center justify-end">
          <a
            href="#waitlist"
            data-scroll
            className="gold-btn font-syne font-extrabold text-base px-6 py-2 rounded-lg border border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#efd991] bg-[length:200%_200%] text-[#181818] shadow-xl animate-gold-shimmer hover:scale-105 transition"
            style={{ transition: 'box-shadow 0.14s, transform 0.14s' }}
          >
            Get Early Access
          </a>
        </div>
        {/* Mobile nav */}
        <nav className="md:hidden flex gap-3 ml-3 items-center">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} data-scroll className="text-white/60 hover:text-[#D4AF37] font-medium">{l.label}</a>
          ))}
        </nav>
      </header>

      {/* --- HERO --- */}
      <section
        ref={heroRef}
        className="pt-32 md:pt-48 pb-14 px-4 flex flex-col md:flex-row items-center md:items-start max-w-7xl mx-auto"
        aria-label="Hero"
      >
        <div className="md:flex-1 flex flex-col items-center md:items-start">
          <h1 className="font-syne font-extrabold text-4xl md:text-5xl lg:text-6xl mb-7 text-white leading-tight tracking-tight text-center md:text-left">
            Approvals that actually work<br className="hidden md:block"/> in Slack
          </h1>
          <div className="mb-8 md:mb-10 text-xl md:text-2xl text-white/80 font-dm-sans font-medium tracking-normal hero-typing selection:bg-[#D4AF37]/50">
            <HeroTyping />
          </div>
          <div className="flex gap-4 mb-6">
            <a
              href="#waitlist"
              data-scroll
              className="gold-btn font-syne font-extrabold text-base px-8 py-3 rounded-xl border border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#efd991] bg-[length:200%_200%] text-[#181818] shadow-xl animate-gold-shimmer hover:scale-105 transition"
              style={{ transition: 'box-shadow 0.16s, transform 0.16s' }}
            >
              Get Early Access
            </a>
            <a
              href="#features"
              data-scroll
              className="font-syne font-extrabold text-base px-8 py-3 rounded-xl border border-[#D4AF37]/60 bg-transparent text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#18181837] transition"
            >
              See Features
            </a>
          </div>
        </div>
        <div className="md:flex-1 flex items-center md:justify-end w-full mt-8 md:mt-0">
          <div className="w-full max-w-xs mx-auto">
            <SlackCard />
          </div>
        </div>
      </section>
      {/* --- STATS BAR --- */}
      <StatsBar />
      {/* --- HOW IT WORKS --- */}
      <HowItWorks />
      {/* --- FEATURES --- */}
      <Features />
      {/* --- PRICING --- */}
      <Pricing />
      {/* --- TESTIMONIALS --- */}
      <Testimonials />
      {/* --- FAQ --- */}
      <FAQAccordion />
      {/* --- WAITLIST CTA --- */}
      <WaitlistSection />
      {/* --- FOOTER --- */}
      <Footer />

      {/* CSS for gold shimmer & typewriter blink */}
      <style jsx global>{`
        body {
          font-family: 'DM Sans', sans-serif;
          background-color: ${DARK_BG};
        }
        .font-syne { font-family: 'Syne', system-ui, sans-serif !important; }
        .font-dm-sans { font-family: 'DM Sans', system-ui, sans-serif !important; }
        .gold-btn {
          background-size: 200% 200%;
          box-shadow: 0 2px 10px #d4af3727, 0 0.5px 0 #fff0 inset;
          position: relative;
        }
        .animate-gold-shimmer {
          animation: gold-shimmer 2.5s linear infinite;
        }
        @keyframes gold-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .glass-card {
          background: linear-gradient(126deg, #16161e88 70%, #1a161e44 100%);
          box-shadow: 0 2px 24px #0a051377;
        }
        .hero-typing span.animate-blink {
          animation: caret-blink 1s steps(1) infinite alternate;
        }
        @keyframes caret-blink {
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
