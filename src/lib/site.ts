/** Contacts and navigation. Every fact here comes from megasolar.com.ua or @megasolar_ua. */
export const site = {
  name: "MEGASOLAR",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://megasolar.vercel.app",
  description:
    "Сонячні електростанції під ключ і обладнання для СЕС у Полтаві: панелі, інвертори, акумулятори, кріплення. Проєктування, власна доставка, монтаж за 1–3 дні, кредит 0%.",
  region: "Полтава та Полтавська область",
  regionLong: "Базуємось у Полтаві, працюємо в усіх прилеглих регіонах",
  phone: "096 021 69 60",
  phoneHref: "tel:+380960216960",
  phones: [
    { label: "Мобільний", phone: "096 021 69 60", href: "tel:+380960216960" },
    { label: "Безкоштовно по Україні", phone: "0 800 216 960", href: "tel:0800216960" },
  ],
  email: "i@megasolar.com.ua",
  address: "м. Полтава, вул. Автобазівська, 2/9, корпус 16",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=%D0%9F%D0%BE%D0%BB%D1%82%D0%B0%D0%B2%D0%B0%2C+%D0%90%D0%B2%D1%82%D0%BE%D0%B1%D0%B0%D0%B7%D1%96%D0%B2%D1%81%D1%8C%D0%BA%D0%B0+2%2F9",
  hours: "Пн–Пт 09:00–18:00",
  hoursNote: "Сб, Нд — вихідні",
  instagram: "https://www.instagram.com/megasolar_ua/",
  instagramHandle: "@megasolar_ua",
  direct: "https://ig.me/m/megasolar_ua",
} as const;

export const nav = [
  { label: "Станції", href: "/stantsii" },
  { label: "Каталог", href: "/katalog" },
  { label: "Об’єкти", href: "/obiekty" },
  { label: "Послуги", href: "/posluhy" },
  { label: "Кредит 0%", href: "/kredyt" },
  { label: "Про нас", href: "/pro-nas" },
  { label: "Контакти", href: "/kontakty" },
] as const;

export const facts = [
  { value: 15, suffix: "+ років", label: "досвіду в сонячній енергетиці", href: "/pro-nas" },
  { value: 3, prefix: "1–", suffix: " дні", label: "триває монтаж станції в середньому", href: "/posluhy#montazh" },
  { value: 25, prefix: "до ", suffix: " років", label: "гарантії на обладнання від моменту монтажу", href: "/faq" },
  { value: 0, suffix: "%", label: "кредит на СЕС у 4 банках-партнерах", href: "/kredyt", text: "0" },
] as const;

export const brands = ["LONGi", "JA Solar", "Tongwei", "DAH Solar", "Trina Solar", "Jinko Solar", "Deye", "Huawei", "Solis", "Dyness", "Pylontech", "Risen Energy"] as const;
