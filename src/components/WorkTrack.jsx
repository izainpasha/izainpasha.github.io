import { useRef } from "react";
import { work } from "../data.js";
import { gsap, MOTION_OK, pad, useGSAP, WIDE } from "../lib/gsap.js";
import { horizontalScroll } from "../lib/horizontal.js";
import { Tags, Thumb } from "./Sections.jsx";

// Chapter: selected work. On wide screens the case studies travel sideways on a dark stage;
// each screenshot wipes in as its panel arrives, and a counter tracks where you are.
// On phones, short windows and with reduced motion it is a plain vertical list.
export default function WorkTrack() {
  const root = useRef(null);
  const pin = useRef(null);
  const track = useRef(null);
  const count = useRef(null);
  const bar = useRef(null);
  const total = pad(work.length);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${WIDE} and ${MOTION_OK}`, () => {
        root.current.classList.add("is-horizontal");
        const panels = gsap.utils.toArray(".panel", track.current);
        const last = panels.length - 1;
        const { tween, cleanup } = horizontalScroll({
          pin: pin.current,
          track: track.current,
          onUpdate: (p) => {
            bar.current.style.transform = `scaleX(${p})`;
            count.current.textContent = pad(Math.min(last, Math.round(p * last)) + 1);
          },
        });

        panels.forEach((panel, i) => {
          const at = { trigger: panel, containerAnimation: tween, scrub: true };
          const thumb = panel.querySelector(".case-thumb");
          const img = panel.querySelector("img");
          if (i > 0) {
            gsap.fromTo(thumb, { clipPath: "inset(0% 100% 0% 0% round 16px)" }, {
              clipPath: "inset(0% 0% 0% 0% round 16px)",
              ease: "none",
              scrollTrigger: { ...at, start: "left 95%", end: "left 40%" },
            });
            gsap.from(panel.querySelector(".panel-name"), {
              yPercent: 60,
              autoAlpha: 0,
              ease: "none",
              scrollTrigger: { ...at, start: "left 75%", end: "left 35%" },
            });
          }
          if (img) {
            gsap.fromTo(img, { xPercent: -5 }, {
              xPercent: 5,
              ease: "none",
              scrollTrigger: { ...at, start: "left right", end: "right left" },
            });
          }
        });

        return () => {
          cleanup();
          root.current?.classList.remove("is-horizontal");
          if (bar.current) bar.current.style.transform = "";
        };
      });
    },
    { scope: root }
  );

  return (
    <section className="work-stage" id="work" aria-labelledby="work-title" ref={root}>
      <div className="work-pin" ref={pin}>
        <div className="container work-head">
          <h2 id="work-title">Stores, apps and sites I've shipped</h2>
          <div className="work-meter" aria-hidden="true">
            <p className="work-count">
              <span ref={count}>01</span> / {total}
            </p>
            <span className="work-rule"><i ref={bar} /></span>
          </div>
        </div>
        <ol className="work-track htrack" ref={track}>
          {work.map((w, i) => {
            const [, rest = w.title] = w.title.split(" — ");
            const subtitle = rest[0].toUpperCase() + rest.slice(1);
            const id = `case-${i}`;
            return (
              <li className="panel" key={w.name} data-hpanel="">
                <article className="panel-inner" aria-labelledby={id}>
                  <div className="panel-media">
                    <Thumb name={w.name} image={w.image} />
                  </div>
                  <div className="panel-head">
                    <p className="case-meta">{w.meta}</p>
                    <h3 id={id} className="panel-name">{w.name}</h3>
                    <p className="panel-sub">{subtitle}</p>
                  </div>
                  <dl className="case-facts">
                    <div><dt>Brief</dt><dd>{w.brief}</dd></div>
                    <div><dt>Built</dt><dd>{w.built}</dd></div>
                    <div><dt>Result</dt><dd>{w.result}</dd></div>
                  </dl>
                  <div className="panel-foot">
                    <Tags items={w.tags} />
                    {w.link && (
                      <a href={w.link.href} className="link" target="_blank" rel="noreferrer">
                        {w.link.label} <span aria-hidden="true">↗</span>
                        <span className="visually-hidden">(opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
