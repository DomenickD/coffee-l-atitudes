"use client";

import React, { useState } from "react";
import { Building2, CheckCircle2, Mail, Phone, Send } from "lucide-react";

export function WholesaleInquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgType, setOrgType] = useState("Office");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: `${name.trim()} (${orgType})`.trim(),
          source: `wholesale-${orgType.toLowerCase().replace(/\s+/g, "-")}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to send inquiry right now.");
      }
      setStatus("done");
      setMessage(
        "Thanks! James received your wholesale inquiry and will reach out shortly."
      );
      setName("");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to submit.");
    }
  }

  return (
    <div className="grid gap-10 rounded-3xl border border-crema-200 bg-espresso-950 p-8 text-crema-100 shadow-xl sm:p-12 lg:grid-cols-2 lg:items-center">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-crema-300/30 bg-white/5 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-crema-300">
          <Building2 className="h-3.5 w-3.5" />
          Tampa Bay Wholesale &amp; Delivery
        </span>
        <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Need coffee for your church, office, or food truck?
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-crema-200/85 sm:text-base">
          We roast fresh and deliver specialty coffee—from single-origin bags to
          5lb bulk roasts and commercial brewers—to churches, offices, cafés,
          and food trucks across Tampa Bay.
        </p>

        <div className="mt-6 flex flex-wrap gap-5 text-sm text-crema-200">
          <a
            href="mailto:James@coffeelatitudes.com"
            className="inline-flex items-center gap-2 font-medium text-crema-300 hover:text-white"
          >
            <Mail className="h-4 w-4" />
            James@coffeelatitudes.com
          </a>
          <a
            href="tel:+18135758000"
            className="inline-flex items-center gap-2 font-medium text-crema-300 hover:text-white"
          >
            <Phone className="h-4 w-4" />
            (813) 575-8000
          </a>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
      >
        <div>
          <label
            htmlFor="wholesale-name"
            className="block text-xs font-semibold uppercase tracking-wider text-crema-300"
          >
            Your Name / Business
          </label>
          <input
            id="wholesale-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Grace Fellowship / Tampa Tech Co."
            className="mt-1.5 w-full rounded-xl border border-white/15 bg-espresso-900/90 px-4 py-2.5 text-sm text-white placeholder:text-crema-200/45 focus:border-crema-300 focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="wholesale-email"
              className="block text-xs font-semibold uppercase tracking-wider text-crema-300"
            >
              Email Address
            </label>
            <input
              id="wholesale-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@organization.com"
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-espresso-900/90 px-4 py-2.5 text-sm text-white placeholder:text-crema-200/45 focus:border-crema-300 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="wholesale-type"
              className="block text-xs font-semibold uppercase tracking-wider text-crema-300"
            >
              Organization Type
            </label>
            <select
              id="wholesale-type"
              value={orgType}
              onChange={(e) => setOrgType(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-espresso-900/90 px-4 py-2.5 text-sm text-white focus:border-crema-300 focus:outline-none"
            >
              <option value="Church">Church / Ministry</option>
              <option value="Office">Office / Workplace</option>
              <option value="Food Truck">Food Truck / Mobile Bar</option>
              <option value="Restaurant">Restaurant / Bakery</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta-500 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-terracotta-400 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {status === "loading" ? "Sending Inquiry..." : "Request Wholesale Info"}
        </button>

        {message && (
          <p
            className={`flex items-center gap-2 text-xs ${
              status === "error" ? "text-terracotta-400" : "text-crema-300"
            }`}
          >
            {status === "done" && <CheckCircle2 className="h-4 w-4 flex-shrink-0" />}
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
