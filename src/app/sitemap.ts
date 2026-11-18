import type { MetadataRoute } from "next";
import { categories, items } from "@/lib/catalog";
import { objects } from "@/lib/objects";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/stantsii", "/katalog", "/obiekty", "/posluhy", "/kredyt", "/pro-nas", "/faq", "/kontakty"];
  return [
    ...pages,
    ...categories.map((c) => `/katalog/${c.id}`),
    ...items.filter((i) => i.cat === "stantsii").map((i) => `/stantsii/${i.id}`),
    ...items.filter((i) => i.cat !== "stantsii" && i.cat !== "posluhy").map((i) => `/tovar/${i.id}`),
    ...objects.map((o) => `/obiekty/${o.slug}`),
  ].map((p) => ({ url: site.url + p }));
}
