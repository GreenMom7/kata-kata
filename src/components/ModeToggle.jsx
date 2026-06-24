import { Sun, Moon } from "lucide-react";

export default function ModeToggle({ dark, onClick, t }) {
  return (
    <button
      onClick={onClick}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={t.iconBtn}
    >
      <span style={{ position: "relative", width: 22, height: 22, display: "block" }}>
        <Sun
          size={22}
          strokeWidth={2.2}
          style={{
            position: "absolute",
            inset: 0,
            opacity: dark ? 0 : 1,
            transform: dark ? "rotate(-90deg) scale(0.4)" : "rotate(0) scale(1)",
            transition: "all .45s cubic-bezier(.34,1.56,.64,1)",
          }}
        />
        <Moon
          size={22}
          strokeWidth={2.2}
          style={{
            position: "absolute",
            inset: 0,
            opacity: dark ? 1 : 0,
            transform: dark ? "rotate(0) scale(1)" : "rotate(90deg) scale(0.4)",
            transition: "all .45s cubic-bezier(.34,1.56,.64,1)",
          }}
        />
      </span>
    </button>
  );
}
