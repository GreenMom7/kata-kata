import { useState } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { generateSentences } from "../lib/ai.js";

export default function WordCard({ entry, t, onDelete, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const generate = async () => {
    setLoading(true);
    setErr("");
    try {
      const sentences = await generateSentences(entry.word, entry.meaning);
      onUpdate(entry.id, { sentences: [...entry.sentences, ...sentences] });
    } catch {
      setErr("Couldn't generate just now. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article style={t.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h3
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
                color: t.ink,
                letterSpacing: "-0.02em",
              }}
            >
              {entry.word}
            </h3>
            {entry.category && <span style={t.tag}>{entry.category}</span>}
          </div>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 15,
              lineHeight: 1.6,
              color: t.body,
              whiteSpace: "pre-wrap",
            }}
          >
            {entry.meaning}
          </p>
        </div>
        <button
          onClick={() => onDelete(entry.id)}
          aria-label={`Delete ${entry.word}`}
          style={t.ghostIcon}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {entry.sentences.length > 0 && (
        <ul
          style={{
            margin: "20px 0 0",
            padding: 0,
            listStyle: "none",
            display: "grid",
            gap: 10,
          }}
        >
          {entry.sentences.map((s, i) => (
            <li key={i} style={t.sentence}>
              “{s}”
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={generate} disabled={loading} style={t.aiBtn}>
          <Sparkles size={15} strokeWidth={2.4} />
          {loading ? "thinking…" : "Generate sentence"}
        </button>
        {err && <span style={{ fontSize: 13, color: t.danger }}>{err}</span>}
      </div>
    </article>
  );
}
