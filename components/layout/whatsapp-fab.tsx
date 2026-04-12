import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_CHAT_URL = "https://wa.me/22891164952";

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_CHAT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 md:bottom-8 md:right-6 md:h-16 md:w-16"
      aria-label="Nous contacter sur WhatsApp"
    >
      <FaWhatsapp className="h-8 w-8 md:h-9 md:w-9" aria-hidden />
    </a>
  );
}
