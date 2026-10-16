import { useEffect, useRef, useState } from "react";
import { nav, profile } from "../data.js";
import Icon from "./Icon.jsx";

// Tracks which section is on screen so its nav link can be highlighted.
function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const sectionIds = nav.map((n) => n.id);

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Primary">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">{profile.initials}</span>
          <span className="brand-name">{profile.shortName}</span>
        </a>

        <button
          ref={toggleRef}
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
          <Icon name={open ? "close" : "menu"} className="icon-nav" />
        </button>

        <ul className={`nav-links${open ? " is-open" : ""}`} id="nav-links" onClick={(e) => e.target.closest("a") && setOpen(false)}>
          {nav.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} aria-current={active === item.id ? "true" : undefined}>
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a className="btn btn-small" href="#contact">Hire me</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
