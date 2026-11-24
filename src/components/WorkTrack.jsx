import { useEffect, useRef } from "react";
import { work } from "../data.js";
import { gsap, MOTION_OK, pad, WIDE } from "../lib/gsap.js";
import { Tags, Thumb } from "./Sections.jsx";

// Selected work as one pinned, horizontally scrolling track on wide screens.
// Vertical scroll moves the panels sideways; a counter and rule show where you are.
// On phones, short windows and with reduced motion it is a plain vertical list.
export default function WorkTrack() {
  const root = useRef(null);
  const pin = useRef(null);
  const track = useRef(null);
  const count = useRef(null);
  const bar = useRef(null);
  const total = pad(work.length);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(`${WIDE} and ${MOTION_OK}`, () => {
      const section = root.current;
      const rail = track.current;
      section.classList.add("is-horizontal");

      const distance = () => Math.max(0, rail.scrollWidth - document.documentElement.clientWidth);
      const panels = gsap.utils.toArray(".panel", rail);

      const slide = gsap.to(rail, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate(self) {
            bar.current.style.transform = `scaleX(${self.progress})`;
            const i = Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1)));
            count.current.textContent = pad(i + 1);
          },
        },
      });

      // Screenshots drift slightly inside their frames as panels pass, for depth.
      panels.forEach((panel) => {
        const img = panel.querySelector("img");
        if (img) {
          gsap.fromTo(img, { xPercent: -5 }, {
            xPercent: 5,
            ease: "none",
            scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
          });
        }
        gsap.from(panel.querySelector(".panel-name"), {
          yPercent: 40,
          opacity: 0,
          ease: "power2.out",
          scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left 80%", end: "left 35%", scrub: true },
        });
      });

      // Keyboard users: tabbing into an off-screen panel scrolls the page to show it.
      const onFocus = (e) => {
        const panel = e.target.closest(".panel");
        const st = slide.scrollTrigger;
        if (!panel || !st) return;
        const x = Math.min(Math.max(0, panel.offsetLeft - rail.offsetLeft), distance());
        const y = st.start + (x / (distance() || 1)) * (st.end - st.start);
        window.scrollTo({ top: y, behavior: "instant" });
      };
      rail.addEventListener("focusin", onFocus);

      return () => {
        rail.removeEventListener("focusin", onFocus);
        section.classList.remove("is-horizontal");
        bar.current && (bar.current.style.transform = "");
      };
    });
    return () => mm.revert();
  }, []);

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
        <ol className="work-track" ref={track}>
          {work.map((w, i) => {
            const [, rest = w.title] = w.title.split(" — ");
            const subtitle = rest[0].toUpperCase() + rest.slice(1);
            const id = `case-${i}`;
            return (
              <li className="panel" key={w.name}>
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
