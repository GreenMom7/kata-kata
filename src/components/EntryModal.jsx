import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

// EntryModal — capture a new word/phrase, or edit an existing one.
// Pass `initial` (an existing entry) to edit; omit it to add a new word.
// Categories are entirely user-driven: there's no preset list. The user types
// whatever they want, and previously-used categories appear as quick-pick chips.
export default function EntryModal({ t, initial, existingCategories, onClose, onSave }) {
  const isEdit = Boolean(initial);
  const [word, setWord] = useState(initial?.word ?? "");
  const [meaning, setMeaning] = useState(initial?.meaning ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const wordRef = useRef();

  useEffect(() => {
    wordRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = () => {
    if (!word.trim() || !meaning.trim()) return;
    onSave({
      word: word.trim(),
      meaning: meaning.trim(),
      // Category is optional — empty string means "uncategorised".
      category: category.trim(),
    });
    onClose();
  };

  return (
    <div style={t.overlay} onClick={onClose}>
      <div
        style={t.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Edit word" : "Add a new word"}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: t.ink }}>
            {isEdit ? "Edit word" : "New word"}
          </h2>
          <button onClick={onClose} style={t.ghostIcon} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <label style={t.label} htmlFor="kk-word">
          Word or phrase
        </label>
        <input
          id="kk-word"
          ref={wordRef}
          value={word}
          onChange={(e) => setWord(e.target.value)}
          style={t.input}
          placeholder="e.g. petrichor"
        />

        <label style={t.label} htmlFor="kk-meaning">
          Meaning
        </label>
        <textarea
          id="kk-meaning"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          rows={3}
          style={{ ...t.input, resize: "vertical" }}
          placeholder="what does it mean? (press Enter for a new line)"
        />

        <label style={t.label} htmlFor="kk-category">
          Category <span style={{ fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          id="kk-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={t.input}
          placeholder="type your own, e.g. malay, idiom…"
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />

        {existingCategories.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {existingCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  ...t.chip,
                  ...(category === cat ? t.chipActive : {}),
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={submit}
          disabled={!word.trim() || !meaning.trim()}
          style={{
            ...t.primaryBtn,
            width: "100%",
            marginTop: 24,
            justifyContent: "center",
            opacity: !word.trim() || !meaning.trim() ? 0.5 : 1,
            cursor: !word.trim() || !meaning.trim() ? "not-allowed" : "pointer",
          }}
        >
          {isEdit ? "Save changes" : "Save word"}
        </button>
      </div>
    </div>
  );
}
