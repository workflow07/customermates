"use client";

import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { observer } from "mobx-react-lite";
import NextLink from "next/link";

import { useRootStore } from "@/core/stores/root-store.provider";
import { usePathname } from "@/i18n/navigation";
import { AppLink } from "@/components/shared/app-link";
import { AppImage } from "@/components/shared/app-image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const PublicNavbar = observer(() => {
  const locale = useLocale();
  const t = useTranslations("");
  const { layoutStore } = useRootStore();
  const pathname = usePathname();
  const scheduleDemoHref =
    locale === "de"
      ? "https://calendly.com/customermates/produkt-demo"
      : "https://calendly.com/customermates/product-demo";

  function closeMenu() {
    layoutStore.setIsMenuOpen(false);
  }

  function isNavItemActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const publicNavItems = [
    { href: "/pricing", title: t("NavigationBar.pricing") },
    { href: "/features", title: t("NavigationBar.features") },
    { href: "/docs", title: t("NavigationBar.docs") },
  ];

  const logoAlt = t("Common.imageAlt.logo");
  const homeLabel = t("UserAvatar.home");
  const homeButton = (
    <AppLink aria-label={`${logoAlt} ${homeLabel}`} href="/" onClick={closeMenu}>
      <AppImage
        alt={logoAlt}
        className="object-contain select-none"
        height={24}
        loading="eager"
        src="customermates.svg"
        width={156}
      />

      <span className="sr-only">{`${logoAlt} ${homeLabel}`}</span>
    </AppLink>
  );

  const signInButton = (
    <Button asChild size="sm" variant="secondary" onClick={closeMenu}>
      <NextLink href="/auth/signin">{t("Common.actions.signIn")}</NextLink>
    </Button>
  );

  const scheduleDemoButton = (
    <Button asChild size="sm" variant="secondary" onClick={closeMenu}>
      <NextLink href={scheduleDemoHref} rel="noopener noreferrer" target="_blank">
        {t("Common.actions.scheduleDemo")}
      </NextLink>
    </Button>
  );

  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="hidden md:flex items-center gap-3">{homeButton}</div>

        <nav className="hidden md:flex items-center gap-3">
          {publicNavItems.map((item) => (
            <AppLink key={item.href} className={cn(!isNavItemActive(item.href) && "text-subdued")} href={item.href}>
              {item.title}
            </AppLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {scheduleDemoButton}

          {signInButton}
        </div>

        <div className="md:hidden flex items-center w-full justify-between">
          {homeButton}

          <Sheet open={layoutStore.isMenuOpen} onOpenChange={layoutStore.setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <Icon icon={layoutStore.isMenuOpen ? X : Menu} />
              </Button>
            </SheetTrigger>

            <SheetContent className="w-80 p-6" side="right">
              <SheetHeader className="p-0">
                <SheetTitle className="sr-only">{logoAlt}</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-3 pt-3">
                {publicNavItems.map((item) => (
                  <AppLink
                    key={item.href}
                    className={cn(!isNavItemActive(item.href) && "text-subdued")}
                    href={item.href}
                    onClick={closeMenu}
                  >
                    {item.title}
                  </AppLink>
                ))}

                {scheduleDemoButton}

                {signInButton}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
});
