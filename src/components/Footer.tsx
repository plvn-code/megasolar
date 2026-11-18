import Link from "next/link";
import { categories, kits } from "@/lib/catalog";
import { objects } from "@/lib/objects";
import { nav, site } from "@/lib/site";
import { Icon } from "./Icons";
import { Logo } from "./Logo";
import { MadeBy } from "./MadeBy";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" aria-label="MEGASOLAR — на головну">
              <Logo className="footer-logo" id="ft" />
            </Link>
            <p>Сонячні електростанції під ключ і обладнання для СЕС. {site.regionLong}. Понад 15 років досвіду.</p>
            <a className="footer-ig" href={site.instagram} target="_blank" rel="noreferrer">
              <Icon name="instagram" size={18} /> {site.instagramHandle}
            </a>
          </div>

          <div className="footer-col">
            <h3>Каталог</h3>
            <Link href="/stantsii">Готові станції · {kits.length}</Link>
            {categories.map((c) => (
              <Link key={c.id} href={`/katalog/${c.id}`}>
                {c.title}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h3>Компанія</h3>
            {nav
              .filter((l) => !["/stantsii", "/katalog"].includes(l.href))
              .map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            <Link href="/faq">Часті питання</Link>
            <Link href="/koshyk">Кошик-заявка</Link>
          </div>

          <div className="footer-col footer-contact">
            <h3>Контакти</h3>
            {site.phones.map((p) => (
              <a key={p.href} className="footer-phone" href={p.href}>
                {p.phone}
                <small>{p.label}</small>
              </a>
            ))}
            <a href={`mailto:${site.email}`}>
              <Icon name="mail" size={16} /> {site.email}
            </a>
            <a href={site.mapUrl} target="_blank" rel="noreferrer">
              <Icon name="pin" size={16} /> {site.address}
            </a>
            <p>
              <Icon name="clock" size={16} /> {site.hours}
            </p>
          </div>
        </div>

        <div className="footer-objects">
          <span className="mono">Об’єкти</span>
          {objects.slice(0, 6).map((o) => (
            <Link key={o.slug} href={`/obiekty/${o.slug}`}>
              {o.short}
            </Link>
          ))}
        </div>
      </div>

      <div className="footer-giant" aria-hidden="true">
        <span>
          MEGA<b>SOLAR</b>
        </span>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 MEGASOLAR</span>
        <span className="footer-copy">Ціни на сайті — ціни компанії на момент публікації. Наявність і фінальну вартість підтверджує менеджер. Онлайн-оплати немає.</span>
        <MadeBy />
      </div>
    </footer>
  );
}
