"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { banks, faq, guarantees, steps, tips, why } from "@/lib/copy";
import { reducedMotion, useScrollProgress } from "@/lib/motion";
import { site } from "@/lib/site";
import { Icon } from "../Icons";
import { LeadButton } from "../LeadModal";

/** Looping video that plays only while on screen. */
export function LoopVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || reducedMotion()) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { rootMargin: "100px" });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="none" aria-hidden="true" />;
}

/** Drone footage of the crew on a 250 kW roof + five steps that fill in as you scroll. */
export function Process() {
  const root = useRef<HTMLOListElement>(null);
  useScrollProgress(root, (p) => root.current?.style.setProperty("--p", p.toFixed(3)), "through");
  return (
    <section className="section process" id="protses">
      <div className="process-media">
        <LoopVideo src="/video/montazh.mp4" poster="/images/montazh-poster.webp" className="process-video" />
        <div className="process-shade" />
      </div>
      <div className="container process-inner">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Від першого дзвінка до власної розетки</p>
          <h2 className="h2">
            Усе під ключ. <span className="accent">Вам — лише рахувати економію</span>
          </h2>
          <p className="section-sub">Проєкт, постачання, монтаж, запуск і сервіс — одна команда й один договір. Наша бригада на даху підприємства — це відео з нашого об’єкта на 250 кВт.</p>
        </div>
        <ol className="process-steps" ref={root}>
          {steps.map((s, i) => (
            <li key={s.title} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="process-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Sticky photo on one side, statements scrolling on the other; the active one drives the photo. */
export function Why() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = root.current?.querySelectorAll<HTMLElement>(".why-item");
    if (!items) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section why">
      <div className="container why-grid" ref={root}>
        <div className="why-visual">
          <Link href={why[active].href} className="why-sticky" data-cursor={why[active].cta} aria-label={why[active].cta}>
            {why.map((w, i) => (
              <Image key={w.id} src={w.image} alt={w.alt} fill sizes="(max-width: 1100px) 100vw, 50vw" className={i === active ? "is-on" : undefined} />
            ))}
            <span className="why-caption mono">{why[active].alt}</span>
            <div className="why-bar" aria-hidden="true">
              {why.map((w, i) => (
                <i key={w.id} className={i <= active ? "is-on" : undefined} />
              ))}
            </div>
          </Link>
        </div>
        <div className="why-list">
          <p className="eyebrow">Чому нам довіряють</p>
          {why.map((w, i) => (
            <article key={w.id} className={`why-item${i === active ? " is-on" : ""}`} data-i={i}>
              <span className="mono">
                {String(i + 1).padStart(2, "0")} · {w.title}
              </span>
              <h3>{w.claim}</h3>
              <p>{w.body}</p>
              <Link href={w.href} className="text-link">
                {w.cta} <Icon name="arrow" size={16} />
              </Link>
              <Link href={w.href} className="why-inline" tabIndex={-1} aria-hidden="true">
                <Image src={w.image} alt="" fill sizes="100vw" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Guarantees() {
  return (
    <section className="section guarantees" id="harantii">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Гарантії за договором</p>
          <h2 className="h2">
            Станція на десятиліття, <span className="accent">а не на сезон</span>
          </h2>
          <p className="section-sub">Середній строк служби сонячної станції — 25–30 років. Гарантії виробників на обладнання ми оформлюємо й обслуговуємо самі.</p>
        </div>
        <ul className="g-grid">
          {guarantees.map((g, i) => (
            <li key={g.label} className="g-card spot" data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="mono">{g.label}</span>
              <p className="g-num">
                <small>до</small>
                <span data-count={g.value}>{g.value}</span>
                <small>{g.unit}</small>
              </p>
              <p className="g-note">{g.note}</p>
              <span className="g-arc" style={{ ["--k" as string]: g.value / 25 }} aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CreditBand() {
  return (
    <section className="section section-tight">
      <div className="container">
        <Link href="/kredyt" className="credit spot" data-reveal data-cursor="Умови 4 банків">
          <div className="credit-rate">
            <span className="mono">Для домогосподарств</span>
            <p>
              0<small>%</small>
            </p>
          </div>
          <div className="credit-text">
            <h2>Станція в кредит — без переплати</h2>
            <p>Безвідсоткові програми для власників будинків і «5-7-9» для бізнесу. Фіксований платіж, а економія — з першого дня роботи станції.</p>
            <ul className="credit-banks">
              {banks.map((b) => (
                <li key={b.bank}>
                  <b>{b.bank}</b>
                  <span>
                    {b.term} · аванс {b.advance.toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <span className="round-link round-lg">
            <Icon name="arrowUpRight" size={24} />
          </span>
        </Link>
      </div>
    </section>
  );
}

/** Engineering notes from the client's Instagram; each opens in a dialog. */
export function Tips() {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const tip = open !== null ? tips[open] : null;
  return (
    <section className="section tips">
      <div className="container">
        <div className="row-head section-head-row" data-reveal>
          <div>
            <p className="eyebrow">Поради інженерів</p>
            <h2 className="h2">
              Те, про що мовчать <span className="accent">у рекламі</span>
            </h2>
          </div>
          <a href={site.instagram} target="_blank" rel="noreferrer" className="btn btn-outline">
            <Icon name="instagram" size={18} /> {site.instagramHandle}
          </a>
        </div>
        <ul className="tips-grid">
          {tips.map((t, i) => (
            <li key={t.id} data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
              <button type="button" className="tip-card spot" onClick={() => setOpen(i)} data-cursor="Читати">
                <span className="tip-top">
                  <span className="chip">{t.tag}</span>
                  <span className="tip-stat">{t.stat}</span>
                </span>
                <span className="tip-title">{t.title}</span>
                <span className="tip-teaser">{t.teaser}</span>
                <span className="tip-more">
                  Читати <Icon name="plus" size={16} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <dialog
        ref={dialog}
        className="lead-modal tip-modal"
        aria-labelledby="tipTitle"
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setOpen(null);
        }}
      >
        {tip && (
          <div className="lead-modal-box">
            <button type="button" className="lead-modal-close" aria-label="Закрити" onClick={() => setOpen(null)}>
              <Icon name="close" size={22} />
            </button>
            <p className="eyebrow">{tip.tag}</p>
            <h2 id="tipTitle">{tip.title}</h2>
            <div className="tip-body">
              {tip.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="tip-actions">
              <LeadButton title="Запитати інженера" details={`Питання після поради: «${tip.title}»`} className="btn btn-primary">
                Запитати інженера <Icon name="arrow" size={16} />
              </LeadButton>
              <a className="text-link" href={`https://www.instagram.com/p/${tip.post}/`} target="_blank" rel="noreferrer">
                <Icon name="instagram" size={16} /> Пост в Instagram
              </a>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}

/** The client's real customer review (their reel), played on click with sound. */
export function Review() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <section className="section section-tight review">
      <div className="container review-grid">
        <div data-reveal>
          <p className="eyebrow">Реальний відгук</p>
          <h2 className="h2 h2-md">
            «Станція працює, <span className="accent">економія відчутна»</span>
          </h2>
          <p className="section-sub">
            Без сценаріїв і прикрас: наша клієнтка розповідає, як живе зі станцією на даху свого магазину. Більше відгуків — у нашому Instagram.
          </p>
          <div className="faq-actions">
            <LeadButton className="btn btn-primary">
              Хочу так само <Icon name="arrow" size={16} />
            </LeadButton>
            <a className="text-link" href="https://www.instagram.com/reel/DQ6JnikCUVk/" target="_blank" rel="noreferrer">
              <Icon name="instagram" size={16} /> Дивитися в Instagram
            </a>
          </div>
        </div>
        <div className={`review-video${playing ? " is-playing" : ""}`} data-reveal>
          <video
            ref={ref}
            src="/video/vidguk.mp4"
            poster="/images/vidguk-poster.webp"
            playsInline
            preload="none"
            controls={playing}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
            aria-label="Відео-відгук клієнтки MEGASOLAR"
          />
          {!playing && (
            <button
              type="button"
              className="review-play"
              onClick={() => {
                ref.current?.play();
              }}
              aria-label="Відтворити відгук зі звуком"
            >
              <span>
                <Icon name="play" size={30} />
              </span>
              <small>
                <Icon name="volume" size={14} /> 0:31 · зі звуком
              </small>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export function Faq({ limit = 6, title = "Часті питання" }: { limit?: number; title?: string }) {
  const items = faq.slice(0, limit);
  return (
    <section className="section" id="faq">
      <div className="container faq-grid">
        <div data-reveal>
          <p className="eyebrow">FAQ</p>
          <h2 className="h2 h2-md">{title}</h2>
          <p className="section-sub">Не знайшли відповідь? Запитайте фахівця — консультація безкоштовна.</p>
          <div className="faq-actions">
            <LeadButton title="Запитати фахівця" className="btn btn-primary">
              Запитати <Icon name="arrow" size={16} />
            </LeadButton>
            {limit < faq.length && (
              <Link href="/faq" className="text-link">
                Усі {faq.length} питань <Icon name="arrow" size={16} />
              </Link>
            )}
          </div>
        </div>
        <div className="faq-list">
          {items.map((f, i) => (
            <details key={f.q} className="faq-item" data-reveal style={{ transitionDelay: `${i * 50}ms` }} open={i === 0}>
              <summary>
                {f.q}
                <span>
                  <Icon name="plus" size={18} />
                </span>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
