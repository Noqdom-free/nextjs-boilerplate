"use client";

import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import Image from "next/image";

export function NoqdomBanner() {
  return (
    <div className="border-b bg-gradient-to-r from-primary/5 to-primary/10 print:hidden">
      <div className="container mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Left: Logo + Branding */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
              <Image
                src="https://mmjpypikonolxacflati.supabase.co/storage/v1/object/public/app-assets/app%20settings%20assets/1758731472993.jpeg"
                alt="Noqdom Logo"
                fill
                className="object-contain rounded"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold text-foreground">
                Noqdom
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Professional Tools, Always Free
              </span>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="default"
              size="sm"
              asChild
              className="text-xs sm:text-sm"
            >
              <a
                href="https://noqdom.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download More Tools
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-1.5"
            >
              <a
                href="https://linkedin.com/company/noqdom"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with Noqdom on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
