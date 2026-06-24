import { useState } from "react";
import { Linkedin, Instagram, Github } from "lucide-react";

// Footer — social profile links.
// 👉 Fill in your own URLs below.
const LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/muhammad-akmal-sabri/",
    Icon: Linkedin,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/iwazuminn__",
    Icon: Instagram,
  },
  { label: "GitHub", href: "https://github.com/GreenMom7", Icon: Github },
];

function SocialLink({ label, href, Icon, t }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        placeItems: "center",
        width: 40,
        height: 40,
        borderRadius: 11,
        border: `1px solid ${t.line}`,
        color: hover ? t.accentInk : t.muted,
        background: hover ? t.accent : "transparent",
        transition: "color .2s, background .2s, border-color .2s",
        textDecoration: "none",
      }}
    >
      <Icon size={18} />
    </a>
  );
}

export default function Footer({ t }) {
  return (
    <footer
      style={{
        borderTop: `1px solid ${t.line}`,
        padding: "32px 28px 40px",
        marginTop: 40,
      }}
    >
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 13, color: t.muted }}>
          © {new Date().getFullYear()} kata-kata
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          {LINKS.map((link) => (
            <SocialLink key={link.label} {...link} t={t} />
          ))}
        </div>
      </div>
    </footer>
  );
}
