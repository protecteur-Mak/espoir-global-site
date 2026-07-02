import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Log de débogage pour vérifier que la fonction est déclenchée
  console.log(">>> Début de l'exécution de la route de paiement FedaPay");

  try {
    const body = await req.json();
    console.log("Données reçues :", body);

    const secretKey = process.env.FEDAPAY_SECRET_KEY;

    // Vérification de la présence de la clé
    if (!secretKey) {
      console.error("Erreur : La clé FEDAPAY_SECRET_KEY est manquante.");
      return NextResponse.json({ error: "Configuration serveur incomplète" }, { status: 500 });
    }

    // Appel à l'API FedaPay
    const response = await fetch('https://api.fedapay.com/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: body.description || "Abonnement TogoMarket",
        amount: Number(body.amount),
        currency: { iso: "XOF" },
        customer: {
          email: body.customer_email || "test@test.com",
          phone_number: body.customer_phone_number || "0000000000"
        },
        callback_url: "https://espoir-global.org/confirmation"
      })
    });

    const data = await response.json();
    console.log("Réponse FedaPay :", data);

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Erreur critique dans route.ts :", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
