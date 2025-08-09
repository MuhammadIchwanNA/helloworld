import { useEffect, useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import "./index.css";

export default function App() {
  /* ---------- Theme toggle (uses html.theme-dark) ---------- */
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  /* ---------- Scroll reveal with gentle stagger ---------- */
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

            {/* Image-based toggle; put icon-light.png & icon-dark.png in /public */}
            <button
              className="toggle-btn"
              aria-label="Toggle theme"
              onClick={() => setIsDark((v) => !v)}
              title={isDark ? "Switch to light" : "Switch to dark"}
            >
              <img
                src={isDark ? "/icon-dark.png" : "/icon-light.png"}
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
            <a href="#projects" className="quiet-link">see projects</a>
            <span className="sep">·</span>
            <a href="#essays" className="quiet-link">read essays</a>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container main">
        <section id="essays" className="reveal">
          <h3>Essays</h3>
          <p><i>(Coming soon: list of essays)</i></p>
        </section>

        <section id="projects" className="reveal">
          <h3>Projects</h3>
          <p><i>(Coming soon: project cards)</i></p>
        </section>

        <section id="photos" className="reveal">
          <h3>Photo Journal</h3>
          <p><i>(Coming soon: photo grid)</i></p>
        </section>

        <section id="memes" className="reveal">
          <h3>Meme Vault</h3>
          <p><i>(Coming soon: image gallery)</i></p>
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
