import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Appel à l'API FedaPay
    const response = await fetch('https://api.fedapay.com/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`, // Ta clé sk_...
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: body.description || "Abonnement TogoMarket",
        amount: Number(body.amount),
        currency: { iso: "XOF" },
        customer: {
          email: body.customer_email,
          phone_number: body.customer_phone_number
        },
        callback_url: "https://espoir-global.org/confirmation"
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
