import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Données reçues du frontend :", body);

    if (!process.env.CINETPAY_API_KEY || !process.env.CINETPAY_SITE_ID) {
      console.error("Erreur critique : Variables d'environnement manquantes");
      return NextResponse.json({ message: "Erreur de configuration serveur" }, { status: 500 });
    }

    const payload = {
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      amount: Number(body.amount),
      currency: body.currency || "XOF",
      description: body.description || "Donation",
      customer_name: body.customer_name || "Client",
      customer_surname: body.customer_surname || "Espoir",
      customer_email: body.customer_email || "test@test.com",
      customer_phone_number: body.customer_phone_number || "00000000",
      notify_url: "https://espoir-global.org/api/notify",
      return_url: "https://espoir-global.org/confirmation",
      transaction_id: Date.now().toString(),
    };

    console.log("Tentative de connexion à l'API CinetPay...");

    const response = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    // C'est ici que tu verras le vrai message d'erreur dans les Logs Vercel
    console.log("Réponse brute de CinetPay :", JSON.stringify(data));

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Erreur fatale de connexion :", error.message);
    return NextResponse.json(
      { message: "Erreur serveur interne", detail: error.message }, 
      { status: 500 }
    );
  }
}
