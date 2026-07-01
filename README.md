# kata-kata

A minimalist personal dictionary for words and phrases you're learning — your own
growing vocab book, with AI-generated example sentences and flashcards for memorising.

> _kata-kata_ means "words" in Malay/Indonesian.

Now accesible from your browser : [kata-kata](https://akmal-kata-kata.netlify.app/)

## Features

- **Add words & phrases** with a meaning and an optional, free-form category.
  Categories are entirely user-driven — type your own, and they become reusable
  quick-pick chips and filters. No preset list.
- **AI example sentences** — generate natural usage examples for any entry,
  powered by Claude (Sonnet 4.6). The API key stays on the server.
- **Two views** — a roomy list, or flashcards.
- **Flashcards** — click to flip (word ↔ meaning), navigate with arrow keys or
  on-screen buttons, and mark each card "Got it" or "Review again".
- **Dark / light mode** with an animated sun⇄moon toggle. Preference is remembered.
- **Local persistence** — everything is saved to your browser via localStorage.

## Stack

- React 18 + Vite
- lucide-react for icons
- Roboto Mono throughout
- A single serverless function (`api/generate.js`) for the AI calls

## Getting started

```bash
npm install
```

### Run the frontend only (no AI)

```bash
npm run dev
```

Opens on http://localhost:5173. Everything works except sentence generation,
which needs the API endpoint running (below).

### Run with AI sentence generation

The AI feature calls `/api/generate`, which proxies to Anthropic using a key that
never reaches the browser. To run it locally you need a serverless dev server.

1. Get an API key from https://console.anthropic.com
2. Copy the env template and fill it in:

   ```bash
   cp .env.example .env
   # then edit .env and set ANTHROPIC_API_KEY
   ```

3. Run with Vercel's dev server (recommended):

   ```bash
   npm i -g vercel
   vercel dev
   ```

   `vite.config.js` proxies `/api` to `localhost:3000`, so both the UI and the
   AI endpoint work together.

## Deploying

This is set up for **Vercel** out of the box (the `api/` folder becomes
serverless functions automatically). Push to a Git repo, import it in Vercel, and
set the `ANTHROPIC_API_KEY` environment variable in the project settings.

Netlify works too — move `api/generate.js` to `netlify/functions/generate.js` and
adjust the fetch path, or use the Netlify Vite plugin.

## Data shape

Each entry stored in localStorage looks like:

```json
{
  "id": 1718900000000,
  "word": "petrichor",
  "meaning": "the earthy scent produced when rain falls on dry soil",
  "category": "nature",
  "sentences": ["After the storm, the petrichor filled the air."]
}
```

`category` may be an empty string (uncategorised). `sentences` starts empty and
grows as you generate them.

## Storage limits

localStorage gives roughly 5 MB per domain. Since entries are plain text, that's
on the order of tens of thousands of words — far more than a personal vocab list
will ever reach. If you ever outgrow it (or want sync across devices), swap the
four functions in `src/lib/storage.js` for a backend; nothing else changes.

## License

MIT — see [LICENSE](./LICENSE).
