import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Lire le texte brut
    const text = await req.text();
    
    // 2. Ignorer silencieusement les requêtes vides (souvent causées par des doublons)
    if (!text || text.trim() === "") {
      return NextResponse.json({ message: "Requête vide ignorée" }, { status: 200 });
    }

    // 3. Parser le JSON
    const body = JSON.parse(text);
    console.log(">>> Données valides reçues :", body);

    const { amount, customer_email, customer_phone_number, description } = body;

    // 4. Validation stricte
    if (!amount || !customer_email) {
      return NextResponse.json({ error: "Données requises manquantes" }, { status: 400 });
    }

    // 5. Appel FedaPay
    const response = await fetch('https://api.fedapay.com/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: description || "Abonnement TogoMarket",
        amount: Number(amount),
        currency: { iso: "XOF" },
        customer: {
          email: customer_email,
          phone_number: customer_phone_number || "0000000000"
        },
        callback_url: "https://espoir-global.org/confirmation"
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Erreur FedaPay :", data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    // Si ce n'est pas une requête vide, c'est une vraie erreur, on log
    console.error("Erreur critique serveur :", error);
    return NextResponse.json({ error: "Erreur lors du traitement" }, { status: 500 });
  }
}
