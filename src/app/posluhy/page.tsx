import type { Metadata } from "next";
import Image from "next/image";
import { AddToCart } from "@/components/CartToast";
import { Icon } from "@/components/Icons";
import { LeadButton } from "@/components/LeadModal";
import { Process } from "@/components/home/Sections";
import { ContactBand, PageHero } from "@/components/Shared";
import { services } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Послуги: проєктування, монтаж, шеф-монтаж, сервіс",
  description: "Монтаж сонячних станцій під ключ від 450 $ за 5 кВт, шеф-монтаж від 350 $, проєктування від 12 000 грн, сервіс і відеонагляд. Полтава та область.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Повний цикл в одних руках"
        title={
          <>
            Від проєкту <span className="accent">до першого кіловата</span>
          </>
        }
        lead="Беремо на себе все: аналіз споживання, проєкт і 3D-візуалізацію, обладнання й доставку, монтаж, запуск, документи для зеленого тарифу та сервіс. Або ведемо вас, якщо монтуєте самі."
        crumbs={[{ label: "Послуги", href: "/posluhy" }]}
      >
        <LeadButton className="btn btn-primary btn-lg">
          Безкоштовна консультація <Icon name="arrow" size={18} />
        </LeadButton>
      </PageHero>

      <section className="section section-top-0">
        <div className="container svc-list">
          {services.map((s, i) => (
            <article key={s.id} id={s.id} className={`svc${i % 2 ? " is-flip" : ""}`} data-reveal>
              <div className="svc-media">
                <Image src={s.image} alt={s.title} fill sizes="(max-width: 1100px) 100vw, 46vw" />
                <span className="svc-num mono">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="svc-body">
                <h2>{s.title}</h2>
                <p>{s.lead}</p>
                <ul className="check-list">
                  {s.points.map((p) => (
                    <li key={p}>
                      <Icon name="check" size={18} />
                      {p}
                    </li>
                  ))}
                </ul>
                {"table" in s ? (
                  <div className="blocks-table-wrap">
                    <table className="blocks-table svc-table">
                      <thead>
                        <tr>
                          {s.tableHead.map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {s.table.map((r) => (
                          <tr key={r[0]}>
                            {r.map((c) => (
                              <td key={c}>{c}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="svc-price">
                    <small>Вартість</small>
                    {s.price}
                  </p>
                )}
                <div className="svc-actions">
                  <LeadButton title={s.title} details={`Послуга: ${s.title}`} className="btn btn-primary">
                    Замовити <Icon name="arrow" size={16} />
                  </LeadButton>
                  {"productId" in s && <AddToCart id={s.productId} className="btn btn-outline" label="Додати до заявки" />}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Process />
      <ContactBand />
    </>
  );
}
