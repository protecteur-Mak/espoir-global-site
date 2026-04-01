"use client";

import type React from "react";

import Link from "next/link";
import { Home, Users, Heart, Handshake, MessageCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function BottomNavigation() {
  const { activeSection, setActiveSection } = useAppStore();
  const router = useRouter();

  const navItems = [
    {
      id: "accueil",
      href: "/",
      label: "Accueil",
      icon: Home,
      isSection: true,
    },
    {
      id: "mission",
      href: "/#mission",
      label: "Mission",
      icon: Users,
      isSection: true,
    },
    {
      id: "donner",
      href: "/paiement",
      label: "Donner",
      icon: Heart,
      isSpecial: true,
      isSection: false,
    },
    {
      id: "partenaires",
      href: "/partenaires",
      label: "Partenaires",
      icon: Handshake,
      isSection: false,
    },
    {
      id: "contact",
      href: "/contact",
      label: "Contact",
      icon: MessageCircle,
      isSection: false,
    },
  ];

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems
        .filter((item) => item.isSection)
        .map((item) => ({
          id: item.id,
          element: document.getElementById(item.id),
        }));

      const scrollPosition = window.scrollY + 100; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setActiveSection]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string,
    isSection: boolean
  ) => {
    if (isSection && href.startsWith("#")) {
      // Only handle section navigation for hash links
      e.preventDefault();
      setActiveSection(id);

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
      router.push(href);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
      <div className="flex justify-around items-center py-2 max-w-sm mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          if (item.isSpecial) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex flex-col items-center w-1/5 cursor-pointer"
                onClick={(e) =>
                  handleNavClick(e, item.href, item.id, item.isSection)
                }
              >
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center -mt-5 shadow-md">
                  <Icon className="text-white text-xl w-6 h-6" />
                </div>
                <span className="text-xs mt-1 text-gray-500">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center w-1/5 cursor-pointer"
              onClick={(e) =>
                handleNavClick(e, item.href, item.id, item.isSection)
              }
            >
              <Icon
                className={`text-lg w-5 h-5 ${isActive && item.isSection ? "text-indigo-700" : "text-gray-500"}`}
              />
              <span
                className={`text-xs mt-1 ${isActive && item.isSection ? "text-indigo-700" : "text-gray-500"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
