import React from "react";
import { Award, MapPin, Mountain, Sprout } from "lucide-react";

export interface FarmLotSummary {
  id: string;
  lotCode: string;
  name: string;
  originRegion: string;
  country: string;
  latitude: string;
  longitude: string;
  elevation: string;
  producer: string;
  varietal: string;
  processMethod: string;
  harvestSeason: string;
  cupScore: number;
  tastingNotes: string[];
  story: string;
  farmGatePremiumPct: number;
  imageUrl: string;
}

export function LotTrackerCard({ lot }: { lot: FarmLotSummary }) {
  return (
    <article
      data-testid={`lot-card-${lot.lotCode}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-crema-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-48 overflow-hidden bg-espresso-900">
        <img
          src={lot.imageUrl}
          alt={`${lot.name} — ${lot.country}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/90 via-espresso-950/25 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-espresso-950/80 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-crema-200 backdrop-blur-sm">
            LOT {lot.lotCode}
          </span>
          <span className="rounded-full bg-canopy-800/90 px-2.5 py-1 text-[11px] font-medium text-crema-50 backdrop-blur-sm">
            +{lot.farmGatePremiumPct}% Farm-Gate
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <p className="font-mono text-[11px] text-crema-300">
              {lot.latitude} • {lot.longitude}
            </p>
            <h3 className="font-serif text-xl font-semibold leading-snug">
              {lot.country}
            </h3>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
            <Award className="h-3.5 w-3.5 text-crema-300" />
            <span>{lot.cupScore.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-canopy-700">
          {lot.originRegion}
        </p>
        <h4 className="mt-1 font-serif text-lg font-semibold text-espresso-950">
          {lot.name}
        </h4>
        <p className="mt-2.5 text-sm leading-relaxed text-espresso-800">
          {lot.story}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-crema-200 py-4 text-xs">
          <div>
            <dt className="flex items-center gap-1 text-espresso-600">
              <MapPin className="h-3.5 w-3.5 text-terracotta-600" /> Producer
            </dt>
            <dd className="mt-0.5 font-medium text-espresso-950">
              {lot.producer}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-espresso-600">
              <Mountain className="h-3.5 w-3.5 text-canopy-700" /> Elevation
            </dt>
            <dd className="mt-0.5 font-medium text-espresso-950">
              {lot.elevation}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-espresso-600">
              <Sprout className="h-3.5 w-3.5 text-canopy-700" /> Varietal
            </dt>
            <dd className="mt-0.5 font-medium text-espresso-950">
              {lot.varietal}
            </dd>
          </div>
          <div>
            <dt className="text-espresso-600">Process</dt>
            <dd className="mt-0.5 font-medium text-espresso-950">
              {lot.processMethod}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {lot.tastingNotes.map((note) => (
            <span
              key={note}
              className="rounded-full bg-crema-100 px-2.5 py-1 text-[11px] font-medium text-espresso-800"
            >
              {note}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
