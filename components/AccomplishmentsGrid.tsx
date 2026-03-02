"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format";
import Image from "next/image";
import type { Accomplishment } from "@/lib/types";
import { toViewableImageUrl } from "@/lib/image";

interface AccomplishmentsGridProps {
  accomplishments: Accomplishment[];
}

export default function AccomplishmentsGrid({ accomplishments }: AccomplishmentsGridProps) {
  const display = accomplishments.slice(0, 6);

  return (
    <div className="grid grid-cols-3 gap-5 px-10 py-5 h-full">
      {display.map((item, i) => (
        <AccomplishmentCard key={item.id} item={item} index={i} />
      ))}
    </div>
  );
}

function AccomplishmentCard({ item, index }: { item: Accomplishment; index: number }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = toViewableImageUrl(item.action_photo_url);

  return (
    <div
      className="tv-card flex flex-col overflow-hidden rounded-xl border-border tv-glow-cyan animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image area */}
      <div className="relative h-52 w-full bg-surface overflow-hidden">
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={item.accomplishment_name}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted/30">
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5 flex-1 overflow-y-auto">
        <h3
          className="text-xl font-bold text-foreground leading-tight"
          style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
        >
          {item.accomplishment_name}
        </h3>
        <p className="text-base text-muted leading-relaxed">
          {item.description}
        </p>
        <span className="mt-auto pt-2 text-sm text-accent/60 font-medium tracking-wide tabular-nums shrink-0">
          {formatDate(item.accomplishment_date)}
        </span>
      </div>
    </div>
  );
}
