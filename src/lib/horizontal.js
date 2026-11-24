import { gsap, jumpTo } from "./gsap.js";

// "Scroll down to travel sideways": pin a full-screen chapter and move its track left
// as the reader scrolls. The tween is linear (ease "none") so scroll and position stay 1:1,
// and it can drive other triggers through containerAnimation.
// Call inside gsap.matchMedia() so it is reverted when the media query stops matching.
export function horizontalScroll({ pin, track, scrub = 0.8, onUpdate, tail = 0 }) {
  const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    // A plain function: GSAP calls it while the tween is still being created, with `this` = the tween.
    onUpdate: onUpdate && function () { onUpdate(this.progress(), this); },
    scrollTrigger: {
      trigger: pin,
      start: "top top",
      // `tail` adds a short hold at the end, so the last panel can be read before the pin lets go.
      end: () => `+=${distance() + tail}`,
      pin: true,
      scrub,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  // Keyboard users: tabbing to a link in an off-screen panel scrolls the page to show that panel.
  const onFocus = (e) => {
    const st = tween.scrollTrigger;
    const panel = e.target.closest("[data-hpanel]");
    if (!st || !panel) return;
    const max = distance() || 1;
    const x = Math.min(Math.max(0, panel.offsetLeft - 48), max);
    jumpTo(st.start + (x / max) * (st.end - st.start - tail));
  };
  track.addEventListener("focusin", onFocus);

  return { tween, distance, cleanup: () => track.removeEventListener("focusin", onFocus) };
}
