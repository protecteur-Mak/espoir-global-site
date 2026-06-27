"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getCountriesList } from "@/lib/utils";

export function PaymentContent() {
  const searchParams = useSearchParams();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState("one-time");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showBankCardForm, setShowBankCardForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bankCardData, setBankCardData] = useState({
    nom: "", prenom: "", telephone: "", email: "", adresse: "", ville: "", pays: "", codePostal: ""
  });

  const countriesList = getCountriesList();
  const { toast } = useToast();
  const predefinedAmounts = [2, 5, 10, 20, 50, 100, 200, 300, 500];
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
        toast({ title: "Erreur", description: result.message || "Erreur de paiement", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de contacter le serveur", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBankCardData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-6 md:py-16 pb-20 md:pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center mb-8">
          <Link href="/"><Button variant="ghost" size="sm" className="mr-4"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Button></Link>
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">Faire un don</h1>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>1. Choisissez votre montant</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select value={donationType} onValueChange={setDonationType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">Don unique</SelectItem>
                <SelectItem value="monthly">Don mensuel</SelectItem>
                <SelectItem value="sponsorship">Parrainage</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {predefinedAmounts.map((amt) => (
                <Button key={amt} variant={selectedAmount === amt ? "default" : "outline"} onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}>{amt}€</Button>
              ))}
            </div>
            <Input type="number" placeholder="Autre montant (€)" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }} />
          </CardContent>
        </Card>

        {finalAmount > 0 && (
          <Button size="lg" className="w-full bg-indigo-600" onClick={() => setIsDialogOpen(true)}>Payer {finalAmount}€</Button>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{showBankCardForm ? "Informations bancaires" : "Méthode de paiement"}</DialogTitle></DialogHeader>
            {!showBankCardForm ? (
              <div className="space-y-4">
                <Button className="w-full" onClick={() => handlePayment("MOBILE_MONEY")}>Mobile Money</Button>
                <Button className="w-full" onClick={() => handlePayment("WALLET")}>WAVE</Button>
                <Button className="w-full" onClick={() => setShowBankCardForm(true)}>Carte Bancaire</Button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handlePayment("CREDIT_CARD"); }} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Nom" required onChange={(e) => handleInputChange("nom", e.target.value)} />
                  <Input placeholder="Prénom" required onChange={(e) => handleInputChange("prenom", e.target.value)} />
                </div>
                <Input placeholder="Email" type="email" required onChange={(e) => handleInputChange("email", e.target.value)} />
                <Input placeholder="Téléphone" type="tel" required onChange={(e) => handleInputChange("telephone", e.target.value)} />
                <Input placeholder="Adresse" required onChange={(e) => handleInputChange("adresse", e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Ville" required onChange={(e) => handleInputChange("ville", e.target.value)} />
                  <Input placeholder="Code Postal" required onChange={(e) => handleInputChange("codePostal", e.target.value)} />
                </div>
                <Select onValueChange={(val) => handleInputChange("pays", val)}>
                  <SelectTrigger><SelectValue placeholder="Pays" /></SelectTrigger>
                  <SelectContent>
                    {countriesList.map((c) => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Traitement..." : "Valider le paiement"}</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

export default function PaymentContentWithSuspense() {
  return <Suspense fallback={<div>Chargement…</div>}><PaymentContent /></Suspense>;
}
