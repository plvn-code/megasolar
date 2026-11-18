import type { Metadata } from "next";
import { KitsBrowser } from "@/components/KitsBrowser";
import { Savings } from "@/components/Savings";
import { ContactBand, PageHero } from "@/components/Shared";
import { kits, minPrice, uah } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Готові сонячні станції під ключ — ціни",
  description: `Гібридні та мережеві сонячні електростанції від 6 до 300 кВт під ключ: обладнання, монтаж і запуск. Ціни від ${uah(minPrice(kits))}.`,
};

export default async function StationsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow={`${kits.length} готових станцій · від ${uah(minPrice(kits))}`}
        title={
          <>
            Станції під ключ <span className="accent">з відкритими цінами</span>
          </>
        }
        lead="Кожна конфігурація — з повною комплектацією: які панелі, інвертор, акумулятори, кріплення й скільки коштує монтаж. Без «дзвоніть — дізнаєтесь»."
        crumbs={[{ label: "Станції", href: "/stantsii" }]}
      />
      <section className="section section-top-0">
        <div className="container">
          <KitsBrowser initial={type} />
        </div>
      </section>
      <section className="section calc-section" id="pidbir">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Не знаєте, яка потужність?</p>
            <h2 className="h2 h2-md">Підберемо станцію за вашим споживанням</h2>
          </div>
          <Savings />
        </div>
      </section>
      <ContactBand title="Потрібна інша конфігурація?" lead="Готові станції — це відправна точка. Під ваш дах, фазність і бюджет зберемо свою — і порахуємо безкоштовно." />
    </>
  );
}
