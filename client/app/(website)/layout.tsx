import { Header } from "@/components/header/header";
import MobileMenu from "@/components/header/mobile-menu";
import Topbar from "@/components/header/top-bar";
import Footer from "@/components/layout/footer";
import { ReactNode } from "react";
import Script from "next/script";

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <Header />
      <MobileMenu />

      <main className="h-full flex-1 pb-20 pt-26 md:pb-0 md:pt-25 lg:pt-25">
        {children}
      </main>

      {/* 🔥 Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <Footer />
    </div>
  );
}
