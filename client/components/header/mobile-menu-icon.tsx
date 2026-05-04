"use client";

import { FaBars } from "react-icons/fa";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileMenuItems } from "@/components/header/mobile-menu-items";
const MobileMenuIcon = () => {
  return (
    <div className="block md:hidden">
      <Sheet>
        <SheetTrigger className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background/90 shadow-sm backdrop-blur-sm transition hover:bg-muted/80">
          <FaBars className="h-4 w-4 text-foreground/75" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[min(88vw,22rem)] border-r border-border/70 bg-background/95 p-0 backdrop-blur-xl"
        >
          <MobileMenuItems />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenuIcon;
