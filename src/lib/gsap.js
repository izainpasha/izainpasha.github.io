// GSAP, ScrollTrigger and useGSAP, registered once, plus Lenis smooth scrolling.
// Safe to import during pre-rendering: nothing touches the DOM until an effect runs in the browser.
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Phones resize the viewport as the URL bar collapses; don't recompute every pin for that.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

// Every scroll-driven effect is wrapped in this condition, so reduced-motion visitors get static layouts.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
// The content-heavy work track only goes horizontal when there is room for a whole case study.
export const WIDE = "(min-width: 1024px) and (min-height: 700px)";

export const pad = (n) => String(n).padStart(2, "0");
export const clamp01 = (x) => Math.min(1, Math.max(0, x));

let lenis = null;

// Lenis drives the scroll; ScrollTrigger reads it every frame through the GSAP ticker.
export function startSmoothScroll(headerOffset = 0) {
  if (lenis || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, anchors: { offset: -headerOffset } });
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
    lenis = null;
  };
}

// Jump to a scroll position immediately (used when keyboard focus lands in a pinned track).
export function jumpTo(y) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: "instant" });
}

export { gsap, ScrollTrigger, useGSAP };
