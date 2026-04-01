import { Header } from "@/components/layout/header"
import { BottomNavigation } from "@/components/layout/bottom-navigation"
import { HeroSection } from "@/components/sections/hero"
import { MissionSection } from "@/components/sections/mission"
import { ImpactSection } from "@/components/sections/impact"
import { SupportSection } from "@/components/sections/support"
import { TransparencySection } from "@/components/sections/transparency"
import { ContactSection } from "@/components/sections/contact"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <HeroSection />
        <MissionSection />
        <ImpactSection />
        <SupportSection />
        <TransparencySection />
        <ContactSection />
      </main>
      <BottomNavigation />
    </div>
  )
}
