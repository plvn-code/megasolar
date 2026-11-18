"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/motion";
import { monthName, objectImage, objects, segmentName, typeName } from "@/lib/objects";
import { Icon } from "../Icons";

const featured = ["nazemna-200-kvt", "hibryd-85-kvt", "merezheva-250-kvt", "hibryd-100-kvt-longi", "merezheva-20-kvt"].map((s) => objects.find((o) => o.slug === s)!);

/** Real objects pin one after another and stack up while scrolling. */
export function ObjectsStack() {
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = list.current;
    if (!root || reducedMotion()) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".stack-card"));
    let raf = 0;
    const update = () => {
      raf = 0;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const a = card.getBoundingClientRect();
        const b = next.getBoundingClientRect();
        card.style.setProperty("--p", Math.min(1, Math.max(0, 1 - (b.top - a.top) / a.height)).toFixed(3));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="section objects" id="obiekty">
      <div className="container">
        <div className="row-head section-head-row" data-reveal>
          <div>
            <p className="eyebrow">Портфоліо · від дачі до 250 кВт</p>
            <h2 className="h2">
              Об’єкти, де сонце <span className="accent">вже працює</span>
            </h2>
          </div>
          <Link href="/obiekty" className="btn btn-outline">
            Усі об’єкти · {objects.length} <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="stack" ref={list}>
          {featured.map((o, i) => (
            <article className="stack-card" key={o.slug} style={{ top: `calc(var(--header-h) + 16px + ${i * 14}px)` }}>
              <div className="stack-inner" data-cursor="Розбір об’єкта">
                <Link href={`/obiekty/${o.slug}`} className="stack-link" aria-label={`${o.title}: розбір об’єкта`} tabIndex={-1} />
                <div className="stack-media">
                  <Image src={objectImage(o.slug)} alt={o.title} fill sizes="(max-width: 700px) 100vw, 660px" className="stack-img" />
                  <div className="stack-shade" aria-hidden="true" />
                </div>
                <div className="stack-body">
                  <div className="stack-top">
                    <span className="mono">
                      {String(i + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")} · {segmentName[o.segment]} · {monthName(o.date)}
                    </span>
                    <span className="chip chip-sun">{typeName[o.type]}</span>
                  </div>
                  <div className="stack-text">
                    <div className="stack-nums">
                      <span>
                        <b>{o.power}</b>
                        <small>потужність</small>
                      </span>
                      {o.storage && (
                        <span>
                          <b>{o.storage}</b>
                          <small>накопичення</small>
                        </span>
                      )}
                    </div>
                    <h3 className="stack-title">{o.title}</h3>
                    <p className="stack-copy">{o.lead}</p>
                    <div className="stack-models">
                      {o.specs.slice(0, 3).map((s) => (
                        <span key={s.k} className="chip">
                          {s.v}
                        </span>
                      ))}
                    </div>
                    <Link href={`/obiekty/${o.slug}`} className="btn btn-glass">
                      Розбір об’єкта <Icon name="arrowUpRight" size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
