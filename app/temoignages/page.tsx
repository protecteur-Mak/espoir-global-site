import { Header } from "@/components/layout/header"
import { BottomNavigation } from "@/components/layout/bottom-navigation"
import { TestimonialsContent } from "@/components/sections/testimonials-content"

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <TestimonialsContent />
      </main>
      <BottomNavigation />
    </div>
  )
}
