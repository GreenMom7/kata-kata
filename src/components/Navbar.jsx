import { Book } from "lucide-react";
import ModeToggle from "./ModeToggle.jsx";

export default function Navbar({ dark, onToggle, t }) {
  return (
    <nav style={t.nav}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Book size={22} strokeWidth={2.4} color={t.accentInk} />
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: t.ink,
          }}
        >
          kata-kata
        </span>
      </div>
      <ModeToggle dark={dark} onClick={onToggle} t={t} />
    </nav>
  );
}
