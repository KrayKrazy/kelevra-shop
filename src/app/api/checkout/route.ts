import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { planId } = await request.json();

    // MAPA DOS CHECKOUTS DA CAKTO
    const CAKTO_PLANS: Record<string, string> = {
      'plan_cardapio': 'https://pay.cakto.com.br/8793vpu', 
      'plan_presenca': 'https://pay.cakto.com.br/ktdh6pk',
      'plan_anti_noshow': 'https://pay.cakto.com.br/7iq37bs_1056712'
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
