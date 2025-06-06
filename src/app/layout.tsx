import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/layout/QueryProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "JobBit",
  description: "Generated by create next app",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
