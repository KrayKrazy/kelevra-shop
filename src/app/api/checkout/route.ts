import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { planId, name, setupPrice, monthlyPrice } = await request.json();

    // OBSERVAÇÃO DE ARQUITETURA:
    // A API da Cakto (e da maioria dos gateways) para ASSINATURAS RECORRENTES 
    // costuma exigir que o Plano já exista previamente no Dashboard (Painel)
    // para poder gerar um Checkout associado àquele plano de recorrência.
    
    // A forma mais estável de lidar com isso é mapear o ID do plano da Cakto
    // (que o cliente cria no painel lá do Cakto) com o nosso planId interno.
    const CAKTO_PLANS: Record<string, string> = {
      'plan_cardapio': 'https://pay.cakto.com.br/CARDAPIO_LINK', 
      'plan_presenca': 'https://pay.cakto.com.br/PRESENCA_LINK',
      'plan_anti_noshow': 'https://pay.cakto.com.br/ANTINOSHOW_LINK'
    };

    const checkoutUrl = CAKTO_PLANS[planId];

    if (checkoutUrl) {
      // Retornamos o link de pagamento pré-configurado com a assinatura e a taxa de setup embutida
      return NextResponse.json({ checkoutUrl });
    } else {
      // Fallback: se quisermos tentar criar dinamicamente (para pagamentos únicos)
      // O código aqui seria similar ao Kikis Burguer (buscando token e criando Offer)
      return NextResponse.json({ error: 'Plano não configurado no Gateway.' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro na geração de checkout:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
