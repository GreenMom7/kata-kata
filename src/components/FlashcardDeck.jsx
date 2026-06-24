import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCw, Check } from "lucide-react";

export default function FlashcardDeck({ entries, t }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState({});

  // Reset to the first card whenever the deck changes (e.g. filter applied).
  useEffect(() => {
    setI(0);
    setFlipped(false);
  }, [entries.length]);

  const go = (dir) => {
    setFlipped(false);
    setI((p) => (p + dir + entries.length) % entries.length);
  };

  const mark = (val) => {
    setKnown((k) => ({ ...k, [entries[i].id]: val }));
    setTimeout(() => go(1), 220);
  };

  // Keyboard: arrows to move, space to flip.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (entries.length === 0) return null;

  const e = entries[i];
  const knownCount = Object.values(known).filter(Boolean).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{ fontSize: 13, color: t.muted }}>
        {i + 1} / {entries.length} · {knownCount} known
      </div>

      <div style={{ perspective: 1400, width: "100%", maxWidth: 520 }}>
        <div
          onClick={() => setFlipped((f) => !f)}
          role="button"
          tabIndex={0}
          aria-label="Flashcard, click to flip"
          onKeyDown={(ev) => ev.key === "Enter" && setFlipped((f) => !f)}
          style={{
            position: "relative",
            height: 300,
            cursor: "pointer",
            transformStyle: "preserve-3d",
            transition: "transform .5s cubic-bezier(.4,.2,.2,1)",
            transform: flipped ? "rotateY(180deg)" : "none",
          }}
        >
          {/* Front: the word */}
          <div style={{ ...t.face, ...t.faceFront }}>
            {e.category && <span style={t.tag}>{e.category}</span>}
            <h2
              style={{
                margin: "16px 0 0",
                fontSize: 34,
                fontWeight: 700,
                color: t.ink,
                letterSpacing: "-0.03em",
                textAlign: "center",
              }}
            >
              {e.word}
            </h2>
            <span style={{ position: "absolute", bottom: 20, fontSize: 12, color: t.muted }}>
              tap to reveal meaning
            </span>
          </div>

          {/* Back: the meaning + first example */}
          <div style={{ ...t.face, ...t.faceBack }}>
            <p
              style={{
                margin: 0,
                fontSize: 17,
                lineHeight: 1.6,
                color: t.body,
                textAlign: "center",
                whiteSpace: "pre-wrap",
              }}
            >
              {e.meaning}
            </p>
            {e.sentences[0] && (
              <p
                style={{
                  margin: "18px 0 0",
                  fontSize: 14,
                  fontStyle: "italic",
                  color: t.muted,
                  textAlign: "center",
                }}
              >
                “{e.sentences[0]}”
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: t.muted }}>
        click card to flip · ← → to move · space to flip
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => go(-1)} style={t.navBtn} aria-label="Previous card">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => mark(false)} style={{ ...t.markBtn, ...t.markUnknown }}>
          <RotateCw size={15} /> Review again
        </button>
        <button onClick={() => mark(true)} style={{ ...t.markBtn, ...t.markKnown }}>
          <Check size={15} /> Got it
        </button>
        <button onClick={() => go(1)} style={t.navBtn} aria-label="Next card">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
