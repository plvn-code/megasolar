"use client";

import { useSyncExternalStore } from "react";
import { byId, type Item } from "./catalog";

/**
 * Request cart («Кошик-заявка»). Lives in localStorage only; nothing is paid online.
 * The manager confirms availability and the final price after the request is sent.
 */
export type Line = { id: string; qty: number };

const KEY = "ms-cart-v1";
const EVENT = "ms-cart";
const EMPTY: Line[] = [];
let cache: Line[] | null = null;

function read(): Line[] {
  if (cache) return cache;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    cache = Array.isArray(raw) ? raw.filter((l) => l && byId.has(l.id) && l.qty > 0).map((l) => ({ id: String(l.id), qty: Math.min(999, Math.floor(l.qty)) })) : [];
  } catch {
    cache = [];
  }
  return cache!;
}

function write(lines: Line[]) {
  cache = lines;
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export const cart = {
  add(id: string, qty = 1) {
    const lines = read();
    const found = lines.find((l) => l.id === id);
    write(found ? lines.map((l) => (l.id === id ? { ...l, qty: Math.min(999, l.qty + qty) } : l)) : [...lines, { id, qty }]);
    window.dispatchEvent(new CustomEvent("ms-toast", { detail: id }));
  },
  set(id: string, qty: number) {
    write(qty <= 0 ? read().filter((l) => l.id !== id) : read().map((l) => (l.id === id ? { ...l, qty: Math.min(999, qty) } : l)));
  },
  clear() {
    write([]);
  },
};

export function cartRows(lines: Line[]) {
  const rows = lines.map((l) => ({ ...l, item: byId.get(l.id) as Item })).filter((r) => r.item);
  const total = rows.reduce((s, r) => s + (r.item.price ?? 0) * r.qty, 0);
  const count = rows.reduce((s, r) => s + r.qty, 0);
  const unpriced = rows.some((r) => !r.item.price);
  return { rows, total, count, unpriced };
}
