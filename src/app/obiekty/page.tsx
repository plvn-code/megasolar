import type { Metadata } from "next";
import { ObjectsFilter } from "@/components/ObjectsFilter";
import { ContactBand, PageHero } from "@/components/Shared";
import { objects } from "@/lib/objects";

export const metadata: Metadata = {
  title: "Наші об’єкти",
  description: "Реалізовані сонячні станції MEGASOLAR у Полтаві та області: від 5 кВт для дому до наземних 200 кВт для бізнесу — з обладнанням і фото.",
};

export default async function ObjectsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow={`Портфоліо · ${objects.length} об’єктів`}
        title={
          <>
            Від дачі до <span className="accent">200 кВт у полі</span>
          </>
        }
        lead="Показуємо, що стоїть на даху й у технічному приміщенні: скільки панелей, які інвертори й акумулятори, як змонтовано. Більше — щотижня в нашому Instagram."
        crumbs={[{ label: "Об’єкти", href: "/obiekty" }]}
      />
      <section className="section section-top-0">
        <div className="container">
          <ObjectsFilter initial={type} />
        </div>
      </section>
      <ContactBand title="Хочете так само?" lead="Залиште телефон — розрахуємо станцію під ваш об’єкт безкоштовно." />
    </>
  );
}
