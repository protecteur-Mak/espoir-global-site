"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Smartphone, CheckCircle, Copy, Loader2, AlertCircle } from "lucide-react";
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
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState("one-time");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"mobile" | "paypal">("mobile");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  
  // 🔄 Gestion de la rotation des bannières (toutes les 5 secondes)
  const banners = [
    "/images/banner-espoir.png",
    "/images/banner-espoir-2.png", // Assurez-vous d'ajouter cette deuxième image dans /public/images/
  ];
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // 5000 ms = 5 secondes

    return () => clearInterval(bannerInterval);
  }, [banners.length]);

  // États pour la vérification post-redirection du Webhook
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const { toast } = useToast();

  const finalAmount = selectedAmount || Number.parseFloat(customAmount) || 0;
  const predefinedAmounts = [1000, 2000, 5000, 10000, 20000, 25000, 50000, 100000];

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const amount = queryParams.get("amount");
    const type = queryParams.get("type");
    const txId = queryParams.get("id") || queryParams.get("transaction_id");

    if (amount) setSelectedAmount(Number.parseInt(amount));
    if (type) setDonationType(type);

    if (txId) {
      verifyTransactionWithBackend(txId);
    }
  }, []);

  const verifyTransactionWithBackend = async (txId: string) => {
    setVerifying(true);
    setVerificationError(null);

    try {
      const response = await fetch(`/api/verify-payment?id=${txId}`);
      const data = await response.json();

      if (data.success && data.status === "approved") {
        setSuccess(true);
      } else {
        setVerificationError("Le paiement n'a pas été confirmé ou encaissé par le serveur. Aucun don validé.");
        setSuccess(false);
      }
    } catch (err) {
      console.error("Erreur de vérification:", err);
      setVerificationError("Impossible de vérifier l'encaissement auprès du serveur.");
    } finally {
      setVerifying(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePayment = async () => {
    if (loadingPayment) return;

    if (finalAmount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez choisir ou entrer un montant valide en F CFA.",
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
          amount: finalAmount,
          currency: "XOF",
          description: "Don pour Espoir Global",
          customer_email: "donateur@espoir-global.org",
        }),
      });

      const result = await response.json();

      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      } else {
        setLoadingPayment(false);
        toast({
          title: "Erreur",
          description: result.error || "Impossible de générer le lien de paiement FedaPay.",
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

  if (verifying) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-xl text-center bg-white rounded-2xl shadow-xl p-8">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Vérification de l'encaissement...</h2>
          <p className="text-gray-600 text-sm mt-2">
            Nous attendons la confirmation du webhook serveur avant d'afficher votre reçu de don.
          </p>
        </div>
      </section>
    );
  }

  if (success) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-xl bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-emerald-800 mb-2">Merci pour votre don !</h2>
          <p className="text-gray-700 text-sm mb-4">
            Le paiement a été confirmé et encaissé avec succès par notre système.
          </p>
          <div className="bg-emerald-50 p-4 rounded-xl mb-6">
            <p className="text-emerald-900 font-bold text-lg">
              Montant reçu : {finalAmount.toLocaleString()} F CFA
            </p>
          </div>
          <Button
            onClick={() => {
              setSuccess(false);
              window.history.replaceState({}, document.title, window.location.pathname);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3"
          >
            Effectuer un autre don
          </Button>
        </div>
      </section>
    );
  }

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

        {verificationError && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{verificationError}</span>
          </div>
        )}

        {/* 🖼️ Affichage dynamique de la bannière en rotation */}
        <div className="mb-8 overflow-hidden rounded-xl shadow-md transition-all duration-500">
          <Image
            key={banners[currentBannerIndex]}
            src={banners[currentBannerIndex]} 
            alt="Faites un don - Espoir Global"
            width={800}
            height={450}
            className="w-full h-auto object-cover transition-opacity duration-500"
            priority
          />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">1. Choisissez votre montant (F CFA)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className="h-14 text-base font-semibold"
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                >
                  {amount.toLocaleString()} F
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-amount">Montant personnalisé (F CFA)</Label>
              <Input
                id="custom-amount"
                type="number"
                min="100"
                step="100"
                placeholder="Ex: 15000"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
              />
            </div>

            {finalAmount > 0 && (
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <p className="text-lg font-semibold text-emerald-800">
                  Montant sélectionné : {finalAmount.toLocaleString()} F CFA
                </p>
                {donationType === "monthly" && <p className="text-sm text-emerald-700">par mois</p>}
                {donationType === "weekly" && <p className="text-sm text-emerald-700">par semaine</p>}
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
                      Mobile Money
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
                  <Smartphone className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Mobile Money / FedaPay / Carte Bancaire
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    Paiement sécurisé via Mobile Money (Togocom, Moov) ou carte bancaire en Francs CFA.
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
                    Payer {finalAmount.toLocaleString()} F CFA
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
                      Scannez ce QR code avec votre application PayPal
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-bold">Confirmation du don</DialogTitle>
              <DialogDescription className="text-center text-base pt-2">
                Vous allez effectuer un don de <strong className="text-emerald-600 text-lg">{finalAmount.toLocaleString()} F CFA</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-3 pt-4">
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
                {loadingPayment ? "Redirection..." : "Payer via Fedapay"}
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
