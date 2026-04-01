import { Header } from "@/components/layout/header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import PaymentContentWithSuspense from "@/components/sections/payment-content";

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
