"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CloudSun } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 fixed top-0 right-0 left-0 md:left-64 z-30 backdrop-blur-sm bg-background/80">
      <div className="w-full flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CloudSun className="h-4 w-4" />
          <span>AQI: 210 (Unhealthy)</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">28°C Haze</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <Button variant="ghost" size="icon" className="rounded-full">
           <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
}
