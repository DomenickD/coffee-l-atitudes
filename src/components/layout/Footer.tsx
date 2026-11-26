"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "footer" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to subscribe.");
      }
      setStatus("done");
      setMessage(data.message || "Welcome to the loop!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Subscription failed.");
    }
  }

  return (
    <footer
      id="contact"
      className="border-t border-espresso-800 bg-espresso-950 text-crema-200"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand & Tampa Café Info */}
          <div>
            <p className="font-serif text-2xl font-semibold tracking-[0.14em] text-white">
              COFFEE LATITUDES
            </p>
            <p className="mt-3 text-sm leading-relaxed text-crema-200/80">
              Neighborhood café &amp; small-batch specialty roastery in Tampa,
              Florida. Celebrate the moment it hits your lips.
            </p>
            <div className="mt-5 space-y-2.5 text-sm">
              <p className="flex items-start gap-2.5 text-crema-200/85">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-crema-300" />
                <span>6431 E. County Line Rd., Unit #110, Tampa, FL 33647</span>
              </p>
              <p className="flex items-start gap-2.5 text-crema-200/80">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-crema-300" />
                <span>Mon–Fri 7am–6pm • Sat 8am–5pm • Sun 9am–5pm</span>
              </p>
              <a
                href="tel:+18135758000"
                className="flex items-center gap-2.5 text-crema-300 hover:text-white"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                (813) 575-8000
              </a>
              <a
                href="mailto:James@coffeelatitudes.com"
                className="flex items-center gap-2.5 text-crema-300 hover:text-white"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                James@coffeelatitudes.com
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-crema-400">
                Shop &amp; Café
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link href="/menu" className="hover:text-white">
                    Tampa Café Menu
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=bagged-coffee&roast=light" className="hover:text-white">
                    Light Roasts
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=bagged-coffee&roast=medium" className="hover:text-white">
                    Medium Roasts
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=bagged-coffee&roast=dark" className="hover:text-white">
                    Dark Roasts
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=merch" className="hover:text-white">
                    Brewers &amp; Merch
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-crema-400">
                Roastery
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us &amp; Origins
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Brick Wall Stage
                  </Link>
                </li>
                <li>
                  <Link href="/?calibrate=1" className="hover:text-white">
                    Hotspot Calibrator
                  </Link>
                </li>
                <li>
                  <Link href="/api/health" className="hover:text-white">
                    System Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Stay in the Loop Newsletter */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-crema-400">
              Stay in the Loop
            </h3>
            <p className="mt-3 text-sm text-crema-200/80">
              Get menu updates, new single-origin releases, local Tampa event
              schedules, and coffee brewing tips straight from James.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address for Coffee Latitudes newsletter"
                className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-crema-200/50 focus:border-crema-300 focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                aria-label="Sign Up"
                className="inline-flex items-center justify-center rounded-full bg-terracotta-500 px-4 py-2.5 text-white transition hover:bg-terracotta-400 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            {message && (
              <p
                className={`mt-2.5 flex items-center gap-1.5 text-xs ${
                  status === "error" ? "text-terracotta-400" : "text-crema-300"
                }`}
              >
                {status === "done" && <CheckCircle2 className="h-3.5 w-3.5" />}
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-crema-200/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Coffee Latitudes LLC (coffeelatitudes.com).
            All rights reserved.
          </p>
          <p className="font-mono">
            Tampa, FL • Light, Medium, Dark &amp; Decaf Small-Batch Roastery
          </p>
        </div>
      </div>
    </footer>
  );
}
