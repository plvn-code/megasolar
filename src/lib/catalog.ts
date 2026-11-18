import data from "./catalog.json";

/**
 * Catalogue of megasolar.com.ua (149 items, scraped 2026-11-18 by scripts/build_catalog.py).
 * Prices are the client's own, in UAH. Descriptions live in catalog-details.json (server only).
 */
export type KitPart = { kind: string; model: string; qty: string };
export type Kit = {
  phases: string | null;
  panels: string | null;
  area: string | null;
  battery: string | null;
  autonomy: string | null;
  warranty: string | null;
  parts: KitPart[];
  usd: string | null;
};
export type CatId = "stantsii" | "paneli" | "invertory" | "akumuliatory" | "kriplennia" | "elektrofurnitura" | "posluhy";
export type Item = {
  id: string;
  src: string;
  cat: CatId;
  sub: string;
  name: string;
  brand: string | null;
  price: number | null;
  value: number | null;
  unit: string | null;
  lead: string;
  img: boolean;
  kit?: Kit | null;
};

export const items = data as Item[];
export const byId = new Map(items.map((i) => [i.id, i]));
export const getItem = (id: string) => byId.get(id);

export type Category = {
  id: Exclude<CatId, "stantsii" | "posluhy">;
  title: string;
  short: string;
  lead: string;
  subs: Record<string, string>;
  filterLabel: string;
};

export const categories: Category[] = [
  {
    id: "paneli",
    title: "Сонячні панелі",
    short: "Панелі",
    lead: "Монокристалічні модулі Tier 1 від 410 до 645 Вт: одно- та двосторонні (bifacial), N-type, Full Black.",
    subs: { panel: "Панелі" },
    filterLabel: "Потужність",
  },
  {
    id: "invertory",
    title: "Інвертори",
    short: "Інвертори",
    lead: "Серце станції: гібридні Deye, мережеві Huawei, Solis і Deye, автономні — плюс моніторинг і облік.",
    subs: { hybrid: "Гібридні", grid: "Мережеві", autonomous: "Автономні", monitoring: "Моніторинг і облік" },
    filterLabel: "Потужність",
  },
  {
    id: "akumuliatory",
    title: "Акумулятори",
    short: "Акумулятори",
    lead: "LiFePO₄ від Deye, Dyness і Pylontech на 6000 циклів, BMS-контролери та стійки для високовольтних систем.",
    subs: { battery: "Акумулятори", bms: "BMS-контролери", rack: "Стійки", ups: "ДБЖ для роутера" },
    filterLabel: "Ємність",
  },
  {
    id: "kriplennia",
    title: "Системи кріплення",
    short: "Кріплення",
    lead: "Оцинковані профільні та безпрофільні системи, баласт для пласких дахів і наземні конструкції.",
    subs: { mount: "Кріплення" },
    filterLabel: "",
  },
  {
    id: "elektrofurnitura",
    title: "Електрофурнітура",
    short: "Електрика",
    lead: "Сонячний кабель H1Z2Z2-K, конектори MC4, автомати Schneider, ОПН, запобіжники та щити.",
    subs: { cable: "Кабель", connector: "Конектори", protection: "Захист і автоматика", box: "Електрощити" },
    filterLabel: "",
  },
];

export const categoryById = (id: string) => categories.find((c) => c.id === id);
export const inCategory = (id: CatId) => items.filter((i) => i.cat === id);

export const kitType: Record<string, string> = { hybrid: "Гібридна", grid: "Мережева" };
export const kits = items.filter((i) => i.cat === "stantsii");

export const uah = (n: number) => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} грн`;
export const price = (i: Item) => (i.price ? uah(i.price) : "Ціна за запитом");
export const spec = (i: Item) => (i.value ? `${String(i.value).replace(".", ",")} ${i.unit}` : null);
export const itemHref = (i: Item) => (i.cat === "stantsii" ? `/stantsii/${i.id}` : i.cat === "posluhy" ? `/posluhy#${i.id}` : `/tovar/${i.id}`);
export const itemImage = (i: Item) => `/images/products/${i.id}.webp`;

/** Short station name: «Оптимальна +» 12 кВт */
export function kitTitle(i: Item) {
  const tier = i.name.match(/«([^»]+)»/)?.[1]?.replace(/\s*\+/, "+") ?? "";
  return { tier, power: `${i.value} кВт`, type: kitType[i.sub] };
}

export const minPrice = (list: Item[]) => Math.min(...list.map((i) => i.price ?? Infinity));
