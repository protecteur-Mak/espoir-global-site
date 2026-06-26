"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Heart,
  Users,
  Star,
  Crown,
  Gift,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Donor = {
  id: string;
  name: string;
  image: string;
  location: string;
  whatsapp: string;
  phone: string;
  badge: string;
  badgeColor: string;
  accentColor: string;
};

const donors: Donor[] = [
  {
    id: "baba-emmaus",
    name: "Prophète BABA Emmaüs",
    image: "/images/team/baba-emmaus.png",
    location: "Congo Brazzaville",
    whatsapp: "242053673206",
    phone: "+242 05 367 32 06",
    badge: "⭐ VIP",
    badgeColor: "from-yellow-400 to-yellow-600",
    accentColor: "from-indigo-500/10 to-purple-500/10",
  },
];

export function PartnersContent() {
  const router = useRouter();
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const benefits = [
    {
      icon: Crown,
      title: "Reconnaissance publique",
      description: "Votre nom et photo honorés sur nos plateformes officielles",
    },
    {
      icon: Heart,
      title: "Impact direct",
      description:
        "Votre contribution change concrètement des vies chaque semaine",
    },
    {
      icon: Users,
      title: "Communauté exclusive",
      description: "Rejoignez un cercle de donateurs engagés et passionnés",
    },
    {
      icon: Gift,
      title: "Suivi personnalisé",
      description: "Recevez des nouvelles régulières de l'impact de vos dons",
    },
  ];

  const impactLevels = [
    {
      amount: "100€",
      frequency: "par semaine",
      impact: "Soutient 5 familles complètes",
      color: "bg-yellow-500",
    },
    {
      amount: "200€",
      frequency: "par semaine",
      impact: "Finance l'éducation de 10 enfants",
      color: "bg-orange-500",
    },
    {
      amount: "500€",
      frequency: "par mois",
      impact: "Construit un avenir pour 25 orphelins",
      color: "bg-red-500",
    },
  ];

  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/contact");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <>
    <section className="py-6 md:py-16 pb-20 md:pb-16">
      <div className="container mx-auto px-4 max-w-screen-xl">
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
              Nos Partenaires
            </h1>
            <p className="text-gray-600">
              Devenez Bâtisseur d'Espoir et changez des vies durablement.
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 md:p-12 rounded-2xl mb-8 md:mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400 rounded-full opacity-10 transform -translate-x-12 translate-y-12"></div>

          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mr-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                🌍 Devenez Bâtisseur d'Espoir
              </h2>
            </div>

            <p className="text-lg md:text-xl leading-relaxed mb-8 opacity-90">
              Grâce à nos Bâtisseurs d'Espoir, chaque orphelin retrouve le
              sourire et chaque veuve retrouve la force d'avancer. Ces donateurs
              engagés choisissent de contribuer régulièrement — 100 € ou plus
              par semaine ou par mois — pour soutenir durablement nos actions en
              faveur des veuves et des orphelins, à travers le monde.
            </p>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">
                ✨ Et si c'était à votre tour de faire une différence ?
              </h3>
              <p className="text-lg leading-relaxed opacity-90">
                En devenant Bâtisseur d'Espoir, vous rejoignez une communauté de
                cœurs généreux qui bâtissent, pierre après pierre, un avenir
                meilleur pour ceux que la vie a fragilisés. Nous aimerions vous
                connaître personnellement — votre nom et votre photo — pour vous
                honorer publiquement sur nos plateformes officielles, dans nos
                orphelinats et nos maisons de repos pour veuves, car votre
                engagement mérite d'être salué.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-700 mb-8">
            Les privilèges des Bâtisseurs d'Espoir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Levels */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-700 mb-8">
            Votre impact selon votre contribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {impactLevels.map((level, index) => (
              <Card
                key={index}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-2 ${level.color}`}
                ></div>
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-indigo-700 mb-2">
                      {level.amount}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {level.frequency}
                    </div>
                  </div>
                  <div
                    className={`w-16 h-16 ${level.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    {level.impact}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 md:p-12 rounded-2xl text-center border border-yellow-200 mb-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-6">
              📲 Prêt à devenir Bâtisseur d'Espoir ?
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Pour devenir Bâtisseur d'Espoir, contactez-nous directement sur
              WhatsApp via le lien disponible sur notre plateforme.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
              <a
                href="https://wa.me/22891164952"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 text-lg"
                >
                  <FaWhatsapp className="w-6 h-6 mr-3" />
                  Contacter sur WhatsApp
                </Button>
              </a>

              <span className="text-gray-500">ou</span>

              <Link href="/paiement">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold px-8 py-4 text-lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Faire un don maintenant
                </Button>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-xl font-bold text-indigo-700 mb-2">
                Votre geste change des vies.
              </p>
              <p className="text-lg text-gray-600">
                Ensemble, laissons une empreinte d'amour et de solidarité
                durable.
              </p>
            </div>
          </div>
        </div>

        {/* Official Donors */}
        <div className="mt-12 mb-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl mb-6 shadow-xl">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Nos Donnateurs Officiels
            </h2>
            <p className="text-lg text-gray-600 mb-2 max-w-3xl mx-auto leading-relaxed">
              Nous honorons nos partenaires officiels qui soutiennent fidèlement
              notre mission
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto"></div>
          </div>

          <div className="relative">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-20 -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full opacity-20 -z-10"></div>

            <div className="flex justify-center">
              {donors.map((donor) => (
                <div
                  key={donor.id}
                  className="group relative cursor-pointer max-w-xs w-full"
                  onClick={() => setSelectedDonor(donor)}
                >
                  <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                    <div className={`absolute top-4 right-4 bg-gradient-to-r ${donor.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                      {donor.badge}
                    </div>
                    <div className={`absolute top-0 left-0 w-16 h-16 bg-gradient-to-br ${donor.accentColor} rounded-br-3xl`}></div>

                    <div className="text-center relative z-10">
                      <div className="relative inline-block mb-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-yellow-400 shadow-2xl mx-auto relative">
                          <Image
                            src={donor.image}
                            alt={donor.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder-user.jpg";
                            }}
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                        {donor.name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-3">
                        <MapPin className="w-3 h-3" />
                        {donor.location}
                      </div>
                      <div className="inline-flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full border border-indigo-200">
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-indigo-700">
                          Partenaire Officiel
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-3">
                        Appuyez pour voir les coordonnées
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recognition message */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border border-indigo-100 max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  🙏 Merci à nos Donnateurs Officiels
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Grâce à leur engagement exceptionnel et leur générosité
                  continue, ces partenaires officiels permettent à notre
                  organisation de transformer des vies et d'apporter l'espoir là
                  où il est le plus nécessaire.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA to become Official Donor */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 md:p-12 rounded-3xl text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400 rounded-full opacity-10 transform translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-400 rounded-full opacity-10 transform -translate-x-16 translate-y-16"></div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-8 shadow-2xl">
              <Crown className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ✨ Rejoignez nos Donnateurs Officiels
            </h2>

            <p className="text-xl md:text-2xl leading-relaxed mb-8 opacity-90">
              Devenez un <strong>Bâtisseur d'Espoir</strong> et voyez votre nom
              honoré aux côtés de nos partenaires officiels
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <p className="text-lg leading-relaxed">
                En devenant Donnateur Officiel, vous bénéficiez d'une
                reconnaissance publique sur toutes nos plateformes et dans nos
                centres d'accueil. Votre engagement inspire d'autres à nous
                rejoindre dans cette noble mission.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-gray-100 font-bold px-10 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={handleContactClick}
              >
                <Mail className="w-6 h-6 mr-3" />
                Devenir Donnateur Officiel
              </Button>

              <span className="text-white/70">ou</span>

              <a
                href="https://wa.me/22891164952"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-indigo-700 hover:bg-white hover:text-indigo-400 font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300"
                >
                  <FaWhatsapp className="w-6 h-6 mr-3" />
                  WhatsApp Direct
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

    </section>

      {/* Modal donateur — portal pour éviter les problèmes de stacking context */}
      {mounted && selectedDonor && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedDonor(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDonor(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-yellow-400 shadow-2xl mx-auto relative">
                  <Image
                    src={selectedDonor.image}
                    alt={selectedDonor.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-user.jpg";
                    }}
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {selectedDonor.name}
              </h3>

              <div className={`inline-block bg-gradient-to-r ${selectedDonor.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full mb-6`}>
                {selectedDonor.badge} Partenaire Officiel
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Localisation</p>
                    <p className="text-base font-semibold text-gray-800">{selectedDonor.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <Phone className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Contact</p>
                    <p className="text-base font-semibold text-gray-800">{selectedDonor.phone}</p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${selectedDonor.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 hover:bg-green-100 transition-colors"
                >
                  <FaWhatsapp className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">WhatsApp</p>
                    <p className="text-base font-semibold text-green-700">{selectedDonor.phone}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
