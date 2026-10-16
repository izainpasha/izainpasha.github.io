import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

// Renders the final number (so the pre-rendered HTML is correct), then counts up from 0
// once it scrolls into view. Screen readers get the final number; the animated digits are hidden.
export default function CountUp({ value, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <>
      <span className="visually-hidden">{value}{suffix}</span>
      <span aria-hidden="true">
        <span ref={ref} className="tabular">{value}</span>
        {suffix}
      </span>
    </>
  );
}
