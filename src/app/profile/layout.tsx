"use client";
import Navigation from "@/components/ui/Navigation";
import type React from "react";

import Container from "@/components/layout/Container";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";
import { useState } from "react";

const menuItems = [
  { label: "Personal information", href: "/profile" },
  { label: "Documents", href: "/profile/documents" },
  { label: "Technologies ", href: "/profile/technologies" },
  { label: "Your applications", href: "/profile/candidatures" },
  { label: "Security", href: "/profile/securite" },
  { label: "Resume generator", href: "/profile/generator" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Navigation />
      <Container styleElement="my-10 md:my-20 h-full">
        <div className="flex h-full flex-col md:flex-row bg-gray-50">
          {/* Mobile menu toggle */}

          {/* Sidebar - hidden on mobile unless toggled */}
          <aside
            className={`${
              menuOpen ? "block" : "hidden"
            } md:block w-full md:w-64 lg:w-80 md:h-screen py-4 md:py-6 px-4 md:pl-6 border-r bg-white md:bg-transparent`}
          >
            <nav className="space-y-2 md:space-y-4">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block py-2 text-sm md:text-base text-gray-600 font-medium hover:text-gray-900 transition",
                    pathname === item.href ? "border-r-4 border-blue-600" : ""
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="w-full">{children}</div>
        </div>
      </Container>
      <Footer />
    </>
  );
}
