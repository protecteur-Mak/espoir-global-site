import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Lire tout le contenu de la requête
    const text = await req.text();

    // 2. Vérification critique : ignorer les requêtes vides (les doublons)
    // Cela empêche l'erreur SyntaxError sur les requêtes vides envoyées en second
    if (!text || text.trim().length === 0) {
      return new NextResponse(null, { status: 204 }); // 204 No Content : succès sans rien retourner
    }

    // 3. Traitement sécurisé des données
    const body = JSON.parse(text);
    console.log(">>> Traitement du paiement pour :", body.amount);

    const { amount, customer_email } = body;

    if (!amount || !customer_email) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    // 4. Appel FedaPay
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

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    // 5. Bloc de sécurité : Si une erreur survient sur la requête principale, on log, sinon on ignore
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
