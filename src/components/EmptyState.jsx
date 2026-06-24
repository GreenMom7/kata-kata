import { Book, Plus } from "lucide-react";

export default function EmptyState({ t, onAdd, filter }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px", color: t.muted }}>
      <Book size={40} strokeWidth={1.6} style={{ opacity: 0.4, marginBottom: 16 }} />
      <p style={{ fontSize: 15, margin: "0 0 20px" }}>
        {filter === "all"
          ? "No words yet. Start your collection."
          : `Nothing in “${filter}” yet.`}
      </p>
      <button style={t.primaryBtn} onClick={onAdd}>
        <Plus size={18} strokeWidth={2.6} /> Add your first word
      </button>
    </div>
  );
}
