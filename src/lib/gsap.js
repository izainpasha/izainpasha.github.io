// GSAP + ScrollTrigger, registered once. Safe to import during pre-rendering: nothing touches
// the DOM until a component's effect runs in the browser.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// The one condition every scroll-driven effect shares.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
// Horizontal pinning needs room: a wide and tall enough window.
export const WIDE = "(min-width: 1024px) and (min-height: 700px)";

export const pad = (n) => String(n).padStart(2, "0");

export { gsap, ScrollTrigger };
