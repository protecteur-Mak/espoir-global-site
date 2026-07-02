import { Header } from "@/components/layout/header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import ConfirmationContentWithSuspense from "@/components/sections/confirmation-content";

// Force le rendu dynamique pour éviter les erreurs de cache (416)
export const dynamic = 'force-dynamic';

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <ConfirmationContentWithSuspense />
      </main>
      <BottomNavigation />
    </div>
  );
}
