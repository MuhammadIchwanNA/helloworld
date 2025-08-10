import { useEffect, useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import Modal from "./components/Modal";
import "./index.css";
import iconLight from "./assets/icon-light.png";
import iconDark from "./assets/icon-dark.png";

// Preload all photos from /public/photos/
const photoEntries = Object.entries(
  import.meta.glob("/public/photos/*.{jpg,jpeg,png}", {
    as: "url",
    eager: true,
  })
);

const photoUrls = photoEntries
  .map(([_, url]) => url)
  .sort((a, b) => (a > b ? 1 : -1));

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
    title: "Soup Servings (DP + Memo)",
    blurb: "LeetCode DP solution with Map memo + explanation.",
    tag: "algorithms",
  },
];

export default function App() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const closeLightbox = () => setLightboxUrl(null);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");

    const link = document.querySelector<HTMLLinkElement>("#app-favicon");
    if (link) {
      const next = isDark ? "/favicon-dark.png" : "/favicon-light.png";
      if (!link.href.endsWith(next)) link.href = next;
    }
  }, [isDark]);

  useEffect(() => {
    const close = (e: KeyboardEvent) =>
      e.key === "Escape" && setModalOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    els.forEach((el, i) => (el.dataset.idx = String(i % 5)));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const idx = Number(el.dataset.idx || 0);
          el.style.transitionDelay = `${idx * 80}ms`;
          el.classList.add("show");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Lightbox keyboard close
  useEffect(() => {
    const close = (e: KeyboardEvent) =>
      e.key === "Escape" && setLightboxUrl(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <>
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

            <button className="btn" onClick={() => setModalOpen(true)}>
              Wallet
            </button>
            <button
              className="btn"
              aria-label="Toggle theme"
              onClick={() => setIsDark((v) => !v)}
              title={isDark ? "Switch to light" : "Switch to dark"}
            >
              <img
                src={isDark ? iconDark : iconLight}
                alt=""
                width={16}
                height={16}
                style={{ display: "block" }}
              />
            </button>
          </div>
        </div>
      </header>

      <section id="hero" className="hero fade-in">
        <div className="container" style={{ textAlign: "center" }}>
          <h2>helloworld</h2>
          <p>
            a small corner on the internet — essays, projects, and experiments.
            built to grow slowly and stay honest.
          </p>
        </div>
      </section>

      <main className="container main">
        <section id="essays" className="reveal">
          <h3>Essays</h3>
          <p>
            <i>(Coming soon)</i>
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
          <div className="photo-grid">
            {photoUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Photo ${i}`}
                loading="lazy"
                onClick={() => setLightboxUrl(url)}
              />
            ))}
          </div>
          {lightboxUrl && (
            <div className="lightbox" onClick={closeLightbox}>
              <img src={lightboxUrl} alt="Zoomed" />
            </div>
          )}
        </section>

        <section id="memes" className="reveal">
          <h3>Meme Vault</h3>
          <p>
            <i>(Coming soon)</i>
          </p>
        </section>

        <section id="web3" className="reveal">
          <h3>Web3 Playground</h3>
          <p>
            <i>Wallet opens in top-right modal →</i>
          </p>
        </section>

        <footer>
          <small>© {new Date().getFullYear()} helloworld</small>
        </footer>
      </main>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <ConnectWallet />
        </Modal>
      )}
    </>
  );
}
