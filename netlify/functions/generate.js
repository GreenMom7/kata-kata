// netlify/functions/generate.js — Netlify-flavoured version of api/generate.js.
// Same job: call Anthropic server-side so the API key never reaches the browser.
// Reached at /api/generate thanks to the redirect in netlify.toml below.

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let word, meaning;
  try {
    ({ word, meaning } = JSON.parse(event.body || "{}"));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  if (!word || !meaning) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "word and meaning are required" }),
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server missing ANTHROPIC_API_KEY" }),
    };
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
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Upstream error", detail }),
      };
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
      sentences = [text];
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sentences }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Request failed", detail: String(err) }),
    };
  }
}
