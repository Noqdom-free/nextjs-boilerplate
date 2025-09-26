"use client";

import { LockSimple } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";

interface PrivacyNoticeProps {
  className?: string;
  showIcon?: boolean;
  customMessage?: string;
}

export function PrivacyNotice({
  className = "",
  showIcon = true,
  customMessage
}: PrivacyNoticeProps) {
  const defaultMessage = `🔒 Your Information Stays Private
All banking and payment details are stored only on your device (local storage).
Nothing is sent to our servers or stored in any database. Your sensitive
information never leaves your computer, ensuring complete privacy and security.`;

  const message = customMessage || defaultMessage;

  return (
    <Card className={`border-emerald-200 bg-emerald-50/50 ${className}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          {showIcon && (
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
              <LockSimple
                className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600"
                weight="bold"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm sm:text-base text-emerald-800 leading-relaxed whitespace-pre-line">
              {message}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}