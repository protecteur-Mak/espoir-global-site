import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Vérification de sécurité : on ne continue pas si les clés sont vides
    if (!process.env.CINETPAY_API_KEY || !process.env.CINETPAY_SITE_ID) {
      console.error("Configuration API manquante");
      return NextResponse.json({ message: "Erreur de configuration serveur" }, { status: 500 });
    }

    const payload = {
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      amount: Number(body.amount), // Forcer le format nombre
      currency: body.currency || "XOF",
      description: body.description || "Donation",
      customer_name: body.customer_name || "Client",
      customer_surname: body.customer_surname || "Espoir",
      customer_email: body.customer_email || "test@test.com",
      customer_phone_number: body.customer_phone_number || "00000000",
      payment_method: body.payment_method,
      notify_url: "https://espoir-global.org/api/notify",
      return_url: "https://espoir-global.org/confirmation",
      transaction_id: Date.now().toString(),
    };

    const response = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    // Si CinetPay renvoie une erreur (ex: clé invalide), on la transmet proprement
    return NextResponse.json(data);

  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}
