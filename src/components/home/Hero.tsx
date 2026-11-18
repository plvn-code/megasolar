"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { reducedMotion, useScrollProgress } from "@/lib/motion";
import { getObject, monthName, objectImage } from "@/lib/objects";
import { Icon } from "../Icons";
import { LeadButton } from "../LeadModal";

const lines = [["Енергія,"], ["що", "працює"], ["на", "вас."]];
const chips = [
  { label: "Готові станції", href: "/stantsii" },
  { label: "Панелі", href: "/katalog/paneli" },
  { label: "Інвертори", href: "/katalog/invertory" },
  { label: "Акумулятори", href: "/katalog/akumuliatory" },
  { label: "Кредит 0%", href: "/kredyt" },
];

/** Full-screen drone flight over a solar field; recedes into a frame on scroll. */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const latest = getObject("nazemna-200-kvt")!; // newest object (June 2026)

  useScrollProgress(root, (p) => root.current?.style.setProperty("--p", p.toFixed(3)));

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (reducedMotion()) {
      v.pause();
      return;
    }
    const ready = () => v.classList.add("is-ready");
    if (v.readyState >= 3) ready();
    v.addEventListener("canplay", ready);
    let onScreen = true;
    const sync = () => {
      if (onScreen && !document.hidden) v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(v);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      v.removeEventListener("canplay", ready);
      document.removeEventListener("visibilitychange", sync);
      io.disconnect();
    };
  }, []);

  let w = 0;
  return (
    <section className="hero" ref={root}>
      <div className="hero-sticky">
        <div className="hero-media">
          <video ref={video} className="hero-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
            <source src="/video/hero-mobile.mp4" media="(max-width: 700px) and (orientation: portrait)" type="video/mp4" />
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          <div className="hero-shade" aria-hidden="true" />
        </div>

        <div className="container hero-content">
          <p className="hero-badge fade-up" style={{ animationDelay: "1.9s" }}>
            <span className="pulse" />
            Полтава · 15+ років у сонячній енергетиці
          </p>
          <h1 className="hero-title">
            <span className="sr-only">MEGASOLAR — сонячні електростанції та обладнання в Полтаві. </span>
            {lines.map((line, i) => (
              <span className={`hero-line${i === 2 ? " accent-line" : ""}`} key={i}>
                {line.map((word) => (
                  <span className="word" key={word}>
                    <span style={{ animationDelay: `${1.95 + w * 0.12}s`, ["--d" as string]: `${0.15 + w++ * 0.12}s` }}>{word}</span>
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <nav className="hero-cats fade-up" style={{ animationDelay: "2.3s" }} aria-label="Напрямки">
            {chips.map((c) => (
              <Link key={c.href} href={c.href}>
                {c.label}
                <Icon name="arrowUpRight" size={15} />
              </Link>
            ))}
          </nav>
          <div className="hero-bottom">
            <div>
              <p className="hero-lead fade-up" style={{ animationDelay: "2.4s" }}>
                Сонячні станції під ключ і обладнання Tier 1 для дому та бізнесу: проєкт, власна доставка, монтаж за 1–3 дні, кредит 0%. Ціни — відкрито.
              </p>
              <div className="hero-actions fade-up" style={{ animationDelay: "2.55s" }}>
                <LeadButton className="btn btn-primary btn-lg">
                  <span className="only-wide">Безкоштовний розрахунок</span>
                  <span className="only-narrow">Розрахунок</span>
                  <Icon name="arrow" size={18} />
                </LeadButton>
                <Link href="/stantsii" className="btn btn-glass btn-lg">
                  <Icon name="panel" size={18} /> <span className="only-wide">Готові станції</span>
                  <span className="only-narrow">Станції</span>
                </Link>
              </div>
            </div>
            <Link href={`/obiekty/${latest.slug}`} className="hero-latest fade-up" style={{ animationDelay: "2.7s" }} data-cursor="Розбір об’єкта">
              <span className="hero-latest-img">
                <Image src={objectImage(latest.slug)} alt="" fill sizes="96px" />
              </span>
              <span className="hero-latest-text">
                <span className="mono">Новий об’єкт · {monthName(latest.date)}</span>
                <strong>{latest.title}</strong>
                <span>
                  {latest.tags.slice(0, 2).join(" · ")}
                </span>
              </span>
              <Icon name="arrowUpRight" size={20} />
            </Link>
          </div>
        </div>

        <a href="#manifest" className="hero-scroll" aria-label="Прокрутити вниз">
          <span />
        </a>
      </div>
    </section>
  );
}
