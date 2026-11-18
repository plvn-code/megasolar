import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/Icons";
import { ContactBand, PageHero } from "@/components/Shared";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакти",
  description: `MEGASOLAR: ${site.address}. ${site.phones.map((p) => p.phone).join(", ")}, ${site.email}. ${site.hours}.`,
};

const week = [
  ["Понеділок", "09:00 – 18:00"],
  ["Вівторок", "09:00 – 18:00"],
  ["Середа", "09:00 – 18:00"],
  ["Четвер", "09:00 – 18:00"],
  ["П’ятниця", "09:00 – 18:00"],
  ["Субота", "Вихідний"],
  ["Неділя", "Вихідний"],
];

export default function ContactsPage() {
  return (
    <>
      <PageHero
        eyebrow="Полтава · працюємо в усіх прилеглих регіонах"
        title={
          <>
            Приїжджайте, телефонуйте, <span className="accent">пишіть</span>
          </>
        }
        lead="Консультація й розрахунок станції — безкоштовно. Відповідаємо в робочий час: Пн–Пт 09:00–18:00."
        crumbs={[{ label: "Контакти", href: "/kontakty" }]}
      />
      <section className="section section-top-0">
        <div className="container contact-cards">
          <article className="contact-info" data-reveal>
            <span className="mono">Телефони</span>
            <h2>Зателефонуйте</h2>
            {site.phones.map((p) => (
              <a key={p.href} href={p.href}>
                <Icon name="phone" size={18} /> {p.phone}
              </a>
            ))}
            <p className="muted">0 800 — безкоштовно з будь-якого номера України</p>
          </article>
          <article className="contact-info" data-reveal style={{ transitionDelay: "70ms" }}>
            <span className="mono">Онлайн</span>
            <h2>Напишіть</h2>
            <a href={`mailto:${site.email}`}>
              <Icon name="mail" size={18} /> {site.email}
            </a>
            <a href={site.direct} target="_blank" rel="noreferrer">
              <Icon name="instagram" size={18} /> Direct {site.instagramHandle}
            </a>
          </article>
          <article className="contact-info" data-reveal style={{ transitionDelay: "140ms" }}>
            <span className="mono">Графік роботи</span>
            <h2>Коли ми на зв’язку</h2>
            <dl className="hours">
              {week.map(([d, h]) => (
                <div key={d} className={h === "Вихідний" ? "is-off" : undefined}>
                  <dt>{d}</dt>
                  <dd>{h}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
        <div className="container">
          <a href={site.mapUrl} target="_blank" rel="noreferrer" className="office-card" data-reveal data-cursor="Відкрити мапу">
            <Image src="/images/about/office.webp" alt="Офіс MEGASOLAR у Полтаві" fill sizes="100vw" />
            <span className="office-text">
              <span className="mono">Офіс і склад</span>
              <strong>{site.address}</strong>
              <span className="text-link">
                <Icon name="pin" size={18} /> Прокласти маршрут <Icon name="arrowUpRight" size={16} />
              </span>
            </span>
          </a>
        </div>
      </section>
      <ContactBand title="Або залиште телефон" lead="Передзвонимо в робочий час, уточнимо об’єкт і підготуємо розрахунок станції." />
    </>
  );
}
