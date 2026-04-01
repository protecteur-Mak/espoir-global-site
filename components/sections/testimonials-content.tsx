"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import CountUp from "react-countup";

export function TestimonialsContent() {
  const { ref: statsRef, isVisible: statsVisible } = useIntersectionObserver({
    threshold: 0.3,
  });

  const allTestimonials = [
    {
      id: "1",
      name: "Fatima Traoré",
      age: 45,
      location: "Bamako, Mali",
      category: "Micro-entreprise",
      story:
        "Après la mort de mon mari, je ne savais pas comment nourrir mes quatre enfants. Grâce au soutien d'Espoir Global, j'ai pu démarrer mon commerce de légumes au marché. Aujourd'hui, mes enfants mangent à leur faim et vont tous à l'école. Je peux même aider d'autres veuves de mon quartier.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hGI35XcqmhEWca6Y0XCvsuyErkpC6Q.png",
      dateSupported: "Février 2023",
      impact: "Commerce créé, 4 enfants scolarisés",
    },
    {
      id: "2",
      name: "Kofi et Ama",
      age: 8,
      location: "Kumasi, Ghana",
      category: "Éducation",
      story:
        "Nous sommes frère et sœur et nous avons perdu nos parents dans un accident. Notre grand-mère ne pouvait pas payer l'école. Maintenant, grâce à votre aide, nous allons à l'école tous les jours ! Nous apprenons l'anglais, les mathématiques et nous rêvons de devenir médecins pour aider les autres.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-J9JVyAj6oMp51gYb6NXQ8vV75KKp0k.png",
      dateSupported: "Septembre 2022",
      impact: "2 enfants scolarisés, fournitures fournies",
    },
    {
      id: "3",
      name: "Aisha Diallo",
      age: 32,
      location: "Dakar, Sénégal",
      category: "Autonomisation",
      story:
        "Veuve avec trois enfants, je vendais quelques fruits dans la rue pour survivre. Le programme de micro-crédit m'a permis d'agrandir mon commerce. Maintenant, j'ai un étal permanent au marché et j'emploie même deux autres femmes. Mes enfants sont fiers de leur maman !",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XZkqaAXeTEHdmiNnPcCFATbkQJZlX7.png",
      dateSupported: "Mai 2023",
      impact: "Commerce développé, 2 emplois créés",
    },
    {
      id: "4",
      name: "Les enfants de l'école",
      age: 9,
      location: "Ouagadougou, Burkina Faso",
      category: "Éducation collective",
      story:
        "Nous sommes une classe d'orphelins et d'enfants vulnérables. Grâce à Espoir Global, notre école a été rénovée et nous avons maintenant des livres, des cahiers et même un repas chaud chaque jour. Nous sommes si heureux d'apprendre ensemble !",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0kVERlhnRnJxeOAbw25SjgQFClRiKv.png",
      dateSupported: "Janvier 2023",
      impact: "École rénovée, 45 enfants aidés",
    },
    {
      id: "5",
      name: "Aminata Keita",
      age: 38,
      location: "Conakry, Guinée",
      category: "Commerce",
      story:
        "Après avoir perdu mon mari, je me suis retrouvée seule avec cinq enfants. Le marché était ma seule option, mais je n'avais pas de capital. Grâce au soutien reçu, j'ai pu acheter des marchandises en gros. Aujourd'hui, mon commerce prospère et mes enfants ont un avenir.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZJB0b3ND4oS8aQfFpSGvyJhyQYkrkl.png",
      dateSupported: "Août 2022",
      impact: "Commerce établi, 5 enfants soutenus",
    },
    {
      id: "6",
      name: "Samuel et ses amis",
      age: 10,
      location: "Accra, Ghana",
      category: "Sport et éducation",
      story:
        "Nous vivions dans la rue et nous n'allions pas à l'école. Le centre d'Espoir Global nous a accueillis et nous a donné une chance. Maintenant, nous étudions le matin et nous faisons du sport l'après-midi. Nous sommes forts et nous avons des rêves !",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HISA5evxe9f0nUwyxXvaFuwiw42Yt3.png",
      dateSupported: "Octobre 2022",
      impact: "6 enfants des rues scolarisés",
    },
    {
      id: "7",
      name: "Mariam Coulibaly",
      age: 41,
      location: "Abidjan, Côte d'Ivoire",
      category: "Formation professionnelle",
      story:
        "Veuve depuis trois ans, je ne savais que faire pour nourrir mes enfants. La formation en couture que j'ai reçue a changé ma vie. J'ai maintenant mon propre atelier et je forme d'autres femmes. Ensemble, nous créons de beaux vêtements et nous gagnons notre vie dignement.",
      image: "/african-woman.jpg",
      dateSupported: "Mars 2023",
      impact: "Atelier créé, 8 femmes formées",
    },
    {
      id: "9",
      name: "Grace Mensah",
      age: 29,
      location: "Tamale, Ghana",
      category: "Entrepreneuriat",
      story:
        "Jeune veuve avec deux enfants, je rêvais de créer mon entreprise mais n'avais pas les moyens. Le programme de soutien aux femmes entrepreneures m'a donné ma chance. Aujourd'hui, je vends des produits locaux et j'ai même ouvert une petite boutique. Mes enfants sont ma fierté !",
      image: "/african-young-woman.jpg",
      dateSupported: "Novembre 2023",
      impact: "Boutique ouverte, indépendance financière",
    },
  ];

  return (
    <section className="py-8 md:py-16 pb-24 md:pb-16">
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
              Témoignages
            </h1>
            <p className="text-gray-600">
              Découvrez les histoires inspirantes de ceux que nous avons pu
              aider grâce à votre générosité.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          ref={statsRef}
        >
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-1">
              {statsVisible ? (
                <CountUp
                  start={0}
                  end={5280}
                  duration={2.5}
                  separator=" "
                  suffix="+"
                  useEasing={true}
                  easingFn={(t, b, c, d) => {
                    // easeOutQuart
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                  }}
                />
              ) : (
                "0+"
              )}
            </h3>
            <p className="text-gray-600 text-sm">Personnes aidées</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-1">
              {statsVisible ? (
                <CountUp
                  start={0}
                  end={27}
                  duration={2}
                  useEasing={true}
                  easingFn={(t, b, c, d) => {
                    // easeOutQuart
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                  }}
                />
              ) : (
                "0"
              )}
            </h3>
            <p className="text-gray-600 text-sm">Pays d'intervention</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-1">
              {statsVisible ? (
                <CountUp
                  start={0}
                  end={8}
                  duration={1.8}
                  useEasing={true}
                  easingFn={(t, b, c, d) => {
                    // easeOutQuart
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                  }}
                />
              ) : (
                "0"
              )}
            </h3>
            <p className="text-gray-600 text-sm">Années d'engagement</p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTestimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-[200px]">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={`Histoire de ${testimonial.name}`}
                  fill
                  className="object-cover"
                  style={
                    testimonial.id === "7" || testimonial.id === "9"
                      ? { objectPosition: "center 20%" }
                      : undefined
                  }
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-indigo-700">
                    {testimonial.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {testimonial.name}, {testimonial.age} ans
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mb-3 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {testimonial.location}
                </p>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  "{testimonial.story}"
                </p>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Aidé en {testimonial.dateSupported}</span>
                  </div>
                  <p className="text-xs text-indigo-600 font-medium mt-1">
                    {testimonial.impact}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-indigo-50 p-8 rounded-lg">
          <h2 className="text-xl md:text-2xl font-bold text-indigo-700 mb-4">
            Vous aussi, vous pouvez changer des vies
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Chaque don, petit ou grand, fait la différence. Rejoignez notre
            communauté de donateurs et aidez-nous à écrire de nouvelles
            histoires d'espoir.
          </p>
          <Link href="/#soutien">
            <Button
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              Faire un don maintenant
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
