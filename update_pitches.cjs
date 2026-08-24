const fs = require('fs');
const path = require('path');

const indexPath = path.join('C:', 'mycelium', 'kelevra-shop', 'src', 'app', 'page.tsx');
let code = fs.readFileSync(indexPath, 'utf-8');

const regexSolutions = /const SOLUTIONS = \[\s*\{[\s\S]*?\}\s*\];/m;

const newSolutions = `const SOLUTIONS = [
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
];`;

if (regexSolutions.test(code)) {
    code = code.replace(regexSolutions, newSolutions);
    fs.writeFileSync(indexPath, code);
    console.log('Pitches de Venda atualizados com sucesso!');
} else {
    console.log('Erro: SOLUTIONS não encontrado.');
}
