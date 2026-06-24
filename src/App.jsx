import { useState, useMemo, useEffect } from "react";
import { Plus, List, Layers } from "lucide-react";

import Navbar from "./components/Navbar.jsx";
import WordCard from "./components/WordCard.jsx";
import FlashcardDeck from "./components/FlashcardDeck.jsx";
import AddModal from "./components/AddModal.jsx";
import EmptyState from "./components/EmptyState.jsx";

import { getTheme } from "./lib/theme.js";
import { loadEntries, saveEntries, loadTheme, saveTheme } from "./lib/storage.js";

export default function App() {
  const [dark, setDark] = useState(loadTheme);
  const [entries, setEntries] = useState(loadEntries);
  const [view, setView] = useState("list"); // "list" | "cards"
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("all");

  const t = getTheme(dark);

  // Persist on change.
  useEffect(() => saveEntries(entries), [entries]);
  useEffect(() => saveTheme(dark), [dark]);

  // Categories are derived from the entries themselves — whatever the user has
  // actually typed. No preset list. Sorted, unique, non-empty.
  const categories = useMemo(() => {
    const set = new Set(entries.map((e) => e.category).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [entries]);

  const filtered = useMemo(
    () => (filter === "all" ? entries : entries.filter((e) => e.category === filter)),
    [entries, filter]
  );

  const addEntry = (entry) =>
    setEntries((prev) => [{ ...entry, id: Date.now() }, ...prev]);
  const deleteEntry = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const updateEntry = (id, patch) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  // If the active filter's category disappears (last entry deleted), reset it.
  useEffect(() => {
    if (filter !== "all" && !categories.includes(filter)) setFilter("all");
  }, [categories, filter]);

  return (
    <div style={{ ...t.page, minHeight: "100vh" }}>
      <Navbar dark={dark} onToggle={() => setDark((d) => !d)} t={t} />

      <main style={{ maxWidth: 880, margin: "0 auto", padding: "40px 28px 80px" }}>
        {/* Controls */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <button style={t.primaryBtn} onClick={() => setAdding(true)}>
            <Plus size={18} strokeWidth={2.6} /> Add word
          </button>

          <div style={t.segmented}>
            <button
              onClick={() => setView("list")}
              style={{ ...t.segBtn, ...(view === "list" ? t.segBtnActive : {}) }}
            >
              <List size={15} /> List
            </button>
            <button
              onClick={() => setView("cards")}
              style={{ ...t.segBtn, ...(view === "cards" ? t.segBtnActive : {}) }}
            >
              <Layers size={15} /> Flashcards
            </button>
          </div>

          <span style={{ marginLeft: "auto", fontSize: 13, color: t.muted }}>
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {/* Category filter chips — only shown once the user has made categories */}
        {categories.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
            <button
              onClick={() => setFilter("all")}
              style={{ ...t.chip, ...(filter === "all" ? t.chipActive : {}) }}
            >
              all
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{ ...t.chip, ...(filter === cat ? t.chipActive : {}) }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {filtered.length === 0 ? (
          <EmptyState t={t} onAdd={() => setAdding(true)} filter={filter} />
        ) : view === "list" ? (
          <div style={{ display: "grid", gap: 20 }}>
            {filtered.map((e) => (
              <WordCard
                key={e.id}
                entry={e}
                t={t}
                onDelete={deleteEntry}
                onUpdate={updateEntry}
              />
            ))}
          </div>
        ) : (
          <FlashcardDeck entries={filtered} t={t} />
        )}
      </main>

      {adding && (
        <AddModal
          t={t}
          existingCategories={categories}
          onClose={() => setAdding(false)}
          onSave={addEntry}
        />
      )}
    </div>
  );
}
