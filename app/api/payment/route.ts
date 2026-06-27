import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Appel vers l'API officielle de CinetPay
    const response = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey: process.env.CINETPAY_API_KEY,
        site_id: process.env.CINETPAY_SITE_ID,
        transaction_id: Date.now().toString(),
        amount: body.amount,
        currency: "XOF",
        description: body.description,
        customer_name: body.customer_name,
        customer_surname: body.customer_surname,
        customer_email: body.customer_email,
        customer_phone_number: body.customer_phone_number,
        payment_method: body.payment_method,
        // URLs de retour et notification configurées avec votre domaine réel
        notify_url: "https://espoir-global.org/api/notify",
        return_url: "https://espoir-global.org/confirmation"
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ code: '500', message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
