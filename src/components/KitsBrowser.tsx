"use client";

import { useState } from "react";
import { kits } from "@/lib/catalog";
import { KitCard } from "./Shared";

const TYPES = [
  { id: "all", label: "Усі" },
  { id: "hybrid", label: "Гібридні" },
  { id: "grid", label: "Мережеві" },
] as const;
const SIZES = [
  { id: "all", label: "Будь-яка потужність", test: () => true },
  { id: "home", label: "До 20 кВт · дім", test: (v: number) => v <= 20 },
  { id: "mid", label: "30–60 кВт · бізнес", test: (v: number) => v >= 30 && v <= 60 },
  { id: "big", label: "100+ кВт · підприємство", test: (v: number) => v >= 100 },
] as const;

export function KitsBrowser({ initial }: { initial?: string }) {
  const [type, setType] = useState<string>(TYPES.some((t) => t.id === initial) ? initial! : "all");
  const [size, setSize] = useState<string>("all");
  const test = SIZES.find((s) => s.id === size)!.test;
  const list = kits.filter((k) => (type === "all" || k.sub === type) && test(k.value ?? 0)).sort((a, b) => (a.value ?? 0) - (b.value ?? 0) || (a.price ?? 0) - (b.price ?? 0));
  return (
    <>
      <div className="browser-bar">
        <div className="tabs" role="tablist" aria-label="Тип станції">
          {TYPES.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={type === t.id} className={type === t.id ? "is-on" : undefined} onClick={() => setType(t.id)}>
              {t.label}
              <span>{kits.filter((k) => t.id === "all" || k.sub === t.id).length}</span>
            </button>
          ))}
        </div>
        <div className="brand-chips">
          {SIZES.map((s) => (
            <button key={s.id} type="button" className={size === s.id ? "is-on" : undefined} aria-pressed={size === s.id} onClick={() => setSize(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="kit-grid" key={`${type}-${size}`}>
        {list.map((k, i) => (
          <KitCard key={k.id} item={k} index={i} />
        ))}
      </div>
    </>
  );
}
