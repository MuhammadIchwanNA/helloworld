import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("theme-dark");
  else root.classList.remove("theme-dark");
}

export default function ToggleTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  }

  return (
    <button
      className="toggle-btn"
      aria-label="Toggle color theme"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      onClick={toggle}
    >
      <span className="toggle-dot" />
    </button>
  );
}
