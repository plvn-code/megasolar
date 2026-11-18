"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { kits, minPrice, uah } from "@/lib/catalog";
import { Icon } from "../Icons";
import { KitCard } from "../Shared";

const tabs = [
  { id: "hybrid", label: "Гібридні", note: "з акумуляторами · світло під час відключень" },
  { id: "grid", label: "Мережеві", note: "максимальна економія · зелений тариф" },
] as const;

/** Ready-made stations with the client's prices, on a horizontal rail. */
export function Kits() {
  const [type, setType] = useState<"hybrid" | "grid">("hybrid");
  const rail = useRef<HTMLDivElement>(null);
  const list = kits.filter((k) => k.sub === type);
  const scroll = (d: number) => rail.current?.scrollBy({ left: d * rail.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section className="section kits" id="stantsii">
      <div className="container">
        <div className="row-head section-head-row" data-reveal>
          <div>
            <p className="eyebrow">Готові станції під ключ</p>
            <h2 className="h2">
              Ціна відома <span className="accent">до дзвінка</span>
            </h2>
            <p className="section-sub">
              {kits.length} готових конфігурацій від 6 до 300 кВт: обладнання, кріплення, автоматика, монтаж і запуск — в одній ціні.
            </p>
          </div>
          <div className="kits-controls">
            <div className="seg seg-lg" role="tablist" aria-label="Тип станції">
              {tabs.map((t) => (
                <button key={t.id} type="button" role="tab" aria-selected={type === t.id} className={type === t.id ? "is-on" : undefined} onClick={() => setType(t.id)}>
                  {t.label} · {kits.filter((k) => k.sub === t.id).length}
                </button>
              ))}
            </div>
            <p className="kits-note">
              {tabs.find((t) => t.id === type)!.note} · від {uah(minPrice(list))}
            </p>
          </div>
        </div>
      </div>
      <div className="rail" ref={rail} key={type}>
        {list.map((k, i) => (
          <KitCard key={k.id} item={k} index={i} />
        ))}
        <Link href="/stantsii" className="rail-more" data-cursor="Усі станції">
          <Icon name="arrowUpRight" size={30} />
          <span>Порівняти всі {kits.length} станцій</span>
        </Link>
      </div>
      <div className="container rail-nav">
        <button type="button" className="round-link" onClick={() => scroll(-1)} aria-label="Попередні станції">
          <Icon name="chevronLeft" size={22} />
        </button>
        <button type="button" className="round-link" onClick={() => scroll(1)} aria-label="Наступні станції">
          <Icon name="chevronRight" size={22} />
        </button>
        <Link href="/stantsii" className="text-link">
          Усі станції з комплектацією <Icon name="arrow" size={16} />
        </Link>
      </div>
    </section>
  );
}
