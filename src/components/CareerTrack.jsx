import { useRef } from "react";
import { experience, study } from "../data.js";
import { clamp01, gsap, MOTION_OK, useGSAP } from "../lib/gsap.js";
import { horizontalScroll } from "../lib/horizontal.js";

// Every role in date order, starting with the degree.
const stops = [
  study,
  ...experience
    .flatMap((job) => job.roles.map((r) => ({ ...r, company: job.company, dates: r.dates || job.dates })))
    .reverse(),
].map((s) => ({ ...s, year: s.dates.match(/\d{4}/)?.[0] ?? "" }));

// Chapter: career. A horizontal timeline travels left as you scroll; the line fills to the
// middle of the screen, and each stop lights up as the line reaches it.
// Without motion it is a vertical timeline with the same content.
export default function CareerTrack() {
  const root = useRef(null);
  const pin = useRef(null);
  const track = useRef(null);
  const fill = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        root.current.classList.add("is-horizontal");
        const items = gsap.utils.toArray(".career-stop", track.current);
        const line = track.current.querySelector(".career-line");
        let dots = [];
        let lineLeft = 0;
        let lineWidth = 1;
        const measure = () => {
          lineLeft = line.offsetLeft;
          lineWidth = line.offsetWidth || 1;
          dots = items.map((li) => li.offsetLeft + li.querySelector(".career-dot").offsetLeft + 8);
        };
        measure();

        // The progress head sits at the middle of the screen, in track coordinates.
        const paint = () => {
          const head = -gsap.getProperty(track.current, "x") + innerWidth * 0.5;
          fill.current.style.transform = `scaleX(${clamp01((head - lineLeft) / lineWidth)})`;
          items.forEach((li, i) => li.classList.toggle("is-reached", dots[i] <= head));
        };

        const { cleanup } = horizontalScroll({ pin: pin.current, track: track.current, tail: 240, onUpdate: paint });
        const onResize = () => {
          measure();
          paint();
        };
        addEventListener("resize", onResize);
        paint();

        return () => {
          cleanup();
          removeEventListener("resize", onResize);
          items.forEach((li) => li.classList.remove("is-reached"));
          root.current?.classList.remove("is-horizontal");
        };
      });
    },
    { scope: root }
  );

  return (
    <section className="chapter career" id="experience" aria-labelledby="exp-title" ref={root}>
      <div className="hpin" ref={pin}>
        <div className="container chapter-head">
          <h2 id="exp-title">Four roles at one agency, from developer to production lead</h2>
          <p className="chapter-note">{experience[0].summary}</p>
        </div>
        <div className="htrack career-track" ref={track}>
          <span className="career-line" aria-hidden="true"><i ref={fill} /></span>
          <ol className="career-stops">
            {stops.map((s) => (
              <li key={s.title} className={`career-stop${s.current ? " is-current" : ""}`} data-hpanel="">
                <p className="career-year" aria-hidden="true">{s.year}</p>
                <span className="career-dot" aria-hidden="true" />
                <p className="career-dates">{s.dates}</p>
                <h3>{s.title}</h3>
                <p className="career-org">{s.company}</p>
                <p className="career-body">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
