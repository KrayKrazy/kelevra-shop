"use client";

import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      business: formData.get("business"),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const { eventId } = await res.json();
        setStatus("success");

        // Client-side Lead event — same eventId as server for deduplication
        // Meta will count this as ONE lead (browser + CAPI together)
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "Lead", {}, { eventID: eventId });
        }
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column - Copy & Social Proof */}
        <div className="space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold tracking-wide">
            Protocolo Presença Blindada
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
            Sua empresa está <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">invisível</span> no celular dos seus clientes?
          </h1>
          
          <p className="text-lg text-zinc-400 leading-relaxed">
            Seu cliente pesquisa por seu serviço agora no Google. Se você não está no Top 3, você está dando dinheiro de presente para o seu concorrente.
          </p>

          {/* Social Proof Box */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/20"></div>
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Caso de Sucesso: La Chicra Café</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold text-zinc-100">9.459</p>
                <p className="text-sm text-zinc-400">Visualizações em 30 dias</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-400">Top 3</p>
                <p className="text-sm text-zinc-400">Posição no Google Maps</p>
              </div>
            </div>
            <p className="text-sm text-zinc-500 mt-4 italic">"Foram quase 500 interações orgânicas na rota e telefone. Sem gastar 1 real com anúncios no Google."</p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl relative">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-100 mb-2">Auditoria Gratuita</h2>
            <p className="text-zinc-400 text-sm">Preencha os dados abaixo e descubra o que está travando o crescimento da sua empresa no Google.</p>
          </div>

          {status === "success" ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
              <h3 className="text-lg font-bold text-emerald-400 mb-2">Auditoria Solicitada!</h3>
              <p className="text-zinc-400 text-sm">Nossa equipe vai analisar o seu perfil e te chamar no WhatsApp nas próximas horas.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-1.5">Seu Nome</label>
                <input required type="text" name="name" id="name" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all" placeholder="Como devemos te chamar?" />
              </div>
              
              <div>
                <label htmlFor="business" className="block text-sm font-medium text-zinc-400 mb-1.5">Nome da Empresa</label>
                <input required type="text" name="business" id="business" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all" placeholder="Ex: Vidraçaria Brasília" />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-400 mb-1.5">WhatsApp</label>
                <input required type="tel" name="phone" id="phone" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all" placeholder="(61) 99999-9999" />
              </div>

              <button 
                disabled={status === "loading"}
                type="submit" 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-lg rounded-xl px-4 py-4 mt-4 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]"
              >
                {status === "loading" ? "Enviando..." : "Receber Auditoria Gratuita"}
              </button>
            </form>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-zinc-900 mt-12 py-8 text-center text-sm text-zinc-600">
        <p>&copy; 2026 Kelevra Corp. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
