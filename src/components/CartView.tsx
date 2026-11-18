"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cart, cartRows, useCart } from "@/lib/cart";
import { itemHref, itemImage, price, uah } from "@/lib/catalog";
import { Icon } from "./Icons";
import { LeadForm } from "./LeadForm";
import { KitVisual } from "./Shared";

export function CartView() {
  const lines = useCart();
  const { rows, total, count, unpriced } = cartRows(lines);
  const [ready, setReady] = useState(false);
  const [sent, setSent] = useState(false);
  useEffect(() => setReady(true), []);

  const details = [
    "Склад заявки:",
    ...rows.map((r) => `• ${r.item.name} × ${r.qty} — ${r.item.price ? uah(r.item.price * r.qty) : "ціна за запитом"}`),
    `Разом: ${uah(total)}${unpriced ? " + позиції за запитом" : ""} (${count} шт.)`,
  ].join("\n");

  if (!ready) return <div className="cart-skeleton" aria-hidden="true" />;

  if (sent)
    return (
      <div className="cart-empty">
        <span className="lead-done-icon">
          <Icon name="check" size={30} />
        </span>
        <h2>Заявку отримали</h2>
        <p>Менеджер перевірить наявність, підтвердить ціну й домовиться про доставку чи монтаж. Онлайн нічого платити не потрібно.</p>
        <Link href="/katalog" className="btn btn-outline">
          Повернутися в каталог
        </Link>
      </div>
    );

  if (!rows.length)
    return (
      <div className="cart-empty">
        <Icon name="cart" size={44} />
        <h2>Кошик-заявка порожній</h2>
        <p>Додайте готову станцію або обладнання з каталогу — і надішліть заявку. Менеджер підтвердить наявність і ціну.</p>
        <div className="page-hero-actions">
          <Link href="/stantsii" className="btn btn-primary">
            Готові станції <Icon name="arrow" size={16} />
          </Link>
          <Link href="/katalog" className="btn btn-outline">
            Каталог обладнання
          </Link>
        </div>
      </div>
    );

  return (
    <div className="cart-grid">
      <div>
        <ul className="cart-list">
          {rows.map(({ item, qty }) => (
            <li key={item.id} className="cart-row">
              <Link href={itemHref(item)} className="cart-thumb" aria-label={item.name}>
                {item.cat === "stantsii" ? <KitVisual item={item} /> : item.img && <Image src={itemImage(item)} alt="" fill sizes="96px" />}
              </Link>
              <div className="cart-info">
                {item.brand && <span className="mono">{item.brand}</span>}
                <Link href={itemHref(item)}>{item.name}</Link>
                <span className="cart-unit">{price(item)} / шт.</span>
              </div>
              <div className="qty" aria-label={`Кількість: ${item.name}`}>
                <button type="button" onClick={() => cart.set(item.id, qty - 1)} aria-label="Менше">
                  <Icon name="minus" size={16} />
                </button>
                <input
                  value={qty}
                  inputMode="numeric"
                  onChange={(e) => cart.set(item.id, Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1))}
                  aria-label="Кількість, шт."
                />
                <button type="button" onClick={() => cart.set(item.id, qty + 1)} aria-label="Більше">
                  <Icon name="plus" size={16} />
                </button>
              </div>
              <strong className="cart-sum">{item.price ? uah(item.price * qty) : "—"}</strong>
              <button type="button" className="cart-remove" onClick={() => cart.set(item.id, 0)} aria-label={`Видалити: ${item.name}`}>
                <Icon name="trash" size={18} />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="text-link cart-clear" onClick={() => cart.clear()}>
          Очистити кошик
        </button>
      </div>
      <aside className="cart-side">
        <div className="cart-total">
          <span>
            {count} шт. · разом{unpriced ? " (без позицій за запитом)" : ""}
          </span>
          <strong>{uah(total)}</strong>
        </div>
        <p className="cart-how">Це не оплата. Ми підтвердимо наявність і фінальну ціну, запропонуємо доставку або монтаж — і лише тоді виставимо рахунок.</p>
        <LeadForm details={details} source="cart" button="Надіслати заявку" defaultObject="Лише обладнання" onDone={() => {
            cart.clear();
            setSent(true);
          }} />
      </aside>
    </div>
  );
}
