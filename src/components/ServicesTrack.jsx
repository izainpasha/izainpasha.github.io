import { useRef } from "react";
import { services } from "../data.js";
import { gsap, MOTION_OK, useGSAP } from "../lib/gsap.js";
import { horizontalScroll } from "../lib/horizontal.js";
import Icon from "./Icon.jsx";

// The Liquid schema that used to sit in the hero now lives on the theme panel, where it explains something.
function CodeCard() {
  return (
    <figure className="code-card" aria-label="Example Shopify section schema written in Liquid">
      <div className="code-bar">
        <span className="code-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="code-file">sections/featured-collection.liquid</span>
      </div>
      <pre>
        <code>
          <span className="c-tag">{"{% schema %}"}</span>{"\n{\n  "}
          <span className="c-key">"name"</span>: <span className="c-str">"Featured collection"</span>,{"\n  "}
          <span className="c-key">"settings"</span>: [{"\n    { "}
          <span className="c-key">"type"</span>: <span className="c-str">"collection"</span>, <span className="c-key">"id"</span>: <span className="c-str">"collection"</span>{" },\n    { "}
          <span className="c-key">"type"</span>: <span className="c-str">"range"</span>, <span className="c-key">"id"</span>: <span className="c-str">"products"</span>,{"\n      "}
          <span className="c-key">"min"</span>: <span className="c-num">2</span>, <span className="c-key">"max"</span>: <span className="c-num">12</span>{" }\n  ],\n  "}
          <span className="c-key">"blocks"</span>: [{"{ "}<span className="c-key">"type"</span>: <span className="c-str">"@app"</span>{" }]\n}\n"}
          <span className="c-tag">{"{% endschema %}"}</span>
        </code>
      </pre>
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
            <li key={s.title} className={`svc${s.icon === "theme" ? " svc-theme" : ""}`} data-hpanel="">
              <Icon name={s.icon} />
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              {s.icon === "theme" && <CodeCard />}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
