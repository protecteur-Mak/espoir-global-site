import { Header } from "@/components/layout/header"
import { BottomNavigation } from "@/components/layout/bottom-navigation"
import { PartnersContent } from "@/components/sections/partners-content"

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <PartnersContent />
      </main>
      <BottomNavigation />
    </div>
  )
}
