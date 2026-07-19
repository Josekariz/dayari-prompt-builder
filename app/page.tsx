"use client";

import { useState, useRef } from "react";
import { buildPrompt, PromptFields } from "@/lib/promptTemplate";

const EMPTY: PromptFields = {
  productName: "",
  dayariUrl: "",
  source1: "",
  source2: "",
};

const RESET_DELAY_MS = 2600;

export default function Home() {
  const [fields, setFields] = useState<PromptFields>(EMPTY);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle"
  );
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prompt = buildPrompt(fields);

  function update<K extends keyof PromptFields>(key: K, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function copyAndReset() {
    const text = buildPrompt(fields);

    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
    } catch {
      // Fallback for environments where the async clipboard API is blocked.
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.focus();
      area.select();
      try {
        document.execCommand("copy");
        setCopyState("copied");
      } catch {
        setCopyState("error");
      }
      document.body.removeChild(area);
    }

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setFields(EMPTY);
      setCopyState("idle");
    }, RESET_DELAY_MS);
  }

  return (
    <main className="min-h-screen bg-console-bg px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-8 flex items-center gap-3">
          <span className="h-2 w-2 shrink-0 rounded-full bg-console-amber shadow-[0_0_8px_2px_rgba(242,169,59,0.6)]" />
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-console-amber">
              Dayari Technologies
            </p>
            <h1 className="text-xl font-semibold text-white sm:text-2xl">
              Product Prompt Builder
            </h1>
          </div>
        </header>

        <p className="mb-8 text-sm leading-relaxed text-white/60">
          Fill in the four source fields below. They drop straight into the
          master product-page prompt. Copy the finished prompt, paste it into
          Claude, then the fields clear themselves for the next product.
        </p>

        <section className="rounded-lg border border-console-border bg-console-panel p-5 sm:p-6">
          <ol className="space-y-5">
            <Field
              index={1}
              label="Product Name"
              hint="A human-readable name, or the raw URL slug — either works."
              value={fields.productName}
              onChange={(v) => update("productName", v)}
              placeholder="e.g. Fanvil X6U Enterprise IP Phone"
            />
            <Field
              index={2}
              label="Current Dayari Product URL"
              hint="The live product page being fixed."
              value={fields.dayariUrl}
              onChange={(v) => update("dayariUrl", v)}
              placeholder="https://dayari.co.ke/product/..."
            />
            <Field
              index={3}
              label="External Source 1"
              hint="Optional — reference only, e.g. an Almiria listing."
              value={fields.source1}
              onChange={(v) => update("source1", v)}
              placeholder="https://..."
              optional
            />
            <Field
              index={4}
              label="External Source 2"
              hint="Optional — reference only, e.g. a Dataworld listing."
              value={fields.source2}
              onChange={(v) => update("source2", v)}
              placeholder="https://..."
              optional
            />
          </ol>

          <button
            onClick={copyAndReset}
            className="mt-6 w-full rounded-md bg-console-amber px-4 py-3 font-mono text-sm font-semibold uppercase tracking-wide text-console-bg transition hover:brightness-110 active:brightness-95"
          >
            {copyState === "copied"
              ? "Copied — clearing fields…"
              : copyState === "error"
              ? "Copy failed — select the preview manually"
              : "Copy full prompt"}
          </button>
        </section>

        <details className="mt-6 rounded-lg border border-console-border bg-console-panelmuted open:pb-4" open>
          <summary className="cursor-pointer select-none px-5 py-3 font-mono text-xs uppercase tracking-[0.15em] text-white/50">
            Live preview
          </summary>
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words px-5 font-mono text-[11px] leading-relaxed text-white/70">
            {prompt}
          </pre>
        </details>
      </div>
    </main>
  );
}

function Field({
  index,
  label,
  hint,
  value,
  onChange,
  placeholder,
  optional,
}: {
  index: number;
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  optional?: boolean;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-2 font-mono text-xs text-white/30">
        {String(index).padStart(2, "0")}
      </span>
      <div className="flex-1">
        <label className="mb-1 flex items-baseline gap-2 text-sm font-medium text-white/90">
          {label}
          {optional && (
            <span className="font-mono text-[10px] font-normal uppercase tracking-wide text-white/35">
              optional
            </span>
          )}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-console-border bg-console-bg px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-console-amber focus:ring-1 focus:ring-console-amber"
        />
        <p className="mt-1 text-xs text-white/35">{hint}</p>
      </div>
    </li>
  );
}
