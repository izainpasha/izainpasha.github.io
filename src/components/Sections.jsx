import { useState } from "react";
import { delivery, education, experience, process, profile, projects, proof, services, tech, work } from "../data.js";
import CountUp from "./CountUp.jsx";
import Icon from "./Icon.jsx";
import Reveal from "./Reveal.jsx";

function SectionHead({ index, label, id, title, note }) {
  return (
    <div className="section-head">
      <Reveal as="p" className="section-label">{index} / {label}</Reveal>
      <Reveal as="h2" id={id}>{title}</Reveal>
      {note && <Reveal as="p" className="section-note">{note}</Reveal>}
    </div>
  );
}

function Tags({ items }) {
  return (
    <ul className="tags">
      {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
}

export function Proof() {
  return (
    <section className="proof" aria-label="Career highlights">
      <dl className="proof-grid container">
        {proof.map((p, i) => (
          <Reveal key={p.label} delay={i * 0.05}>
            <dt>{p.label}</dt>
            <dd>{p.text ?? <CountUp value={p.value} suffix={p.suffix} />}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

export function Services() {
  return (
    <section className="section container" id="services" aria-labelledby="services-title">
      <SectionHead index="01" label="Services" id="services-title" title="What I build, from stores to custom web apps" />
      <div className="services">
        {services.map((s, i) => (
          <Reveal as="article" key={s.title} className={`service${s.wide ? " service-wide" : ""}`} delay={(i % 2) * 0.06}>
            <Icon name={s.icon} />
            <div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Work() {
  return (
    <section className="section container" id="work" aria-labelledby="work-title">
      <SectionHead index="02" label="Selected work" id="work-title" title="Stores and apps I've shipped" />
      <div className="work-list">
        {work.map((w) => (
          <Reveal as="article" key={w.title} className="case">
            <Thumb name={w.name} image={w.image} />
            <div className="case-body">
              <p className="case-meta">{w.meta}</p>
              <h3>{w.title}</h3>
              <dl className="case-facts">
                <div><dt>Brief</dt><dd>{w.brief}</dd></div>
                <div><dt>Built</dt><dd>{w.built}</dd></div>
                <div><dt>Result</dt><dd>{w.result}</dd></div>
              </dl>
              <Tags items={w.tags} />
              {w.link && (
                <a href={w.link.href} className="link" target="_blank" rel="noreferrer">
                  {w.link.label} <span aria-hidden="true">↗</span>
                  <span className="visually-hidden">(opens in a new tab)</span>
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// "Rooflights & Skylights UK" → "RS"; the card heading already shows the full name.
const monogram = (name) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

// Screenshot when we have one; otherwise a branded tile with the project's name.
function Thumb({ name, image, small = false }) {
  if (image) {
    return (
      <div className={`case-thumb${small ? " is-small" : ""}`}>
        <img
          src={image}
          srcSet={`${image.replace(".webp", "-640.webp")} 640w, ${image} 1200w`}
          sizes={small ? "(min-width: 1000px) 380px, (min-width: 640px) 50vw, 100vw" : "(min-width: 900px) 560px, 100vw"}
          alt={`${name} homepage`}
          width="1200"
          height="750"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }
  return (
    <div className={`case-thumb is-tile${small ? " is-small" : ""}`} aria-hidden="true">
      <span>{small ? monogram(name) : name}</span>
    </div>
  );
}

const filters = ["All", "Shopify", "Apps", "Web"];

export function ProjectIndex() {
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.type === filter);

  return (
    <section className="section container" id="projects" aria-labelledby="projects-title">
      <SectionHead
        index="03"
        label="All projects"
        id="projects-title"
        title={`${projects.length} projects, from theme fixes to public apps`}
      />
      <Reveal className="filters" role="group" aria-label="Filter projects">
        {filters.map((f) => {
          const count = f === "All" ? projects.length : projects.filter((p) => p.type === f).length;
          return (
            <button key={f} type="button" className="filter" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === "Apps" ? "Shopify apps" : f === "Web" ? "WordPress, Webflow & web" : f} <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </Reveal>
      <p className="visually-hidden" aria-live="polite">{shown.length} projects shown</p>
      <ul className="project-grid">
        {shown.map((p) => (
          <li key={`${filter}-${p.name}`} className="project">
            <Thumb name={p.name} image={p.image} small />
            <div className="project-body">
              <h3>{p.name}</h3>
              <p>{p.what}</p>
              <p className="project-stack">{p.stack}</p>
              {p.url && (
                <a className="link" href={p.url} target="_blank" rel="noreferrer">
                  {new URL(p.url).hostname.replace(/^www\./, "")} <span aria-hidden="true">↗</span>
                  <span className="visually-hidden">(opens in a new tab)</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Process() {
  return (
    <section className="section container" id="process" aria-labelledby="process-title">
      <SectionHead index="04" label="Process" id="process-title" title="From brief to launch, and after" />
      <ol className="process">
        {process.map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 0.06}>
            <span className="step" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

export function Experience() {
  return (
    <section className="section container" id="experience" aria-labelledby="exp-title">
      <SectionHead
        index="05"
        label="Experience"
        id="exp-title"
        title="Four roles at one agency, from developer to production lead"
      />
      {experience.map((job) => (
        <div className="exp" key={job.company}>
          <Reveal className="exp-company">
            <h3>{job.company}</h3>
            <p>{job.dates}</p>
            {job.summary && <p className="exp-summary">{job.summary}</p>}
          </Reveal>
          <ol className={job.roles.length > 1 ? "ladder" : "ladder ladder-single"}>
            {job.roles.map((r) => (
              <Reveal as="li" key={r.title} className={r.current ? "is-current" : undefined}>
                {r.dates && <p className="ladder-date">{r.dates}</p>}
                <h4>{r.title}</h4>
                <p>{r.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      ))}
      <Reveal as="p" className="education">
        <strong>Education:</strong> {education}
      </Reveal>
    </section>
  );
}

export function Skills() {
  return (
    <section className="section container" id="skills" aria-labelledby="skills-title">
      <SectionHead index="06" label="Technologies" id="skills-title" title="The tech and tools I use" />
      <ul className="tech-grid">
        {tech.map((t, i) => (
          <Reveal as="li" key={t.name} className="tech" delay={(i % 6) * 0.04}>
            <span className="tech-tile" style={{ "--tile-bg": t.bg, "--tile-fg": t.fg }} aria-hidden="true">
              {t.mark}
            </span>
            <span className="tech-name">{t.name}</span>
          </Reveal>
        ))}
      </ul>
      <Reveal className="delivery">
        <h3>How I run delivery</h3>
        <Tags items={delivery} />
      </Reveal>
    </section>
  );
}

export function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact-inner">
        <Reveal as="p" className="section-label">07 / Contact</Reveal>
        <Reveal as="h2" id="contact-title">Have a store or site to build or fix?</Reveal>
        <Reveal as="p" className="lede">
          Send me the brief, the designs or just the URL. I'll reply with next steps and a rough timeline.
        </Reveal>
        <Reveal className="hero-actions">
          <a className="btn btn-invert" href={`mailto:${profile.email}`}>{profile.email}</a>
          <a className="btn btn-ghost-invert" href={profile.cv} download>Download CV</a>
        </Reveal>
        <Reveal as="ul" className="socials">
          {profile.linkedin && (
            <li><a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn (opens in a new tab)"><Icon name="linkedin" /></a></li>
          )}
          {profile.github && (
            <li><a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub (opens in a new tab)"><Icon name="github" /></a></li>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p>Built with React, Vite &amp; Motion.</p>
      </div>
    </footer>
  );
}
