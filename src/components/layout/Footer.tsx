"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

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
      setMessage(data.message || "Welcome to the Harvest Dispatch.");
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
          {/* Brand & Contact */}
          <div>
            <p className="font-serif text-2xl font-semibold tracking-[0.14em] text-white">
              COFFEE LATITUDES
            </p>
            <p className="mt-3 text-sm leading-relaxed text-crema-200/80">
              Small-batch direct-trade roasters celebrating micro-lots across
              the global Coffee Belt—from North Kona volcanic slopes to the
              cloud forests of Papua New Guinea and Nicaragua.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <a
                href="mailto:james@coffeelatitudes.com"
                className="flex items-center gap-2 text-crema-300 hover:text-white"
              >
                <Mail className="h-4 w-4" />
                james@coffeelatitudes.com
              </a>
              <p className="flex items-center gap-2 text-crema-200/75">
                <MapPin className="h-4 w-4" />
                Roastery &amp; Tasting Bar • Pick-Up Daily 7am – 4pm
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-crema-400">
                Explore
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link href="/" className="hover:text-white">
                    Brick Wall Stage
                  </Link>
                </li>
                <li>
                  <Link href="/menu" className="hover:text-white">
                    Café Menu &amp; Pick-Up
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=bagged-coffee" className="hover:text-white">
                    Bagged Coffee
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=merch" className="hover:text-white">
                    Roastery Merch
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white">
                    Origin Traceability
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-crema-400">
                Tools
              </h3>
              <ul className="mt-4 space-y-2.5">
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

          {/* Harvest Dispatch Newsletter */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-crema-400">
              Harvest Dispatch
            </h3>
            <p className="mt-3 text-sm text-crema-200/80">
              First access to fresh micro-lot releases, cupping notes, and farm
              partner stories.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address for Harvest Dispatch"
                className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-crema-200/50 focus:border-crema-300 focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                aria-label="Subscribe"
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
            © {new Date().getFullYear()} Coffee Latitudes (coffeelatitudes.com).
            All rights reserved.
          </p>
          <p className="font-mono">
            Direct Trade • 19.6° N Kona • 5.8° S PNG • 13.1° N Nicaragua
          </p>
        </div>
      </div>
    </footer>
  );
}
