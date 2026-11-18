import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { Icon } from "@/components/Icons";
import { LeadButton } from "@/components/LeadModal";
import { ContactBand, MoreObjects } from "@/components/Shared";
import { getObject, monthName, objectImage, objectPhotos, objects, segmentName, typeName } from "@/lib/objects";

export function generateStaticParams() {
  return objects.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const o = getObject((await params).slug);
  if (!o) return {};
  return { title: `${o.title} · ${o.power}`, description: o.lead, openGraph: { images: [objectImage(o.slug)] } };
}

export default async function ObjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const o = getObject((await params).slug);
  if (!o) notFound();
  const i = objects.indexOf(o);
  const prev = objects[(i - 1 + objects.length) % objects.length];
  const next = objects[(i + 1) % objects.length];
  const photos = objectPhotos(o.slug).map((p, k) => ({ ...p, alt: `${o.title} — фото ${k + 1}` }));

  return (
    <>
      <section className="obj-hero">
        <div className="container obj-hero-grid">
          <div className="obj-hero-text">
            <nav className="crumbs" aria-label="Навігаційний ланцюжок">
              <Link href="/">Головна</Link>
              <Link href="/obiekty">Об’єкти</Link>
              <Link href={`/obiekty/${o.slug}`}>{o.short}</Link>
            </nav>
            <p className="eyebrow fade-up">
              {typeName[o.type]} станція · {segmentName[o.segment].toLowerCase()} · {monthName(o.date)}
            </p>
            <h1 className="page-title obj-title fade-up" style={{ animationDelay: "90ms" }}>
              {o.title}
            </h1>
            <p className="page-lead fade-up" style={{ animationDelay: "180ms" }}>
              {o.lead}
            </p>
            <div className="obj-nums fade-up" style={{ animationDelay: "260ms" }}>
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
          </div>
          <div className="obj-hero-photo fade-up" style={{ animationDelay: "200ms" }}>
            <Image src={objectImage(o.slug)} alt={o.title} fill priority sizes="(max-width: 1040px) 100vw, 46vw" />
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container model-grid-2">
          <div className="model-copy" data-reveal>
            {o.story.map((p, k) => (
              <p key={k}>{p}</p>
            ))}
            {o.post && (
              <a className="text-link" href={`https://www.instagram.com/p/${o.post}/`} target="_blank" rel="noreferrer">
                <Icon name="instagram" size={18} /> Цей об’єкт в нашому Instagram
              </a>
            )}
          </div>
          <aside className="spec-card" data-reveal>
            <h2 className="spec-card-title">Що на об’єкті</h2>
            <dl className="spec-common">
              {o.specs.map((s) => (
                <div key={s.k}>
                  <dt>{s.k}</dt>
                  <dd>{s.v}</dd>
                </div>
              ))}
            </dl>
            <div className="chip-row">
              {o.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <div className="spec-actions">
              <LeadButton title="Хочу так само" details={`Цікавить станція як на об’єкті: ${o.title} (${o.power})`} className="btn btn-primary btn-lg">
                Хочу так само <Icon name="arrow" size={18} />
              </LeadButton>
              <Link href="/stantsii" className="btn btn-outline">
                Готові станції з цінами
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {photos.length > 1 && (
        <section className="section section-tight">
          <div className="container">
            <h2 className="mini-title" data-reveal>
              Фото з об’єкта
            </h2>
            <Gallery photos={photos} fallbackAlt={o.title} />
          </div>
        </section>
      )}

      <div className="container">
        <nav className="model-pager" aria-label="Інші об’єкти">
          <Link href={`/obiekty/${prev.slug}`}>
            <span className="mono">
              <Icon name="chevronLeft" size={14} /> Попередній
            </span>
            <strong>
              {prev.short}
            </strong>
          </Link>
          <Link href={`/obiekty/${next.slug}`} className="is-next">
            <span className="mono">
              Наступний <Icon name="chevronRight" size={14} />
            </span>
            <strong>
              {next.short}
            </strong>
          </Link>
        </nav>
      </div>

      <MoreObjects exclude={o.slug} title="Інші об’єкти" />
      <ContactBand title="Хочете так само?" lead="Залиште телефон — фахівець розрахує станцію під ваш об’єкт і підготує кошторис без прихованих доплат." details={`Сторінка об’єкта: ${o.title}`} />
    </>
  );
}
