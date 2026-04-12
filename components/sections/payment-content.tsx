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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Smartphone,
  Bitcoin,
  Copy,
  CheckCircle,
  CreditCard,
  Wallet,
} from "lucide-react";
import { FaPaypal } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import { v4 as uuidv4 } from "uuid";

import { useCinetPay } from "@/hooks/use-cinetpay";
import { useToast } from "@/hooks/use-toast";

import { COINS } from "@/lib/coins";
import { MIN_TOPUP_USDT } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { createPayment } from "@/services/nowpayments";
import { getCountryCode, getCountriesList } from "@/lib/utils";

function formatTimer(sec: number | null) {
  if (sec === null) return "";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState("one-time");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const [paymentId, setPaymentId] = useState("");
  const [paymentAddress, setPaymentAddress] = useState("");
  const [selectedPayCurrency, setSelectedPayCurrency] = useState<string>("trx");
  const selectedCoin = COINS.find(
    (c) => c.currency_code === selectedPayCurrency,
  );
  const filteredCoins = COINS.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.full_name.toLowerCase().includes(search.toLowerCase()),
  );
  const [showReview, setShowReview] = useState(false);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [showBankCardForm, setShowBankCardForm] = useState(false);

  // Bank card form data
  const [bankCardData, setBankCardData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    adresse: "",
    ville: "",
    pays: "",
    codePostal: "",
    channels: "",
  });

  // Get countries list for dropdown
  const countriesList = getCountriesList();

  const handleContinue = () => {
    const amount = selectedAmount ?? (Number.parseFloat(customAmount) || 0);
    if (amount >= MIN_TOPUP_USDT) {
      setShowReview(true);
    }
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      // Convert finalAmount (in euro) to dollars (USD)
      const euroToUsdRate = 1.08;
      const finalAmountInUsd =
        Math.round(finalAmount * euroToUsdRate * 100) / 100; // Example conversion rate, update as needed
      const depositAmount = finalAmountInUsd;

      const paymentId = uuidv4();
      const payment = await createPayment(
        depositAmount,
        selectedPayCurrency,
        paymentId,
      );

      if (!payment || !payment.pay_address) {
        throw new Error("Invalid payment response from NOWPayments");
      }

      setPaymentAddress(payment.pay_address);
      setPaymentId(payment.payment_id);
      setPaymentResponse(payment);
      setShowReview(false);
      setTimerExpired(false);
      // Calculate seconds left until expiration
      if (payment.expiration_estimate_date) {
        const expire = new Date(payment.expiration_estimate_date).getTime();
        const now = Date.now();
        setTimer(Math.max(0, Math.floor((expire - now) / 1000)));
      } else {
        setTimer(null);
      }

      // Show payment instructions
      toast({
        title: "Instructions de paiement",
        description: `Veuillez envoyer exactement ${payment.pay_amount} ${payment.pay_currency.toUpperCase()} à l'adresse suivante: ${payment.pay_address}`,
      });
    } catch (error: any) {
      console.error("Error creating payment:", error);
      toast({
        title: "Erreur",
        description:
          error.message ||
          "Une erreur est survenue lors de la création du paiement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timer === null) return;
    if (timer <= 0) {
      setTimerExpired(true);
      setTimeout(() => {
        setPaymentAddress("");
        setPaymentId("");
        setPaymentResponse(null);
        setTimer(null);
        setTimerExpired(false);
      }, 2000);
      return;
    }
    const interval = setInterval(() => {
      setTimer((t) => (t !== null ? t - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // You need to have user, isAuth, game, gameAccountId, and selectedPkg (the package to buy) available in your context or props.

  const { handleMobilePayment } = useCinetPay();
  const { toast } = useToast();

  // Conversion rate EUR to XOF
  const EUR_TO_XOF = 655;

  const finalAmount = selectedAmount || Number.parseFloat(customAmount) || 0;
  const finalAmountXOF = Math.round(finalAmount * EUR_TO_XOF);

  const handlePayment = async (
    method: string,
    channels?: "MOBILE_MONEY" | "CREDIT_CARD" | "WALLET" | "ALL",
  ) => {
    try {
      const paymentData = {
        amount: finalAmountXOF,
        description: "Don pour Espoir Global",
        customerName:
          bankCardData.nom && bankCardData.prenom
            ? `${bankCardData.prenom} ${bankCardData.nom}`
            : "Donateur Anonyme",
        customerEmail: bankCardData.email || "donateur@anonyme.com",
        customerPhone: bankCardData.telephone || "0000000000",
        customerSurname: bankCardData.prenom || "Anonyme",
        customerAddress: bankCardData.adresse || "Anonyme",
        customerCity: bankCardData.ville || "Anonyme",
        customerCountry: getCountryCode(bankCardData.pays),
        customerState: getCountryCode(bankCardData.pays),
        customerZipCode: bankCardData.codePostal || "12345",
        channels:
          channels ||
          (bankCardData.channels as
            | "MOBILE_MONEY"
            | "CREDIT_CARD"
            | "WALLET"
            | "ALL"),
      };

      const result = await handleMobilePayment(paymentData);

      if (result.success) {
        toast({
          title: "Paiement réussi!",
          description: "Paiement réussi",
        });
        router.push(
          `/confirmation?method=${method}&amount=${selectedAmount || customAmount}`,
        );
      } else {
        toast({
          title: "Paiement annulé",
          description: "Le paiement a été annulé ou a échoué",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive",
      });
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);

    if (method === "mobile-money" || method === "wallet") {
      if (method === "mobile-money") {
        setBankCardData({ ...bankCardData, channels: "MOBILE_MONEY" as const });
        // Direct payment for mobile money with correct channel
        handlePayment(method, "MOBILE_MONEY");
      }
      if (method === "wallet") {
        setBankCardData({ ...bankCardData, channels: "WALLET" as const });
        // Direct payment for wallet with correct channel
        handlePayment(method, "WALLET");
      }
      setIsDialogOpen(false);
    } else if (method === "bank-card") {
      setBankCardData({ ...bankCardData, channels: "CREDIT_CARD" as const });
      // Show form for bank card
      setShowBankCardForm(true);
    }
  };

  const handleBankCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields are filled
    const requiredFields = Object.values(bankCardData);
    if (requiredFields.some((field) => !field.trim())) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Validate postal code format
    if (
      bankCardData.codePostal.length !== 5 ||
      !/^\d{5}$/.test(bankCardData.codePostal)
    ) {
      toast({
        title: "Code postal invalide",
        description: "Le code postal doit contenir exactement 5 chiffres",
        variant: "destructive",
      });
      return;
    }

    // Submit payment with CREDIT_CARD channel
    handlePayment("bank-card", "CREDIT_CARD");
    setIsDialogOpen(false);
    setShowBankCardForm(false);
    setBankCardData({
      nom: bankCardData.nom,
      prenom: bankCardData.prenom,
      telephone: bankCardData.telephone,
      email: bankCardData.email,
      adresse: bankCardData.adresse,
      ville: bankCardData.ville,
      pays: bankCardData.pays,
      codePostal: bankCardData.codePostal,
      channels: bankCardData.channels,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setBankCardData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Load parameters from URL
  useEffect(() => {
    const amount = searchParams.get("amount");
    const type = searchParams.get("type");

    if (amount) {
      setSelectedAmount(Number.parseInt(amount));
    }
    if (type) {
      setDonationType(type);
    }
  }, [searchParams]);

  const predefinedAmounts = [2, 5, 10, 20, 50, 100, 200, 300, 500];

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section className="py-6 md:py-16 pb-20 md:pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-2">
              Faire un don
            </h1>
            <p className="text-gray-600">
              Choisissez votre montant et votre méthode de paiement préférée.
            </p>
          </div>
        </div>

        {/* Amount Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-indigo-700">
              1. Choisissez votre montant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-4 block">
                Type de don
              </Label>
              <Select value={donationType} onValueChange={setDonationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">Don unique</SelectItem>
                  <SelectItem value="monthly">Don mensuel</SelectItem>
                  <SelectItem value="sponsorship">Parrainage</SelectItem>
                  <SelectItem value="weekly">
                    Don hebdomadaire (Bâtisseur d'Espoir)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium mb-4 block">
                Montant prédéfini
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
                {predefinedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    className={`h-16 text-lg font-semibold ${
                      selectedAmount === amount
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "border-2 hover:border-indigo-300"
                    }`}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                  >
                    {amount}€
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label
                htmlFor="custom-amount"
                className="text-base font-medium mb-2 block"
              >
                Montant personnalisé
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  €
                </span>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Entrez votre montant"
                  className="pl-8 h-12 text-lg"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                />
              </div>
            </div>

            {finalAmount > 0 && (
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-lg font-semibold text-indigo-700">
                  Montant sélectionné: {finalAmount}€{" "}
                  {donationType === "monthly" && "par mois"}
                  {donationType === "weekly" && "par semaine"}
                  {donationType === "sponsorship" && "par mois (parrainage)"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        {finalAmount > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-indigo-700">
                2. Choisissez votre méthode de paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="mobile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto">
                  <TabsTrigger
                    value="mobile"
                    className="text-xs md:text-sm p-2 md:p-3 bg-orange-100 data-[state=active]:bg-orange-200 hover:bg-orange-200 transition-colors"
                  >
                    <Smartphone className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span className="hidden sm:inline">Mobile</span>
                    <span className="sm:hidden">Mobile</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="crypto"
                    className="text-xs md:text-sm p-2 md:p-3 bg-green-100 data-[state=active]:bg-green-200 hover:bg-green-200 transition-colors"
                  >
                    <Bitcoin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    Crypto
                  </TabsTrigger>
                  <TabsTrigger
                    value="paypal"
                    className="text-xs md:text-sm p-2 md:p-3 bg-blue-100 data-[state=active]:bg-blue-200 hover:bg-blue-200 transition-colors"
                  >
                    <FaPaypal className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    PayPal
                  </TabsTrigger>
                </TabsList>

                {/* Mobile Money */}
                <TabsContent value="mobile" className="space-y-4">
                  <div className="text-center p-6">
                    <Smartphone className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-4">
                      Mobile Money / WAVE / Carte Bancaire
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Paiement sécurisé via Mobile Money (Orange Money, MTN
                      Mobile Money, Moov Money), Wallet (WAVE) ou carte
                      bancaire. Transaction rapide et sécurisée.
                    </p>
                    <div className="flex justify-center">
                      <Button
                        size="lg"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        Payer maintenant - {finalAmount}€
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Cryptocurrency */}
                <TabsContent value="crypto" className="space-y-4">
                  <div className="text-center p-6">
                    {/* Payment Methods List */}
                    <Card className="p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Méthodes de paiement disponibles
                      </h2>
                      <input
                        type="text"
                        placeholder="Rechercher une crypto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-4 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {filteredCoins.length === 0 && (
                          <div className="text-gray-500 text-center py-8">
                            Aucune crypto trouvée.
                          </div>
                        )}
                        {filteredCoins.map((coin) => (
                          <label
                            key={coin.currency_code}
                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${selectedPayCurrency === coin.currency_code ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                          >
                            <input
                              type="radio"
                              name="pay_currency"
                              value={coin.currency_code}
                              checked={
                                selectedPayCurrency === coin.currency_code
                              }
                              onChange={() =>
                                setSelectedPayCurrency(coin.currency_code)
                              }
                              className="form-radio h-5 w-5 text-blue-600"
                            />
                            <img
                              src={coin.image}
                              alt={coin.full_name}
                              className="w-8 h-8"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {coin.full_name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {coin.currency_code.toUpperCase()}
                              </div>
                            </div>
                            {coin.currency_code === "trx" && (
                              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold ml-2">
                                Recommandé
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    </Card>

                    {/* Review Dialog */}
                    <Dialog open={showReview} onOpenChange={setShowReview}>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader className="space-y-4">
                          <DialogTitle className="text-2xl font-bold text-center">
                            Détails du rechargement
                          </DialogTitle>
                          <DialogDescription className="text-center text-base">
                            Vérifiez les détails avant de confirmer votre
                            rechargement.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-8 py-6">
                          {/* Left Column - Amount Details */}
                          <div className="space-y-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                              <div className="text-sm text-blue-600 font-medium mb-2">
                                Montant à recharger
                              </div>
                              <div className="text-3xl font-bold text-blue-700">
                                {finalAmount}€
                              </div>
                            </div>
                          </div>

                          {/* Right Column - Payment Method */}
                          <div className="space-y-6">
                            {selectedCoin && (
                              <div className="flex items-center gap-3">
                                <img
                                  src={selectedCoin.image}
                                  alt={selectedCoin.full_name}
                                  className="w-8 h-8"
                                />
                                <span className="font-medium">
                                  {selectedCoin.full_name}
                                </span>
                              </div>
                            )}
                            <Alert className="bg-yellow-50 border-yellow-200">
                              <AlertDescription className="text-yellow-700">
                                Important: N'envoyez que des USDT sur le réseau
                                TRC20. Les autres réseaux ne sont pas supportés.
                              </AlertDescription>
                            </Alert>
                          </div>
                        </div>

                        <Button
                          className="w-full h-12 text-lg"
                          onClick={handleConfirm}
                          disabled={isLoading}
                        >
                          {isLoading
                            ? "Chargement..."
                            : "Confirmer le rechargement"}
                        </Button>
                      </DialogContent>
                    </Dialog>

                    {/* Payment Instructions Dialog */}
                    <Dialog
                      open={!!paymentAddress && !timerExpired}
                      onOpenChange={(open) => {
                        if (!open) {
                          setPaymentAddress("");
                          setPaymentId("");
                          setPaymentResponse(null);
                          setTimer(null);
                          setTimerExpired(false);
                        }
                      }}
                    >
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-center">
                            Instructions de paiement
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-6">
                          {paymentResponse && (
                            <>
                              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                <div className="text-sm text-blue-600 font-medium mb-2">
                                  Montant à envoyer
                                </div>
                                <div className="text-3xl font-bold text-blue-700 flex items-center gap-2">
                                  {paymentResponse.pay_amount}{" "}
                                  {paymentResponse.pay_currency.toUpperCase()}
                                  {(() => {
                                    const coin = COINS.find(
                                      (c) =>
                                        c.currency_code ===
                                        paymentResponse.pay_currency,
                                    );
                                    return coin ? (
                                      <img
                                        src={coin.image}
                                        alt={coin.full_name}
                                        className="w-7 h-7 inline-block align-middle"
                                      />
                                    ) : null;
                                  })()}
                                </div>
                              </div>
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-sm text-gray-700">
                                  Expire dans :
                                </span>
                                <span className="ml-2 font-mono text-lg text-red-600">
                                  {timer !== null
                                    ? formatTimer(timer)
                                    : "--:--"}
                                </span>
                                {timerExpired && (
                                  <span className="text-red-600 font-semibold mt-2">
                                    Le temps est écoulé. Cette demande de
                                    paiement a expiré.
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                {(() => {
                                  const coin = COINS.find(
                                    (c) =>
                                      c.currency_code ===
                                      paymentResponse.pay_currency,
                                  );
                                  return coin ? (
                                    <>
                                      <img
                                        src={coin.image}
                                        alt={coin.full_name}
                                        className="w-8 h-8"
                                      />
                                      <span className="font-medium">
                                        {coin.full_name}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="font-medium">
                                      {paymentResponse.pay_currency.toUpperCase()}
                                    </span>
                                  );
                                })()}
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-700">
                                    Adresse de paiement
                                  </label>
                                  <div className="mt-1 flex items-center gap-2">
                                    <code className="bg-gray-100 p-2 rounded flex-1 overflow-x-auto">
                                      {paymentResponse.pay_address}
                                    </code>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          paymentResponse.pay_address,
                                        );
                                        toast({
                                          title: "Copié!",
                                          description:
                                            "L'adresse a été copiée dans le presse-papiers.",
                                        });
                                      }}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <Alert className="bg-yellow-50 border-yellow-200">
                                  <AlertDescription className="text-yellow-700">
                                    Important:
                                    <ul className="list-disc list-inside mt-2">
                                      <li>
                                        Envoyez exactement le montant indiqué en{" "}
                                        {paymentResponse.pay_currency.toUpperCase()}
                                        .
                                      </li>
                                      <li>Le montant doit être exact</li>
                                      <li>
                                        La transaction peut prendre quelques
                                        minutes
                                      </li>
                                    </ul>
                                  </AlertDescription>
                                </Alert>
                              </div>
                            </>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <div className="text-center mt-8 mb-4">
                      <div className="text-sm lg:text-base text-black mt-2">
                        Montant minimum de {MIN_TOPUP_USDT} USDT pour les dons
                        en cryptomonnaies
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
                      onClick={handleContinue}
                    >
                      {isLoading
                        ? "Chargement..."
                        : "Payer en Crypto - " + finalAmount + "€"}
                    </Button>
                  </div>
                </TabsContent>

                {/* PayPal */}
                <TabsContent value="paypal" className="space-y-4">
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
                        onClick={() =>
                          copyToClipboard("ongsoutienplus@gmail.com", "paypal")
                        }
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Payment Method Selection Dialog */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              // Reload the page when dialog is closed
              window.location.reload();
            }
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
                  onClick={() => handlePaymentMethodSelect("mobile-money")}
                >
                  <Smartphone className="w-6 h-6 mr-3 text-orange-600" />
                  <div className="text-left">
                    <div className="font-semibold">Mobile Money</div>
                    <div className="text-sm text-gray-500">
                      Orange Money, MTN Money, etc.
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-4 px-6"
                  onClick={() => handlePaymentMethodSelect("wallet")}
                >
                  <Wallet className="w-6 h-6 mr-3 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold">Portefeuille</div>
                    <div className="text-sm text-gray-500">
                      Paiement rapide et sécurisé
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-4 px-6"
                  onClick={() => handlePaymentMethodSelect("bank-card")}
                >
                  <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold">Carte bancaire</div>
                    <div className="text-sm text-gray-500">
                      Visa, Mastercard, etc.
                    </div>
                  </div>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBankCardSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      value={bankCardData.nom}
                      onChange={(e) => handleInputChange("nom", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      value={bankCardData.prenom}
                      onChange={(e) =>
                        handleInputChange("prenom", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="telephone">Numéro de téléphone *</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={bankCardData.telephone}
                    onChange={(e) =>
                      handleInputChange("telephone", e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={bankCardData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="adresse">Adresse *</Label>
                  <Input
                    id="adresse"
                    value={bankCardData.adresse}
                    onChange={(e) =>
                      handleInputChange("adresse", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ville">Ville *</Label>
                    <Input
                      id="ville"
                      value={bankCardData.ville}
                      onChange={(e) =>
                        handleInputChange("ville", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="codePostal">Code postal *</Label>
                    <Input
                      id="codePostal"
                      type="text"
                      pattern="[0-9]{5}"
                      maxLength={5}
                      value={bankCardData.codePostal}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                        handleInputChange("codePostal", value);
                      }}
                      className={
                        bankCardData.codePostal.length > 0 &&
                        bankCardData.codePostal.length !== 5
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                      placeholder="12345"
                      required
                    />
                    {bankCardData.codePostal.length > 0 &&
                      bankCardData.codePostal.length !== 5 && (
                        <p className="text-red-500 text-xs mt-1">
                          Le code postal doit contenir exactement 5 chiffres
                        </p>
                      )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="pays">Pays *</Label>
                  <Select
                    value={bankCardData.pays}
                    onValueChange={(value) => handleInputChange("pays", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre pays" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {countriesList.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowBankCardForm(false);
                      setSelectedPaymentMethod("");
                    }}
                    className="flex-1"
                  >
                    Retour
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleBankCardSubmit}
                  >
                    Payer {finalAmount}€
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
