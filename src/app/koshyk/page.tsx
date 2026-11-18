import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { PageHero } from "@/components/Shared";

export const metadata: Metadata = {
  title: "Кошик-заявка",
  description: "Обране обладнання та станції MEGASOLAR. Надішліть заявку — менеджер підтвердить наявність і ціну.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageHero eyebrow="Без онлайн-оплати" title="Кошик-заявка" crumbs={[{ label: "Кошик", href: "/koshyk" }]} />
      <section className="section section-top-0">
        <div className="container">
          <CartView />
        </div>
      </section>
    </>
  );
}
