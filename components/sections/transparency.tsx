"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Download, PieChart, FileText, Award, TrendingUp } from "lucide-react"
import { useAppStore } from "@/lib/store"
import Image from "next/image"

export function TransparencySection() {
  const { fundAllocation } = useAppStore()

  return (
    <section
      id="transparence"
      className="py-6 md:py-20 bg-gray-50 md:bg-gradient-to-br md:from-gray-50 md:to-indigo-50"
    >
      <div className="container mx-auto px-4 max-w-screen-xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <div className="hidden md:inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-6">
            <PieChart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-indigo-700 md:bg-gradient-to-r md:from-indigo-600 md:to-indigo-800 md:bg-clip-text md:text-transparent mb-4 md:mb-6">
            Transparence
          </h2>
          <p className="text-sm md:text-lg text-gray-600 md:max-w-2xl md:mx-auto md:leading-relaxed mb-8">
            Nous nous engageons à utiliser vos dons de manière responsable et transparente.
            <span className="hidden md:inline">
              {" "}
              Découvrez exactement comment vos contributions font la différence.
            </span>
          </p>
        </div>

        {/* Fund Allocation */}
        <div className="bg-white p-4 md:p-12 rounded-lg md:rounded-2xl shadow-sm md:shadow-2xl md:border md:border-gray-100 mb-6 md:mb-8">
          <div className="flex items-center mb-6 md:mb-8">
            <div className="hidden md:block w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center mr-4">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold md:text-2xl text-gray-800 text-lg md:text-xl">Répartition des fonds</h3>
          </div>

          <div className="space-y-4 md:space-y-8">
            {fundAllocation.map((item, index) => (
              <div key={index} className="md:group">
                <div className="flex justify-between mb-3 md:items-center md:mb-4">
                  <span className="text-sm md:text-lg font-medium md:text-gray-700 md:group-hover:text-indigo-600 md:transition-colors">
                    {item.category}
                  </span>
                  <span className="text-sm md:text-xl font-medium md:font-bold text-indigo-700 md:bg-indigo-50 md:px-3 md:py-1 md:rounded-lg">
                    {item.percentage}%
                  </span>
                </div>
                <div className="relative">
                  <Progress
                    value={item.percentage}
                    className="h-3 md:h-4 md:bg-gray-100 md:rounded-full md:overflow-hidden"
                  />
                  <div
                    className="hidden md:block absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents & Certifications - Desktop Only */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Documents */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Documents officiels</h3>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 px-6 border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl transition-all duration-300 group"
              >
                <Download className="w-5 h-5 mr-3 text-indigo-600 group-hover:scale-110 transition-transform" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 group-hover:text-indigo-700 break-words">
                    Rapport annuel 2023
                  </div>
                  <div className="text-sm text-gray-500 break-words">Impact détaillé et financements</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 px-6 border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl transition-all duration-300 group"
              >
                <Download className="w-5 h-5 mr-3 text-indigo-600 group-hover:scale-110 transition-transform" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 group-hover:text-indigo-700 break-words">
                    États financiers
                  </div>
                  <div className="text-sm text-gray-500 break-words">Comptes certifiés par expert-comptable</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Nos certifications</h3>
            </div>

            <div className="text-center">
              <div className="relative w-full max-w-xs mx-auto mb-6">
                <Image
                  src="/images/certifications/certificate-badge.png"
                  alt="Certification officielle Espoir Global"
                  width={300}
                  height={300}
                  className="w-full h-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300 hover:scale-105 transform transition-transform"
                />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Nous sommes certifiés par les organismes de contrôle les plus exigeants pour garantir la transparence et
                l'efficacité de nos actions humanitaires.
              </p>
              <div className="mt-4 inline-flex items-center bg-green-50 px-4 py-2 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-700">Certification Validée</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Certifications */}
        <div className="md:hidden bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg text-center">Nos certifications</h3>
          <div className="text-center">
            <div className="relative w-32 mx-auto mb-4">
              <Image
                src="/images/certifications/certificate-badge.png"
                alt="Certification officielle"
                width={128}
                height={128}
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="inline-flex items-center bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs font-medium text-green-700">Certifié</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
