const fs = require('fs');
const path = require('path');

const indexPath = path.join('C:', 'mycelium', 'kelevra-shop', 'src', 'app', 'page.tsx');
let code = fs.readFileSync(indexPath, 'utf-8');

const regex = /function MapRadar\(\) \{[\s\S]*?\}\s*\n\s*\/\/\s*─── DADOS DAS SOLUÇÕES/m;

const replacement = `function MapRadar() {
  const LOCATIONS = [
    { name: 'Brasília (Plano Piloto)', x: 55, y: 45, size: 3 },
    { name: 'Taguatinga', x: 40, y: 55, size: 2.5 },
    { name: 'Valparaíso (Entorno)', x: 45, y: 92, size: 2 },
    { name: 'Planaltina', x: 65, y: 25, size: 2 },
    { name: 'Asa Norte', x: 57, y: 40, size: 2.5 },
    { name: 'SAD', x: 35, y: 65, size: 2 },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center bg-[#050507] rounded-full overflow-hidden border border-[#94a3b8]/10 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
      
      {/* Mapa do DF (Vetor Estilizado) */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid de fundo */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#94a3b8" strokeWidth="0.2" strokeOpacity="0.3" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {/* Polígono simulando o mapa do Distrito Federal (Quadrilátero Cruls) */}
        <path 
          d="M 30 15 L 75 15 L 85 45 L 80 85 L 35 85 L 20 60 L 25 35 Z" 
          fill="rgba(148,163,184,0.05)" 
          stroke="#94a3b8" 
          strokeWidth="0.5" 
          strokeDasharray="2 2"
        />
        {/* Linha representando o Entorno (Sul) */}
        <path 
          d="M 20 85 L 35 85 L 80 85 L 90 95" 
          fill="none" 
          stroke="#94a3b8" 
          strokeWidth="0.3" 
          strokeDasharray="1 3"
          strokeOpacity="0.5"
        />
        <text x="50" y="10" fill="#94a3b8" fontSize="3" textAnchor="middle" opacity="0.4" className="font-mono tracking-widest">
          SETOR: DF & ENTORNO
        </text>
      </svg>

      {/* Círculos do radar */}
      <div className="absolute inset-0 rounded-full border border-[#94a3b8]/10 animate-ping" style={{ animationDuration: '4s' }} />
      <div className="absolute inset-4 rounded-full border border-[#94a3b8]/20" />
      <div className="absolute inset-16 rounded-full border border-[#94a3b8]/10" />
      <div className="absolute inset-32 rounded-full border border-[#94a3b8]/5" />
      
      {/* Linhas cruzadas */}
      <div className="absolute w-full h-[1px] bg-[#94a3b8]/10" />
      <div className="absolute h-full w-[1px] bg-[#94a3b8]/10" />
      
      {/* Pinos (Locations) */}
      {LOCATIONS.map((loc, idx) => (
        <div 
          key={idx} 
          className="absolute flex flex-col items-center justify-center cursor-default z-20 group"
          style={{ left: \`\${loc.x}%\`, top: \`\${loc.y}%\`, transform: 'translate(-50%, -50%)' }}
        >
          <div 
            className="rounded-full bg-[#94a3b8] shadow-[0_0_15px_rgba(148,163,184,0.8)] relative z-10"
            style={{ width: \`\${loc.size * 3}px\`, height: \`\${loc.size * 3}px\` }}
          >
            <div className="absolute inset-0 rounded-full bg-[#94a3b8] animate-ping opacity-70" style={{ animationDuration: '2s' }} />
          </div>
          
          {/* Label VISÍVEL NO MOBILE e realçado no hover */}
          <div className="absolute top-full mt-2 bg-[#050507]/80 backdrop-blur-sm border border-slate-800 px-2 py-1 rounded text-[8px] md:text-[9px] text-[#94a3b8] whitespace-nowrap opacity-80 group-hover:opacity-100 group-hover:text-white group-hover:border-[#94a3b8]/50 transition-all uppercase tracking-widest pointer-events-none">
            {loc.name}
          </div>
        </div>
      ))}
      
      {/* Scanner line */}
      <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] origin-left animate-spin z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.5))', animationDuration: '4s', animationTimingFunction: 'linear' }} />
    </div>
  );
}

// ─── DADOS DAS SOLUÇÕES`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync(indexPath, code);
    console.log('MapRadar atualizado com mapa do DF, Entorno e Labels visíveis no mobile!');
} else {
    console.log('Erro: MapRadar não encontrado pela regex.');
}
