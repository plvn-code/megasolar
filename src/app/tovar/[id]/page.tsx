import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocks, blocksOf, specPairs } from "@/components/Blocks";
import { BuyBox } from "@/components/BuyBox";
import { Icon } from "@/components/Icons";
import { ContactBand, Crumbs, ProductCard } from "@/components/Shared";
import { categoryById, getItem, itemImage, items, price, spec } from "@/lib/catalog";

const products = items.filter((i) => i.cat !== "stantsii" && i.cat !== "posluhy");

export function generateStaticParams() {
  return products.map((i) => ({ id: i.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const i = getItem((await params).id);
  if (!i) return {};
  return { title: `${i.name} — ${price(i)}`, description: i.lead || i.name, openGraph: { images: i.img ? [itemImage(i)] : [] } };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const item = getItem((await params).id);
  if (!item || item.cat === "stantsii" || item.cat === "posluhy") notFound();
  const cat = categoryById(item.cat)!;
  const blocks = blocksOf(item.id);
  const pairs = specPairs(blocks);
  const s = spec(item);
  const related = products
    .filter((i) => i.cat === item.cat && i.sub === item.sub && i.id !== item.id)
    .sort((a, b) => Math.abs((a.value ?? 0) - (item.value ?? 0)) - Math.abs((b.value ?? 0) - (item.value ?? 0)))
    .slice(0, 4);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    brand: item.brand ? { "@type": "Brand", name: item.brand } : undefined,
    image: item.img ? itemImage(item) : undefined,
    description: item.lead,
    offers: item.price ? { "@type": "Offer", price: item.price, priceCurrency: "UAH", availability: "https://schema.org/InStock" } : undefined,
  };

  return (
    <>
      <section className="pdp">
        <div className="container">
          <Crumbs
            items={[
              { label: "Каталог", href: "/katalog" },
              { label: cat.title, href: `/katalog/${cat.id}` },
              { label: item.brand ?? "Товар", href: `/tovar/${item.id}` },
            ]}
          />
          <div className="pdp-grid">
            <div className="pdp-media fade-up">
              <div className="pdp-plate">{item.img && <Image src={itemImage(item)} alt={item.name} fill priority sizes="(max-width: 1100px) 100vw, 46vw" />}</div>
              {s && <span className="prod-spec pdp-spec">{s}</span>}
            </div>
            <div className="pdp-info fade-up" style={{ animationDelay: "100ms" }}>
              <p className="eyebrow">
                {cat.subs[item.sub] ?? cat.title}
                {item.brand ? ` · ${item.brand}` : ""}
              </p>
              <h1 className="pdp-title">{item.name}</h1>
              {item.lead && <p className="pdp-lead">{item.lead}</p>}
              {pairs.length > 0 && (
                <dl className="spec-common pdp-specs">
                  {pairs.slice(0, 6).map((p) => (
                    <div key={p.k}>
                      <dt>{p.k}</dt>
                      <dd>{p.v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <BuyBox item={item} />
            </div>
          </div>
        </div>
      </section>

      {blocks.length > 1 && (
        <section className="section section-tight">
          <div className="container pdp-desc">
            <h2 className="mini-title" data-reveal>
              Опис і характеристики
            </h2>
            <div data-reveal>
              <Blocks blocks={blocks} />
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section section-tight">
          <div className="container">
            <div className="row-head" data-reveal>
              <h2 className="mini-title">Схожі моделі</h2>
              <Link href={`/katalog/${cat.id}?type=${item.sub}`} className="text-link">
                Усі {cat.subs[item.sub]?.toLowerCase() ?? cat.title.toLowerCase()} <Icon name="arrow" size={16} />
              </Link>
            </div>
            <div className="prod-grid">
              {related.map((r, k) => (
                <ProductCard key={r.id} item={r} index={k} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactBand title="Потрібен монтаж?" lead="Змонтуємо це обладнання під ключ або проведемо шеф-монтаж, якщо ставите самі. Гарантія зберігається." details={`Сторінка товару: ${item.name}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
