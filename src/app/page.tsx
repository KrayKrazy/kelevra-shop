'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── CURSOR PERSONALIZADO DE LUXO ────────────────────────────────────────────
function LuxuryCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const trailPosRef = useRef({ x: -100, y: -100 });
  const isHoveringRef = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    const onEnter = () => { isHoveringRef.current = true; };
    const onLeave = () => { isHoveringRef.current = false; };

    window.addEventListener('mousemove', onMove);

    const interactives = document.querySelectorAll('button, a, [data-hover]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    let rafId: number;
    const animate = () => {
      const cur = cursorRef.current;
      const trail = trailRef.current;
      if (!cur || !trail) { rafId = requestAnimationFrame(animate); return; }

      // Trail lags behind
      trailPosRef.current.x += (posRef.current.x - trailPosRef.current.x) * 0.12;
      trailPosRef.current.y += (posRef.current.y - trailPosRef.current.y) * 0.12;

      cur.style.transform = `translate(${posRef.current.x - 8}px, ${posRef.current.y - 8}px) scale(${isHoveringRef.current ? 2 : 1})`;
      trail.style.transform = `translate(${trailPosRef.current.x - 20}px, ${trailPosRef.current.y - 20}px) scale(${isHoveringRef.current ? 1.5 : 1})`;

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Dot principal */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-[#94a3b8] pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100"
        style={{ willChange: 'transform' }}
      />
      {/* Anel seguidor */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-[#94a3b8]/60 pointer-events-none z-[9998] transition-transform duration-75"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}

// ─── CONSTELAÇÃO ANIMADA ──────────────────────────────────────────────────────
function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', onResize);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener('mousemove', onMouse);

    // Generate stars
    const STAR_COUNT = 70;
    const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      baseX: 0,
      baseY: 0,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.5 + 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.3 + 0.1,
    }));
    stars.forEach(s => { s.baseX = s.x; s.baseY = s.y; });

    const CONNECTION_DIST = 130;
    let t = 0;
    let rafId: number;

    const draw = () => {
      t += 0.005;
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x || W / 2;
      const my = mouseRef.current.y || H / 2;

      // Update star positions (gentle float + mouse parallax)
      stars.forEach(s => {
        s.x = s.baseX + Math.sin(t * s.speed + s.phase) * 18 + (mx - W / 2) * 0.015;
        s.y = s.baseY + Math.cos(t * s.speed * 0.7 + s.phase) * 12 + (my - H / 2) * 0.015;
        // Wrap
        if (s.x < 0) { s.x += W; s.baseX += W; }
        if (s.x > W) { s.x -= W; s.baseX -= W; }
        if (s.y < 0) { s.y += H; s.baseY += H; }
        if (s.y > H) { s.y -= H; s.baseY -= H; }
      });

      // Draw connections
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(148,163,184,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw stars
      stars.forEach(s => {
        const pulse = 0.7 + 0.3 * Math.sin(t * 2 + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(203,213,225,${0.5 + 0.5 * pulse})`;
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ─── PLANOS ───────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'plan_cardapio',
    name: 'Sistema Cardápio Que Vende™',
    badge: '🍕 Para Restaurantes & Delivery',
    setupPrice: 700,
    monthlyPrice: 300,
    checkoutUrl: 'https://pay.cakto.com.br/8793vpu',
    features: [
      'Cardápio Digital Interativo',
      'Automação de pedidos no WhatsApp',
      'QR Code de mesa físico impresso',
      'Fim das taxas de aplicativos (0%)',
      'Implementação 100% feita por nós',
    ],
  },
  {
    id: 'plan_presenca',
    name: 'Protocolo Presença Blindada™',
    badge: '📍 Para Negócios Locais & Serviços',
    setupPrice: 800,
    monthlyPrice: 300,
    featured: true,
    checkoutUrl: 'https://pay.cakto.com.br/ktdh6pk',
    features: [
      'Auditoria & SEO Local Completo',
      'Site de Alta Conversão (< 1s)',
      'Automação de Avaliações Google',
      'Domínio Top 3 do Google Maps',
      'Implementação 100% feita por nós',
    ],
  },
  {
    id: 'plan_anti_noshow',
    name: 'Protocolo Anti No-Show™',
    badge: '⭐ Mais Escolhido | Clínicas & Estética',
    setupPrice: 1500,
    monthlyPrice: 450,
    checkoutUrl: 'https://pay.cakto.com.br/7iq37bs_1056712',
    features: [
      'Sistema de Agendamento com IA',
      'Sinal financeiro obrigatório (Pix)',
      'Lembretes automáticos no WhatsApp',
      'Eliminação de 85% dos no-shows',
      'Implementação 100% feita por nós',
    ],
  },
];

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function Home() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = useCallback((plan: typeof PLANS[0]) => {
    if (loadingPlan) return;
    setLoadingPlan(plan.id);
    setTimeout(() => {
      window.location.href = plan.checkoutUrl;
    }, 400);
  }, [loadingPlan]);

  return (
    <main className="min-h-screen bg-[#050507] text-slate-200 selection:bg-[#94a3b8] selection:text-black overflow-x-hidden">

      {/* Cursor de luxo — apenas desktop */}
      <div className="hidden md:block">
        <LuxuryCursor />
      </div>

      {/* HEADER */}
      <header
        className={`absolute top-0 w-full px-6 md:px-8 py-6 md:py-8 flex justify-between items-center z-50 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <div className="font-serif text-xl md:text-2xl font-bold text-metallic tracking-tight">
          |Kelevra corp.
        </div>
        <div className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-[#94a3b8] opacity-70">
          Infraestrutura Segura
        </div>
      </header>

      {/* HERO COM CONSTELAÇÃO ANIMADA */}
      <section className="relative min-h-[55vh] md:min-h-[60vh] flex flex-col justify-center items-center px-6 text-center pt-24 md:pt-32 pb-10 md:pb-16 overflow-hidden">
        <ConstellationCanvas />

        {/* Rings decorativos estáticos atrás */}
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
          <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full border border-[#94a3b8]/10" />
          <div className="absolute w-[400px] h-[400px] md:w-[800px] md:h-[800px] rounded-full border border-[#94a3b8]/5" />
        </div>

        <div
          className={`relative z-10 max-w-4xl mx-auto transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <p className="text-[#94a3b8] text-[10px] md:text-xs tracking-[0.35em] md:tracking-[0.4em] font-semibold uppercase mb-4 md:mb-6 opacity-80">
            CONTRATAÇÃO OFICIAL • ETAPA FINAL
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8 leading-tight tracking-tight">
            Ative a Inteligência<br />
            <span className="text-metallic">Artificial do Seu Negócio.</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Selecione o plano acordado com nosso especialista. Implementação 100% realizada pelo nosso time técnico — sistema no ar em até <strong className="text-slate-300 font-medium">72 horas</strong>.
          </p>
        </div>
      </section>

      {/* CARDS */}
      <section className="px-4 md:px-6 pb-16 md:pb-32 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {PLANS.map((plan, idx) => (
            <div
              key={plan.id}
              className={`group relative flex flex-col transition-all duration-500
                ${plan.featured
                  ? 'bg-[#0a0b10] border border-[#94a3b8]/50 shadow-[0_0_40px_rgba(148,163,184,0.08)]'
                  : 'bg-[#0a0b10] border border-slate-800/60 hover:border-[#94a3b8]/40'
                }
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${300 + idx * 120}ms` }}
            >
              {plan.featured && (
                <div className="absolute -top-px left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#94a3b8]/70 to-transparent" />
              )}

              {/* Glow hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#94a3b8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 p-7 md:p-10 flex flex-col flex-1">
                {/* Badge segmentação */}
                <p className="text-[10px] uppercase tracking-widest text-[#64748b] mb-4 font-medium">
                  {plan.badge}
                </p>

                <h3 className="font-serif text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white leading-snug">
                  {plan.name}
                </h3>

                {/* Preço */}
                <div className="mb-8 md:mb-10 pb-8 md:pb-10 border-b border-slate-800/80">
                  <p className="text-[10px] uppercase tracking-widest text-[#94a3b8] mb-2">
                    Taxa de Implementação
                  </p>
                  <p className="font-serif text-4xl md:text-5xl font-bold text-metallic">
                    R$ {plan.setupPrice.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-slate-500 mt-2 font-light">
                    + R$ {plan.monthlyPrice}/mês · Sem fidelidade
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10 md:mb-12 flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300 font-light">
                      <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlan !== null}
                  data-hover
                  className={`relative w-full py-4 font-semibold text-xs uppercase tracking-widest transition-all duration-300 disabled:cursor-wait
                    ${plan.featured
                      ? 'bg-[#94a3b8] text-[#050507] hover:bg-[#cbd5e1] disabled:opacity-70'
                      : 'border border-[#94a3b8]/40 bg-transparent text-[#94a3b8] hover:bg-[#94a3b8] hover:text-[#050507] disabled:opacity-50'
                    }
                  `}
                >
                  {loadingPlan === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Preparando link seguro...
                    </span>
                  ) : 'Ativar Sistema Agora →'}
                </button>

                <p className="mt-3 text-center text-[10px] text-slate-600">
                  🔒 Checkout seguro via Cakto · Sem fidelidade
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section
        className={`border-t border-slate-900 px-6 py-16 md:py-24 transition-all duration-700 delay-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#94a3b8] mb-8 opacity-70">
            Processo de Implementação
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-left">
            {[
              { step: '01', title: 'Você Escolhe o Plano', desc: 'Seleciona a infraestrutura acordada na conversa com o especialista e confirma via checkout seguro.' },
              { step: '02', title: 'Nossa Equipe Entra em Contato', desc: 'Em até 30 minutos, um técnico da Kelevra inicia o processo de configuração e coleta os dados necessários.' },
              { step: '03', title: 'Sistema no Ar', desc: 'Em até 72 horas, sua infraestrutura está ativa, testada e você começa a usar imediatamente.' },
            ].map(item => (
              <div key={item.step} className="flex gap-5">
                <span className="font-serif text-4xl font-bold text-metallic opacity-40 shrink-0 leading-none">
                  {item.step}
                </span>
                <div>
                  <h4 className="font-semibold text-white mb-2 text-sm">{item.title}</h4>
                  <p className="text-slate-500 text-xs font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GARANTIA */}
      <section className="px-6 py-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center border border-slate-800/60 p-8 md:p-12 bg-[#0a0b10]">
          <p className="text-3xl mb-4">🛡️</p>
          <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-3">
            Garantia Incondicional de 7 Dias
          </h3>
          <p className="text-slate-400 text-sm font-light leading-relaxed">
            Se em até 7 dias corridos após a implementação você não estiver satisfeito com os resultados, devolvemos 100% do valor da taxa de implementação. Sem burocracia, sem questionamentos.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 py-10 md:py-12 px-6 text-center text-[11px] text-slate-600 font-light tracking-wide space-y-2">
        <p className="text-metallic font-serif text-base mb-4">|Kelevra corp.</p>
        <p>© {new Date().getFullYear()} Kelevra Corp. Todos os direitos reservados.</p>
        <p>Ambiente protegido e criptografado via SSL · Pagamentos processados pela Cakto</p>
        <p className="mt-4 pt-4 border-t border-slate-900">
          <a href="https://wa.me/5561981849873" target="_blank" rel="noopener noreferrer" data-hover className="text-[#94a3b8] hover:text-white transition-colors">
            📲 Dúvidas? Fale com seu consultor no WhatsApp
          </a>
        </p>
      </footer>

      {/* MOBILE: CTA FIXO NO FUNDO */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#050507]/95 backdrop-blur-sm border-t border-slate-800/60 p-4">
        <a
          href="https://wa.me/5561981849873"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#94a3b8] text-[#050507] font-semibold text-xs uppercase tracking-widest"
        >
          📲 Falar com Consultor no WhatsApp
        </a>
      </div>
    </main>
  );
}
