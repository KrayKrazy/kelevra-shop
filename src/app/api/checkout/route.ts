import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { planId } = await request.json();

    // MAPA DOS CHECKOUTS DA CAKTO
    // Aqui você vai colar o link do checkout que contém a combinação (Implementação + Mensalidade)
    // para cada um dos 3 serviços.
    const CAKTO_PLANS: Record<string, string> = {
      'plan_cardapio': 'COLE_AQUI_O_LINK_DO_CARDAPIO_QUE_VENDE', 
      'plan_presenca': 'COLE_AQUI_O_LINK_DA_PRESENCA_BLINDADA',
      'plan_anti_noshow': 'COLE_AQUI_O_LINK_DO_ANTI_NOSHOW'
    };

    const checkoutUrl = CAKTO_PLANS[planId];

    if (checkoutUrl && !checkoutUrl.includes('COLE_AQUI')) {
      return NextResponse.json({ checkoutUrl });
    } else {
      // Se o link ainda não foi configurado
      return NextResponse.json(
        { error: 'Link de pagamento em configuração. Tente novamente mais tarde.' }, 
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erro na geração de checkout:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
