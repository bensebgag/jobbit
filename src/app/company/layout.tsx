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
  { label: "Mange Job Offers", href: "/company" },
  { label: "Enterprise Information", href: "/company/info" },
  { label: "Jobs For Company", href: "/company/jobs" },
  { label: "Security", href: "/company/securite" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Navigation />
      <Container styleElement="my-10 md:my-20 h-full">
        <div className="flex flex-col md:flex-row bg-gray-50">
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
                    pathname === item.href
                      ? "border-r-4 border-blue-600 text-blue-600"
                      : ""
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
