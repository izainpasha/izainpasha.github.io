import { domAnimation, LazyMotion, m, stagger } from "motion/react";
import { profile } from "../data.js";

const list = {
  hidden: {},
  show: { transition: { delayChildren: stagger(0.07) } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.8 } },
};
// The headline only slides (no fade) so it paints straight from the pre-rendered HTML — it's the LCP element.
const headline = {
  hidden: { y: 16 },
  show: { y: 0, transition: { type: "spring", bounce: 0, duration: 0.8 } },
};

export default function Hero() {
  return (
    <LazyMotion features={domAnimation} strict>
      <m.section
        className="hero container"
        id="top"
        aria-labelledby="hero-title"
        variants={list}
        initial="hidden"
        animate="show"
      >
        <div className="hero-copy">
          <m.p className="eyebrow" data-hero="" variants={item}>
            <span className="status-dot" aria-hidden="true" />
            Full-stack developer · {profile.location} · Remote worldwide
          </m.p>
          <m.h1 id="hero-title" variants={headline}>
            Stores and websites, <span className="accent">built from scratch</span> and shipped on time.
          </m.h1>
          <m.p className="lede" data-hero="" variants={item}>
            I'm {profile.name}. I build custom Shopify themes and apps, WordPress and Webflow sites,
            and React and PHP web apps, and I lead the teams that ship them. In 5+ years that's
            added up to 300+ projects, most of them Shopify stores.
          </m.p>
          <m.div className="hero-actions" data-hero="" variants={item}>
            <a className="btn" href="#work">See selected work</a>
            <a className="btn btn-ghost" href="#contact">Start a project</a>
          </m.div>
        </div>

        <m.figure className="code-card" data-hero="" variants={item} aria-label="Example Shopify section schema written in Liquid">
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
              <span className="c-key">"min"</span>: <span className="c-num">2</span>, <span className="c-key">"max"</span>: <span className="c-num">12</span>, <span className="c-key">"default"</span>: <span className="c-num">4</span>{" }\n  ],\n  "}
              <span className="c-key">"blocks"</span>: [{"{ "}<span className="c-key">"type"</span>: <span className="c-str">"@app"</span>{" }],\n  "}
              <span className="c-key">"presets"</span>: [{"{ "}<span className="c-key">"name"</span>: <span className="c-str">"Featured collection"</span>{" }]\n}\n"}
              <span className="c-tag">{"{% endschema %}"}</span>
            </code>
          </pre>
          <figcaption className="code-foot">
            <span><b>OS 2.0</b> sections &amp; blocks</span>
            <span><b>Metafields</b> &amp; metaobjects</span>
            <span><b>Theme app</b> extensions</span>
          </figcaption>
        </m.figure>
      </m.section>
    </LazyMotion>
  );
}
