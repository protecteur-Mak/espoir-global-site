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
import {
  ArrowLeft,
  Smartphone,
  Copy,
  CheckCircle,
  CreditCard,
  Wallet,
} from "lucide-react";
import { FaPaypal } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getCountryCode, getCountriesList } from "@/lib/utils";

function TabImage({
  src,
  alt,
  fallback,
}: {
  src: string;
  alt: string;
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <>{fallback}</>
  ) : (
    <img
      src={src}
      alt={alt}
      style={{ maxHeight: "40px", maxWidth: "100%", width: "auto", objectFit: "contain", display: "block", margin: "0 auto" }}
      onError={() => setFailed(true)}
    />
  );
}

export function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState("one-time");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"mobile" | "paypal">("mobile");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showBankCardForm, setShowBankCardForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [bankCardData, setBankCardData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    adresse: "",
    ville: "",
    pays: "",
    codePostal: "",
  });

  const countriesList = getCountriesList();
  const { toast } = useToast();

  const finalAmount = selectedAmount || Number.parseFloat(customAmount) || 0;
  const finalAmountXOF = Math.round(finalAmount * 655);
  const predefinedAmounts = [2, 5, 10, 20, 50, 100, 200, 300, 500];

  useEffect(() => {
    const amount = searchParams.get("amount");
    const type = searchParams.get("type");
    if (amount) setSelectedAmount(Number.parseInt(amount));
    if (type) setDonationType(type);
  }, [searchParams]);

  // LOGIQUE DE PAIEMENT SÉCURISÉE APPELANT /api/payment
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
          customer_name: bankCardData.nom || "Donateur",
          customer_surname: bankCardData.prenom || "Anonyme",
          customer_email: bankCardData.email || "donateur@anonyme.com",
          customer_phone_number: bankCardData.telephone || "0000000000",
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

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setBankCardData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-6 md:py-16 pb-20 md:pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center mb-8">
          <Link href="/"><Button variant="ghost" size="sm" className="mr-4"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Button></Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-2">Faire un don</h1>
            <p className="text-gray-600">Choisissez votre montant et votre méthode de paiement préférée.</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle className="text-xl text-indigo-700">1. Choisissez votre montant</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <Select value={donationType} onValueChange={setDonationType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">Don unique</SelectItem>
                <SelectItem value="monthly">Don mensuel</SelectItem>
                <SelectItem value="sponsorship">Parrainage</SelectItem>
                <SelectItem value="weekly">Don hebdomadaire (Bâtisseur d'Espoir)</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {predefinedAmounts.map((amount) => (
                <Button key={amount} variant={selectedAmount === amount ? "default" : "outline"} onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}>{amount}€</Button>
              ))}
            </div>
            <Input type="number" placeholder="Montant personnalisé" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }} />
          </CardContent>
        </Card>

        {finalAmount > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-xl text-indigo-700">2. Méthode de paiement</CardTitle></CardHeader>
            <CardContent>
              <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => setIsDialogOpen(true)}>Payer {finalAmount}€</Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            {!showBankCardForm ? (
              <div className="space-y-4">
                <Button variant="outline" className="w-full" onClick={() => handlePayment("MOBILE_MONEY")}>Mobile Money</Button>
                <Button variant="outline" className="w-full" onClick={() => handlePayment("WALLET")}>WAVE</Button>
                <Button variant="outline" className="w-full" onClick={() => setShowBankCardForm(true)}>Carte Bancaire</Button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handlePayment("CREDIT_CARD"); }} className="space-y-4">
                <Input placeholder="Nom" onChange={(e) => handleInputChange("nom", e.target.value)} required />
                <Button type="submit" disabled={loading}>{loading ? "Traitement..." : "Valider"}</Button>
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
