"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Heart, Share2, Home } from "lucide-react";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

export function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    setPaymentMethod(searchParams.get("method") || "");
    setAmount(searchParams.get("amount") || "");
  }, [searchParams]);

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "mobile-money":
      case "fedapay":
        return "Mobile Money / FedaPay";
      case "crypto":
        return "Cryptomonnaie";
      case "paypal":
        return "PayPal";
      case "bank":
        return "Virement bancaire";
      default:
        return "Mobile Money / FedaPay";
    }
  };

  const numericAmount = Number.parseInt(amount) || 0;
  const formattedAmount = numericAmount ? numericAmount.toLocaleString() : amount;

  const shareMessage = `Je viens de faire un don de ${formattedAmount} F CFA à Espoir Global pour soutenir les orphelins et veuves. Rejoignez-moi dans cette belle cause ! 💙`;

  return (
    <section className="py-8 md:py-16 pb-24 md:pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-4">
            Merci pour votre générosité !
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Votre don va directement changer la vie d'orphelins et de veuves
            dans le monde entier.
          </p>
        </div>

        {/* Payment Details */}
        <Card className="mb-8 border-emerald-100 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">
                Détails de votre don
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <p className="text-sm text-gray-600 mb-1">Montant</p>
                <p className="text-2xl font-bold text-emerald-900">{formattedAmount} F CFA</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">
                  Méthode de paiement
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {getPaymentMethodName(paymentMethod)}
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-xl text-center border border-emerald-100">
              <Heart className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <p className="text-lg font-semibold text-emerald-800 mb-2">
                Votre impact
              </p>
              <p className="text-gray-700 text-sm">
                Avec {formattedAmount} F CFA, vous permettez à{" "}
                {Math.max(1, Math.floor(numericAmount / 1000))} famille(s) de recevoir
                un repas complet, ou à{" "}
                {Math.max(1, Math.floor(numericAmount / 5000))} enfant(s) d'avoir des
                fournitures scolaires.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Share */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-8 text-center">
            <Share2 className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Partagez votre geste
            </h3>
            <p className="text-gray-600 mb-6">
              Inspirez vos proches en partageant votre engagement pour cette
              belle cause.
            </p>

            <div className="flex justify-center space-x-4">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
              >
                <FaWhatsapp className="w-6 h-6" />
              </a>
              <a
                href={`https://www.tiktok.com/share?text=${encodeURIComponent(shareMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-md"
              >
                <FaTiktok className="w-6 h-6" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">
            Continuez à faire la différence
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Votre générosité ne s'arrête pas là. Découvrez d'autres façons de
            soutenir notre mission et de devenir un véritable Bâtisseur
            d'Espoir.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/partenaires">
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-md"
              >
                Devenir Bâtisseur d'Espoir
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold"
              >
                <Home className="w-5 h-5 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ConfirmationContentWithSuspense() {
  return (
    <Suspense fallback={<div className="text-center py-12">Chargement de la confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
              }
