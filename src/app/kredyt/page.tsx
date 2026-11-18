import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icons";
import { LeadButton } from "@/components/LeadModal";
import { ContactBand, PageHero } from "@/components/Shared";
import { getItem, price } from "@/lib/catalog";
import { banks, creditSteps } from "@/lib/copy";

export const metadata: Metadata = {
  title: "СЕС у кредит під 0%",
  description: "Сонячна станція в кредит: 0% в Ощадбанку, ПриватБанку, Укргазбанку та UKRSIBBANK до 480–500 тис. грн, для бізнесу — програма «5-7-9». Готуємо документи для банку.",
};

export default function CreditPage() {
  const example = getItem("gibrydna-sonyachna-elektrostancziya-optymalna-na-12-kvt");
  return (
    <>
      <PageHero
        eyebrow="Кредит на сонячну станцію"
        title={
          <>
            Станція зараз, <span className="accent">0% переплати</span>
          </>
        }
        lead="Для власників будинків — безвідсоткові кредити в чотирьох банках: фіксований щомісячний платіж і жодних великих стартових витрат. Для бізнесу — пільгова програма «5-7-9»."
        crumbs={[{ label: "Кредит 0%", href: "/kredyt" }]}
      >
        <LeadButton title="Підібрати кредит на станцію" details="Цікавить СЕС у кредит" className="btn btn-primary btn-lg">
          Підібрати банк <Icon name="arrow" size={18} />
        </LeadButton>
      </PageHero>

      <section className="section section-top-0">
        <div className="container">
          <div className="bank-grid">
            {banks.map((b, i) => (
              <article key={b.bank} className="bank-card spot" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <span className="mono">Банк-партнер</span>
                <h2>{b.bank}</h2>
                <p className="bank-rate">
                  {b.rate}
                  <small>річних</small>
                </p>
                <dl className="spec-common">
                  <div>
                    <dt>Термін</dt>
                    <dd>{b.term}</dd>
                  </div>
                  <div>
                    <dt>Аванс</dt>
                    <dd>{b.advance}</dd>
                  </div>
                  <div>
                    <dt>Комісія</dt>
                    <dd>{b.fee}</dd>
                  </div>
                  <div>
                    <dt>Максимум</dt>
                    <dd>{b.max}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
          <p className="catalog-note">
            <Icon name="check" size={16} /> Погашення в усіх банках — ануїтетом (рівними платежами). Умови — за даними банків на момент публікації; актуальні уточнимо під вашу суму.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container credit-how">
          <div data-reveal>
            <p className="eyebrow">Як це працює</p>
            <h2 className="h2 h2-md">Чотири кроки до станції в кредит</h2>
            <ol className="credit-steps">
              {creditSteps.map((s, i) => (
                <li key={s.title}>
                  <span className="process-num">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="biz-band">
              <span className="mono">Для бізнесу</span>
              <p>
                Програма <b>«5-7-9»</b> — пільгове кредитування під 5%, 7% або 9% залежно від типу бізнесу. Довгий термін дає змогу поступово покривати витрати й економити з першого дня роботи
                станції.
              </p>
            </div>
          </div>
          {example && (
            <Link href={`/stantsii/${example.id}`} className="credit-case" data-reveal data-cursor="Склад станції">
              <Image src="/images/objects/hibryd-85-kvt/01.webp" alt="Гібридна станція MEGASOLAR на даху приватного будинку" fill sizes="(max-width: 1100px) 100vw, 40vw" />
              <span className="credit-case-text">
                <span className="mono">Наприклад</span>
                <strong>Гібридна «Оптимальна+» 12 кВт</strong>
                <span>{price(example)} під ключ — вкладається в ліміт Ощадбанку й ПриватБанку (480 000 грн)</span>
              </span>
            </Link>
          )}
        </div>
      </section>

      <ContactBand title="Порахуємо станцію для кредиту" lead="Підготуємо кошторис і пакет документів по станції — саме їх просить банк." details="Сторінка «Кредит 0%»" />
    </>
  );
}
