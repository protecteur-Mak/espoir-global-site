"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const slides = [
    {
      image: "/images/slideshow/slide1.png",
      title: "Ensemble, Soutenons les Orphelins et les Veuves",
      subtitle: "Chaque geste compte pour changer des vies",
    },
    {
      image: "/images/slideshow/slide2.jpeg",
      title: "Éducation pour Tous",
      subtitle: "Donnons à chaque enfant la chance d'apprendre",
    },
    {
      image: "/images/slideshow/slide3.jpeg",
      title: "Joie et Espoir",
      subtitle: "Redonnons le sourire aux enfants dans le besoin",
    },
    {
      image: "/images/slideshow/slide4.png",
      title: "Un Avenir Meilleur",
      subtitle: "Construisons ensemble un monde plus juste",
    },
    {
      image: "/images/slideshow/slide5.png",
      title: "Force et Détermination",
      subtitle: "Soutenons leur courage et leur résilience",
    },
    {
      image: "/images/slideshow/slide6.png",
      title: "Autonomie des Veuves",
      subtitle: "Aidons les veuves à reconstruire leur vie avec dignité",
    },
    {
      image: "/images/slideshow/slide7.png",
      title: "Entrepreneuriat Féminin",
      subtitle: "Soutenons les femmes dans leur indépendance économique",
    },
  ]

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [slides.length])

  const handleDonateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push("/paiement")
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  return (
    <section id="accueil" className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Slideshow Images */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-white text-xl md:text-3xl lg:text-5xl font-bold mb-3 md:mb-4 transition-all duration-500">
            {slides[currentSlide].title}
          </h1>
          <p className="text-white text-sm md:text-base lg:text-lg mb-4 md:mb-6 max-w-2xl transition-all duration-500">
            {slides[currentSlide].subtitle}
          </p>
          <Button
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 border-none text-black font-semibold w-full md:w-auto"
            onClick={handleDonateClick}
          >
            Faire un don maintenant
          </Button>
        </div>
      </div>
    </section>
  )
}
