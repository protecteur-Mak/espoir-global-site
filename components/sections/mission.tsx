"use client"

import { Home, BookOpen, Heart } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import CountUp from "react-countup"

export function MissionSection() {
  const { statistics } = useAppStore()
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.3 })

  const services = [
    { icon: Home, label: "Logement", color: "bg-indigo-100" },
    { icon: BookOpen, label: "Éducation", color: "bg-indigo-100" },
    { icon: Heart, label: "Santé", color: "bg-indigo-100" },
  ]

  return (
    <section id="mission" className="py-8 md:py-16" ref={ref}>
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="bg-white shadow-sm rounded-lg p-4 md:p-8 lg:p-12 -mt-8 md:-mt-12 relative z-10 mx-2 md:mx-0">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-indigo-700 mb-4 md:mb-6">Notre Mission</h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
            Depuis 2020, nous nous engageons à soutenir financièrement les orphelins et les veuves dans le monde entier,
            en leur offrant une chance de reconstruire leur vie avec dignité et espoir.
          </p>

          <div className="grid grid-cols-3 gap-3 md:gap-8 lg:gap-12 mt-6 md:mt-12">
            {services.map((service, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-full ${service.color} flex items-center justify-center mb-2 md:mb-4 transform transition-transform duration-300 hover:scale-110`}
                >
                  <service.icon className="w-6 h-6 md:w-8 md:h-8 lg:w-9 lg:h-9 text-indigo-600" />
                </div>
                <span className="text-xs md:text-sm lg:text-base text-center font-medium">{service.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 md:mt-12 bg-gray-50 p-3 md:p-6 lg:p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              <div className="flex justify-between md:flex-col md:items-center text-center">
                <span className="text-sm md:text-base lg:text-lg font-medium">Personnes aidées</span>
                <span className="text-sm md:text-2xl lg:text-3xl font-bold text-indigo-700">
                  {isVisible ? (
                    <CountUp
                      start={0}
                      end={statistics.peopleHelped}
                      duration={2.5}
                      separator=" "
                      suffix="+"
                      useEasing={true}
                      easingFn={(t, b, c, d) => {
                        // easeOutQuart
                        return -c * ((t = t / d - 1) * t * t * t - 1) + b
                      }}
                    />
                  ) : (
                    "0+"
                  )}
                </span>
              </div>
              <div className="flex justify-between md:flex-col md:items-center text-center">
                <span className="text-sm md:text-base lg:text-lg font-medium">Pays d'intervention</span>
                <span className="text-sm md:text-2xl lg:text-3xl font-bold text-indigo-700">
                  {isVisible ? (
                    <CountUp
                      start={0}
                      end={statistics.countries}
                      duration={2}
                      useEasing={true}
                      easingFn={(t, b, c, d) => {
                        // easeOutQuart
                        return -c * ((t = t / d - 1) * t * t * t - 1) + b
                      }}
                    />
                  ) : (
                    "0"
                  )}
                </span>
              </div>
              <div className="flex justify-between md:flex-col md:items-center text-center">
                <span className="text-sm md:text-base lg:text-lg font-medium">Projets en cours</span>
                <span className="text-sm md:text-2xl lg:text-3xl font-bold text-indigo-700">
                  {isVisible ? (
                    <CountUp
                      start={0}
                      end={statistics.activeProjects}
                      duration={1.8}
                      useEasing={true}
                      easingFn={(t, b, c, d) => {
                        // easeOutQuart
                        return -c * ((t = t / d - 1) * t * t * t - 1) + b
                      }}
                    />
                  ) : (
                    "0"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
