import { useEffect, useRef } from "react";

// Mounts the three.js particle field into a canvas once the page is interactive.
// Skipped for reduced-motion visitors and when WebGL isn't available; the canvas then stays
// transparent and the section reads fine without it. Rendering pauses while off screen.
export default function ParticleCanvas({ mode, className, apiRef }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let field;
    let io;
    let cancelled = false;

    import("../three/field.js")
      .then(({ createField }) => {
        if (cancelled) return;
        try {
          field = createField(canvas, { mode });
        } catch {
          return; // no WebGL: leave the canvas empty
        }
        if (apiRef) apiRef.current = field;
        io = new IntersectionObserver(([e]) => (e.isIntersecting ? field.start() : field.stop()), {
          rootMargin: "120px 0px",
        });
        io.observe(canvas);
        canvas.setAttribute("data-ready", "");
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      io?.disconnect();
      field?.destroy();
      if (apiRef) apiRef.current = null;
    };
  }, [mode, apiRef]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
