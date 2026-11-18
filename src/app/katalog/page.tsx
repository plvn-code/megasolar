import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icons";
import { ContactBand, KitVisual, PageHero } from "@/components/Shared";
import { categories, inCategory, itemImage, items, kits, minPrice, uah } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Каталог обладнання для СЕС",
  description: "Сонячні панелі LONGi, JA Solar, Tongwei, DAH Solar, інвертори Deye, Huawei, Solis, акумулятори Deye, Dyness, Pylontech, кріплення та електрофурнітура з цінами. Власна доставка.",
};

/** Category overview: five equipment sections + ready-made stations. */
export default function CatalogPage() {
  const total = items.filter((i) => i.cat !== "posluhy").length;
  const showcase = kits.find((k) => k.value === 12) ?? kits[0];
  return (
    <>
      <PageHero
        eyebrow={`Каталог · ${total} позицій з цінами`}
        title={
          <>
            Усе для сонячної станції <span className="accent">в одному місці</span>
          </>
        }
        lead="Панелі Tier 1, інвертори, акумулятори, кріплення й електрофурнітура — те саме обладнання, яке ми монтуємо на своїх об’єктах. Додайте в кошик-заявку: менеджер підтвердить наявність і ціну."
        crumbs={[{ label: "Каталог", href: "/katalog" }]}
      />
      <section className="section section-top-0">
        <div className="container">
          <div className="cat-grid">
            <Link href="/stantsii" className="cat-card cat-card-kits spot card-in" data-cursor="Готові станції">
              <span className="mono">Під ключ · {kits.length} конфігурацій</span>
              <h2>Готові станції</h2>
              <p>Гібридні та мережеві від 6 до 300 кВт: обладнання, монтаж і запуск в одній ціні.</p>
              <KitVisual item={showcase} />
              <span className="cat-card-foot">
                від {uah(minPrice(kits))}
                <span className="round-link">
                  <Icon name="arrowUpRight" size={20} />
                </span>
              </span>
            </Link>
            {categories.map((c, i) => {
              const list = inCategory(c.id);
              const pics = list.filter((x) => x.img).slice(0, 3);
              return (
                <Link key={c.id} href={`/katalog/${c.id}`} className="cat-card spot card-in" data-cursor="Відкрити розділ" style={{ animationDelay: `${(i + 1) * 60}ms` }}>
                  <span className="mono">{list.length} позицій</span>
                  <h2>{c.title}</h2>
                  <p>{c.lead}</p>
                  <span className="cat-pics" aria-hidden="true">
                    {pics.map((p) => (
                      <span key={p.id}>
                        <Image src={itemImage(p)} alt="" fill sizes="120px" />
                      </span>
                    ))}
                  </span>
                  <span className="cat-card-foot">
                    від {uah(minPrice(list))}
                    <span className="round-link">
                      <Icon name="arrowUpRight" size={20} />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
          <ul className="cat-perks" data-reveal>
            <li>
              <Icon name="truck" size={22} />
              <span>
                <b>Власна доставка</b>
                Обладнання приїде неушкодженим
              </span>
            </li>
            <li>
              <Icon name="shield" size={22} />
              <span>
                <b>Гарантія якості</b>
                Сертифіковане обладнання
              </span>
            </li>
            <li>
              <Icon name="bank" size={22} />
              <span>
                <b>Для юросіб — з ПДВ</b>
                Рахунок, акт, договір, накладна
              </span>
            </li>
            <li>
              <Icon name="phone" size={22} />
              <span>
                <b>Підтримка</b>
                Пн–Пт 09:00–18:00
              </span>
            </li>
          </ul>
        </div>
      </section>
      <ContactBand title="Не знаєте, що обрати?" lead="Підберемо сумісний комплект під ваш об’єкт і бюджет — безкоштовно. Або змонтуємо все під ключ." />
    </>
  );
}
