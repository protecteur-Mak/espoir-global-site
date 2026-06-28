"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, Suspense } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export function PaymentContent() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"mobile" | "paypal">("mobile");
  const [isLoading, setIsLoading] = useState(false);

  const [bankCardData] = useState({
    nom: "Donateur", prenom: "Anonyme", telephone: "0000000000", email: "don@test.com"
  });

  const { toast } = useToast();

  const predefinedAmounts = [2, 5, 10, 20, 50, 100, 200, 300, 500];
  const finalAmount = selectedAmount || Number.parseFloat(customAmount) || 0;
  // Conversion en XOF (Taux estimé 1$ = 600 XOF)
  const finalAmountXOF = Math.round(finalAmount * 600);

  const handlePayment = async (channels: "MOBILE_MONEY" | "WALLET") => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmountXOF,
          currency: "XOF",
          description: `Don de ${finalAmount}$ - Espoir Global`,
          customer_name: bankCardData.nom,
          customer_surname: bankCardData.prenom,
          customer_email: bankCardData.email,
          customer_phone_number: bankCardData.telephone,
          payment_method: channels,
        }),
      });

      const data = await response.json();

      if (data.code === '201' || data.code === '00') {
        window.location.href = data.data.payment_url;
      } else {
        throw new Error(data.message || "Erreur lors de l'initialisation");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({ title: "Erreur", description: "Impossible de contacter le serveur de paiement.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-6 container mx-auto px-4 max-w-4xl">
      <div className="flex items-center mb-8">
        <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Button></Link>
      </div>
      
      <Card className="mb-8">
        <CardHeader><CardTitle>Choisissez votre montant ($)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {predefinedAmounts.map((amt) => (
              <Button key={amt} variant={selectedAmount === amt ? "default" : "outline"} onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}>{amt}$</Button>
            ))}
          </div>
          <Input type="number" placeholder="Autre montant ($)" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }} />
          <Button size="lg" className="w-full bg-indigo-600" onClick={() => setIsDialogOpen(true)} disabled={finalAmount <= 0}>
            Payer {finalAmount}$
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Choisir la méthode de paiement</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Button className="w-full" onClick={() => handlePayment("MOBILE_MONEY")}>Mobile Money</Button>
            <Button className="w-full" onClick={() => handlePayment("WALLET")}>WAVE</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default function PaymentContentWithSuspense() {
  return <Suspense fallback={<div>Chargement…</div>}><PaymentContent /></Suspense>;
}
