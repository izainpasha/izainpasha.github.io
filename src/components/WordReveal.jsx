import { createElement, useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "../lib/gsap.js";

// Scroll-scrubbed word reveal: words brighten one after another as the passage scrolls through
// the viewport, so scrolling paces the reading. The words are real text in the pre-rendered HTML
// (fully visible without JS or with reduced motion); line wrapping stays the browser's.
export default function WordReveal({ as = "p", text, className, start = "top 85%", end = "bottom 45%", ...rest }) {
  const ref = useRef(null);
  const words = text.split(/\s+/);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ref.current.querySelectorAll(".rw"),
          { opacity: 0.14, filter: "blur(3px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: ref.current, start, end, scrub: true },
          }
        );
      });
    },
    { scope: ref }
  );

  return createElement(
    as,
    { ref, className: `reveal-words${className ? ` ${className}` : ""}`, ...rest },
    words.map((w, i) => (
      <span key={i}>
        <span className="rw">{w}</span>
        {i < words.length - 1 ? " " : ""}
      </span>
    ))
  );
}
