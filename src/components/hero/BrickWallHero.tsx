"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  Coffee,
  Compass,
  Copy,
  Crosshair,
  Move,
  Package,
  RotateCcw,
  Shirt,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import {
  DEFAULT_HOTSPOTS,
  getActiveHotspotId,
  HERO_LOOP_DURATION_SEC,
  HeroHotspot,
} from "@/lib/hotspots";

function HotspotIcon({ id }: { id: string }) {
  switch (id) {
    case "order-pickup":
      return <ShoppingBag className="h-4 w-4" />;
    case "cafe-menu":
      return <Coffee className="h-4 w-4" />;
    case "bagged-coffee":
      return <Package className="h-4 w-4" />;
    case "merch":
      return <Shirt className="h-4 w-4" />;
    case "learn-about-us":
    default:
      return <Compass className="h-4 w-4" />;
  }
}

export function BrickWallHero() {
  const searchParams = useSearchParams();
  const initialCalibrate = searchParams.get("calibrate") === "1";

  const [hotspots, setHotspots] = useState<HeroHotspot[]>(DEFAULT_HOTSPOTS);
  const [calibrateMode, setCalibrateMode] = useState<boolean>(initialCalibrate);
  const [videoAvailable, setVideoAvailable] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [manualScrub, setManualScrub] = useState<boolean>(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setCalibrateMode(searchParams.get("calibrate") === "1");
  }, [searchParams]);

  // Track mobile vs desktop viewport for responsive hotspot coordinates
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobileViewport(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Probe whether /media/brick-hero.mp4 exists so fallback renders immediately without console noise
  useEffect(() => {
    let active = true;
    fetch("/media/brick-hero.mp4", { method: "HEAD" })
      .then((res) => {
        if (active && !res.ok) {
          setVideoAvailable(false);
        }
      })
      .catch(() => {
        if (active) setVideoAvailable(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Sync currentTime from <video> or virtual 10-second loop clock when using fallback brick stage
  useEffect(() => {
    if (manualScrub) return;

    let rafId = 0;
    const startWallMs = performance.now();

    const tick = (now: number) => {
      const vid = videoRef.current;
      if (videoAvailable && vid && !vid.paused && !Number.isNaN(vid.currentTime)) {
        setCurrentTime(vid.currentTime % HERO_LOOP_DURATION_SEC);
      } else {
        const elapsedSec = ((now - startWallMs) / 1000) % HERO_LOOP_DURATION_SEC;
        setCurrentTime(elapsedSec);
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [videoAvailable, manualScrub]);

  const activeHotspotId = getActiveHotspotId(currentTime, hotspots);
  const activeHotspot =
    hotspots.find((h) => h.id === activeHotspotId) ?? hotspots[0];

  // Pointer drag-and-drop for ?calibrate=1 mode
  const handleStagePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!calibrateMode || !draggingId || !stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const xPct = Math.max(
        5,
        Math.min(95, Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10)
      );
      const yPct = Math.max(
        10,
        Math.min(90, Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10)
      );

      setHotspots((prev) =>
        prev.map((spot) => {
          if (spot.id !== draggingId) return spot;
          return isMobileViewport
            ? { ...spot, mobileXPct: xPct, mobileYPct: yPct }
            : { ...spot, xPct, yPct };
        })
      );
    },
    [calibrateMode, draggingId, isMobileViewport]
  );

  const handleStagePointerUp = useCallback(() => {
    setDraggingId(null);
  }, []);

  const handleCopyJson = useCallback(async () => {
    const payload = JSON.stringify(
      hotspots.map(({ id, label, startSec, endSec, xPct, yPct, mobileXPct, mobileYPct }) => ({
        id,
        label,
        startSec,
        endSec,
        xPct,
        yPct,
        mobileXPct,
        mobileYPct,
      })),
      null,
      2
    );
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be restricted in headless contexts
    }
  }, [hotspots]);

  const handleScrub = (val: number) => {
    setManualScrub(true);
    setCurrentTime(val);
    if (videoRef.current && videoAvailable) {
      videoRef.current.pause();
      videoRef.current.currentTime = val;
    }
  };

  return (
    <section
      ref={stageRef}
      onPointerMove={handleStagePointerMove}
      onPointerUp={handleStagePointerUp}
      onPointerLeave={handleStagePointerUp}
      aria-label="Coffee Latitudes Interactive Brick Wall Hero"
      data-testid="brick-wall-hero"
      className="relative min-h-[100svh] w-full overflow-hidden bg-espresso-950 text-crema-50 select-none"
    >
      {/* Background Video or Architectural Brick-Wall Fallback Stage */}
      {videoAvailable ? (
        <video
          ref={videoRef}
          src="/media/brick-hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoAvailable(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className="brick-wall-fallback absolute inset-0"
          data-testid="brick-wall-fallback"
        >
          {/* Architectural SVG brick mortar highlights & latitude grid */}
          <svg
            aria-hidden="true"
            className="h-full w-full opacity-55"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="brick-lines"
                width="120"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 0 H120 M0 30 H120 M60 0 V30 M0 30 V60 M120 30 V60"
                  stroke="#F4E3CE"
                  strokeOpacity="0.34"
                  strokeWidth="1.5"
                  fill="none"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#brick-lines)" />
            {/* Subtle Latitude Arc Graphic in center */}
            <circle
              cx="50%"
              cy="48%"
              r="210"
              stroke="#FBF8F3"
              strokeOpacity="0.22"
              strokeWidth="1"
              strokeDasharray="4 6"
              fill="none"
            />
            <circle
              cx="50%"
              cy="48%"
              r="145"
              stroke="#F4EDE1"
              strokeOpacity="0.28"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
      )}

      {/* Atmospheric vignette overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-espresso-950/55 via-espresso-950/15 to-espresso-950/60" />

      {/* Center Editorial Focal Mark (Desktop only, behind hotspots) */}
      <div className="pointer-events-none absolute inset-x-0 top-24 z-10 flex flex-col items-center px-6 text-center md:top-1/2 md:-translate-y-1/2">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-crema-300/90">
          23.5° N — 23.5° S • Direct-Trade Roastery
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-white drop-shadow-md sm:text-5xl md:text-6xl">
          Coffee Latitudes
        </h1>
        <p className="mt-3 hidden max-w-md text-sm leading-relaxed text-crema-200/90 md:block">
          Small-batch micro-lots roasted with care from Kona, Papua New Guinea,
          and Nicaragua. Select any illuminated storefront sign on the wall to
          explore.
        </p>
      </div>

      {/* 5 Time-Synced Interactive Hotspots */}
      <div className="absolute inset-0 z-20">
        {hotspots.map((spot) => {
          const isActive = spot.id === activeHotspotId;
          const x = isMobileViewport ? spot.mobileXPct : spot.xPct;
          const y = isMobileViewport ? spot.mobileYPct : spot.yPct;

          const sharedClasses = `group absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 rounded-full border px-4 py-2.5 backdrop-blur-md transition-all duration-300 ${
            isActive
              ? "border-crema-200 bg-terracotta-600/90 text-white shadow-[0_0_32px_rgba(195,91,61,0.65)] scale-105"
              : "border-white/30 bg-espresso-950/70 text-crema-100 hover:border-crema-200/80 hover:bg-espresso-900/90"
          } ${calibrateMode ? "cursor-grab active:cursor-grabbing ring-2 ring-amber-400" : ""}`;

          const content = (
            <>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="hotspot-pulse-ring pointer-events-none absolute inset-0 rounded-full border-2 border-crema-200/80"
                />
              )}
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isActive
                    ? "bg-white text-espresso-950"
                    : "bg-white/15 text-crema-200"
                }`}
              >
                {calibrateMode ? <Move className="h-3.5 w-3.5" /> : <HotspotIcon id={spot.id} />}
              </span>
              <span className="flex flex-col text-left leading-tight">
                <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider sm:text-sm">
                  {spot.label}
                </span>
                {calibrateMode && (
                  <span className="font-mono text-[10px] text-crema-200/80">
                    x:{x}% y:{y}%
                  </span>
                )}
              </span>
              {!calibrateMode && (
                <ArrowUpRight className="h-4 w-4 opacity-75 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              )}
            </>
          );

          if (calibrateMode) {
            return (
              <button
                key={spot.id}
                type="button"
                data-testid={`hero-hotspot-${spot.id}`}
                data-active={isActive ? "true" : "false"}
                style={{ left: `${x}%`, top: `${y}%` }}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setDraggingId(spot.id);
                }}
                className={sharedClasses}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={spot.id}
              href={spot.href}
              data-testid={`hero-hotspot-${spot.id}`}
              data-active={isActive ? "true" : "false"}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={sharedClasses}
            >
              {content}
            </Link>
          );
        })}
      </div>

      {/* Bottom Spotlight Indicator Bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 mx-auto max-w-4xl px-4 sm:px-6">
        <div className="pointer-events-auto flex flex-col gap-2 rounded-2xl border border-white/15 bg-espresso-950/75 px-4 py-3 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5 text-xs">
            <Sparkles className="h-4 w-4 text-crema-300" />
            <span className="text-crema-200/85">
              Now spotlighting:{" "}
              <strong className="text-white">{activeHotspot.label}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {hotspots.map((spot) => {
              const isActive = spot.id === activeHotspotId;
              return (
                <Link
                  key={spot.id}
                  href={spot.href}
                  className={`h-1.5 flex-1 rounded-full transition-all sm:w-10 sm:flex-none ${
                    isActive ? "bg-terracotta-400" : "bg-white/20 hover:bg-white/40"
                  }`}
                  title={spot.label}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ?calibrate=1 Coordinate Calibration Inspector Overlay */}
      {calibrateMode && (
        <div
          data-testid="calibration-overlay"
          className="fixed bottom-4 right-4 z-40 w-[min(92vw,380px)] rounded-2xl border border-amber-400/50 bg-espresso-950/95 p-4 text-xs text-crema-100 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
            <div className="flex items-center gap-2 font-semibold text-amber-300">
              <Crosshair className="h-4 w-4" />
              <span>Hotspot Calibration Mode</span>
            </div>
            <button
              type="button"
              onClick={() => setCalibrateMode(false)}
              className="rounded-md bg-white/10 px-2 py-1 text-[11px] text-crema-200 hover:bg-white/20"
            >
              Exit
            </button>
          </div>

          <p className="mt-2.5 leading-relaxed text-crema-200/80">
            Drag any of the 5 buttons directly onto James&apos;s brick-wall video
            targets. Copy the JSON below into{" "}
            <code className="font-mono text-amber-300">src/lib/hotspots.ts</code>.
          </p>

          {/* Timeline Scrubber */}
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span>Timeline Preview ({currentTime.toFixed(1)}s)</span>
              {manualScrub && (
                <button
                  type="button"
                  onClick={() => setManualScrub(false)}
                  className="text-amber-300 underline"
                >
                  Resume Loop
                </button>
              )}
            </div>
            <input
              type="range"
              min={0}
              max={9.9}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleScrub(Number(e.target.value))}
              aria-label="Scrub hero timeline"
              className="w-full accent-amber-400"
            />
          </div>

          {/* Live Coordinates JSON */}
          <pre
            data-testid="calibration-json"
            className="mt-3 max-h-40 overflow-auto rounded-lg bg-black/60 p-2.5 font-mono text-[10px] leading-relaxed text-crema-200"
          >
            {JSON.stringify(
              hotspots.map(({ id, xPct, yPct, mobileXPct, mobileYPct, startSec, endSec }) => ({
                id,
                startSec,
                endSec,
                xPct,
                yPct,
                mobileXPct,
                mobileYPct,
              })),
              null,
              2
            )}
          </pre>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyJson}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 font-semibold text-espresso-950 transition hover:bg-amber-300"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied JSON" : "Copy Coordinates"}
            </button>
            <button
              type="button"
              onClick={() => setHotspots(DEFAULT_HOTSPOTS)}
              className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-crema-200 hover:bg-white/10"
              title="Reset coordinates"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
