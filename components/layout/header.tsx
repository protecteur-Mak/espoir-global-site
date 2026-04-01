"use client";

import type React from "react";

import { Heart, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export function Header() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const router = useRouter();

  const navItems = [
    { href: "#accueil", label: "Accueil" },
    { href: "/#mission", label: "Mission" },
    { href: "/#impact", label: "Impact" },
    { href: "/partenaires", label: "Partenaires" },
    { href: "/#soutien", label: "Soutenir" },
    { href: "/#transparence", label: "Transparence" },
    { href: "/contact", label: "Contact" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setMobileMenuOpen(false);

      const targetElement = document.querySelector(href);
      if (targetElement) {
        const headerOffset = 80; // Account for fixed header
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    } else {
      // For page navigation, scroll to top after navigation
      e.preventDefault();
      setMobileMenuOpen(false);
      router.push(href);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  const handleDonateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/paiement");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-screen-xl">
        <div className="flex items-center">
          <Heart className="text-xl mr-2" />
          <Link
            href="/"
            className="font-semibold text-lg hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
          >
            Espoir Global
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-yellow-300 transition-colors"
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 border-none text-black font-medium"
            onClick={handleDonateClick}
          >
            Faire un don
          </Button>

          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium hover:text-indigo-600 transition-colors"
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
