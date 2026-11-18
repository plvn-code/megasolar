import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocks, blocksOf } from "@/components/Blocks";
import { BuyBox } from "@/components/BuyBox";
import { Icon } from "@/components/Icons";
import { ContactBand, Crumbs, KitCard, KitVisual } from "@/components/Shared";
import { type Item, getItem, itemHref, items, kitTitle, kits, price } from "@/lib/catalog";

export function generateStaticParams() {
  return kits.map((k) => ({ id: k.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const k = getItem((await params).id);
  if (!k || k.cat !== "stantsii") return {};
  return { title: `${k.name} — ${price(k)}`, description: k.lead };
}

const equipment = items.filter((i) => i.cat !== "stantsii" && i.cat !== "posluhy");
const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");

/** Links a composition line («Deye SUN-12K-SG04LP3-EU (12 кВт…)») to the catalogue item with that model code. */
function match(model: string): Item | undefined {
  const codes = model.split(/[\s,()]+/).filter((t) => /\d/.test(t) && /[A-Za-z]/.test(t) && t.length >= 5).map(norm);
  if (!codes.length) return undefined;
  return equipment.find((i) => codes.some((c) => c.length >= 6 && norm(i.name).includes(c)));
}

export default async function KitPage({ params }: { params: Promise<{ id: string }> }) {
  const kit = getItem((await params).id);
  if (!kit || kit.cat !== "stantsii") notFound();
  const t = kitTitle(kit);
  const blocks = blocksOf(kit.id);
  const tables = blocks.filter((b) => b.table).map((b) => b.table!);
  const comp = tables[1];
  const facts = (tables[0] ?? []).filter((r) => r.length === 2 && !/характеристика/i.test(r[0]));
  const similar = kits.filter((k) => k.sub === kit.sub && k.id !== kit.id).sort((a, b) => Math.abs((a.value ?? 0) - (kit.value ?? 0)) - Math.abs((b.value ?? 0) - (kit.value ?? 0))).slice(0, 3);

  return (
    <>
      <section className="pdp kit-hero">
        <div className="container">
          <Crumbs
            items={[
              { label: "Станції", href: "/stantsii" },
              { label: `${t.type} ${t.power}`, href: `/stantsii/${kit.id}` },
            ]}
          />
          <div className="pdp-grid">
            <div className="kit-hero-visual fade-up">
              <span className={`kit-type kit-t-${kit.sub}`}>{t.type}</span>
              <p className="kit-hero-power">
                {kit.value}
                <small>кВт</small>
              </p>
              <KitVisual item={kit} />
              <span className="mono">«{t.tier}» · під ключ</span>
            </div>
            <div className="pdp-info fade-up" style={{ animationDelay: "100ms" }}>
              <p className="eyebrow">Готова станція «{t.tier}»</p>
              <h1 className="pdp-title">{kit.name}</h1>
              {kit.lead && <p className="pdp-lead">{kit.lead}</p>}
              {facts.length > 0 && (
                <dl className="spec-common pdp-specs">
                  {facts.slice(0, 7).map(([k, v]) => (
                    <div key={k}>
                      <dt>{k.replace(/,\s*(шт|кВт|м²|год|років)$/, "")}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <BuyBox item={kit} />
            </div>
          </div>
        </div>
      </section>

      {comp && (
        <section className="section section-tight">
          <div className="container">
            <div className="row-head" data-reveal>
              <div>
                <p className="eyebrow">Прозорий кошторис</p>
                <h2 className="mini-title">Що входить у станцію</h2>
              </div>
              <p className="kit-comp-note">Комплектуючі — в доларах, як у нашому кошторисі. Підсумкова ціна в гривнях: {price(kit)}.</p>
            </div>
            <div className="blocks-table-wrap" data-reveal>
              <table className="blocks-table kit-comp">
                <thead>
                  <tr>
                    {comp[0].map((c, k) => (
                      <th key={k}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comp.slice(1).map((r, k) => {
                    const linked = r.length > 2 ? match(r[1]) : undefined;
                    const total = r.length === 2;
                    return (
                      <tr key={k} className={total ? "is-total" : undefined}>
                        {total ? (
                          <>
                            <td colSpan={comp[0].length - 1}>{r[0]}</td>
                            <td>{r[1]}</td>
                          </>
                        ) : (
                          r.map((c, j) => (
                            <td key={j}>
                              {j === 1 && linked ? (
                                <Link href={itemHref(linked)} className="kit-comp-link">
                                  {c} <Icon name="arrowUpRight" size={14} />
                                </Link>
                              ) : (
                                c
                              )}
                            </td>
                          ))
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section className="section section-tight">
        <div className="container pdp-desc" data-reveal>
          <h2 className="mini-title">Про станцію</h2>
          <Blocks blocks={blocks.filter((b, i) => !(i === 0 && b.p))} skipTables={2} />
        </div>
      </section>

      {similar.length > 0 && (
        <section className="section section-tight">
          <div className="container">
            <div className="row-head" data-reveal>
              <h2 className="mini-title">Схожі станції</h2>
              <Link href={`/stantsii?type=${kit.sub}`} className="text-link">
                Усі {t.type.toLowerCase()} <Icon name="arrow" size={16} />
              </Link>
            </div>
            <div className="kit-grid kit-grid-3">
              {similar.map((k, i) => (
                <KitCard key={k.id} item={k} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactBand title="Порахуємо під ваш дах" lead="Готова станція — відправна точка. Уточнимо споживання, фазність і місце, підженемо конфігурацію й кошторис під ваш об’єкт." details={`Сторінка станції: ${kit.name} — ${price(kit)}`} />
    </>
  );
}
