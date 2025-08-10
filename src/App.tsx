import { useEffect, useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import "./index.css";


type Project = { title: string; blurb: string; href?: string; tag?: string };

const projects: Project[] = [
  {
    title: "Personal Site (this)",
    blurb:
      "React + TypeScript + minimal CSS. Theme toggle, scroll reveal, and Web3 wallet connect.",
    tag: "frontend",
  },
  {
    title: "Daily Exercises",
    blurb: "TypeScript practice from bootcamp: algorithms, DS, and utilities.",
    href: "https://github.com/your-username/programming101/tree/main/dailyExercise",
    tag: "typescript",
  },
  {
    title: "Soup Servings (DP+Memo)",
    blurb: "LeetCode DP solution with Map memo + explanation.",
    tag: "algorithms",
  },
];

export default function App() {
  // ---------- Theme toggle (uses html.theme-dark) ----------
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // ---------- Scroll reveal with gentle stagger ----------
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    els.forEach((el, i) => (el.dataset.idx = String(i % 5)));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const idx = Number(el.dataset.idx || 0);
          el.style.transitionDelay = `${idx * 80}ms`; // 0,80,160,240,320
          el.classList.add("show");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Fixed header */}
      <header className="header">
        <div className="header-inner container">
          <h1 className="site-title">helloworld</h1>

          <div className="header-right">
            <nav className="nav">
              <a href="#essays">Essays</a>
              <a href="#projects">Projects</a>
              <a href="#photos">Photos</a>
              <a href="#memes">Memes</a>
              <a href="#web3">Web3</a>
            </nav>

            <button
              className="toggle-btn"
              aria-label="Toggle theme"
              onClick={() => setIsDark((v) => !v)}
              title={isDark ? "Switch to light" : "Switch to dark"}
            >
              <img
                src={`${import.meta.env.BASE_URL}${
                  isDark ? "icon-dark.svg" : "icon-light.svg"
                }`}
                alt=""
                width={16}
                height={16}
                style={{ display: "block" }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Hero (immediate slow fade) */}
      <section id="hero" className="hero fade-in">
        <div className="container" style={{ textAlign: "center" }}>
          <h2>helloworld</h2>
          <p>
            a small corner on the internet — essays, projects, and experiments.
            built to grow slowly and stay honest.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="quiet-link">
              see projects
            </a>
            <span className="sep">·</span>
            <a href="#essays" className="quiet-link">
              read essays
            </a>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container main">
        <section id="essays" className="reveal">
          <h3>Essays</h3>
          <p>
            <i>(Coming soon: list of essays)</i>
          </p>
        </section>

        <section id="projects" className="reveal">
          <h3>Projects</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {projects.map((p) => (
              <article
                key={p.title}
                className="card"
                style={{ textAlign: "left" }}
              >
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {p.tag ?? "project"}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 8,
                  }}
                >
                  <h4
                    style={{
                      margin: "2px 0 6px",
                      fontSize: 13.5,
                      fontWeight: 400,
                    }}
                  >
                    {p.title}
                  </h4>
                  {p.href && (
                    <a
                      className="quiet-link"
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      open ↗
                    </a>
                  )}
                </div>
                <p style={{ margin: 0 }}>{p.blurb}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="photos" className="reveal">
          <h3>Photo Journal</h3>
          <p>
            <i>(Coming soon: photo grid)</i>
          </p>
        </section>

        <section id="memes" className="reveal">
          <h3>Meme Vault</h3>
          <p>
            <i>(Coming soon: image gallery)</i>
          </p>
        </section>

        <section id="web3" className="reveal">
          <h3>Web3 Playground</h3>
          <div className="card">
            <ConnectWallet />
          </div>
        </section>

        <footer>
          <small>© {new Date().getFullYear()} helloworld</small>
        </footer>
      </main>
    </>
  );
}
