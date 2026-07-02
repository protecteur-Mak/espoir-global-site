import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log(">>> Début de l'exécution de la route de paiement FedaPay");

  try {
    // Lecture sécurisée du corps de la requête
    const text = await req.text();
    if (!text) {
      console.error("Erreur : La requête est vide.");
      return NextResponse.json({ error: "Aucune donnée reçue" }, { status: 400 });
    }

    const body = JSON.parse(text);
    console.log("Données reçues :", body);

    const { amount, customer_email, customer_phone_number, description } = body;

    // Validation minimale
    if (!amount || !customer_email) {
      return NextResponse.json({ error: "Montant ou email manquant" }, { status: 400 });
    }

    const secretKey = process.env.FEDAPAY_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Erreur de configuration serveur" }, { status: 500 });
    }

    // Appel API FedaPay
    const response = await fetch('https://api.fedapay.com/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
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
    console.log("Réponse API FedaPay :", data);

    if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Erreur critique :", error.message);
    return NextResponse.json({ error: "Format JSON invalide ou erreur serveur" }, { status: 400 });
  }
}
