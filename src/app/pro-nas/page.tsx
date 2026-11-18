import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icons";
import { Guarantees, Why } from "@/components/home/Sections";
import { ContactBand, Marquee, MoreObjects, PageHero } from "@/components/Shared";
import { brands, facts, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Про компанію",
  description: "MEGASOLAR — 15+ років у сонячній енергетиці. Базуємось у Полтаві, працюємо в усіх прилеглих регіонах: станції під ключ, обладнання, сервіс.",
};

const offer = ["Надійний, акуратний монтаж", "Гарантія на обладнання та виконані роботи", "Підбір альтернативної конфігурації та проєктування", "Обслуговування та технічна підтримка"];
const gets = [
  { t: "Енергонезалежність", d: "від нестабільного електропостачання та зростання цін" },
  { t: "Безперебійність", d: "стабільна робота всіх приладів" },
  { t: "Сталість", d: "електроенергія за будь-яких умов і пори року" },
  { t: "Рахунки до «0»", d: "зниження витрат на електроенергію" },
  { t: "Вартість нерухомості", d: "станція підвищує ціну вашого об’єкта" },
  { t: "Сучасний імідж", d: "технологічність, якій довіряють" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Про MEGASOLAR"
        title={
          <>
            Інновації для вашого <span className="accent">екологічного й фінансового</span> майбутнього
          </>
        }
        lead="Довговічні технології, вигідні рішення й турбота про майбутнє — це те, що робить нас лідерами ринку."
        crumbs={[{ label: "Про нас", href: "/pro-nas" }]}
      />

      <section className="section section-top-0">
        <div className="container about-split">
          <div className="model-copy" data-reveal>
            <p>Ми базуємось у Полтаві, але швидко й якісно виконуємо роботи в усіх прилеглих регіонах. За результатами стоять досвід і команда кваліфікованих спеціалістів, якими ми по-справжньому пишаємось.</p>
            <p>
              Ми впевнені: якісна сонячна енергія має бути доступною для кожного. Тому поєднуємо швидке виконання, професійну якість і приємні ціни — для приватних домогосподарств, бізнесу та
              громад.
            </p>
            <p>З нами ви отримуєте не просто сонячну станцію, а довгострокову економію, стабільність і впевненість у кожному кіловаті.</p>
            <ul className="check-list">
              {offer.map((o) => (
                <li key={o}>
                  <Icon name="check" size={18} />
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <figure className="about-photo" data-reveal>
            <Image src="/images/about/office.webp" alt="Офіс MEGASOLAR у Полтаві: панелі на фасаді будівлі" fill sizes="(max-width: 1100px) 100vw, 44vw" />
            <figcaption>{site.address}</figcaption>
          </figure>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <ul className="facts facts-open">
            {facts.map((f, i) => (
              <li key={f.label} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <strong>
                  {"prefix" in f && <small>{f.prefix}</small>}
                  <span data-count={f.value}>{f.value}</span>
                  <small>{f.suffix}</small>
                </strong>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
          <h2 className="mini-title" data-reveal>
            Що отримує клієнт
          </h2>
          <div className="pillars">
            {gets.map((g, i) => (
              <article key={g.t} className="pillar" data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
                <h2>{g.t}</h2>
                <p>{g.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Why />
      <Marquee items={brands} reverse />
      <Guarantees />
      <section className="section section-tight">
        <div className="container about-split about-split-rev">
          <figure className="about-photo about-photo-wide" data-reveal>
            <Image src="/images/about/crew.webp" alt="Бригада MEGASOLAR монтує панелі на даху підприємства" fill sizes="(max-width: 1100px) 100vw, 50vw" />
            <figcaption>Наш об’єкт на 250 кВт · кадр з дрона</figcaption>
          </figure>
          <div data-reveal>
            <p className="eyebrow">Команда</p>
            <h2 className="h2 h2-md">Сертифіковані інженери, а не підрядники на годину</h2>
            <p className="section-sub">Монтажники працюють як єдиний механізм: 100% герметичність покрівлі, надійні кріплення, жодної самодіяльності в автоматиці. Станцію передаємо протестованою.</p>
            <div className="faq-actions">
              <Link href="/obiekty" className="btn btn-primary">
                Наші об’єкти <Icon name="arrow" size={16} />
              </Link>
              <a className="text-link" href={site.instagram} target="_blank" rel="noreferrer">
                <Icon name="instagram" size={16} /> {site.instagramHandle}
              </a>
            </div>
          </div>
        </div>
      </section>
      <MoreObjects />
      <ContactBand />
    </>
  );
}
