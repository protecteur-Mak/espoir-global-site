"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, MapPin, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAppStore } from "@/lib/store"

export function ImpactSection() {
  const { impactStories } = useAppStore()

  return (
    <section id="impact" className="py-6 md:py-20 bg-gray-50 md:bg-gradient-to-br md:from-gray-50 md:to-indigo-50">
      <div className="container mx-auto px-4 max-w-screen-xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <div className="hidden md:inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-indigo-700 md:bg-gradient-to-r md:from-indigo-600 md:to-indigo-800 md:bg-clip-text md:text-transparent mb-4 md:mb-6">
            Notre Impact
          </h2>
          <p className="text-sm md:text-lg text-gray-600 md:max-w-2xl md:mx-auto md:leading-relaxed">
            Découvrez les histoires de ceux dont la vie a été transformée grâce à votre générosité.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="mb-8 md:mb-12">
          <div className="flex space-x-3 md:grid md:grid-cols-3 md:gap-6 md:space-x-0 overflow-x-auto md:overflow-visible pb-4 md:pb-0 px-1 md:justify-items-center md:max-w-5xl md:mx-auto">
            {impactStories.map((story, index) => (
              <Card
                key={story.id}
                className="w-[260px] md:w-full md:max-w-sm md:min-w-0 bg-white shadow-sm md:shadow-xl rounded-lg md:rounded-2xl overflow-hidden hover:shadow-lg md:hover:shadow-2xl transform md:hover:scale-105 transition-shadow md:transition-all duration-300 md:border-0 md:group flex-shrink-0"
              >
                <div className="relative h-[150px] md:h-[220px] lg:h-[240px] overflow-hidden">
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={`Histoire de ${story.name}`}
                    fill
                    className="object-cover md:group-hover:scale-110 md:transition-transform md:duration-500"
                  />
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 md:top-4 right-3 md:right-4">
                    <span className="bg-white/90 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full text-xs font-medium text-indigo-700 md:border md:border-white/20">
                      {story.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4 md:p-6">
                  <div className="mb-3 md:mb-4">
                    <h3 className="text-base md:text-xl font-semibold md:font-bold text-gray-900 md:group-hover:text-indigo-600 md:transition-colors mb-1 md:mb-2">
                      {story.name}, {story.age} ans
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 text-indigo-600 mr-1 md:mr-2" />
                      {story.location}
                    </p>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed md:line-clamp-4 break-words">
                    "{story.story}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-6">
          <Link href="/temoignages">
            <Button
              className="border-indigo-700 text-indigo-700 hover:bg-indigo-50 md:bg-gradient-to-r md:from-indigo-600 md:to-indigo-700 md:hover:from-indigo-700 md:hover:to-indigo-800 md:text-white md:px-8 md:py-4 md:rounded-xl md:font-semibold md:shadow-xl md:hover:shadow-2xl md:transform md:hover:scale-105 md:transition-all md:duration-300"
              variant="outline"
            >
              Voir plus d'histoires
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
