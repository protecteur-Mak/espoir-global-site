"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, Suspense } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export function PaymentContent() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showBankCardForm, setShowBankCardForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bankCardData, setBankCardData] = useState({
    nom: "", prenom: "", telephone: "", email: ""
  });
  const { toast } = useToast();

  const predefinedAmounts = [2, 5, 10, 20, 50, 100];
  const finalAmount = selectedAmount || Number.parseFloat(customAmount) || 0;
  const finalAmountXOF = Math.round(finalAmount * 655);

  const handlePayment = async (channel: "MOBILE_MONEY" | "CREDIT_CARD" | "WALLET") => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmountXOF,
          currency: "XOF",
          description: "Don pour Espoir Global",
          customer_name: bankCardData.nom,
          customer_surname: bankCardData.prenom,
          customer_email: bankCardData.email,
          customer_phone_number: bankCardData.telephone,
          payment_method: channel,
        }),
      });

      const result = await response.json();
      if (result.code === '201') {
        window.location.href = result.data.payment_url;
      } else {
        alert("Erreur : " + (result.description || JSON.stringify(result)));
        setLoading(false);
      }
    } catch (error) {
      alert("Erreur de connexion : " + error);
      setLoading(false);
    }
  };

  return (
    <section className="py-6 container mx-auto px-4 max-w-4xl">
      <div className="flex items-center mb-8">
        <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Button></Link>
      </div>
      
      <Card className="mb-8">
        <CardHeader><CardTitle>Choisissez votre montant</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {predefinedAmounts.map((amt) => (
              <Button key={amt} variant={selectedAmount === amt ? "default" : "outline"} onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}>{amt}€</Button>
            ))}
          </div>
          <Input type="number" placeholder="Autre montant (€)" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }} />
          <Button size="lg" className="w-full bg-indigo-600" onClick={() => setIsDialogOpen(true)} disabled={finalAmount <= 0}>
            Payer {finalAmount}€
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{showBankCardForm ? "Paiement par Carte" : "Choisir la méthode"}</DialogTitle></DialogHeader>
          {!showBankCardForm ? (
            <div className="space-y-3">
              <Button className="w-full" onClick={() => handlePayment("MOBILE_MONEY")}>Mobile Money</Button>
              <Button className="w-full" onClick={() => handlePayment("WALLET")}>WAVE</Button>
              <Button className="w-full" onClick={() => setShowBankCardForm(true)}>Carte Bancaire</Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input placeholder="Nom" onChange={(e) => setBankCardData({...bankCardData, nom: e.target.value})} />
              <Input placeholder="Prénom" onChange={(e) => setBankCardData({...bankCardData, prenom: e.target.value})} />
              <Input placeholder="Téléphone" onChange={(e) => setBankCardData({...bankCardData, telephone: e.target.value})} />
              <Button className="w-full" onClick={() => handlePayment("CREDIT_CARD")} disabled={loading}>
                {loading ? "Traitement..." : "Valider le paiement"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default function PaymentContentWithSuspense() {
  return <Suspense fallback={<div>Chargement…</div>}><PaymentContent /></Suspense>;
}
