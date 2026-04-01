import { Header } from "@/components/layout/header"
import { BottomNavigation } from "@/components/layout/bottom-navigation"
import { ContactSection } from "@/components/sections/contact"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <ContactSection />
      </main>
      <BottomNavigation />
    </div>
  )
}
