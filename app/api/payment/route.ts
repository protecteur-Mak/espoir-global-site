import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Lire tout le contenu de la requête en texte
    const text = await req.text();

    // 2. Vérification robuste : si la requête est vide ou ne contient que des espaces, on ignore le doublon
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ message: "Requête doublon ignorée" }, { status: 200 });
    }

    // 3. Si on a du contenu, on tente de parser le JSON en toute sécurité
    const body = JSON.parse(text);
    console.log(">>> Données valides traitées :", body);

    const { amount, customer_email, customer_phone_number, description } = body;

    // 4. Validation des champs obligatoires
    if (!amount || !customer_email) {
      return NextResponse.json({ error: "Données de paiement incomplètes" }, { status: 400 });
    }

    // 5. Appel à l'API FedaPay
    const response = await fetch('https://api.fedapay.com/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: description || "Paiement TogoMarket",
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
    
    // 6. Gestion des erreurs de l'API FedaPay
    if (!response.ok) {
        console.error("Erreur API FedaPay :", data);
        return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    // Ce bloc catch ne sera plus pollué par les requêtes vides grâce à l'étape 2
    console.error("Erreur critique serveur :", error);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}
