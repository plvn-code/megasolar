import Image from "next/image";
import Link from "next/link";
import { type Item, itemHref, itemImage, kitTitle, price, spec } from "@/lib/catalog";
import { type Obj, monthName, objectImage, objects, segmentName, typeName } from "@/lib/objects";
import { site } from "@/lib/site";
import { AddToCart } from "./CartToast";
import { Icon } from "./Icons";
import { LeadForm } from "./LeadForm";

export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  alt = "",
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: string;
  image?: string;
  alt?: string;
  crumbs?: { label: string; href: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className={`page-hero${image ? " has-image" : ""}`}>
      {image && (
        <div className="page-hero-media" data-parallax="0.08">
          <Image src={image} alt={alt} fill priority sizes="100vw" />
        </div>
      )}
      <div className="page-hero-rays" aria-hidden="true" />
      <div className="container page-hero-inner">
        {crumbs && <Crumbs items={crumbs} />}
        {eyebrow && <p className="eyebrow fade-up">{eyebrow}</p>}
        <h1 className="page-title fade-up" style={{ animationDelay: "90ms" }}>
          {title}
        </h1>
        {lead && (
          <p className="page-lead fade-up" style={{ animationDelay: "180ms" }}>
            {lead}
          </p>
        )}
        {children && (
          <div className="page-hero-actions fade-up" style={{ animationDelay: "270ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export function Crumbs({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Навігаційний ланцюжок">
      <Link href="/">Головна</Link>
      {items.map((c) => (
        <Link key={c.href} href={c.href}>
          {c.label}
        </Link>
      ))}
    </nav>
  );
}

export function ObjectCard({ o, index = 0 }: { o: Obj; index?: number }) {
  return (
    <Link href={`/obiekty/${o.slug}`} className="obj-card spot" data-reveal data-cursor="Розбір об’єкта" style={{ transitionDelay: `${(index % 3) * 70}ms` }}>
      <div className="obj-card-media">
        <Image src={objectImage(o.slug)} alt={o.title} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
        <span className="obj-card-power">{o.power}</span>
        <span className="obj-card-type">{typeName[o.type]}</span>
      </div>
      <div className="obj-card-body">
        <span className="mono">
          {segmentName[o.segment]} · {monthName(o.date)}
        </span>
        <h3>{o.title}</h3>
        <div className="obj-card-foot">
          <span>{o.tags.slice(0, 2).join(" · ")}</span>
          <span className="round-link">
            <Icon name="arrowUpRight" size={20} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Product tile on a light plate: the client's shots are on white, multiply drops the white. */
export function ProductCard({ item, index = 0 }: { item: Item; index?: number }) {
  const s = spec(item);
  return (
    <article className="prod-card card-in" style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}>
      <Link href={itemHref(item)} className="prod-link" data-cursor="Детальніше" aria-label={item.name} />
      <div className="prod-plate">
        {item.img && <Image src={itemImage(item)} alt="" fill sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 280px" />}
        {s && <span className="prod-spec">{s}</span>}
      </div>
      <div className="prod-body">
        {item.brand && <span className="mono">{item.brand}</span>}
        <h3>{item.name}</h3>
        <div className="prod-foot">
          <strong className={item.price ? undefined : "is-muted"}>{price(item)}</strong>
          <AddToCart id={item.id} compact className="prod-add" />
        </div>
      </div>
    </article>
  );
}

const firstInt = (s: string | null | undefined) => Number(s?.match(/\d+/)?.[0] ?? 0);

/** Station drawn from its own composition: one cell per panel (up to 60), batteries for hybrids. */
export function KitVisual({ item }: { item: Item }) {
  const n = firstInt(item.kit?.panels) || firstInt(item.kit?.parts?.[0]?.qty) || Math.round((item.value ?? 10) * 2);
  const shown = Math.min(n, 60);
  const cols = Math.min(12, Math.max(4, Math.ceil(Math.sqrt(shown * 2.2))));
  const rows = Math.ceil(shown / cols);
  const w = 15;
  const h = 22;
  const gap = 3;
  const W = cols * (w + gap);
  const H = rows * (h + gap);
  const hybrid = item.sub === "hybrid";
  return (
    <svg className="kit-visual" viewBox={`-6 -6 ${W + (hybrid ? 46 : 12)} ${Math.max(H, 70) + 12}`} aria-hidden="true">
      <g transform={`translate(${H * 0.18} 0) skewX(-14)`}>
        {Array.from({ length: shown }, (_, i) => (
          <rect key={i} className="kv-cell" x={(i % cols) * (w + gap)} y={Math.floor(i / cols) * (h + gap)} width={w} height={h} rx="1.5" style={{ ["--i" as string]: i }} />
        ))}
      </g>
      {hybrid && (
        <g transform={`translate(${W + H * 0.18 + 10} ${Math.max(H, 70) - 66})`} className="kv-bat">
          {[0, 1, 2].map((k) => (
            <g key={k} transform={`translate(0 ${k * 22})`}>
              <rect width="26" height="18" rx="3" />
              <rect className="kv-lvl" x="3" y="3" width="20" height="12" rx="1.5" style={{ ["--k" as string]: k }} />
            </g>
          ))}
        </g>
      )}
      {n > shown && (
        <text x={W - 4} y={H + 4} textAnchor="end" className="kv-more">
          +{n - shown}
        </text>
      )}
    </svg>
  );
}

export function KitCard({ item, index = 0 }: { item: Item; index?: number }) {
  const t = kitTitle(item);
  const k = item.kit;
  const panels = k?.panels && /^\d+$/.test(k.panels.trim()) ? `${k.panels} шт` : k?.panels;
  const inverter = k?.parts.find((p) => /інвертор/i.test(p.kind))?.model.split(/[(,]/)[0].trim();
  return (
    <article className="kit-card spot card-in" style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}>
      <Link href={itemHref(item)} className="prod-link" data-cursor="Склад станції" aria-label={item.name} />
      <div className="kit-top">
        <span className={`kit-type kit-t-${item.sub}`}>{t.type}</span>
        <span className="mono">{t.tier}</span>
      </div>
      <div className="kit-power">
        <b>{item.value}</b>
        <small>кВт</small>
      </div>
      <KitVisual item={item} />
      <dl className="kit-facts">
        {panels && (
          <div>
            <dt>Панелі</dt>
            <dd>{panels}</dd>
          </div>
        )}
        {inverter && (
          <div>
            <dt>Інвертор</dt>
            <dd>{inverter}</dd>
          </div>
        )}
        {k?.battery && item.sub === "hybrid" && (
          <div>
            <dt>Акумулятори</dt>
            <dd>{/^\d+$/.test(k.battery.trim()) ? `${k.battery} шт` : k.battery}</dd>
          </div>
        )}
        {k?.area && (
          <div>
            <dt>Площа</dt>
            <dd>{/м/.test(k.area) ? k.area : `${k.area} м²`}</dd>
          </div>
        )}
      </dl>
      <div className="kit-foot">
        <span className="kit-price">
          <small>під ключ</small>
          {price(item)}
        </span>
        <AddToCart id={item.id} compact className="prod-add" label="У кошик" />
      </div>
    </article>
  );
}

export function Marquee({ items, reverse = false }: { items: readonly string[]; reverse?: boolean }) {
  const row = (hidden: boolean) => (
    <div className="marquee-row" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i}>
          {t}
          <i />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee${reverse ? " is-reverse" : ""}`}>
      {row(false)}
      {row(true)}
    </div>
  );
}

/** Closing request band: a field of panels that lights up under the cursor. */
export function ContactBand({
  title = "Порахуємо станцію під ваш об’єкт — безкоштовно",
  lead = "Залиште телефон. Фахівець уточнить споживання, фазність і ціль — економія чи зелений тариф — і підготує кошторис без прихованих доплат.",
  details,
  id = "zaiavka",
}: {
  title?: string;
  lead?: string;
  details?: string;
  id?: string;
}) {
  return (
    <section className="contact-band spot" id={id}>
      <div className="contact-cells" aria-hidden="true" />
      <div className="contact-sun" aria-hidden="true" />
      <div className="container contact-grid">
        <div data-reveal>
          <p className="eyebrow">Безкоштовна консультація</p>
          <h2 className="h2">{title}</h2>
          <p className="section-sub">{lead}</p>
          <div className="contact-phones">
            {site.phones.map((p) => (
              <a key={p.href} className="contact-phone" href={p.href}>
                <Icon name="phone" size={20} />
                {p.phone}
                <small>{p.label}</small>
              </a>
            ))}
          </div>
          <p className="contact-meta">
            <Icon name="clock" size={16} /> {site.hours} · <Icon name="pin" size={16} /> {site.address}
          </p>
          <a className="text-link contact-direct" href={site.direct} target="_blank" rel="noreferrer">
            <Icon name="instagram" size={18} /> Або напишіть у Direct
          </a>
        </div>
        <div className="contact-card" data-reveal>
          <LeadForm details={details} source={`band:${id}`} />
        </div>
      </div>
    </section>
  );
}

/** Ends pages with real objects instead of a dead end. */
export function MoreObjects({ title = "Наші об’єкти", exclude }: { title?: string; exclude?: string }) {
  const picks = objects.filter((o) => o.slug !== exclude).slice(0, 3);
  return (
    <section className="section section-tight">
      <div className="container">
        <div className="row-head" data-reveal>
          <h2 className="mini-title">{title}</h2>
          <Link href="/obiekty" className="text-link">
            Усі об’єкти <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="obj-grid">
          {picks.map((o, i) => (
            <ObjectCard key={o.slug} o={o} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
