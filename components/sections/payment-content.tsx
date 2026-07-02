"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Smartphone, CheckCircle, Copy } from "lucide-react";
import { FaPaypal } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import Image from "next/image";

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
  if (failed) return <>{fallback}</>;

  return (
    <Image
      src={src}
      alt={alt}
      width={120}
      height={40}
      style={{ maxHeight: 40, width: "auto", objectFit: "contain" }}
      onError={() => setFailed(true)}
    />
  );
}

export function PaymentContent() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState("one-time");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"mobile" | "paypal">("mobile");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const { toast } = useToast();

  const EURTOXOF = 655;
  const finalAmount = selectedAmount || Number.parseFloat(customAmount) || 0;
  const finalAmountXOF = Math.round(finalAmount * EURTOXOF);
  const predefinedAmounts = [2, 5, 10, 20, 50, 100, 200, 300, 500, 1000];

  useEffect(() => {
    const amount = new URLSearchParams(window.location.search).get("amount");
    const type = new URLSearchParams(window.location.search).get("type");
    if (amount) setSelectedAmount(Number.parseInt(amount));
    if (type) setDonationType(type);
  }, []);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Envoi direct vers l'API FedaPay sans passer par des formulaires intermédiaires
  const handlePayment = async () => {
    if (finalAmount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez choisir ou entrer un montant pour votre don.",
        variant: "destructive",
      });
      return;
    }

    setLoadingPayment(true);
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmountXOF,
          currency: "XOF",
          description: "Don pour Espoir Global",
          customer_email: "donateur@espoir-global.org", // Email par défaut si non fourni
        }),
      });

      const result = await response.json();

      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      } else {
        setLoadingPayment(false);
        toast({
          title: "Erreur",
          description: "Impossible de générer le lien de paiement FedaPay.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      setLoadingPayment(false);
      toast({
        title: "Erreur réseau",
        description: "Une erreur est survenue lors de la communication avec le serveur.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-6 md:py-16 pb-20 md:pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">1. Choisissez votre montant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className="h-16 text-lg font-semibold"
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                >
                  {amount}$
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-amount">Montant personnalisé ($)</Label>
              <Input
                id="custom-amount"
                type="number"
                placeholder="Entrez votre montant"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
              />
            </div>

            {finalAmount > 0 && (
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-lg font-semibold text-indigo-700">
                  Montant sélectionné : {finalAmount}$
                </p>
                {donationType === "monthly" && <p className="text-sm text-indigo-600">par mois</p>}
                {donationType === "weekly" && <p className="text-sm text-indigo-600">par semaine</p>}
                {donationType === "sponsorship" && <p className="text-sm text-indigo-600">par mois (parrainage)</p>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">2. Choisissez votre méthode de paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab("mobile")}
                className={`flex items-center justify-center rounded-md p-3 transition-all border-2 min-h-[64px] ${
                  activeTab === "mobile"
                    ? "border-orange-400 bg-orange-100 shadow-md"
                    : "border-transparent bg-gray-100 hover:bg-orange-50 hover:border-orange-200"
                }`}
              >
                <TabImage
                  src="/images/paymentmobile.png"
                  alt="Mobile Money"
                  fallback={
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Smartphone className="w-5 h-5 text-orange-500" />
                      Mobile
                    </span>
                  }
                />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("paypal")}
                className={`flex items-center justify-center rounded-md p-3 transition-all border-2 min-h-[64px] ${
                  activeTab === "paypal"
                    ? "border-blue-400 bg-blue-100 shadow-md"
                    : "border-transparent bg-gray-100 hover:bg-blue-50 hover:border-blue-200"
                }`}
              >
                <TabImage
                  src="/images/paymentpaypal.png"
                  alt="PayPal"
                  fallback={
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FaPaypal className="w-5 h-5 text-blue-600" />
                      PayPal
                    </span>
                  }
                />
              </button>
            </div>

            {activeTab === "mobile" ? (
              <div className="space-y-4">
                <div className="text-center p-6">
                  <Smartphone className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">
                    Mobile Money / WAVE / Carte Bancaire
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Paiement sécurisé via Mobile Money, Wallet WAVE ou carte bancaire.
                    Transaction rapide et sécurisée.
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8"
                    onClick={() => {
                      if (finalAmount > 0) {
                        setIsDialogOpen(true);
                      } else {
                        toast({
                          title: "Montant requis",
                          description: "Veuillez choisir un montant avant de payer.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Payer maintenant {finalAmount}$
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-6">
                  <div className="bg-blue-100 p-4 rounded-lg mb-6">
                    <Image
                      src="/paypal-qr.png"
                      alt="PayPal QR Code"
                      width={200}
                      height={200}
                      className="mx-auto mb-4"
                    />
                    <p className="text-sm text-gray-600 mb-4">
                      Scannez ce QR code avec votre app PayPal
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Ou envoyez directement à :
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-mono text-sm bg-white px-3 py-2 rounded border">
                        ongsoutienplus@gmail.com
                      </span>
                    </div>
                  </div>

                  <div className="w-full flex justify-center">
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8"
                      onClick={() => copyToClipboard("ongsoutienplus@gmail.com", "paypal")}
                    >
                      {copiedField === "paypal" ? (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      ) : (
                        <Copy className="w-5 h-5 mr-2" />
                      )}
                      Copier l'email PayPal
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 🎯 Dialogue de confirmation court demandé */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-bold">Confirmation du don</DialogTitle>
              <DialogDescription className="text-center text-base pt-4">
                Vous êtes en train de faire un don de <strong className="text-indigo-600 text-lg">{finalAmount}$</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 h-12"
                disabled={loadingPayment}
              >
                Annuler
              </Button>
              <Button 
                type="button" 
                onClick={handlePayment} 
                className="flex-1 bg-orange-500 hover:bg-orange-600 h-12 text-white font-semibold"
                disabled={loadingPayment}
              >
                {loadingPayment ? "Chargement..." : "Continuer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

export default function PaymentContentWithSuspense() {
  return (
    <Suspense fallback={<div>Chargement du paiement...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
