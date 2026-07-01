import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1. Log immédiat pour savoir si Vercel reçoit l'appel
  console.log("DEBUG: La route /api/payment a bien été déclenchée.");

  try {
    const body = await req.json();
    console.log("DEBUG: Corps de la requête reçu :", body);

    // 2. Vérification des variables
    const apiKey = process.env.CINETPAY_API_KEY;
    const apiPassword = process.env.CINETPAY_API_PASSWORD;

    if (!apiKey || !apiPassword) {
      console.error("ERREUR: Variables d'environnement manquantes.");
      return NextResponse.json({ message: "Configuration incomplète" }, { status: 500 });
    }

    // 3. Appel simplifié vers CinetPay
    const response = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey: apiKey,
        password: apiPassword,
        amount: Number(body.amount),
        currency: body.currency || "XOF",
        description: body.description || "Donation",
        transaction_id: Date.now().toString(),
        notify_url: "https://espoir-global.org/api/notify",
        return_url: "https://espoir-global.org/confirmation",
        customer_name: "Client",
        customer_email: "test@test.com"
      }),
      cache: 'no-store'
    });

    const data = await response.json();
    console.log("DEBUG: Réponse de CinetPay :", data);

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("ERREUR FATALE :", error.message);
    return NextResponse.json({ message: "Erreur serveur", detail: error.message }, { status: 500 });
  }
}
