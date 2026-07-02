import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const text = await req.text();

    // 1. Éviter le crash sur les requêtes vides
    if (!text || text.trim().length === 0) {
      return new NextResponse(null, { status: 204 });
    }

    const body = JSON.parse(text);
    console.log(">>> Traitement du paiement pour :", body.amount);

    const { amount, customer_email, customer_phone_number, description } = body;

    if (!amount || !customer_email) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const secretKey = process.env.FEDAPAY_SECRET_KEY;
    if (!secretKey) {
      console.error(">>> ERREUR : La variable FEDAPAY_SECRET_KEY est introuvable !");
      return NextResponse.json({ error: "Clé API manquante sur le serveur" }, { status: 500 });
    }

    // 2. Requête vers FedaPay avec la structure attendue
    const response = await fetch('https://api.fedapay.com/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: description || "Paiement TogoMarket",
        amount: Number(amount),
        currency: { iso: "XOF" },
        callback_url: "https://espoir-global.org/confirmation",
        customer: {
          firstname: body.customer_surname || "Donateur",
          lastname: body.customer_name || "Anonyme",
          email: customer_email,
          phone_number: {
            number: customer_phone_number || "00000000",
            country: "tg"
          }
        }
      })
    });

    const fedaPayRawText = await response.text();
    console.log(`>>> FedaPay a répondu avec le statut : ${response.status}`);

    let data;
    try {
      data = fedaPayRawText ? JSON.parse(fedaPayRawText) : {};
    } catch (parseError) {
      return NextResponse.json({ error: "FedaPay a renvoyé une réponse illisible" }, { status: 502 });
    }

    if (!response.ok) {
        console.error("Erreur retournée par FedaPay :", data);
        return NextResponse.json(data, { status: response.status });
    }

    // 3. Extraction et normalisation de l'URL pour le Frontend
    const transactionData = data["v1/transaction"] || data;
    const redirectUrl = transactionData.payment_url || data.checkout_url;

    return NextResponse.json({
      success: true,
      checkout_url: redirectUrl
    });

  } catch (error: any) {
    console.error("Erreur serveur globale :", error.message);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}
