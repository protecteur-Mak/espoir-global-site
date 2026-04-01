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
import { Smartphone, CreditCard, Wallet } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCinetPay } from "@/hooks/use-cinetpay";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Utility function to get country code (you'll need to implement this)
const getCountryCode = (countryName: string): string => {
  // Implement your country code mapping logic here
  const countryMap: Record<string, string> = {
    France: "FR",
    "United States": "US",
    Canada: "CA",
    // Add more countries as needed
  };
  return countryMap[countryName] || "FR";
};

// Get countries list (you'll need to implement this)
const getCountriesList = () => {
  return [
    { code: "FR", name: "France" },
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    // Add more countries as needed
  ];
};

interface CinetPayPaymentProps {
  amount: number;
  description?: string;
  onSuccess?: (result: { success: boolean; transactionId: string }) => void;
  onError?: (error: any) => void;
  successRedirectUrl?: string;
}

export function CinetPayPayment({
  amount,
  description = "Payment",
  onSuccess,
  onError,
  successRedirectUrl,
}: CinetPayPaymentProps) {
  const router = useRouter();
  const { handleMobilePayment } = useCinetPay();
  const { toast } = useToast();

  // Conversion rate EUR to XOF (West African CFA)
  const EUR_TO_XOF = 655;
  const finalAmountXOF = Math.round(amount * EUR_TO_XOF);

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

  const handlePayment = async (
    method: string,
    channels?: "MOBILE_MONEY" | "CREDIT_CARD" | "WALLET" | "ALL"
  ) => {
    try {
      const paymentData = {
        amount: finalAmountXOF,
        description: description,
        customerName:
          bankCardData.nom && bankCardData.prenom
            ? `${bankCardData.prenom} ${bankCardData.nom}`
            : "Customer",
        customerEmail: bankCardData.email || "customer@example.com",
        customerPhone: bankCardData.telephone || "0000000000",
        customerSurname: bankCardData.prenom || "Customer",
        customerAddress: bankCardData.adresse || "Address",
        customerCity: bankCardData.ville || "City",
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
          title: "Payment successful!",
          description: "Payment completed successfully",
        });

        if (onSuccess) {
          onSuccess(result);
        }

        if (successRedirectUrl) {
          router.push(successRedirectUrl);
        }
      } else {
        toast({
          title: "Payment cancelled",
          description: "Payment was cancelled or failed",
          variant: "destructive",
        });

        if (onError) {
          onError(new Error("Payment cancelled"));
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment error",
        description: "An error occurred during payment",
        variant: "destructive",
      });

      if (onError) {
        onError(error);
      }
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
        title: "Required fields",
        description: "Please fill in all required fields",
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
        title: "Invalid postal code",
        description: "Postal code must contain exactly 5 digits",
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

  return (
    <div>
      {/* Mobile Money Tab Content */}
      <TabsContent value="mobile" className="space-y-4">
        <div className="text-center p-6">
          <Smartphone className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-4">
            Mobile Money / WAVE / Credit Card
          </h3>
          <p className="text-gray-600 mb-6">
            Secure payment via Mobile Money (Orange Money, MTN Mobile Money,
            Moov Money), Wallet (WAVE) or credit card. Fast and secure
            transaction.
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8"
              onClick={() => setIsDialogOpen(true)}
            >
              Pay now - {amount}€
            </Button>
          </div>
        </div>
      </TabsContent>

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
            <DialogTitle>Choose your payment method</DialogTitle>
            <DialogDescription>
              Select the payment method that suits you best.
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
                  <div className="font-semibold">Wallet</div>
                  <div className="text-sm text-gray-500">
                    Fast and secure payment
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
                  <div className="font-semibold">Credit Card</div>
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
                  <Label htmlFor="nom">Last Name *</Label>
                  <Input
                    id="nom"
                    value={bankCardData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="prenom">First Name *</Label>
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
                <Label htmlFor="telephone">Phone Number *</Label>
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
                <Label htmlFor="adresse">Address *</Label>
                <Input
                  id="adresse"
                  value={bankCardData.adresse}
                  onChange={(e) => handleInputChange("adresse", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ville">City *</Label>
                  <Input
                    id="ville"
                    value={bankCardData.ville}
                    onChange={(e) => handleInputChange("ville", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="codePostal">Postal Code *</Label>
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
                        Postal code must contain exactly 5 digits
                      </p>
                    )}
                </div>
              </div>

              <div>
                <Label htmlFor="pays">Country *</Label>
                <Select
                  value={bankCardData.pays}
                  onValueChange={(value) => handleInputChange("pays", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
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
                  Back
                </Button>
                <Button className="flex-1" onClick={() => handleBankCardSubmit}>
                  Pay {amount}€
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
