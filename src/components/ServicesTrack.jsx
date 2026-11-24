import { useRef } from "react";
import { services } from "../data.js";
import { gsap, MOTION_OK, useGSAP } from "../lib/gsap.js";
import { horizontalScroll } from "../lib/horizontal.js";
import Icon from "./Icon.jsx";

// A small editor window with a few lines from that kind of work. Every card has one, at the
// same size, so the row reads as a set.
function Snippet({ file, code }) {
  return (
    <figure className="snippet" aria-label={`Example code: ${file}`}>
      <figcaption className="snippet-bar">
        <span className="code-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="code-file">{file}</span>
      </figcaption>
      <pre><code>{code}</code></pre>
    </figure>
  );
}

// Chapter: what I build. Service panels travel sideways while the page scrolls down.
export default function ServicesTrack() {
  const root = useRef(null);
  const pin = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        root.current.classList.add("is-horizontal");
        const { tween, cleanup } = horizontalScroll({
          pin: pin.current,
          track: track.current,
          tail: 200,
          onUpdate: (p) => (bar.current.style.transform = `scaleX(${p})`),
        });
        gsap.utils.toArray(".svc", track.current).forEach((panel) => {
          gsap.from(panel.children, {
            y: 48,
            autoAlpha: 0,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 92%", end: "left 55%", scrub: true },
          });
        });
        return () => {
          cleanup();
          root.current?.classList.remove("is-horizontal");
        };
      });
    },
    { scope: root }
  );

  return (
    <section className="chapter services-chapter" id="services" aria-labelledby="services-title" ref={root}>
      <div className="hpin" ref={pin}>
        <div className="container chapter-head">
          <h2 id="services-title">What I build, from stores to custom web apps</h2>
          <span className="hrule" aria-hidden="true"><i ref={bar} /></span>
        </div>
        <ul className="htrack services-track" ref={track}>
          {services.map((s) => (
            <li key={s.title} className="svc" data-hpanel="">
              <Icon name={s.icon} />
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              {s.code && <Snippet file={s.file} code={s.code} />}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
