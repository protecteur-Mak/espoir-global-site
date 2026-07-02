import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const text = await req.text();

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

    // Appel FedaPay avec la structure officiellement attendue
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
          firstname: body.customer_surname || "Donateur", // Prénom
          lastname: body.customer_name || "Anonyme",     // Nom
          email: customer_email,
          phone_number: {
            number: customer_phone_number || "00000000",
            country: "tg" // Code pays pour le Togo (ou s'adapte selon tes besoins)
          }
        }
      })
    });

    const fedaPayRawText = await response.text();
    
    // 💡 LOG CRITIQUE : On affiche le statut HTTP retourné par FedaPay
    console.log(`>>> FedaPay a répondu avec le statut : ${response.status}`);
    console.log(">>> Réponse brute de FedaPay :", fedaPayRawText);

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

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Erreur serveur globale :", error.message);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}
