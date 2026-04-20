"use client";

import type { PricingCard } from "@/core/fumadocs/schemas/pricing";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

import { AppCard } from "@/components/card/app-card";
import { AppCardBody } from "@/components/card/app-card-body";
import { Icon } from "@/components/shared/icon";
import { AppLink } from "@/components/shared/app-link";

type Props = {
  annualPrice: number;
  card: PricingCard;
  isAnnual: boolean;
  planType: "basic" | "pro" | "static";
  monthlyPrice: number;
};

function mapButtonVariant(
  heroVariant: "bordered" | "shadow" | "solid",
  heroColor: "default" | "primary",
): "default" | "outline" | "secondary" {
  if (heroVariant === "bordered") return "outline";
  if (heroColor === "default") return "secondary";
  return "default";
}

export function PricingCardComponent({ annualPrice, card, isAnnual, monthlyPrice, planType }: Props) {
  const dynamicPrice = planType !== "static" ? `${Math.round(isAnnual ? annualPrice / 12 : monthlyPrice)}` : card.price;

  const transformedFeatures = card.features.map((text) => ({
    icon: Check,
    text,
  }));

  const buttonVariant = mapButtonVariant(card.buttonVariant, card.buttonColor);
  const hasShadow = card.buttonVariant === "shadow";

  return (
    <AppCard className={`h-full ${card.cardClassName || ""}`}>
      <AppCardBody>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-x-xl">{card.title}</h3>

            {card.badge && (
              <span className="px-2 py-0.5 text-x-xs bg-primary/20 text-primary rounded-full font-medium">
                {card.badge}
              </span>
            )}
          </div>

          <p className="text-x-sm text-subdued h-10">{card.description}</p>
        </div>

        <div className="mb-6">
          <div>
            <span className="text-x-3xl">{dynamicPrice}</span>

            {card.priceSubtext && <span className="ml-1 text-muted-foreground">{card.priceSubtext}</span>}
          </div>
        </div>

        <Button asChild className={`w-full ${hasShadow ? "shadow-lg" : ""}`} size="lg" variant={buttonVariant}>
          <AppLink href={card.buttonHref}>{card.buttonText}</AppLink>
        </Button>

        <div className="mt-6 mb-1 space-y-3">
          {transformedFeatures.map((feature, featureIndex) => (
            <div key={featureIndex} className="flex items-center">
              <Icon className="text-primary dark:text-primary mr-3 shrink-0" icon={feature.icon} size="sm" />

              <span className="text-x-sm">{feature.text}</span>
            </div>
          ))}
        </div>
      </AppCardBody>
    </AppCard>
  );
}
