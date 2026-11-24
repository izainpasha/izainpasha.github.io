import { manifesto } from "../data.js";
import WordReveal from "./WordReveal.jsx";

// Chapter: a short statement, read word by word as it scrolls up the screen.
export default function Manifesto() {
  return (
    <section className="manifesto" aria-label="How I work">
      <div className="container">
        <WordReveal text={manifesto} className="manifesto-text" start="top 80%" end="bottom 55%" />
      </div>
    </section>
  );
}
