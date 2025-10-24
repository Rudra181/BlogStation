import React, { useEffect, useState } from "react";
import SunIcon from "./icons/SunIcon";
import MoonIcon from "./icons/MoonIcon";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("bs-theme");
    if (saved) return saved === "dark";
    // prefer light by default
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("bs-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("bs-theme", "light");
    }
  }, [dark]);

  return (
    <button
      aria-label="Toggle color theme"
      onClick={() => setDark(d => !d)}
      style={{
        display:'inline-flex',
        alignItems:'center',
        justifyContent:'center',
        width:36,
        height:36,
        borderRadius:10,
        border:'none',
        cursor:'pointer',
        background:'transparent'
      }}
    >
      {dark ? <SunIcon fill="#fff" /> : <MoonIcon fill="#fff" />}
    </button>
  );
}
