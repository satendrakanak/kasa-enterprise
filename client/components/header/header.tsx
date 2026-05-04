"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/logo";
import Container from "@/components/container";
import MobileMenuIcon from "@/components/header/mobile-menu-icon";
import { Navbar } from "@/components/header/navbar";
import { cn } from "@/lib/utils";
import { WebsiteNavUser } from "../auth/website-nav-user";
import { CartIcon } from "./cart-icon";

interface HeaderProps {
  isHomePage?: boolean;
}

export const Header = ({ isHomePage }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass = isHomePage
    ? scrolled
      ? "border-b border-border/70 bg-background/86 shadow-[0_16px_44px_-30px_rgba(15,23,42,0.32)] backdrop-blur-xl"
      : "bg-transparent"
    : "border-b border-border/70 bg-background/90 shadow-[0_16px_44px_-30px_rgba(15,23,42,0.26)] backdrop-blur-xl";

  return (
    <header
      className={cn(
        "fixed left-0 z-50 w-full transition-all duration-300",
        scrolled ? "top-0" : "top-15 md:top-10",
        headerClass,
      )}
    >
      <div className="relative">
        {!scrolled ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.14),transparent)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent)]" />
        ) : null}
        <Container>
          <div className="flex min-h-18 items-center justify-between gap-4">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <div className="md:hidden">
                <MobileMenuIcon />
              </div>
              <Logo />
            </div>

            {/* CENTER (Desktop Navbar) */}
            <div className="hidden lg:flex">
              <Navbar />
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 sm:gap-3">
              <CartIcon />

              <WebsiteNavUser />
            </div>
          </div>

          {/* Tablet Navbar */}
          <div className="mt-1 hidden justify-center border-t border-border/70 pt-3 md:flex lg:hidden">
            <Navbar />
          </div>
        </Container>
      </div>
    </header>
  );
};
