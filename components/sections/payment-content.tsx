  "use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Smartphone, CreditCard, Wallet, Copy, CheckCircle } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

type PaymentMethod = "MOBILE_MONEY" | "CREDIT_CARD" | "WALLET" | "PAYPAL";

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
  const [showBankCardForm, setShowBankCardForm] = useState(false);
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

  // Gestion de la soumission adaptée à FedaPay
  const handlePayment = async (
    channel: "MOBILE_MONEY" | "CREDIT_CARD" | "WALLET"
  ) => {
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmountXOF,
          currency: "XOF",
          description: "Don pour Espoir Global",
          customer_name: bankCardData.nom || "Donateur",
          customer_surname: bankCardData.prenom || "Anonyme",
          customer_email: bankCardData.email || "donateur@anonyme.com",
          customer_phone_number: bankCardData.telephone || "0000000000",
          customer_address: bankCardData.adresse || "Anonyme",
          customer_city: bankCardData.ville || "Anonyme",
          customer_country: bankCardData.pays || "TG",
          customer_zip_code: bankCardData.codePostal || "12345",
          payment_method: channel,
        }),
      });

      const result = await response.json();

      // Adaptation FedaPay : On cherche la clé transaction et sa checkout_url
      if (result.transaction && result.transaction.checkout_url) {
        window.location.href = result.transaction.checkout_url;
      } else if (result.checkout_url) {
        window.location.href = result.checkout_url;
      } else {
        toast({
          title: "Erreur de configuration",
          description: result.error || "Impossible de générer le lien FedaPay.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors de la communication avec le serveur.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBankCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = Object.values(bankCardData);
    if (requiredFields.some((field) => !field.trim())) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    if (bankCardData.codePostal.length !== 5 || !/^\d{5}$/.test(bankCardData.codePostal)) {
      toast({
        title: "Code postal invalide",
        description: "Le code postal doit contenir exactement 5 chiffres.",
        variant: "destructive",
      });
      return;
    }

    await handlePayment("CREDIT_CARD");
    setIsDialogOpen(false);
    setShowBankCardForm(false);
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
                    onClick={() => setIsDialogOpen(true)}
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

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Choisissez votre méthode de paiement</DialogTitle>
              <DialogDescription>
                Sélectionnez la méthode de paiement qui vous convient le mieux.
              </DialogDescription>
            </DialogHeader>

            {!showBankCardForm ? (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-4 px-6"
                  onClick={() => handlePayment("MOBILE_MONEY")}
                >
                  <Smartphone className="w-6 h-6 mr-3 text-orange-600" />
                  <div className="text-left">
                    <div className="font-semibold">Mobile Money</div>
                    <div className="text-sm text-gray-500">Orange Money, MTN Money, etc.</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-4 px-6"
                  onClick={() => handlePayment("WALLET")}
                >
                  <Wallet className="w-6 h-6 mr-3 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold">Portefeuille WAVE</div>
                    <div className="text-sm text-gray-500">Paiement rapide et sécurisé</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-4 px-6"
                  onClick={() => setShowBankCardForm(true)}
                >
                  <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold">Carte bancaire</div>
                    <div className="text-sm text-gray-500">Visa, Mastercard, etc.</div>
                  </div>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBankCardSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      value={bankCardData.nom}
                      onChange={(e) => handleInputChange("nom", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input
                      id="prenom"
                      value={bankCardData.prenom}
                      onChange={(e) => handleInputChange("prenom", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="telephone">Numéro de téléphone</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={bankCardData.telephone}
                    onChange={(e) => handleInputChange("telephone", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={bankCardData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input
                    id="adresse"
                    value={bankCardData.adresse}
                    onChange={(e) => handleInputChange("adresse", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ville">Ville</Label>
                    <Input
                      id="ville"
                      value={bankCardData.ville}
                      onChange={(e) => handleInputChange("ville", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="codePostal">Code postal</Label>
                    <Input
                      id="codePostal"
                      type="text"
                      pattern="[0-9]{5}"
                      maxLength={5}
                      value={bankCardData.codePostal}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleInputChange("codePostal", value);
                      }}
                      className={
                        bankCardData.codePostal.length > 0 && bankCardData.codePostal.length !== 5
                          ? "border-red-500 focus-visible:border-red-500"
                          : ""
                      }
                      placeholder="12345"
                      required
                    />
                    {bankCardData.codePostal.length > 0 && bankCardData.codePostal.length !== 5 && (
                      <p className="text-red-500 text-xs mt-1">
                        Le code postal doit contenir exactement 5 chiffres.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="pays">Pays</Label>
                  <Select value={bankCardData.pays} onValueChange={(value) => handleInputChange("pays", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Togo">Togo</SelectItem>
                      <SelectItem value="Bénin">Bénin</SelectItem>
                      <SelectItem value="Burkina Faso">Burkina Faso</SelectItem>
                      <SelectItem value="Côte d'Ivoire">Côte d'Ivoire</SelectItem>
                      <SelectItem value="Mali">Mali</SelectItem>
                      <SelectItem value="Niger">Niger</SelectItem>
                      <SelectItem value="Sénégal">Sénégal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBankCardForm(false)}
                    className="flex-1"
                  >
                    Retour
                  </Button>
                  <Button type="submit" className="flex-1">
                    Payer {finalAmount}$
                  </Button>
                </div>
              </form>
            )}
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
