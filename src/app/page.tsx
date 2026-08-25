'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── CURSOR PERSONALIZADO DE LUXO ──────────────────────────────────────────
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
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-[#94a3b8] pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-[#94a3b8]/60 pointer-events-none z-[9998] transition-transform duration-75"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}

// ─── CONSTELAÇÃO ANIMADA ───────────────────────────────────────────────────
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

      stars.forEach(s => {
        s.x = s.baseX + Math.sin(t * s.speed + s.phase) * 18 + (mx - W / 2) * 0.015;
        s.y = s.baseY + Math.cos(t * s.speed * 0.7 + s.phase) * 12 + (my - H / 2) * 0.015;
        if (s.x < 0) { s.x += W; s.baseX += W; }
        if (s.x > W) { s.x -= W; s.baseX -= W; }
        if (s.y < 0) { s.y += H; s.baseY += H; }
        if (s.y > H) { s.y -= H; s.baseY -= H; }
      });

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
        ctx.beginPath();
        ctx.arc(stars[i].x, stars[i].y, stars[i].r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,184,${Math.random() * 0.5 + 0.5})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
    />
  );
}

// ─── TERMINAL INTERATIVO DE ATUAÇÃO ──────────────────────────────────────────
function NetworkCoverage() {
  const [activeNode, setActiveNode] = useState(0);
  const nodes = [
    { id: 'bsb', name: 'Goiás (Plano Piloto)', status: 'MONITORAMENTO ATIVO', metrics: 'Otimização GMB' },
    { id: 'tag', name: 'Taguatinga', status: 'MÁQUINA DE VENDAS', metrics: 'Automação WPP' },
    { id: 'val', name: 'Valparaíso (Entorno)', status: 'BLINDADO', metrics: 'Sistema Anti No-Show' },
    { id: 'pla', name: 'Planaltina', status: 'MONITORAMENTO ATIVO', metrics: 'Posicionamento Local' },
    { id: 'asn', name: 'Asa Norte', status: 'MÁQUINA DE VENDAS', metrics: 'Otimização GMB' },
    { id: 'sad', name: 'SAD (S.A. do Descoberto)', status: 'BLINDADO', metrics: 'Automação WPP' },
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setActiveNode(prev => (prev + 1) % nodes.length);
    }, 3500);
    return () => clearInterval(t);
  }, [nodes.length]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col md:flex-row gap-4 bg-[#08090d] border border-[#1e293b] p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <div className="flex flex-col gap-2 w-full md:w-1/2">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#64748b] mb-2 px-2">
          {"Nós Operacionais //"}
        </p>
        {nodes.map((node, i) => (
          <div 
            key={node.id} 
            onClick={() => setActiveNode(i)}
            className={`p-3 flex justify-between items-center cursor-pointer transition-all border rounded-lg
              ${activeNode === i 
                ? 'border-[#94a3b8] bg-[#94a3b8]/10' 
                : 'border-transparent hover:border-[#1e293b] hover:bg-[#1e293b]/30'}`}
          >
            <span className={`font-mono text-xs md:text-sm ${activeNode === i ? 'text-white font-bold' : 'text-slate-400'}`}>
              {node.name}
            </span>
            {activeNode === i && <span className="w-2 h-2 rounded-full bg-[#94a3b8] animate-pulse" />}
          </div>
        ))}
      </div>

      <div className="flex-1 bg-[#020203] border border-[#1e293b] rounded-lg p-5 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #94a3b8 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="font-mono text-[9px] uppercase tracking-widest text-[#94a3b8] mb-6 flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Terminal de Monitoramento
          </div>
          <div className="space-y-5 font-mono">
            <div>
              <div className="text-slate-500 text-[10px] mb-1">LOCALIDADE</div>
              <div className="text-white text-lg md:text-xl font-bold">{nodes[activeNode].name}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px] mb-1">STATUS DE COBERTURA</div>
              <div className="text-emerald-400 text-xs tracking-wider flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {nodes[activeNode].status}
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px] mb-1">SOLUÇÃO ATIVA</div>
              <div className="text-[#94a3b8] text-sm uppercase">{nodes[activeNode].metrics}</div>
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-6 pt-4 border-t border-[#1e293b]">
          <div className="text-slate-600 text-[9px] mb-2">TRÁFEGO EM TEMPO REAL</div>
          <div className="flex gap-[2px] items-end h-8">
            {Array.from({length: 30}).map((_, i) => {
              const height = ((i * 17 + activeNode * 13) % 100);
              return (
                <div 
                  key={i} 
                  className="flex-1 bg-[#94a3b8]/30 hover:bg-[#94a3b8] transition-colors"
                  style={{ height: `${Math.max(20, height)}%` }} 
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DADOS DAS SOLUÇÕES ────────────────────────────────────────────────────
const SOLUTIONS = [
  {
    id: 'sol_cardapio',
    name: 'Sistema Cardápio Que Vende™',
    badge: '🍕 Restaurantes & Delivery',
    desc: 'Transforme seu WhatsApp em uma máquina de vendas autônoma. Livre-se das taxas abusivas dos aplicativos com uma estrutura própria.',
    features: [
      'Zero comissão no iFood: lucre 100% de cada pedido',
      'Cardápio Digital com gatilhos de conversão',
      'Atendimento IA instantâneo no WhatsApp 24/7',
      'QR Code de mesa integrado para autosserviço',
    ],
  },
  {
    id: 'sol_noshow',
    name: 'Sistema Anti No-Show™',
    badge: '✂️ Clínicas & Salões',
    featured: true,
    desc: 'Blindamos a sua agenda. Nossa IA cobra sinais financeiros e envia lembretes para aniquilar as faltas e maximizar seu faturamento.',
    features: [
      'Gatilhos automáticos de sinal financeiro via Pix',
      'Lembretes autônomos humanizados via WhatsApp',
      'Reagendamento inteligente sem esforço manual',
      'Fim dos horários vagos e perda de receita',
    ],
  },
  {
    id: 'sol_presenca',
    name: 'Protocolo Presença Blindada™',
    badge: '📍 Negócios Locais',
    desc: 'Domine a sua região. 100% do tráfego orgânico capturado para o seu negócio quando o cliente pesquisar no Google.',
    features: [
      'Efeito Máquina de Vendas: +24.000 visualizações orgânicas',
      'Funil Automático de Avaliações 5 Estrelas',
      'Otimização Extrema de SEO Local (Google Maps)',
      'Atração passiva de clientes de alta intenção',
    ],
  }
];

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsApp = useCallback(() => {
    window.location.href = 'https://api.whatsapp.com/send/?phone=5561981849873&text=Olá%21+Gostaria+de+um+diagnóstico+gratuito+da+Kelevra+Corp+para+o+meu+negócio.&type=phone_number&app_absent=0';
  }, []);

  return (
    <main className="min-h-screen bg-[#050507] text-slate-200 selection:bg-[#94a3b8] selection:text-black overflow-x-hidden">

      <div className="hidden md:block">
        <LuxuryCursor />
      </div>

      <header
        className={`absolute top-0 w-full px-6 md:px-8 py-6 md:py-8 flex justify-between items-center z-50 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <div className="font-serif text-xl md:text-2xl font-bold text-metallic tracking-tight">
          |Kelevra corp.
        </div>
        <div className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-[#94a3b8] opacity-70 cursor-pointer hover:text-white transition-colors" onClick={handleWhatsApp}>
          {"Solicitar Diagnóstico"}
        </div>
      </header>

      {/* HERO INSTITUCIONAL */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex flex-col justify-center items-center px-6 text-center pt-24 md:pt-32 pb-10 md:pb-16 overflow-hidden">
        <ConstellationCanvas />

        <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
          <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full border border-[#94a3b8]/10" />
          <div className="absolute w-[400px] h-[400px] md:w-[800px] md:h-[800px] rounded-full border border-[#94a3b8]/5" />
        </div>

        <div
          className={`relative z-10 max-w-4xl mx-auto transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <p className="text-[#94a3b8] text-[10px] md:text-xs tracking-[0.35em] md:tracking-[0.4em] font-semibold uppercase mb-4 md:mb-6 opacity-80">
            {"A ACELERAÇÃO DIGITAL DEFINITIVA PARA GOIÂNIA, BRASÍLIA E ENTORNO"}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight tracking-tight">
            {"Transformamos Empresas Físicas em "} <br className="hidden md:block" />
            <span className="text-metallic">{"Operações Invisíveis e Lucrativas."}</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-10">
            {"A Kelevra Corp não vende software de prateleira. Nós entramos na sua operação, diagnosticamos os gargalos e implementamos a tecnologia de Inteligência Artificial exata para você escalar com segurança."}
          </p>
          
          <button
            onClick={handleWhatsApp}
            data-hover
            className="px-8 py-4 border border-[#94a3b8]/40 bg-transparent text-[#94a3b8] font-bold text-xs uppercase tracking-widest hover:bg-[#94a3b8] hover:text-[#050507] transition-all duration-300 mx-auto"
          >
            {"Agendar Diagnóstico Gratuito"}
          </button>
        </div>
      </section>

      {/* MANIFESTO INSTITUCIONAL - A HISTÓRIA (NOVA SEÇÃO) */}
      <section className={`relative px-6 py-20 md:py-32 bg-[#0a0b10] border-t border-slate-900 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#94a3b8]/30 to-transparent" />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
            <span className="w-8 h-[1px] bg-[#d4af37]" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-bold">Nossa História</p>
            <span className="w-8 h-[1px] bg-[#d4af37]" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-10 leading-tight text-center md:text-left">
            {"Nascida da vivência real, para proteger o seu negócio."}
          </h2>
          
          <div className="space-y-6 text-slate-400 font-light text-base md:text-lg leading-relaxed">
            <p>
              {"A Kelevra Corp nasceu de anos nos bastidores, lado a lado com empresários. Ao entender as dores diárias de quem tem a coragem de empreender no Brasil, focamos nossas operações em Goiânia e todo o Entorno, observando uma injustiça silenciosa destruir o comércio local."}
            </p>
            <p>
              {"Víamos donos de restaurantes, clínicas e salões trabalhando 14 horas por dia. Empreendedores suando para entregar o melhor serviço, mas que no fim do mês, deixavam todo o seu lucro na mesa para pagar taxas abusivas de aplicativos de delivery ou perdiam milhares de reais com clientes que agendavam e simplesmente não apareciam."}
            </p>
            <p className="text-white font-medium">
              {"O nosso objetivo se tornou claro: Armar o pequeno empresário com a mesma Inteligência Artificial e Automação que os gigantes usam."}
            </p>
            <p>
              {"Nós decidimos que a tecnologia não deveria ser um bicho de sete cabeças reservado apenas para as mega corporações. Criamos um ecossistema onde você foca naquilo que faz de melhor — o seu produto e o seu serviço — enquanto as nossas máquinas invisíveis trabalham 24 horas por dia para atrair clientes, fechar vendas no WhatsApp, cobrar sinais financeiros e blindar a sua agenda."}
            </p>
            <p>
              {"Sem jargões técnicos para te confundir. Sem plataformas onde você precisa aprender a programar. Nós assumimos a sua operação tecnológica de ponta a ponta. Porque no final das contas, o herói da história é você. Nós somos apenas a armadura."}
            </p>
          </div>
          
          <div className="mt-12 flex justify-center md:justify-start">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-full border border-slate-700 bg-[#050507] flex items-center justify-center overflow-hidden">
                 <svg className="w-5 h-5 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
               </div>
               <div>
                 <p className="text-white font-bold text-sm">{"Solano"}</p>
                 <p className="text-[#94a3b8] text-[10px] uppercase tracking-widest">{"Fundador, Kelevra Corp."}</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* CASOS DE USO / SOLUÇÕES */}
      <section className="px-4 md:px-6 py-16 md:py-32 relative z-10 bg-[#050507]">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">{"Como resolvemos os seus gargalos"}</h2>
          <p className="text-slate-400 font-light max-w-xl mx-auto">{"Soluções modulares, implementadas 100% pelo nosso time técnico, sem que você precise tocar em uma linha de código."}</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {SOLUTIONS.map((sol, idx) => (
            <div
              key={sol.id}
              className={`group relative flex flex-col transition-all duration-500
                ${sol.featured
                  ? 'bg-[#0a0b10] border border-[#94a3b8]/50 shadow-[0_0_40px_rgba(148,163,184,0.08)]'
                  : 'bg-[#0a0b10] border border-slate-800/60 hover:border-[#94a3b8]/40'
                }
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${300 + idx * 120}ms` }}
            >
              {sol.featured && (
                <div className="absolute -top-px left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#94a3b8]/70 to-transparent" />
              )}

              <div className="absolute inset-0 bg-gradient-to-br from-[#94a3b8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 p-7 md:p-10 flex flex-col flex-1">
                <p className="text-[10px] uppercase tracking-widest text-[#64748b] mb-4 font-medium">
                  {sol.badge}
                </p>

                <h3 className="font-serif text-xl md:text-2xl font-bold mb-4 text-white leading-snug">
                  {sol.name}
                </h3>
                
                <p className="text-sm text-slate-400 mb-8 font-light leading-relaxed flex-1">
                  {sol.desc}
                </p>

                <ul className="space-y-4 mb-10 md:mb-12">
                  {sol.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300 font-light">
                      <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleWhatsApp}
                  data-hover
                  className={`relative w-full py-4 font-semibold text-xs uppercase tracking-widest transition-all duration-300
                    ${sol.featured
                      ? 'bg-[#94a3b8] text-[#050507] hover:bg-[#cbd5e1]'
                      : 'border border-[#94a3b8]/40 bg-transparent text-[#94a3b8] hover:bg-[#94a3b8] hover:text-[#050507]'
                    }
                  `}
                >
                  {"Falar com Especialista"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MANIFESTO / TERMINAL DE COBERTURA */}
      <section className={`border-y border-slate-900 px-6 py-20 md:py-32 bg-[#08090d] transition-all duration-700 delay-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#94a3b8] mb-6 opacity-70">
              {"INFRAESTRUTURA DE ATUAÇÃO"}
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {"O foco não é a ferramenta."} <br/>{"É a máquina de vendas."}
            </h2>
            <p className="text-slate-400 font-light mb-6 leading-relaxed">
              {"Diferente de sistemas de prateleira onde você assina, recebe um login e precisa descobrir sozinho como usar, nós operamos como seu parceiro estratégico de tecnologia."}
            </p>
            <p className="text-slate-400 font-light leading-relaxed">
              {"Atuamos na linha de frente em todo o Distrito Federal e Entorno. Nossos sistemas monitoram e blindam a operação dos nossos parceiros 24 horas por dia."}
            </p>
          </div>
          
          <div className="flex-1 w-full">
            <NetworkCoverage />
          </div>
        </div>
      </section>

      {/* RESULTADOS */}
      <section className="px-6 py-20 md:py-32 bg-[#050507]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-white mb-16">{"Resultados Reais 100% Orgânicos."}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div>
              <p className="font-serif text-4xl md:text-5xl font-bold text-metallic mb-2">{"24.336"}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">{"Visualizações no Google"}</p>
            </div>
            <div>
              <p className="font-serif text-4xl md:text-5xl font-bold text-metallic mb-2">{"4.724"}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">{"Cliques e Interações Geradas"}</p>
            </div>
            <div>
              <p className="font-serif text-4xl md:text-5xl font-bold text-metallic mb-2">{"+400"}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">{"Avaliações 5 Estrelas Retidas"}</p>
            </div>
            <div>
              <p className="font-serif text-4xl md:text-5xl font-bold text-metallic mb-2">{"14"}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">{"Negócios Locais Transformados"}</p>
            </div>
          </div>
          <p className="mt-12 text-sm text-slate-600 font-light max-w-2xl mx-auto">
            {"* Dados de desempenho consolidados extraídos diretamente das plataformas oficiais Google das empresas sob gestão da Kelevra Corp."}
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 px-6 py-12 md:py-16 text-center">
        <p className="font-serif text-xl font-bold text-white mb-4">{"|Kelevra corp."}</p>
        <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-8">{"Tecnologia para pequenos negócios físicos"}</p>
        <p className="text-xs text-slate-700">{"© 2026 Kelevra Corp. Todos os direitos reservados."}</p>
      </footer>
    </main>
  );
}
