import { useState } from "react";
import { delivery, profile, projects, tech } from "../data.js";
import { gallery } from "../gallery.js";
import Icon from "./Icon.jsx";
import Reveal from "./Reveal.jsx";
import WordReveal from "./WordReveal.jsx";

function SectionHead({ id, title, note }) {
  return (
    <div className="section-head">
      <Reveal as="h2" id={id}>{title}</Reveal>
      {note && <Reveal as="p" className="section-note">{note}</Reveal>}
    </div>
  );
}

export function Tags({ items }) {
  return (
    <ul className="tags">
      {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
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
export function Thumb({ name, image, small = false }) {
  if (image) {
    return (
      <div className={`case-thumb${small ? " is-small" : ""}`}>
        <img
          src={image}
          srcSet={`${image.replace(".webp", "-640.webp")} 640w, ${image} 1200w`}
          sizes={small ? "(min-width: 1000px) 380px, (min-width: 640px) 50vw, 100vw" : "(min-width: 900px) 560px, 100vw"}
          alt={`${name} screenshot`}
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
        id="stores-title"
        title={`${gallery.length} more live client stores I've worked on`}
        note="Theme builds, customisations, fixes and launches for clients since 2021, filterable by industry."
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

export function Skills() {
  return (
    <section className="section container" id="skills" aria-labelledby="skills-title">
      <SectionHead id="skills-title" title="The tech and tools I use" />
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
        <WordReveal as="h2" id="contact-title" text="Have a store or site to build or fix?" start="top 85%" end="top 35%" />
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
        <p>Built with React, Vite, GSAP &amp; Three.js.</p>
      </div>
    </footer>
  );
}
