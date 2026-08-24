const fs = require('fs');

// 1. Corrigir o page.tsx
let content = fs.readFileSync('C:/mycelium/kelevra-shop/src/app/page.tsx', 'utf8');
let fixed = Buffer.from(content, 'latin1').toString('utf8');

// Mudar SAD
fixed = fixed.replace(
  "{ id: 'sad', name: 'SAD', status: 'BLINDADO', metrics: 'Automação WPP' }",
  "{ id: 'sad', name: 'SAD (Santo Antônio do Descoberto)', status: 'BLINDADO', metrics: 'Automação WPP' }"
);

fs.writeFileSync('C:/mycelium/kelevra-shop/src/app/page.tsx', fixed, 'utf8');
console.log('page.tsx corrigido!');

// 2. Criar a pasta de pitches
const pitchDir = 'C:/mycelium/pitch';
if (!fs.existsSync(pitchDir)) {
  fs.mkdirSync(pitchDir, { recursive: true });
}

// 3. Salvar os 3 pitches
const p1 = `### Sistema Cardápio Que Vende™
**Público:** Restaurantes & Delivery
**Pitch:** Transforme seu WhatsApp em uma máquina de vendas autônoma. Livre-se das taxas abusivas dos aplicativos com uma estrutura própria.
**Benefícios:**
- Zero comissão no iFood: lucre 100% de cada pedido
- Cardápio Digital com gatilhos de conversão
- Atendimento IA instantâneo no WhatsApp 24/7
- QR Code de mesa integrado para autosserviço`;

const p2 = `### Sistema Anti No-Show™
**Público:** Clínicas & Salões
**Pitch:** Blindamos a sua agenda. Nossa IA cobra sinais financeiros e envia lembretes para aniquilar as faltas e maximizar seu faturamento.
**Benefícios:**
- Gatilhos automáticos de sinal financeiro via Pix
- Lembretes autônomos humanizados via WhatsApp
- Reagendamento inteligente sem esforço manual
- Fim dos horários vagos e perda de receita`;

const p3 = `### Protocolo Presença Blindada™
**Público:** Negócios Locais
**Pitch:** Domine a sua região. 100% do tráfego orgânico capturado para o seu negócio quando o cliente pesquisar no Google.
**Benefícios:**
- Efeito Máquina de Vendas: +24.000 visualizações orgânicas
- Funil Automático de Avaliações 5 Estrelas
- Otimização Extrema de SEO Local (Google Maps)
- Atração passiva de clientes de alta intenção`;

fs.writeFileSync(pitchDir + '/pitch_cardapio.md', p1, 'utf8');
fs.writeFileSync(pitchDir + '/pitch_noshow.md', p2, 'utf8');
fs.writeFileSync(pitchDir + '/pitch_presenca.md', p3, 'utf8');
console.log('Pitches criados com sucesso!');
