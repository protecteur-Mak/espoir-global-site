"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Heart, Users, Gift } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SupportSection() {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState("one-time");

  const donationAmounts = [
    { amount: 20, label: "Repas", description: "Nourrit une famille" },
    { amount: 50, label: "Fournitures", description: "Équipe un enfant" },
    { amount: 100, label: "Soins", description: "Soigne plusieurs personnes" },
  ];

  const monthlyAmounts = [
    { amount: 15, label: "Soutien", description: "Aide régulière" },
    { amount: 30, label: "Éducation", description: "Scolarise un enfant" },
    { amount: 50, label: "Famille", description: "Soutient une famille" },
  ];

  const handleAmountSelect = (amount: number, type: string) => {
    setSelectedAmount(amount);
    setSelectedType(type);
  };

  const handleDonateClick = () => {
    const params = new URLSearchParams();
    if (selectedAmount) {
      params.set("amount", selectedAmount.toString());
    }
    params.set("type", selectedType);

    router.push(`/paiement?${params.toString()}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <section id="soutien" className="py-6 md:py-16">
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-indigo-700 mb-3 md:mb-4">
            Comment Soutenir
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Choisissez la façon dont vous souhaitez contribuer à notre mission.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-1 mb-6 max-w-4xl mx-auto">
          <Tabs
            defaultValue="one-time"
            className="w-full"
            onValueChange={setSelectedType}
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 h-auto">
              <TabsTrigger
                value="one-time"
                className="text-xs md:text-sm py-2 md:py-3"
              >
                Don unique
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                className="text-xs md:text-sm py-2 md:py-3"
              >
                Don mensuel
              </TabsTrigger>
              <TabsTrigger
                value="sponsorship"
                className="text-xs md:text-sm py-2 md:py-3"
              >
                Parrainage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="one-time" className="p-4 md:p-6">
              <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
                {donationAmounts.map((item) => (
                  <div
                    key={item.amount}
                    className={`border-2 rounded-lg p-3 md:p-4 text-center transition-all cursor-pointer ${
                      selectedAmount === item.amount &&
                      selectedType === "one-time"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                    onClick={() => handleAmountSelect(item.amount, "one-time")}
                  >
                    <div className="text-lg md:text-2xl font-bold text-indigo-700 mb-1">
                      {item.amount}€
                    </div>
                    <div className="text-xs md:text-sm font-medium text-gray-700 mb-1">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 hidden md:block">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full md:w-auto px-8 py-3"
                  onClick={handleDonateClick}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Faire un don maintenant
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="p-4 md:p-6">
              <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
                {monthlyAmounts.map((item) => (
                  <div
                    key={item.amount}
                    className={`border-2 rounded-lg p-3 md:p-4 text-center transition-all cursor-pointer ${
                      selectedAmount === item.amount &&
                      selectedType === "monthly"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                    onClick={() => handleAmountSelect(item.amount, "monthly")}
                  >
                    <div className="text-lg md:text-2xl font-bold text-indigo-700 mb-1">
                      {item.amount}€
                    </div>
                    <div className="text-xs md:text-sm font-medium text-gray-700 mb-1">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 hidden md:block">
                      {item.description}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">par mois</div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full md:w-auto px-8 py-3"
                  onClick={handleDonateClick}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Devenir donateur mensuel
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="sponsorship" className="p-4 md:p-6">
              <div className="space-y-4 md:space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-indigo-700 mb-2">
                    Parrainez un enfant
                  </h3>
                  <div
                    className={`bg-indigo-50 rounded-lg p-4 mb-4 cursor-pointer transition-all ${
                      selectedAmount === 35 && selectedType === "sponsorship"
                        ? "ring-2 ring-indigo-500 bg-indigo-100"
                        : "hover:bg-indigo-100"
                    }`}
                    onClick={() => handleAmountSelect(35, "sponsorship")}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-indigo-700 mb-1">
                      35€
                    </div>
                    <div className="text-sm text-gray-600">par mois</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                  <p className="text-sm md:text-base text-gray-700 mb-4 text-center">
                    Avec 35€ par mois, vous changez la vie d'un enfant en lui
                    offrant:
                  </p>

                  <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                    <div className="flex items-center text-sm md:text-base">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 md:mr-3 flex-shrink-0"></div>
                      <span>Accès à l'éducation</span>
                    </div>
                    <div className="flex items-center text-sm md:text-base">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 md:mr-3 flex-shrink-0"></div>
                      <span>Soins médicaux</span>
                    </div>
                    <div className="flex items-center text-sm md:text-base">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 md:mr-3 flex-shrink-0"></div>
                      <span>Alimentation équilibrée</span>
                    </div>
                    <div className="flex items-center text-sm md:text-base">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 md:mr-3 flex-shrink-0"></div>
                      <span>Soutien psychologique</span>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-gray-600 text-center mb-6">
                    Vous recevrez régulièrement des nouvelles et pourrez
                    échanger des lettres.
                  </p>
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full md:w-auto px-8 py-3"
                    onClick={handleDonateClick}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Parrainer un enfant
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-medium text-sm md:text-base">
                Paiement 100% sécurisé
              </h3>
              <p className="text-xs text-gray-500">
                Vos données sont protégées
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 rounded p-4 text-sm text-gray-800">
              <p>
                Paiements sécurisés via Mobile Money, Crypto, PayPal et Virement
                bancaire
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
