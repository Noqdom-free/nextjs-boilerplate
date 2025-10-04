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
  const defaultMessage = `All information details are stored only on your device (local storage).`;

  const message = customMessage || defaultMessage;

  return (
    <div className={`p-3 border border-border bg-muted/30 rounded-md ${className}`}>
      <div className="flex items-center gap-2">
        {showIcon && (
          <LockSimple
            className="w-4 h-4 text-muted-foreground flex-shrink-0"
            weight="regular"
          />
        )}
        <div className="text-sm text-muted-foreground">
          {message}
        </div>
      </div>
    </div>
  );
}