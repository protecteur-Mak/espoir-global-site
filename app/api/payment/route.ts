import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // On vérifie seulement la clé et le mot de passe
    if (!process.env.CINETPAY_API_KEY || !process.env.CINETPAY_API_PASSWORD) {
      console.error("Erreur critique : Identifiants API manquants");
      return NextResponse.json({ message: "Erreur de configuration serveur" }, { status: 500 });
    }

    const payload = {
      apikey: process.env.CINETPAY_API_KEY,
      password: process.env.CINETPAY_API_PASSWORD,
      // Le site_id est retiré pour ce test
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

    const response = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Erreur fatale :", error.message);
    return NextResponse.json({ message: "Erreur serveur", detail: error.message }, { status: 500 });
  }
}
