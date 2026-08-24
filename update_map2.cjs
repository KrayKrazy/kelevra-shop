const fs = require('fs');
const path = require('path');

const indexPath = path.join('C:', 'mycelium', 'kelevra-shop', 'src', 'app', 'page.tsx');
let code = fs.readFileSync(indexPath, 'utf-8');

const regex = /function MapRadar\(\) \{[\s\S]*?\}\s*\n\s*\/\/\s*─── DADOS DAS SOLUÇÕES/m;

const replacement = `function MapRadar() {
  const LOCATIONS = [
    { name: 'Brasília (Plano Piloto)', x: 50, y: 50, size: 3 },
    { name: 'Asa Norte', x: 50, y: 44, size: 2.5 },
    { name: 'Taguatinga', x: 35, y: 55, size: 2.5 },
    { name: 'Planaltina', x: 65, y: 35, size: 2 },
    { name: 'Valparaíso (Entorno)', x: 45, y: 80, size: 2 },
    { name: 'SAD', x: 40, y: 55, size: 2 },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center bg-[#050507] rounded-xl overflow-hidden border border-[#94a3b8]/20 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      
      {/* Imagem de Fundo (Gerada por IA - Mapa DF e Entorno) */}
      <div 
        className="absolute inset-0 w-full h-full opacity-60 bg-cover bg-center"
        style={{ backgroundImage: "url('/df_map.jpg')" }}
      />
      
      {/* Overlay escuro para dar contraste */}
      <div className="absolute inset-0 bg-[#050507]/40 mix-blend-multiply pointer-events-none" />

      {/* Círculos do radar */}
      <div className="absolute inset-0 rounded-full border border-[#94a3b8]/20 animate-ping" style={{ animationDuration: '4s' }} />
      <div className="absolute inset-4 rounded-full border border-[#94a3b8]/30" />
      <div className="absolute inset-16 rounded-full border border-[#94a3b8]/10" />
      <div className="absolute inset-32 rounded-full border border-[#94a3b8]/5" />
      
      {/* Linhas cruzadas */}
      <div className="absolute w-full h-[1px] bg-[#94a3b8]/20" />
      <div className="absolute h-full w-[1px] bg-[#94a3b8]/20" />
      
      {/* Pinos (Locations) */}
      {LOCATIONS.map((loc, idx) => (
        <div 
          key={idx} 
          className="absolute flex flex-col items-center justify-center cursor-default z-20 group"
          style={{ left: \`\${loc.x}%\`, top: \`\${loc.y}%\`, transform: 'translate(-50%, -50%)' }}
        >
          <div 
            className="rounded-full bg-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.8)] relative z-10"
            style={{ width: \`\${loc.size * 3}px\`, height: \`\${loc.size * 3}px\` }}
          >
            <div className="absolute inset-0 rounded-full bg-[#d4af37] animate-ping opacity-70" style={{ animationDuration: '2s' }} />
          </div>
          
          {/* Label sempre visível */}
          <div className="absolute top-full mt-1.5 bg-[#050507]/90 backdrop-blur-sm border border-slate-700 px-2 py-1 rounded text-[8px] md:text-[9px] text-[#cbd5e1] whitespace-nowrap opacity-90 transition-all uppercase tracking-widest pointer-events-none shadow-lg font-semibold">
            {loc.name}
          </div>
        </div>
      ))}
      
      {/* Scanner line */}
      <div className="absolute top-1/2 left-1/2 w-[150%] h-[2px] origin-left animate-spin z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4))', animationDuration: '4s', animationTimingFunction: 'linear' }} />
    </div>
  );
}

// ─── DADOS DAS SOLUÇÕES`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync(indexPath, code);
    console.log('MapRadar atualizado com a imagem fotorealista do DF!');
} else {
    console.log('Erro: MapRadar não encontrado pela regex.');
}
