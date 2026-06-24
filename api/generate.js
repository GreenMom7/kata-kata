// api/generate.js — serverless endpoint (Vercel/Netlify-style).
// Keeps ANTHROPIC_API_KEY on the server so it's never exposed to the browser.
//
// Deploy: set ANTHROPIC_API_KEY in your hosting environment variables.
// Local dev: run `vercel dev` (or `netlify dev`) so this runs on :3000,
// which vite.config.js proxies to.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { word, meaning } = req.body || {};
  if (!word || !meaning) {
    return res.status(400).json({ error: "word and meaning are required" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server missing ANTHROPIC_API_KEY" });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Write 2 short, natural example sentences using the word or phrase "${word}" (meaning: ${meaning}). Return ONLY a JSON array of 2 strings — no preamble, no markdown.`,
          },
        ],
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      return res.status(502).json({ error: "Upstream error", detail });
    }

    const data = await upstream.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    let sentences;
    try {
      sentences = JSON.parse(text);
    } catch {
      // Model didn't return clean JSON — wrap whatever we got as a single item.
      sentences = [text];
    }

    return res.status(200).json({ sentences });
  } catch (err) {
    return res.status(500).json({ error: "Request failed", detail: String(err) });
  }
}
