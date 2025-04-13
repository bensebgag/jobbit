"use client"
import Navigation from "@/components/ui/Navigation";
import Container from "@/components/layout/Container";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import Footer from "@/components/layout/Footer";

const menuItems = [
    { label: "Personal information",href: "/profile"  },
    { label: "Documents" , href: "/profile/documents" },
    { label: "Technologies & notifications", href: "/profile/technologies" },
    { label: "Your applications", href: "/profile/candidatures" },
    { label: "Security", href: "/profile/securite" },
    { label: "Resume generator", href: "/profile/generator" },
];

export  default function Layout({ children }: { children: React.ReactNode }){
    const pathname = usePathname();
    return(
      <>
          <Navigation/>
          <Container styleElement="my-20 h-full ">
              <div className={"flex bg-gray-50  "}>
              <aside className="w-80 h-screen   py-6 pl-6 border-r">
                  <nav className="space-y-4">
                      {menuItems.map((item, index) => (
                          <Link

                              key={index}
                              href={item.href}
                              className={cn(
                                  "block py-2 text-gray-600 font-medium hover:text-gray-900 transition",
                                  pathname === item.href
                                      ? "border-r-4 border-blue-600"
                                      : ""
                              )}
                          >
                              {item.label}
                          </Link>
                      ))}
                  </nav>
              </aside>
                  {children}
               </div>
          </Container>
          <Footer/>
      </>
    )
}