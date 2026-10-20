import { useState } from "react";
import { delivery, education, experience, process, profile, projects, proof, services, tech, work } from "../data.js";
import { gallery } from "../gallery.js";
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
const industriesOf = (items) => [...new Set(items.map((p) => p.industry).filter(Boolean))].sort();

function IndustrySelect({ id, value, onChange, items }) {
  return (
    <label className="industry-select" htmlFor={id}>
      <span>Industry</span>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="All">All industries</option>
        {industriesOf(items).map((i) => (
          <option key={i} value={i}>{i} ({items.filter((p) => p.industry === i).length})</option>
        ))}
      </select>
    </label>
  );
}

function SiteLink({ url }) {
  if (!url) return null;
  return (
    <a className="link" href={url} target="_blank" rel="noreferrer">
      {new URL(url).hostname.replace(/^www\./, "")} <span aria-hidden="true">↗</span>
      <span className="visually-hidden">(opens in a new tab)</span>
    </a>
  );
}

export function ProjectIndex() {
  const [filter, setFilter] = useState("All");
  const [industry, setIndustry] = useState("All");
  const byType = filter === "All" ? projects : projects.filter((p) => p.type === filter);
  const shown = industry === "All" ? byType : byType.filter((p) => p.industry === industry);

  return (
    <section className="section container" id="projects" aria-labelledby="projects-title">
      <SectionHead
        index="03"
        label="All projects"
        id="projects-title"
        title={`${projects.length} projects, from theme fixes to public apps`}
      />
      <Reveal className="filter-bar">
        <div className="filters" role="group" aria-label="Filter projects by type">
          {filters.map((f) => {
            const count = f === "All" ? projects.length : projects.filter((p) => p.type === f).length;
            return (
              <button key={f} type="button" className="filter" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f === "Apps" ? "Shopify apps" : f === "Web" ? "WordPress, Webflow & web" : f} <span className="filter-count">{count}</span>
              </button>
            );
          })}
        </div>
        <IndustrySelect id="project-industry" value={industry} onChange={setIndustry} items={projects} />
      </Reveal>
      <p className="visually-hidden" aria-live="polite">{shown.length} projects shown</p>
      {shown.length === 0 && <p className="empty-note">No projects match these filters.</p>}
      <ul className="project-grid">
        {shown.map((p) => (
          <li key={`${filter}-${industry}-${p.name}`} className="project">
            <Thumb name={p.name} image={p.image} small />
            <div className="project-body">
              {p.industry && <p className="project-industry">{p.industry}</p>}
              <h3>{p.name}</h3>
              <p>{p.what}</p>
              <p className="project-stack">{p.stack}</p>
              <SiteLink url={p.url} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const PAGE = 12;

export function Gallery() {
  const [industry, setIndustry] = useState("All");
  const [limit, setLimit] = useState(PAGE);
  if (!gallery.length) return null;
  const counts = industriesOf(gallery).map((i) => [i, gallery.filter((g) => g.industry === i).length]).sort((a, b) => b[1] - a[1]);
  const all = industry === "All" ? gallery : gallery.filter((g) => g.industry === industry);
  const shown = all.slice(0, limit);
  const pick = (i) => { setIndustry(i); setLimit(PAGE); };

  return (
    <section className="section container" id="stores" aria-labelledby="stores-title">
      <SectionHead
        index="04"
        label="More client stores"
        id="stores-title"
        title={`${gallery.length} more live stores, delivered with my teams at Beecreative`}
        note="As Team Lead and Production Manager I scoped, reviewed and shipped these with Beecreative's developers and designers."
      />
      <Reveal className="filters chips" role="group" aria-label="Filter stores by industry">
        <button type="button" className="filter" aria-pressed={industry === "All"} onClick={() => pick("All")}>
          All <span className="filter-count">{gallery.length}</span>
        </button>
        {counts.map(([i, n]) => (
          <button key={i} type="button" className="filter" aria-pressed={industry === i} onClick={() => pick(i)}>
            {i} <span className="filter-count">{n}</span>
          </button>
        ))}
      </Reveal>
      <p className="visually-hidden" aria-live="polite">{all.length} stores shown</p>
      <ul className="store-grid">
        {shown.map((g) => (
          <li key={`${industry}-${g.url}`} className="store">
            <Thumb name={g.name} image={g.image} small />
            <div className="store-body">
              <h3>{g.name}</h3>
              <p className="project-stack">{g.industry} · {g.platform}</p>
              <SiteLink url={g.url} />
            </div>
          </li>
        ))}
      </ul>
      {limit < all.length && (
        <div className="more-row">
          <button type="button" className="btn btn-ghost" onClick={() => setLimit((l) => l + PAGE * 2)}>
            Show more stores <span className="filter-count">{all.length - limit} left</span>
          </button>
        </div>
      )}
    </section>
  );
}

export function Process() {
  return (
    <section className="section container" id="process" aria-labelledby="process-title">
      <SectionHead index="05" label="Process" id="process-title" title="From brief to launch, and after" />
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
        index="06"
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
      <SectionHead index="07" label="Technologies" id="skills-title" title="The tech and tools I use" />
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
        <Reveal as="p" className="section-label">08 / Contact</Reveal>
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
