"use client";

import type { Pricing } from "@/core/fumadocs/schemas/pricing";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PricingCardComponent } from "./pricing-card";

type Props = Pricing;

export function PricingSection({
  ariaLabelSlider,
  ariaLabelTabs,
  monthly,
  pricingCards: mdxPricingCards,
  users,
  yearly,
}: Props) {
  const [userCount, setUserCount] = useState(1);
  const [isAnnual, setIsAnnual] = useState(true);

  const maxUsers = 25;
  const pricingByPlan = {
    basic: {
      monthlyPerUser: 12,
      yearlyMonthlyEquivalentPerUser: 10,
    },
    pro: {
      monthlyPerUser: 29,
      yearlyMonthlyEquivalentPerUser: 24,
    },
  } as const;
  const yearlyDiscountPercent = Math.round(
    (1 - pricingByPlan.basic.yearlyMonthlyEquivalentPerUser / pricingByPlan.basic.monthlyPerUser) * 100,
  );
  const yearlyTitle = (
    <>
      {yearly}

      <span className="ml-1 text-x-xs font-bold">{`-${yearlyDiscountPercent}%`}</span>
    </>
  );

  return (
    <>
      <div className="max-w-xl mx-auto mb-8">
        <div className="flex justify-between mb-6 items-center">
          <div>
            <h3 className="text-x-lg mb-2">{users}</h3>

            <div className="text-x-3xl text-primary dark:text-primary">{userCount}</div>
          </div>

          <Tabs
            aria-label={ariaLabelTabs}
            value={isAnnual ? "yearly" : "monthly"}
            onValueChange={(key) => setIsAnnual(key === "yearly")}
          >
            <TabsList>
              <TabsTrigger value="monthly">{monthly}</TabsTrigger>

              <TabsTrigger value="yearly">{yearlyTitle}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Slider
          aria-label={ariaLabelSlider}
          className="w-full mb-3"
          max={maxUsers}
          min={1}
          step={1}
          value={[userCount]}
          onValueChange={(values) => setUserCount(values[0] ?? 1)}
        />

        <div className="flex justify-between text-x-xs text-muted-foreground">
          {[1, 5, 10, 15, 20, maxUsers].map((value) => (
            <span key={value} className={userCount >= value ? "font-semibold text-primary" : ""}>
              {value}
            </span>
          ))}
        </div>
      </div>

      <div className="grid min-[1280px]:grid-cols-4 min-[900px]:grid-cols-2 min-[500px]:grid-cols-2 min-[400px]:grid-cols-1 gap-6 max-w-7xl mx-auto justify-center items-stretch">
        {mdxPricingCards.map((card, index) => {
          const normalizedTitle = card.title.toLowerCase();
          const planType = normalizedTitle === "basic" ? "basic" : normalizedTitle === "pro" ? "pro" : "static";
          const monthlyPrice = planType === "static" ? 0 : userCount * pricingByPlan[planType].monthlyPerUser;
          const annualPrice =
            planType === "static" ? 0 : userCount * pricingByPlan[planType].yearlyMonthlyEquivalentPerUser * 12;

          return (
            <PricingCardComponent
              key={index}
              annualPrice={annualPrice}
              card={card}
              isAnnual={isAnnual}
              monthlyPrice={monthlyPrice}
              planType={planType}
            />
          );
        })}
      </div>
    </>
  );
}
