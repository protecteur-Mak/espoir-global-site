import { Header } from "@/components/layout/header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import PaymentContentWithSuspense from "@/components/sections/payment-content";

// Désactive le cache Vercel pour cette page et stoppe les boucles de requêtes
export const dynamic = 'force-dynamic';

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <PaymentContentWithSuspense />
      </main>
      <BottomNavigation />
    </div>
  );
}
