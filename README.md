# Dayari Prompt Builder

A tiny Next.js tool with 4 fields — Product Name, Current Dayari Product URL,
External Source 1, External Source 2 — that drop straight into the Dayari
master product-page prompt. One click copies the finished prompt to your
clipboard, then the fields clear themselves after a couple of seconds so the
form is ready for the next product.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Where things live

- `lib/promptTemplate.ts` — the full master prompt, with the four field
  values spliced in. Edit this file if the master prompt itself ever changes.
- `app/page.tsx` — the form, live preview, and the copy-then-reset button.

## Notes

- Leaving External Source 1 or 2 blank keeps the original `[]` placeholder
  in the generated prompt, exactly like the source template expects.
- The reset delay after copying is 5.0 seconds — change `RESET_DELAY_MS` in
  `app/page.tsx` if you want it faster or slower.
