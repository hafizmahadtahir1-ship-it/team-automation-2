"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════════ */
function CosmicCanvas({ mousePos }) {
  const canvasRef = useRef(null);
  const mp = useRef({ x: -9999, y: -9999 });
  useEffect(() => { mp.current = mousePos; }, [mousePos]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 90 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.4 + 0.3,
      hue: Math.random() > 0.6 ? "212,175,55" : Math.random() > 0.5 ? "150,90,255" : "70,130,255",
      alpha: Math.random() * 0.55 + 0.15, pulse: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now() * 0.001;
      pts.forEach(p => {
        const dx = p.x - mp.current.x, dy = p.y - mp.current.y;
        const d = Math.hypot(dx, dy);
        if (d < 120) { p.vx += dx / d * 0.5; p.vy += dy / d * 0.5; }
        p.vx *= 0.988; p.vy *= 0.988;
        p.x = (p.x + p.vx + canvas.width) % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        p.pulse += 0.009;
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 110) {
          const op = (1 - d / 110) * 0.09;
          const g = ctx.createLinearGradient(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
          g.addColorStop(0, `rgba(${pts[i].hue},${op})`);
          g.addColorStop(1, `rgba(${pts[j].hue},${op})`);
          ctx.beginPath(); ctx.strokeStyle = g; ctx.lineWidth = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
      pts.forEach(p => {
        const pulse = Math.sin(p.pulse + now) * 0.28 + 0.72;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${p.alpha * pulse})`; ctx.fill();
        if (p.r > 1.1) {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.5 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.hue},${0.03 * pulse})`; ctx.fill();
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

/* ══════════════════════════════════════════
   MORPHING ORBS
══════════════════════════════════════════ */
function MorphOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <style>{`
        @keyframes mo1{0%,100%{border-radius:62% 38% 34% 66%/58% 34% 66% 42%;transform:translate(0,0)}25%{border-radius:38% 62% 68% 32%/52% 62% 38% 48%;transform:translate(35px,20px)}50%{border-radius:52% 48% 32% 68%/44% 44% 56% 56%;transform:translate(-20px,45px)}75%{border-radius:44% 56% 62% 38%/62% 44% 56% 38%;transform:translate(12px,-22px)}}
        @keyframes mo2{0%,100%{border-radius:44% 56% 58% 42%/44% 52% 48% 56%;transform:translate(0,0)}33%{border-radius:62% 38% 42% 58%/58% 42% 58% 42%;transform:translate(-45px,32px)}66%{border-radius:52% 42% 62% 48%/34% 58% 42% 58%;transform:translate(22px,-32px)}}
        @keyframes mo3{0%,100%{border-radius:68% 32% 52% 48%/34% 48% 52% 66%;transform:translate(0,0)}50%{border-radius:34% 66% 42% 58%/62% 34% 66% 38%;transform:translate(-28px,-22px)}}
      `}</style>
      {[
        { x:"-6%", y:"-6%",  s:800, c:"212,175,55", op:0.10, an:"mo1 20s ease-in-out infinite" },
        { x:"66%", y:"-12%", s:620, c:"120,70,255",  op:0.08, an:"mo2 25s ease-in-out infinite" },
        { x:"35%", y:"45%",  s:500, c:"212,175,55",  op:0.06, an:"mo3 18s ease-in-out infinite" },
        { x:"76%", y:"56%",  s:440, c:"44,110,255",  op:0.07, an:"mo1 23s ease-in-out infinite reverse" },
        { x:"6%",  y:"66%",  s:380, c:"120,70,255",  op:0.055,an:"mo2 20s ease-in-out infinite reverse" },
      ].map((o,i) => (
        <div key={i} style={{ position:"absolute", left:o.x, top:o.y, width:o.s, height:o.s,
          background:`radial-gradient(ellipse at 32% 32%, rgba(${o.c},${o.op*1.7}) 0%, rgba(${o.c},${o.op}) 40%, transparent 68%)`,
          filter:"blur(60px)", animation:o.an }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   3D TILT — butter smooth
══════════════════════════════════════════ */
function TiltCard({ children, style, intensity = 14 }) {
  const ref = useRef(null);
  const raf = useRef(null);
  const tgt = useRef({ rx:0, ry:0 });
  const cur = useRef({ rx:0, ry:0 });
  const onMove = useCallback((e) => {
    const r = ref.current.getBoundingClientRect();
    tgt.current.ry = ((e.clientX - r.left) / r.width - 0.5) * intensity;
    tgt.current.rx = -((e.clientY - r.top) / r.height - 0.5) * intensity;
  }, [intensity]);
  const onLeave = useCallback(() => { tgt.current = { rx:0, ry:0 }; }, []);
  useEffect(() => {
    const tick = () => {
      cur.current.rx += (tgt.current.rx - cur.current.rx) * 0.07;
      cur.current.ry += (tgt.current.ry - cur.current.ry) * 0.07;
      if (ref.current) {
        const a = Math.abs(cur.current.rx) > 0.05 || Math.abs(cur.current.ry) > 0.05;
        ref.current.style.transform = `perspective(900px) rotateX(${cur.current.rx}deg) rotateY(${cur.current.ry}deg) scale3d(${a?1.025:1},${a?1.025:1},1)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ willChange:"transform", ...style }}>{children}</div>;
}

/* ══════════════════════════════════════════
   MAGNETIC BUTTON
══════════════════════════════════════════ */
function MagBtn({ children, onClick, gold, outline, style }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) * 0.3;
    const y = (e.clientY - r.top - r.height/2) * 0.3;
    ref.current.style.transform = `translate(${x}px,${y}px) scale(1.04)`;
  }, []);
  const onLeave = useCallback(() => { ref.current.style.transform = "translate(0,0) scale(1)"; }, []);
  return (
    <button ref={ref} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave} style={{
      border:"none", cursor:"pointer",
      transition:"transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s",
      ...(gold ? {
        background:"linear-gradient(135deg,#D4AF37 0%,#f5e070 38%,#D4AF37 68%,#7a5800 100%)",
        backgroundSize:"280% 280%", animation:"btnShimmer 3.5s ease infinite",
      } : outline ? {
        background:"transparent",
        border:"1px solid rgba(255,255,255,0.14)",
      } : {
        background:"rgba(255,255,255,0.06)",
        border:"1px solid rgba(255,255,255,0.1)",
      }),
      ...style,
    }}>{children}</button>
  );
}

/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
function SR({ children, delay=0, dir="up" }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold:0.06 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const from = { up:"translateY(55px)", left:"translateX(-55px)", right:"translateX(55px)", scale:"scale(0.9)" };
  return (
    <div ref={ref} style={{
      opacity: v?1:0, transform: v?"none":from[dir],
      transition:`opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>{children}</div>
  );
}

/* ══════════════════════════════════════════
   TYPING ANIMATION
══════════════════════════════════════════ */
function TypeText({ words }) {
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      if (!del) {
        if (ci < words[wi].length) setCi(c=>c+1);
        else { setTimeout(()=>setDel(true), 1800); clearInterval(t); }
      } else {
        if (ci > 0) setCi(c=>c-1);
        else { setDel(false); setWi(w=>(w+1)%words.length); clearInterval(t); }
      }
    }, del?45:88);
    return ()=>clearInterval(t);
  }, [ci, del, wi, words]);
  useEffect(() => { const b=setInterval(()=>setBlink(x=>!x),520); return()=>clearInterval(b); }, []);
  return (
    <span>
      {words[wi].slice(0,ci)}
      <span style={{ opacity:blink?1:0, color:"#D4AF37", transition:"opacity 0.1s" }}>|</span>
    </span>
  );
}

/* ══════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════ */
function Counter({ to, prefix="", suffix="", label }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e])=>{ if(e.isIntersecting&&!on) setOn(true); },{ threshold:0.4 });
    if(ref.current) io.observe(ref.current);
    return ()=>io.disconnect();
  },[on]);
  useEffect(() => {
    if(!on) return;
    let s=0;
    const step=(ts)=>{
      if(!s) s=ts;
      const p=Math.min((ts-s)/1900,1);
      setVal(Math.floor((1-Math.pow(1-p,3))*to));
      if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },[on,to]);
  return (
    <div ref={ref} style={{ textAlign:"center" }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(34px,4vw,52px)", fontWeight:800, lineHeight:1,
        background:"linear-gradient(135deg,#D4AF37,#fff3a0 50%,#c49a20)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
        {prefix}{val}{suffix}
      </div>
      <div style={{ color:"rgba(255,255,255,0.28)", fontSize:"11px", letterSpacing:"0.12em", textTransform:"uppercase", marginTop:"10px", fontFamily:"'DM Sans',sans-serif" }}>{label}</div>
    </div>
  );
}

/* ══════════════════════════════════════════
   INTERACTIVE SLACK CARD
══════════════════════════════════════════ */
function SlackCard() {
  const [state, setState] = useState("idle");
  return (
    <TiltCard intensity={13} style={{
      background:"linear-gradient(150deg,rgba(15,13,22,0.97),rgba(8,7,14,0.99))",
      border:"1px solid rgba(212,175,55,0.22)",
      borderRadius:"28px", padding:"26px 28px", width:"340px",
      boxShadow:"0 50px 120px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)",
      backdropFilter:"blur(40px)", position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"50%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.55),transparent)" }} />
      <div style={{ position:"absolute", top:"-45px", right:"-45px", width:"140px", height:"140px", borderRadius:"50%", background:"radial-gradient(circle,rgba(212,175,55,0.12),transparent 68%)", pointerEvents:"none" }} />

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"11px", marginBottom:"18px" }}>
        <div style={{ width:"40px", height:"40px", borderRadius:"11px", background:"linear-gradient(135deg,#D4AF37,#8B6914)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"17px", boxShadow:"0 6px 22px rgba(212,175,55,0.42)", flexShrink:0 }}>⚡</div>
        <div>
          <div style={{ color:"#fff", fontSize:"13px", fontWeight:700, fontFamily:"'Syne',sans-serif" }}>TeamAutomation</div>
          <div style={{ color:"rgba(212,175,55,0.45)", fontSize:"10px", letterSpacing:"0.07em" }}>APP · JUST NOW</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"5px" }}>
          <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 9px #22c55e, 0 0 18px rgba(34,197,94,0.4)" }} />
          <span style={{ color:"rgba(34,197,94,0.65)", fontSize:"10px" }}>Live</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:"14px", padding:"14px 16px", marginBottom:"16px", border:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ color:"rgba(255,255,255,0.32)", fontSize:"11px", marginBottom:"8px" }}>
          <span style={{ color:"#D4AF37", fontWeight:600 }}>@sarah_ops</span> · Purchase Request
        </div>
        <div style={{ color:"#fff", fontSize:"17px", fontWeight:700, fontFamily:"'Syne',sans-serif", marginBottom:"5px" }}>MacBook Pro M4</div>
        <div style={{ color:"#D4AF37", fontSize:"21px", fontWeight:800, fontFamily:"'Syne',sans-serif", marginBottom:"12px" }}>$1,200</div>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {["Engineering","Q2 Budget"].map(t=>(
            <span key={t} style={{ background:"rgba(212,175,55,0.07)", border:"1px solid rgba(212,175,55,0.16)", borderRadius:"100px", padding:"2px 9px", fontSize:"9px", color:"rgba(212,175,55,0.65)", letterSpacing:"0.04em" }}>{t}</span>
          ))}
        </div>
      </div>

      {state==="idle" && (
        <div style={{ display:"flex", gap:"9px" }}>
          <MagBtn gold onClick={()=>setState("approved")} style={{ flex:1, padding:"12px", borderRadius:"13px", fontSize:"13px", fontWeight:700, color:"#0a0a0a", fontFamily:"'Syne',sans-serif", letterSpacing:"0.04em", boxShadow:"0 6px 22px rgba(212,175,55,0.38)" }}>✓ Approve</MagBtn>
          <MagBtn onClick={()=>setState("rejected")} style={{ flex:1, padding:"12px", borderRadius:"13px", fontSize:"13px", color:"rgba(255,255,255,0.38)", fontFamily:"'DM Sans',sans-serif" }}>✕ Reject</MagBtn>
        </div>
      )}
      {state==="approved" && (
        <div style={{ textAlign:"center", padding:"14px", borderRadius:"13px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.22)", animation:"popIn 0.45s cubic-bezier(0.16,1,0.3,1)" }}>
          <div style={{ fontSize:"20px", marginBottom:"5px" }}>✦</div>
          <div style={{ color:"#22c55e", fontWeight:700, fontFamily:"'Syne',sans-serif", fontSize:"14px" }}>Approved & logged</div>
          <div style={{ color:"rgba(255,255,255,0.25)", fontSize:"11px", marginTop:"3px" }}>Audit trail updated · sarah notified</div>
          <button onClick={()=>setState("idle")} style={{ marginTop:"9px", background:"none", border:"none", color:"rgba(255,255,255,0.16)", fontSize:"10px", cursor:"pointer" }}>↩ reset</button>
        </div>
      )}
      {state==="rejected" && (
        <div style={{ textAlign:"center", padding:"14px", borderRadius:"13px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.22)", animation:"popIn 0.45s cubic-bezier(0.16,1,0.3,1)" }}>
          <div style={{ color:"#ef4444", fontWeight:700, fontFamily:"'Syne',sans-serif", fontSize:"14px" }}>Rejected & notified</div>
          <div style={{ color:"rgba(255,255,255,0.25)", fontSize:"11px", marginTop:"3px" }}>@sarah_ops was notified instantly</div>
          <button onClick={()=>setState("idle")} style={{ marginTop:"9px", background:"none", border:"none", color:"rgba(255,255,255,0.16)", fontSize:"10px", cursor:"pointer" }}>↩ reset</button>
        </div>
      )}
      <div style={{ marginTop:"14px", textAlign:"center", color:"rgba(255,255,255,0.09)", fontSize:"9px", letterSpacing:"0.1em" }}>POWERED BY <span style={{ color:"rgba(212,175,55,0.28)" }}>TEAMAUTOMATION</span></div>
    </TiltCard>
  );
}

/* ══════════════════════════════════════════
   WAITLIST FORM
══════════════════════════════════════════ */
function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!email.includes("@")) return;
    setLoading(true);
    try { await fetch("/api/waitlist",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email}) }); } catch(_){}
    setLoading(false); setSent(true);
  };
  if (sent) return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:"12px", background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:"100px", padding:"16px 32px", animation:"popIn 0.5s ease" }}>
      <span style={{ color:"#D4AF37", fontSize:"18px" }}>✦</span>
      <span style={{ color:"#22c55e", fontWeight:700, fontFamily:"'Syne',sans-serif", fontSize:"15px" }}>You're on the list — we'll reach out soon</span>
    </div>
  );
  return (
    <div>
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"14px" }}>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}
          placeholder="your@company.com"
          style={{ flex:"1 1 200px", maxWidth:"280px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)",
            borderRadius:"100px", padding:"15px 24px", fontSize:"15px", color:"#fff", outline:"none",
            fontFamily:"'DM Sans',sans-serif", transition:"border 0.3s, box-shadow 0.3s" }}
          onFocus={e=>{ e.target.style.borderColor="rgba(212,175,55,0.45)"; e.target.style.boxShadow="0 0 0 3px rgba(212,175,55,0.09)"; }}
          onBlur={e=>{ e.target.style.borderColor="rgba(255,255,255,0.12)"; e.target.style.boxShadow="none"; }}
        />
        <MagBtn gold onClick={submit} style={{ padding:"15px 30px", borderRadius:"100px", fontSize:"15px", fontWeight:700, color:"#0a0a0a", fontFamily:"'Syne',sans-serif", letterSpacing:"0.04em", boxShadow:"0 6px 26px rgba(212,175,55,0.38)", opacity:loading?0.7:1 }}>
          {loading ? "..." : "Get Early Access →"}
        </MagBtn>
      </div>
      <div style={{ color:"rgba(255,255,255,0.18)", fontSize:"11px", letterSpacing:"0.1em", textTransform:"uppercase" }}>Free 14-day trial · No credit card</div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SECTION HEADER
══════════════════════════════════════════ */
function SectionHead({ eyebrow, title, italic, sub, center }) {
  return (
    <SR>
      <div style={{ textAlign:center?"center":"left", marginBottom:"52px" }}>
        <div style={{ color:"rgba(212,175,55,0.55)", fontSize:"10px", letterSpacing:"0.28em", textTransform:"uppercase", marginBottom:"14px", fontFamily:"'DM Sans',sans-serif" }}>{eyebrow}</div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(30px,3.8vw,50px)", fontWeight:800, letterSpacing:"-0.025em", lineHeight:1.1, marginBottom: sub?"16px":"0" }}>
          {title} {italic && <em style={{ color:"rgba(255,255,255,0.2)", fontWeight:400 }}>{italic}</em>}
        </h2>
        {sub && <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"17px", lineHeight:1.8, fontWeight:300, maxWidth:"520px", margin:center?"0 auto":"0", marginTop:"12px" }}>{sub}</p>}
      </div>
    </SR>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function LandingPage() {
  const [mouse, setMouse] = useState({ x:-9999, y:-9999 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const mm = e => setMouse({ x:e.clientX, y:e.clientY });
    const os = () => setScrolled(window.scrollY > 28);
    window.addEventListener("mousemove", mm);
    window.addEventListener("scroll", os);
    return ()=>{ window.removeEventListener("mousemove",mm); window.removeEventListener("scroll",os); };
  }, []);

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  return (
    <div style={{ background:"#04040a", minHeight:"100vh", color:"#fff", overflowX:"hidden", fontFamily:"'DM Sans',sans-serif", position:"relative" }}>

      {/* ── GLOBAL CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::selection{background:rgba(212,175,55,0.2);color:#fff;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#D4AF37,#8B6914);border-radius:2px;}
        input::placeholder{color:rgba(255,255,255,0.22);}

        @keyframes btnShimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes popIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
        @keyframes goldPulse{0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.5)}70%{box-shadow:0 0 0 14px rgba(212,175,55,0)}}
        @keyframes heroFloat{0%,100%{transform:translateY(0px)}50%{transform:translateY(-18px)}}
        @keyframes spinCW{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes spinCCW{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
        @keyframes textGlow{0%,100%{text-shadow:0 0 40px rgba(212,175,55,0.18),0 0 80px rgba(212,175,55,0.06)}50%{text-shadow:0 0 60px rgba(212,175,55,0.42),0 0 120px rgba(212,175,55,0.14)}}
        @keyframes borderGlow{0%,100%{border-color:rgba(212,175,55,0.14)}50%{border-color:rgba(212,175,55,0.44)}}
        @keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.4)}70%{box-shadow:0 0 0 8px rgba(212,175,55,0)}}
        @keyframes shimmerGold{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes dividerShimmer{0%{opacity:0.3}50%{opacity:1}100%{opacity:0.3}}

        .card-hover{transition:border-color 0.3s,transform 0.25s,box-shadow 0.25s;}
        .card-hover:hover{border-color:rgba(212,175,55,0.28)!important;transform:translateY(-4px)!important;box-shadow:0 24px 60px rgba(0,0,0,0.45)!important;}
        .icon-box{width:48px;height:48px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:19px;background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.17);margin-bottom:18px;transition:all 0.3s;}
        .card-hover:hover .icon-box{background:linear-gradient(135deg,#D4AF37,#8B6914)!important;border-color:transparent!important;box-shadow:0 8px 28px rgba(212,175,55,0.35)!important;}

        @media(max-width:900px){
          .hero-grid{flex-direction:column!important;}
          .hero-right-wrap{display:none!important;}
          .three-col{grid-template-columns:1fr 1fr!important;}
          .pricing-row{flex-direction:column!important;align-items:center!important;}
          .pricing-row>*{width:100%!important;max-width:440px!important;}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important;}
          nav{padding:0 20px!important;}
          .nav-links-row{display:none!important;}
        }
        @media(max-width:600px){
          .three-col{grid-template-columns:1fr!important;}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important;}
        }
      `}</style>

      {/* ── BACKGROUNDS ── */}
      <MorphOrbs />
      <CosmicCanvas mousePos={mouse} />

      {/* Grid overlay */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(255,255,255,0.013) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.013) 1px,transparent 1px)",
        backgroundSize:"68px 68px",
        maskImage:"radial-gradient(ellipse 75% 75% at 50% 50%,black 30%,transparent 100%)" }} />

      {/* Cursor glow */}
      <div style={{ position:"fixed", width:"480px", height:"480px", borderRadius:"50%",
        background:"radial-gradient(circle,rgba(212,175,55,0.026) 0%,transparent 65%)",
        pointerEvents:"none", zIndex:1, transform:"translate(-50%,-50%)",
        left:mouse.x, top:mouse.y, transition:"left 0.07s linear,top 0.07s linear" }} />

      {/* Floating geo shapes */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:"4%", top:"7%", width:"120px", height:"120px", animation:"spinCW 24s linear infinite" }}>
          <div style={{ width:"100%", height:"100%", border:"1px solid rgba(212,175,55,0.09)", borderRadius:"5px" }} />
        </div>
        <div style={{ position:"absolute", left:"2%", bottom:"24%", width:"80px", height:"80px", animation:"spinCCW 18s linear infinite" }}>
          <div style={{ width:"100%", height:"100%", border:"1px solid rgba(120,70,255,0.11)", borderRadius:"50%" }} />
        </div>
        <div style={{ position:"absolute", right:"11%", top:"54%", width:"55px", height:"55px", animation:"spinCW 32s linear infinite" }}>
          <div style={{ width:"100%", height:"100%", border:"1px solid rgba(44,110,255,0.08)" }} />
        </div>
      </div>

      {/* ══ NAV ══ */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:300, height:"64px",
        padding:"0 48px", display:"flex", alignItems:"center", justifyContent:"space-between",
        background:scrolled?"rgba(4,4,10,0.92)":"rgba(4,4,10,0.55)",
        backdropFilter:"blur(28px)", borderBottom:"1px solid rgba(255,255,255,0.04)",
        transition:"background 0.4s" }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"32px", height:"32px", borderRadius:"9px", background:"linear-gradient(135deg,#D4AF37,#8B6914)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", animation:"goldPulse 2.8s ease infinite", flexShrink:0 }}>⚡</div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"17px", fontWeight:800, letterSpacing:"0.01em" }}>
            Team<span style={{ color:"#D4AF37" }}>Automation</span>
          </span>
        </div>

        {/* Links */}
        <div className="nav-links-row" style={{ display:"flex", alignItems:"center", gap:"28px" }}>
          {[["Features","features"],["How it works","how"],["Pricing","pricing"],["FAQ","faq"]].map(([l,id])=>(
            <button key={id} onClick={()=>go(id)} style={{ background:"none", border:"none", cursor:"pointer",
              color:"rgba(255,255,255,0.3)", fontSize:"12px", letterSpacing:"0.07em", textTransform:"uppercase",
              fontFamily:"'DM Sans',sans-serif", transition:"color 0.25s", padding:"4px 0" }}
              onMouseEnter={e=>e.target.style.color="#D4AF37"}
              onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.3)"}
            >{l}</button>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <MagBtn outline onClick={()=>go("cta")} style={{ padding:"9px 20px", borderRadius:"100px", fontSize:"13px", color:"rgba(255,255,255,0.38)", fontFamily:"'DM Sans',sans-serif" }}>Sign in</MagBtn>
          <MagBtn gold onClick={()=>go("cta")} style={{ padding:"9px 20px", borderRadius:"100px", fontSize:"13px", fontWeight:700, color:"#0a0a0a", fontFamily:"'Syne',sans-serif", letterSpacing:"0.04em", boxShadow:"0 4px 18px rgba(212,175,55,0.3)" }}>
            Get Early Access
          </MagBtn>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section id="hero" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"88px 32px 60px", position:"relative", zIndex:2 }}>
        <div className="hero-grid" style={{ maxWidth:"1080px", width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"56px", flexWrap:"wrap" }}>

          {/* LEFT — text */}
          <div style={{ flex:"1 1 400px", maxWidth:"500px" }}>

            {/* Badge */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px",
              background:"rgba(212,175,55,0.06)", border:"1px solid rgba(212,175,55,0.2)",
              borderRadius:"100px", padding:"6px 16px", marginBottom:"32px",
              animation:"borderGlow 3.5s ease infinite" }}>
              <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#D4AF37",
                boxShadow:"0 0 9px #D4AF37", animation:"badgePulse 2.2s ease infinite" }} />
              <span style={{ color:"rgba(212,175,55,0.85)", fontSize:"11px", letterSpacing:"0.13em", textTransform:"uppercase", fontWeight:600 }}>
                Slack-Native · Now in Beta
              </span>
            </div>

            {/* Headline */}
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(42px,5.5vw,70px)", fontWeight:800,
              letterSpacing:"-0.032em", lineHeight:1.07, marginBottom:"20px",
              animation:"textGlow 4.5s ease infinite" }}>
              Approvals that{" "}
              <span style={{ background:"linear-gradient(135deg,#D4AF37,#fff0a0 45%,#C49A20)", backgroundSize:"280% 280%",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"shimmerGold 4s ease infinite" }}>
                actually work
              </span>
              {" "}in Slack
            </h1>

            {/* Typing line */}
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(16px,1.9vw,22px)", fontWeight:400,
              color:"rgba(255,255,255,0.22)", lineHeight:1.35, marginBottom:"22px", minHeight:"32px" }}>
              <TypeText words={["No more lost requests.","No more Slack ping chaos.","Full audit trail, zero effort.","Your team, finally unblocked."]} />
            </div>

            {/* Description */}
            <p style={{ color:"rgba(255,255,255,0.34)", fontSize:"16px", lineHeight:1.85, marginBottom:"40px", fontWeight:300, maxWidth:"420px" }}>
              TeamAutomation brings structured approval workflows into Slack — with smart nudges, audit logs, and one-click delegation built in.
            </p>

            {/* Hero CTA — just a button, no form */}
            <div style={{ display:"flex", gap:"12px", alignItems:"center", flexWrap:"wrap", marginBottom:"20px" }}>
              <MagBtn gold onClick={()=>go("cta")} style={{ padding:"15px 32px", borderRadius:"100px", fontSize:"16px", fontWeight:700, color:"#0a0a0a", fontFamily:"'Syne',sans-serif", letterSpacing:"0.04em", boxShadow:"0 8px 30px rgba(212,175,55,0.4)" }}>
                Get Early Access →
              </MagBtn>
              <MagBtn outline onClick={()=>go("how")} style={{ padding:"15px 28px", borderRadius:"100px", fontSize:"14px", color:"rgba(255,255,255,0.45)", fontFamily:"'DM Sans',sans-serif" }}>
                See how it works ↓
              </MagBtn>
            </div>

            <div style={{ color:"rgba(255,255,255,0.15)", fontSize:"11px", letterSpacing:"0.1em", textTransform:"uppercase" }}>
              Free 14-day trial · No credit card required
            </div>
          </div>

          {/* RIGHT — Slack card + rings */}
          <div className="hero-right-wrap" style={{ flex:"1 1 340px", display:"flex", justifyContent:"center", alignItems:"center", position:"relative", animation:"heroFloat 5.5s ease-in-out infinite" }}>
            {/* Rings */}
            {[460,384,308].map((s,i)=>(
              <div key={i} style={{ position:"absolute", top:"50%", left:"50%", width:s, height:s,
                borderRadius:"50%", transform:"translate(-50%,-50%)",
                border:`1px ${i===2?"dashed":"solid"} rgba(${i===0?"212,175,55":i===1?"120,70,255":"44,110,255"},${i===0?0.09:0.07})`,
                animation:`${i%2===0?"spinCW":"spinCCW"} ${22+i*9}s linear infinite`, pointerEvents:"none" }} />
            ))}
            <div style={{ position:"absolute", inset:"-30px", borderRadius:"50%",
              background:"radial-gradient(circle,rgba(212,175,55,0.07) 0%,transparent 65%)", pointerEvents:"none" }} />
            <SlackCard />
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{ padding:"0 32px 80px", position:"relative", zIndex:2 }}>
        <SR>
          <div style={{ maxWidth:"820px", margin:"0 auto" }}>
            <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1px",
              background:"rgba(212,175,55,0.08)", borderRadius:"22px", overflow:"hidden",
              border:"1px solid rgba(212,175,55,0.1)" }}>
              {[
                { to:5, suffix:" min", label:"Setup Time" },
                { to:14, suffix:"-day", label:"Free Trial" },
                { to:100, suffix:"%", label:"Slack-Native" },
                { prefix:"$", to:49, suffix:"/mo", label:"Starting Price" },
              ].map((s,i)=>(
                <div key={i} style={{ padding:"36px 20px", background:"rgba(4,4,10,0.9)", backdropFilter:"blur(20px)" }}>
                  <Counter {...s} />
                </div>
              ))}
            </div>
          </div>
        </SR>
      </section>

      {/* DIVIDER */}
      <div style={{ maxWidth:"300px", margin:"0 auto 80px", height:"1px",
        background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)",
        animation:"dividerShimmer 3s ease infinite" }} />

      {/* ══ HOW IT WORKS ══ */}
      <section id="how" style={{ padding:"0 32px 100px", position:"relative", zIndex:2 }}>
        <div style={{ maxWidth:"940px", margin:"0 auto" }}>
          <SectionHead eyebrow="How It Works" title="Live in Slack" italic="in minutes" />
          <div className="three-col" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
            {[
              { n:"01", icon:"🔧", title:"Install in 5 min", desc:"Connect to your Slack workspace with one click. No dev required, no setup headache. Works with any Slack plan." },
              { n:"02", icon:"⚡", title:"Type /approve", desc:"Your team types the slash command and fills in the request. Everything else is automated from there." },
              { n:"03", icon:"✦", title:"Approve anywhere", desc:"Approvers get a rich Slack card. One click approves or rejects — with full audit trail and auto-nudges." },
            ].map((s,i)=>(
              <SR key={i} delay={i*90}>
                <div className="card-hover" style={{ background:"linear-gradient(145deg,rgba(14,14,20,0.92),rgba(7,7,12,0.97))",
                  border:"1px solid rgba(255,255,255,0.06)", borderRadius:"20px", padding:"28px 24px", height:"100%" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"18px" }}>
                    <div style={{ width:"46px", height:"46px", borderRadius:"13px", background:"linear-gradient(135deg,#D4AF37,#8B6914)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"14px", color:"#0a0a0a",
                      boxShadow:"0 7px 22px rgba(212,175,55,0.32)", flexShrink:0 }}>{s.n}</div>
                    <span style={{ fontSize:"24px" }}>{s.icon}</span>
                  </div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"17px", marginBottom:"10px" }}>{s.title}</div>
                  <div style={{ color:"rgba(255,255,255,0.34)", fontSize:"14px", lineHeight:1.78 }}>{s.desc}</div>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" style={{ padding:"0 32px 100px", position:"relative", zIndex:2 }}>
        <div style={{ maxWidth:"940px", margin:"0 auto" }}>
          <SectionHead eyebrow="Features" title="Everything your team" italic="actually needs" />
          <div className="three-col" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
            {[
              { icon:"⚡", title:"Instant Slack Cards", desc:"Approval requests appear as rich interactive Slack messages. Approve or reject with one click, inside the channel.", delay:0 },
              { icon:"🔔", title:"Smart Nudges", desc:"Auto reminders on Day 1, 3, and 7 if a request is pending. Zero forgotten approvals — ever again.", delay:70 },
              { icon:"📋", title:"Full Audit Trail", desc:"Every action logged: timestamp, user, context. Always compliant, always exportable.", delay:140 },
              { icon:"🔀", title:"Delegate Approvals", desc:"Out of office? Delegate your approval authority instantly with /approve-delegate. Zero friction.", delay:0 },
              { icon:"📊", title:"Dashboard & Export", desc:"See all requests in one view. Filter by status, export CSV, track team bottlenecks in real time.", delay:70 },
              { icon:"🔒", title:"Secure by Default", desc:"Slack signature verification, Supabase RLS, full request isolation. Enterprise-grade from day one.", delay:140 },
            ].map((f,i)=>(
              <SR key={i} delay={f.delay}>
                <div className="card-hover" style={{ background:"linear-gradient(145deg,rgba(14,14,20,0.92),rgba(7,7,12,0.97))",
                  border:"1px solid rgba(255,255,255,0.06)", borderRadius:"20px", padding:"26px 22px", height:"100%" }}>
                  <div className="icon-box">{f.icon}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"15px", marginBottom:"9px" }}>{f.title}</div>
                  <div style={{ color:"rgba(255,255,255,0.33)", fontSize:"13px", lineHeight:1.78 }}>{f.desc}</div>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="pricing" style={{ padding:"0 32px 100px", position:"relative", zIndex:2 }}>
        <div style={{ maxWidth:"940px", margin:"0 auto" }}>
          <SectionHead eyebrow="Pricing" title="Simple," italic="transparent pricing"
            sub="14-day free trial on all plans. No credit card required to start." />

          <div className="pricing-row" style={{ display:"flex", gap:"18px", flexWrap:"wrap", justifyContent:"center" }}>
            {[
              { name:"Starter", price:"$49", period:"mo", sub:"Small teams up to 10 people",
                features:["Up to 10 members","Unlimited requests","Smart nudges","30-day audit trail","Dashboard + CSV","Email support"],
                featured:false, cta:"Start free trial", href:"/api/auth/slack" },
              { name:"Growth", price:"$149", period:"mo", sub:"Growing teams up to 50 people",
                features:["Up to 50 members","Unlimited requests","Multi-level chains","1-year audit trail","Analytics & reporting","Priority support"],
                featured:true, cta:"Start free trial", href:"/api/auth/slack" },
              { name:"Scale", price:"$499", period:"mo", sub:"Unlimited team size",
                features:["Unlimited members","Custom workflows","SSO & advanced security","Unlimited audit trail","Dedicated manager","SLA guarantee"],
                featured:false, cta:"Contact us", href:"mailto:mahadbuilds289@gmail.com" },
            ].map((p,i)=>(
              <SR key={i} delay={i*80}>
                <div style={{ flex:"1 1 260px", maxWidth:"300px",
                  background:p.featured?"linear-gradient(145deg,rgba(22,17,8,0.98),rgba(12,9,3,0.99))":"linear-gradient(145deg,rgba(13,13,20,0.93),rgba(7,7,12,0.97))",
                  border:p.featured?"1px solid rgba(212,175,55,0.36)":"1px solid rgba(255,255,255,0.07)",
                  borderRadius:"24px", padding:"34px 28px", position:"relative", overflow:"hidden",
                  boxShadow:p.featured?"0 28px 80px rgba(212,175,55,0.13)":"none",
                  transition:"transform 0.3s, box-shadow 0.3s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-5px)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; }}
                >
                  {p.featured&&<>
                    <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"45%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.65),transparent)" }} />
                    <div style={{ display:"inline-block", background:"linear-gradient(135deg,#D4AF37,#8B6914)", color:"#0a0a0a", fontSize:"9px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", borderRadius:"100px", padding:"4px 12px", marginBottom:"16px", fontFamily:"'Syne',sans-serif" }}>Most Popular</div>
                  </>}
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"17px", fontWeight:700, marginBottom:"10px", color:p.featured?"#D4AF37":"rgba(255,255,255,0.75)" }}>{p.name}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"40px", fontWeight:800, marginBottom:"4px", color:"#fff" }}>
                    {p.price}<span style={{ fontSize:"15px", fontWeight:400, color:"rgba(255,255,255,0.28)" }}>/{p.period}</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.28)", fontSize:"12px", marginBottom:"26px" }}>{p.sub}</div>
                  <ul style={{ listStyle:"none", marginBottom:"28px" }}>
                    {p.features.map((f,j)=>(
                      <li key={j} style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", gap:"9px" }}>
                        <span style={{ color:"#D4AF37", fontWeight:700, flexShrink:0, fontSize:"12px" }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <MagBtn gold={p.featured} outline={!p.featured} onClick={()=>window.location.href=p.href}
                    style={{ width:"100%", padding:"13px", borderRadius:"13px", fontSize:"14px", fontWeight:700,
                      fontFamily:"'Syne',sans-serif", letterSpacing:"0.04em",
                      ...(p.featured?{color:"#0a0a0a",boxShadow:"0 6px 24px rgba(212,175,55,0.38)"}:{color:"rgba(255,255,255,0.55)"}) }}>
                    {p.cta}
                  </MagBtn>
                </div>
              </SR>
            ))}
          </div>

          {/* Annual pill */}
          <SR delay={200}>
            <div style={{ marginTop:"24px", textAlign:"center", background:"rgba(212,175,55,0.04)",
              border:"1px solid rgba(212,175,55,0.14)", borderRadius:"14px", padding:"16px 24px",
              animation:"borderGlow 4.5s ease infinite", maxWidth:"500px", margin:"24px auto 0" }}>
              <span style={{ color:"rgba(255,255,255,0.45)", fontSize:"13px" }}>
                Save 32% with annual billing —{" "}
                <span style={{ color:"#D4AF37", fontWeight:600 }}>$399/year</span>
                <span style={{ color:"rgba(255,255,255,0.25)" }}> · Contact us to activate</span>
              </span>
            </div>
          </SR>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ padding:"0 32px 100px", position:"relative", zIndex:2 }}>
        <div style={{ maxWidth:"940px", margin:"0 auto" }}>
          <SectionHead eyebrow="Early Feedback" title="Teams already" italic="love it" />
          <div className="three-col" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
            {[
              { q:"We used to lose track of purchase approvals constantly. TeamAutomation fixed that in literally one afternoon.", name:"Sarah K.", role:"Ops Manager, Series A startup", bg:"rgba(212,175,55,0.11)" },
              { q:"The audit trail alone is worth it. Our finance team finally stopped asking us for screenshots of approvals.", name:"Marcus T.", role:"Team Lead, 40-person agency", bg:"rgba(120,70,255,0.11)" },
              { q:"Setup was genuinely 5 minutes. Our whole approval process now lives in Slack where the work already happens.", name:"Priya N.", role:"Head of Ops, SaaS company", bg:"rgba(44,110,255,0.11)" },
            ].map((t,i)=>(
              <SR key={i} delay={i*80}>
                <div className="card-hover" style={{ background:"linear-gradient(145deg,rgba(14,14,20,0.92),rgba(7,7,12,0.97))",
                  border:"1px solid rgba(255,255,255,0.06)", borderRadius:"20px", padding:"26px 22px", height:"100%" }}>
                  <div style={{ color:"#D4AF37", letterSpacing:"2px", marginBottom:"13px", fontSize:"13px" }}>★★★★★</div>
                  <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"14px", lineHeight:1.78, marginBottom:"18px", fontStyle:"italic" }}>"{t.q}"</p>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", flexShrink:0 }}>👤</div>
                    <div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"13px", fontWeight:700 }}>{t.name}</div>
                      <div style={{ color:"rgba(255,255,255,0.28)", fontSize:"11px" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section id="faq" style={{ padding:"0 32px 100px", position:"relative", zIndex:2 }}>
        <div style={{ maxWidth:"680px", margin:"0 auto" }}>
          <SectionHead eyebrow="FAQ" title="Questions" italic="answered" center />
          {[
            ["Do I need to know how to code?","Not at all. TeamAutomation installs like any Slack app — click, authorize, done. Zero technical knowledge needed."],
            ["Does my team need to download anything?","No. Everything happens inside Slack. Your team uses the same app they already have open all day."],
            ["What's included in the free trial?","Full access to all features for 14 days. No credit card required. Cancel anytime — no questions asked."],
            ["How does the audit trail work?","Every request, approval, rejection, and delegation is logged with a timestamp and the acting user. Fully exportable as CSV."],
            ["Can I delegate approvals when I'm out of office?","Yes. Use /approve-delegate to assign a temporary approver. All requests route to them until you remove the delegation."],
            ["What happens when my trial ends?","You'll get a reminder on day 12. If you don't upgrade, the app pauses — no data is lost. Resume anytime."],
          ].map(([q,a],i)=>{
            const [open, setOpen] = useState(false);
            return (
              <div key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <button onClick={()=>setOpen(!open)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 0",
                  fontFamily:"'Syne',sans-serif", fontSize:"15px", fontWeight:600,
                  color:open?"#D4AF37":"rgba(255,255,255,0.78)", transition:"color 0.3s", textAlign:"left" }}>
                  {q}
                  <span style={{ fontSize:"20px", color:"rgba(212,175,55,0.55)", transition:"transform 0.35s cubic-bezier(0.16,1,0.3,1)", transform:open?"rotate(45deg)":"rotate(0)", flexShrink:0, marginLeft:"16px" }}>+</span>
                </button>
                <div style={{ maxHeight:open?"180px":"0", overflow:"hidden", transition:"max-height 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
                  <p style={{ color:"rgba(255,255,255,0.38)", fontSize:"14px", lineHeight:1.85, paddingBottom:"20px" }}>{a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ WAITLIST CTA (bottom — where it belongs) ══ */}
      <section id="cta" style={{ padding:"0 32px 110px", position:"relative", zIndex:2 }}>
        <SR>
          <div style={{ maxWidth:"740px", margin:"0 auto", textAlign:"center" }}>
            <div style={{
              background:"linear-gradient(150deg,rgba(20,15,6,0.98),rgba(10,8,3,0.99))",
              border:"1px solid rgba(212,175,55,0.22)", borderRadius:"30px", padding:"68px 52px",
              boxShadow:"0 50px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)",
              position:"relative", overflow:"hidden",
              animation:"borderGlow 4s ease infinite",
            }}>
              {/* Shine */}
              <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"38%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.6),transparent)" }} />
              {/* Corner glows */}
              <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"200px", height:"200px", borderRadius:"50%", background:"radial-gradient(circle,rgba(212,175,55,0.09),transparent 68%)", pointerEvents:"none" }} />
              <div style={{ position:"absolute", bottom:"-60px", left:"-60px", width:"180px", height:"180px", borderRadius:"50%", background:"radial-gradient(circle,rgba(120,70,255,0.07),transparent 68%)", pointerEvents:"none" }} />

              {/* Live badge */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:"8px",
                background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.2)",
                borderRadius:"100px", padding:"6px 16px", marginBottom:"26px" }}>
                <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 8px #22c55e" }} />
                <span style={{ color:"rgba(34,197,94,0.75)", fontSize:"11px", letterSpacing:"0.12em", textTransform:"uppercase" }}>Accepting beta users now</span>
              </div>

              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,3.8vw,48px)", fontWeight:800,
                letterSpacing:"-0.025em", lineHeight:1.1, marginBottom:"16px",
                animation:"textGlow 4.5s ease infinite" }}>
                Stop losing approvals<br />
                <span style={{ background:"linear-gradient(135deg,#D4AF37,#fff0a0 45%,#C49A20)", backgroundSize:"280% 280%",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"shimmerGold 4s ease infinite" }}>
                  in the Slack noise
                </span>
              </h2>

              <p style={{ color:"rgba(255,255,255,0.33)", fontSize:"16px", lineHeight:1.85, marginBottom:"38px", fontWeight:300, maxWidth:"480px", margin:"0 auto 38px" }}>
                Join teams already using TeamAutomation to automate approvals, eliminate follow-ups, and maintain a clean audit trail — entirely inside Slack.
              </p>

              <div style={{ display:"flex", justifyContent:"center" }}>
                <WaitlistForm />
              </div>

              {/* Trust signals */}
              <div style={{ marginTop:"28px", display:"flex", alignItems:"center", justifyContent:"center", gap:"24px", flexWrap:"wrap" }}>
                {["✓ No credit card","✓ 14-day free trial","✓ Cancel anytime"].map(s=>(
                  <span key={s} style={{ color:"rgba(255,255,255,0.2)", fontSize:"12px", letterSpacing:"0.06em" }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </SR>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.04)", padding:"36px 48px",
        position:"relative", zIndex:2, display:"flex", alignItems:"center",
        justifyContent:"space-between", flexWrap:"wrap", gap:"18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"9px" }}>
          <div style={{ width:"27px", height:"27px", borderRadius:"8px", background:"linear-gradient(135deg,#D4AF37,#8B6914)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px" }}>⚡</div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"14px", fontWeight:700 }}>Team<span style={{ color:"#D4AF37" }}>Automation</span></span>
        </div>
        <div style={{ display:"flex", gap:"24px" }}>
          {[["Privacy Policy","/privacy"],["Terms of Service","/terms"],["Contact","mailto:mahadbuilds289@gmail.com"]].map(([l,h])=>(
            <a key={l} href={h} style={{ color:"rgba(255,255,255,0.22)", fontSize:"12px", textDecoration:"none", transition:"color 0.25s" }}
              onMouseEnter={e=>e.target.style.color="#D4AF37"}
              onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.22)"}
            >{l}</a>
          ))}
        </div>
        <div style={{ color:"rgba(255,255,255,0.13)", fontSize:"11px" }}>© 2025 TeamAutomation</div>
      </footer>

    </div>
  );
}
