"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { AmbientAudioToggle } from "@/components/audio/AmbientAudioToggle";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/menu", label: "MENU" },
  { href: "/shop", label: "SHOP" },
  { href: "/about", label: "ABOUT" },
  { href: "/#contact", label: "CONTACT" },
];

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solidHeader = !isHome || scrolled || mobileMenuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        solidHeader
          ? "border-b border-white/10 bg-espresso-950/92 shadow-lg backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Gold-Mountain-inspired white outline wordmark/logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 text-white"
          aria-label="Coffee Latitudes Home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 transition group-hover:border-crema-300">
            <svg
              viewBox="0 0 32 32"
              className="h-6 w-6 stroke-current"
              fill="none"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="11" />
              <ellipse cx="16" cy="16" rx="5.5" ry="11" />
              <path d="M5 12h22M5 20h22" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-semibold tracking-[0.16em] text-white">
              COFFEE LATITUDES
            </span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-crema-300/90">
              Farm-to-Cup Roastery
            </span>
          </span>
        </Link>

        {/* Minimal Top Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden items-center gap-7 md:flex"
        >
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : !link.href.includes("#") && pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold tracking-[0.22em] transition ${
                  active
                    ? "text-crema-300"
                    : "text-white/85 hover:text-crema-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Audio Toggle + Cart Button + Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          <AmbientAudioToggle compact={false} />

          <button
            type="button"
            onClick={openCart}
            data-testid="cart-open-button"
            aria-label={`Open cart (${itemCount} items)`}
            className="relative inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md transition hover:border-crema-300 hover:bg-white/20"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Bag</span>
            <span
              data-testid="cart-badge"
              className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-terracotta-500 px-1 text-[11px] font-bold text-white"
            >
              {itemCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="inline-flex rounded-full border border-white/25 p-2 text-white md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="border-t border-white/10 bg-espresso-950 px-6 py-4 md:hidden"
        >
          <div className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-sm font-semibold tracking-[0.2em] text-crema-100 hover:text-crema-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
