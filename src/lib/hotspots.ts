export interface HeroHotspot {
  id: string;
  index: number;
  label: string;
  shortLabel: string;
  tagline: string;
  href: string;
  startSec: number;
  endSec: number;
  /** Desktop horizontal position percentage (0-100) */
  xPct: number;
  /** Desktop vertical position percentage (0-100) */
  yPct: number;
  /** Mobile horizontal position percentage (0-100) */
  mobileXPct: number;
  /** Mobile vertical position percentage (0-100) */
  mobileYPct: number;
}

export const HERO_LOOP_DURATION_SEC = 10;

export const DEFAULT_HOTSPOTS: HeroHotspot[] = [
  {
    id: "order-pickup",
    index: 1,
    label: "Order Here / Pick-Up Here",
    shortLabel: "Pick-Up Here",
    tagline: "Skip the line — fresh espresso & pour-overs ready at the bar",
    href: "/menu#pickup",
    startSec: 0.0,
    endSec: 2.0,
    xPct: 22,
    yPct: 34,
    mobileXPct: 50,
    mobileYPct: 24,
  },
  {
    id: "cafe-menu",
    index: 2,
    label: "Café Menu",
    shortLabel: "Café Menu",
    tagline: "Seasonal lattes, single-origin V60, & 18-hour cold brew",
    href: "/menu",
    startSec: 2.0,
    endSec: 4.0,
    xPct: 76,
    yPct: 30,
    mobileXPct: 50,
    mobileYPct: 38,
  },
  {
    id: "bagged-coffee",
    index: 3,
    label: "Bagged Coffee",
    shortLabel: "Bagged Coffee",
    tagline: "Kona, Papua New Guinea & Nicaragua direct-trade micro-lots",
    href: "/shop?category=bagged-coffee",
    startSec: 4.0,
    endSec: 6.0,
    xPct: 20,
    yPct: 62,
    mobileXPct: 50,
    mobileYPct: 52,
  },
  {
    id: "merch",
    index: 4,
    label: "Merch",
    shortLabel: "Merch",
    tagline: "Wheel-thrown stoneware, organic tees & waxed canvas gear",
    href: "/shop?category=merch",
    startSec: 6.0,
    endSec: 8.0,
    xPct: 78,
    yPct: 60,
    mobileXPct: 50,
    mobileYPct: 66,
  },
  {
    id: "learn-about-us",
    index: 5,
    label: "Learn About Us",
    shortLabel: "Learn About Us",
    tagline: "Trace every harvest back to the latitude & family farm",
    href: "/about",
    startSec: 8.0,
    endSec: 10.0,
    xPct: 50,
    yPct: 78,
    mobileXPct: 50,
    mobileYPct: 80,
  },
];

export function getActiveHotspotId(
  currentTimeSec: number,
  hotspots: HeroHotspot[] = DEFAULT_HOTSPOTS
): string {
  const normalized =
    ((currentTimeSec % HERO_LOOP_DURATION_SEC) + HERO_LOOP_DURATION_SEC) %
    HERO_LOOP_DURATION_SEC;

  const match = hotspots.find(
    (spot) => normalized >= spot.startSec && normalized < spot.endSec
  );
  return match?.id ?? hotspots[0]?.id ?? "order-pickup";
}
