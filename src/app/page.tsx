import Link from "next/link";
import { Icon } from "@/components/Icons";
import { Savings } from "@/components/Savings";
import { Anatomy, type LayerStat } from "@/components/home/Anatomy";
import { Hero } from "@/components/home/Hero";
import { Kits } from "@/components/home/Kits";
import { Manifest } from "@/components/home/Manifest";
import { ObjectsStack } from "@/components/home/ObjectsStack";
import { CreditBand, Faq, Guarantees, Process, Review, Tips, Why } from "@/components/home/Sections";
import { ContactBand, Marquee } from "@/components/Shared";
import { type CatId, inCategory, minPrice, uah } from "@/lib/catalog";
import { layers } from "@/lib/copy";
import { brands } from "@/lib/site";

function stats(): LayerStat[] {
  return layers.map((l) => {
    const list = inCategory(l.id as CatId);
    const top = Object.entries(
      list.reduce<Record<string, number>>((a, i) => {
        if (i.brand) a[i.brand] = (a[i.brand] ?? 0) + 1;
        return a;
      }, {}),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([b]) => b);
    return { id: l.id, count: list.length, from: uah(minPrice(list)), brands: top.join(" · ") };
  });
}

export default function Home() {
  return (
    <>
      <Hero />
      <Manifest />
      <Anatomy stats={stats()} />
      <Kits />
      <ObjectsStack />
      <Marquee items={brands} />
      <section className="section calc-section" id="kalkuliator">
        <div className="container">
          <div className="row-head section-head-row" data-reveal>
            <div>
              <p className="eyebrow">Підбір станції</p>
              <h2 className="h2">
                Скільки сонця <span className="accent">вам потрібно?</span>
              </h2>
            </div>
            <Link href="/stantsii" className="text-link">
              Усі готові станції <Icon name="arrow" size={16} />
            </Link>
          </div>
          <Savings />
        </div>
      </section>
      <Process />
      <Why />
      <Review />
      <Guarantees />
      <CreditBand />
      <Tips />
      <Faq />
      <ContactBand />
    </>
  );
}
