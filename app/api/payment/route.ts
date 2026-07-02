import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const text = await req.text();

    if (!text || text.trim().length === 0) {
      return new NextResponse(null, { status: 204 });
    }

    const body = JSON.parse(text);
    console.log(">>> Traitement du paiement pour :", body.amount);

    const { amount, customer_email } = body;

    if (!amount || !customer_email) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    // Appel FedaPay
    const response = await fetch('https://api.fedapay.com/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: body.description || "Paiement TogoMarket",
        amount: Number(amount),
        currency: { iso: "XOF" },
        customer: {
          email: customer_email,
          phone_number: body.customer_phone_number || "0000000000"
        },
        callback_url: "https://espoir-global.org/confirmation"
      })
    });

    // 🔴 CORRECTION : Lecture sécurisée de la réponse FedaPay
    const fedaPayRawText = await response.text();
    console.log(">>> Réponse brute de FedaPay :", fedaPayRawText);

    let data;
    try {
      data = fedaPayRawText ? JSON.parse(fedaPayRawText) : {};
    } catch (parseError) {
      console.error("Impossible de parser le JSON de FedaPay. Statut :", response.status);
      return NextResponse.json({ error: "FedaPay a renvoyé une réponse invalide" }, { status: 502 });
    }

    if (!response.ok) {
        console.error("Erreur retournée par FedaPay :", data);
        return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Erreur serveur globale :", error.message);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}
