// ai.js — talks to our own /api/generate endpoint, never to Anthropic directly.
// The API key stays on the server (see api/generate.js), so it's never shipped
// to the browser.

export async function generateSentences(word, meaning) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word, meaning }),
  });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  const data = await res.json();
  if (!Array.isArray(data.sentences)) {
    throw new Error("Unexpected response shape");
  }
  return data.sentences;
}
