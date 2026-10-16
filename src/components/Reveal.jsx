import { createElement, useEffect, useRef } from "react";

// One IntersectionObserver shared by every Reveal on the page: far cheaper to hydrate than a
// Motion component per element. The fade itself is a CSS transition on [data-reveal] (style.css).
let observer;
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            observer.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
  }
  return observer;
}

export default function Reveal({ as = "div", delay = 0, style, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return createElement(
    as,
    { ref, "data-reveal": "", style: delay ? { ...style, "--reveal-delay": `${delay}s` } : style, ...rest },
    children
  );
}
