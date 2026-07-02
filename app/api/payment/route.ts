
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Lecture directe et unique
    const body = await req.json();
    console.log("Données reçues :", body);

    // Extraction sécurisée
    const amount = body.amount;
    const customer_email = body.customer_email;

    if (!amount || !customer_email) {
      return NextResponse.json({ error: "Données incomplètes" }, { status: 400 });
    }

    // Appel FedaPay
    const response = await fetch('https://api.fedapay.com/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: body.description || "Paiement",
        amount: Number(amount),
        currency: { iso: "XOF" },
        customer: {
          email: customer_email,
          phone_number: body.customer_phone_number || "0000000000"
        }
      })
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Erreur fatale :", error);
    return NextResponse.json({ error: "Erreur lors du traitement JSON" }, { status: 400 });
  }
}
