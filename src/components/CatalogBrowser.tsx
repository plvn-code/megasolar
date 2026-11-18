"use client";

import { useMemo, useState } from "react";
import { type Category, type Item, inCategory } from "@/lib/catalog";
import { Icon } from "./Icons";
import { ProductCard } from "./Shared";

type Sort = "pop" | "cheap" | "dear" | "power";
const SORTS: { id: Sort; label: string }[] = [
  { id: "pop", label: "Як у каталозі" },
  { id: "cheap", label: "Спочатку дешевші" },
  { id: "dear", label: "Спочатку дорожчі" },
  { id: "power", label: "За потужністю" },
];

/** Filters (type, brand), search and sort for one catalogue category. */
export function CatalogBrowser({ cat, initialSub }: { cat: Category; initialSub?: string }) {
  const all = useMemo(() => inCategory(cat.id), [cat.id]);
  const subs = Object.entries(cat.subs).filter(([id]) => all.some((i) => i.sub === id));
  const [sub, setSub] = useState<string>(subs.some(([id]) => id === initialSub) ? initialSub! : "all");
  const [brand, setBrand] = useState<string>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("pop");

  const bySub = all.filter((i) => sub === "all" || i.sub === sub);
  const brands = [...new Set(bySub.map((i) => i.brand).filter(Boolean))] as string[];
  const query = q.trim().toLowerCase();
  let list: Item[] = bySub.filter((i) => (brand === "all" || i.brand === brand) && (!query || i.name.toLowerCase().includes(query)));
  if (sort === "cheap") list = [...list].sort((a, b) => (a.price ?? 1e12) - (b.price ?? 1e12));
  if (sort === "dear") list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  if (sort === "power") list = [...list].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  const reset = () => {
    setSub("all");
    setBrand("all");
    setQ("");
  };

  return (
    <div className="browser">
      <div className="browser-bar">
        {subs.length > 1 && (
          <div className="tabs" role="tablist" aria-label="Тип">
            <button type="button" role="tab" aria-selected={sub === "all"} className={sub === "all" ? "is-on" : undefined} onClick={() => {
                setSub("all");
                setBrand("all");
              }}>
              Усі<span>{all.length}</span>
            </button>
            {subs.map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={sub === id} className={sub === id ? "is-on" : undefined} onClick={() => {
                  setSub(id);
                  setBrand("all");
                }}>
                {label}
                <span>{all.filter((i) => i.sub === id).length}</span>
              </button>
            ))}
          </div>
        )}
        <div className="browser-tools">
          <label className="search">
            <Icon name="search" size={18} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Пошук за моделлю" aria-label="Пошук за моделлю" />
          </label>
          <label className="select">
            <span className="sr-only">Сортування</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              {SORTS.filter((s) => s.id !== "power" || cat.filterLabel).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={16} />
          </label>
        </div>
      </div>
      {brands.length > 1 && (
        <div className="brand-chips" aria-label="Бренд">
          <button type="button" className={brand === "all" ? "is-on" : undefined} onClick={() => setBrand("all")} aria-pressed={brand === "all"}>
            Усі бренди
          </button>
          {brands.map((b) => (
            <button key={b} type="button" className={brand === b ? "is-on" : undefined} onClick={() => setBrand(b)} aria-pressed={brand === b}>
              {b}
            </button>
          ))}
        </div>
      )}
      <p className="browser-count mono" aria-live="polite">
        Знайдено: {list.length}
      </p>
      {list.length ? (
        <div className="prod-grid" key={`${sub}-${brand}-${sort}`}>
          {list.map((i, k) => (
            <ProductCard key={i.id} item={i} index={k} />
          ))}
        </div>
      ) : (
        <div className="browser-empty">
          <p>Нічого не знайшли за цим запитом. Можливо, потрібна модель є під замовлення — запитайте менеджера.</p>
          <button type="button" className="btn btn-outline" onClick={reset}>
            Скинути фільтри
          </button>
        </div>
      )}
    </div>
  );
}
