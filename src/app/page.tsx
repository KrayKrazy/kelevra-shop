'use client';

import { useState } from 'react';

const PLANS = [
  {
    id: 'plan_cardapio',
    name: 'Cardápio Que Vende',
    setupPrice: 700,
    monthlyPrice: 300,
    color: 'from-lime-900/20 to-black border-lime-500/30 text-lime-500',
    btnColor: 'bg-lime-600 hover:bg-lime-500',
    features: [
      'Construção do Cardápio Digital Interativo',
      'Automação de Pedidos no WhatsApp',
      'Criação de QR Code de Mesa Físico',
      'Fim das taxas absurdas de aplicativos',
    ]
  },
  {
    id: 'plan_presenca',
    name: 'Presença Blindada',
    setupPrice: 800,
    monthlyPrice: 300,
    color: 'from-blue-900/30 to-black border-blue-500/30 text-blue-400',
    btnColor: 'bg-blue-600 hover:bg-blue-500',
    features: [
      'Auditoria & SEO Local',
      'Construção de Site de Conversão',
      'Automação de Avaliações',
      'Domine o Top 3 do Google Maps'
    ]
  },
  {
    id: 'plan_anti_noshow',
    name: 'Anti No-Show',
    setupPrice: 1500,
    monthlyPrice: 450,
    color: 'from-amber-900/20 to-black border-amber-500/30 text-amber-500',
    btnColor: 'bg-amber-600 hover:bg-amber-500',
    features: [
      'Sistema de Agendamento IA',
      'Integração com Gateway (Sinal)',
      'Lembretes WhatsApp Automatizados',
      'Fim dos horários vagos e prejuízos'
    ]
  }
];

export default function Home() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: typeof PLANS[0]) => {
    setLoadingPlan(plan.id);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId: plan.id, 
          name: plan.name, 
          setupPrice: plan.setupPrice, 
          monthlyPrice: plan.monthlyPrice 
        })
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || 'Erro ao gerar link de pagamento.');
      }
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-brand-primary)] text-white font-sans selection:bg-[var(--color-brand-gold)] selection:text-black pb-24">
      {/* HEADER */}
      <header className="border-b border-white/5 py-6 px-6 sticky top-0 bg-[var(--color-brand-primary)]/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-[var(--color-brand-gold)] to-slate-700 flex items-center justify-center font-serif font-bold text-black text-xl">
              K
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-widest text-white">KELEVRA PAY</h1>
              <p className="text-[10px] text-[var(--color-brand-gold)] uppercase tracking-[0.3em]">Infraestrutura Comercial</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-400">
            <a href="#solucoes" className="hover:text-white transition-colors">Soluções</a>
            <a href="#sobre" className="hover:text-white transition-colors">Sobre Nós</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-brand-gold)]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-[var(--color-brand-gold)] text-sm tracking-[0.4em] font-bold uppercase mb-6">O Futuro é Iluminado</p>
          <h2 className="font-serif text-5xl md:text-7xl font-black mb-6 leading-tight">
            BLINDE SUA MARCA.<br />
            <span className="text-gold-gradient">ESCALONE SEUS LUCROS.</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Não vendemos "postzinhos". Construímos ecossistemas de vendas altamente lucrativos para você não depender apenas de anúncios.
          </p>
          <a href="#solucoes" className="inline-flex items-center justify-center bg-[var(--color-brand-gold)] text-black px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[var(--color-brand-gold-light)] transition-colors shadow-[0_0_30px_rgba(148,163,184,0.3)]">
            Escolher Infraestrutura
          </a>
        </div>
      </section>

      {/* PRICING */}
      <section id="solucoes" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-serif text-4xl font-bold mb-4">Escolha sua Solução</h3>
            <p className="text-slate-400">Taxa de setup única para estruturação + manutenção mensal para evolução contínua.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map(plan => (
              <div key={plan.id} className={`bg-gradient-to-br ${plan.color} border rounded-2xl p-8 flex flex-col glow-box transition-transform hover:-translate-y-2`}>
                <h4 className="font-serif text-2xl font-bold mb-2 text-white">{plan.name}</h4>
                
                <div className="my-8">
                  <p className="text-sm uppercase tracking-widest font-bold mb-2 opacity-80">Setup Inicial</p>
                  <p className="font-serif text-5xl font-black text-white mb-2">R$ {plan.setupPrice}</p>
                  <p className="text-sm opacity-80">+ R$ {plan.monthlyPrice} / mês (Manutenção)</p>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <svg className="w-5 h-5 mt-0.5 opacity-80 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlan !== null}
                  className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider text-sm text-white transition-colors ${plan.btnColor} ${loadingPlan === plan.id ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {loadingPlan === plan.id ? 'Processando...' : 'Assinar Agora'}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center max-w-2xl mx-auto p-6 bg-[var(--color-brand-card)] border border-slate-800 rounded-2xl">
            <p className="text-sm text-slate-400">
              <strong className="text-[var(--color-brand-gold)]">A assinatura consome o limite do cartão?</strong><br />
              Não! Assim como um plano de academia ou Netflix, a recorrência debita apenas o valor da mensalidade (R$ 300 ou R$ 450) no mês vigente, sem bloquear o limite total do seu cartão. O Setup (Investimento Único) será cobrado na primeira fatura.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
