import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { Icon } from "@/components/Icons";
import { ContactBand, PageHero } from "@/components/Shared";
import { categories, categoryById, inCategory, minPrice, uah } from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ cat: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ cat: string }> }): Promise<Metadata> {
  const c = categoryById((await params).cat);
  if (!c) return {};
  return { title: `${c.title} — ціни`, description: `${c.title} з цінами від ${uah(minPrice(inCategory(c.id)))}. ${c.lead}` };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ cat: string }>; searchParams: Promise<{ type?: string }> }) {
  const c = categoryById((await params).cat);
  if (!c) notFound();
  const { type } = await searchParams;
  const list = inCategory(c.id);
  return (
    <>
      <PageHero
        eyebrow={`${list.length} позицій · від ${uah(minPrice(list))}`}
        title={c.title}
        lead={c.lead}
        crumbs={[
          { label: "Каталог", href: "/katalog" },
          { label: c.title, href: `/katalog/${c.id}` },
        ]}
      />
      <section className="section section-top-0">
        <div className="container">
          <nav className="cat-switch" aria-label="Розділи каталогу">
            <Link href="/stantsii">Готові станції</Link>
            {categories.map((x) => (
              <Link key={x.id} href={`/katalog/${x.id}`} className={x.id === c.id ? "is-on" : undefined} aria-current={x.id === c.id ? "page" : undefined}>
                {x.short}
              </Link>
            ))}
          </nav>
          <CatalogBrowser cat={c} initialSub={type} />
          <p className="catalog-note">
            <Icon name="check" size={16} /> Для юросіб — розрахунок з ПДВ і повний пакет документів. Наявність і фінальну ціну підтверджуємо після заявки — онлайн нічого платити не потрібно.
          </p>
        </div>
      </section>
      <ContactBand title="Підберемо сумісний комплект" lead="Скажіть, що вже маєте або що плануєте, — порадимо сумісне обладнання й розрахуємо доставку та монтаж." />
    </>
  );
}
