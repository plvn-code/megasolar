import type { Metadata } from "next";
import { Faq, Tips } from "@/components/home/Sections";
import { ContactBand, PageHero } from "@/components/Shared";
import { faq } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Часті питання про сонячні станції",
  description: "Скільки триває монтаж, яку потужність обрати, яку площу займають панелі, скільки коштує СЕС, як працює в похмуру погоду — відповіді MEGASOLAR.",
};

export default function FaqPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <PageHero eyebrow={`${faq.length} відповідей`} title="Часті питання" lead="Що питають найчастіше перед встановленням сонячної станції — і що відповідають наші інженери." crumbs={[{ label: "FAQ", href: "/faq" }]} />
      <div className="section-pull">
        <Faq limit={faq.length} title="Перед встановленням СЕС" />
      </div>
      <Tips />
      <ContactBand title="Не знайшли відповідь?" lead="Запитайте фахівця — консультація безкоштовна й ні до чого не зобов’язує." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
