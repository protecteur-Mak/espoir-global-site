import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Lire le body une seule fois
    const body = await req.json();
    
    // 2. Extraire les données en toute sécurité
    const { amount, customer_email, customer_phone_number, description } = body;

    if (!amount || !customer_email) {
      return NextResponse.json({ error: "Données manquantes (montant ou email)" }, { status: 400 });
    }

    const secretKey = process.env.FEDAPAY_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Erreur serveur : Clé manquante" }, { status: 500 });
    }

    // 3. Appel à l'API FedaPay
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
        customer: {
          email: customer_email,
          phone_number: customer_phone_number || "0000000000"
        }
      })
    });

    const data = await response.json();
    
    // Si l'API FedaPay renvoie une erreur
    if (!response.ok) {
        console.error("Erreur FedaPay :", data);
        return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Erreur critique :", error);
    return NextResponse.json({ error: "Format JSON invalide" }, { status: 400 });
  }
}
