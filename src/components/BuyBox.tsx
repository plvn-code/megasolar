"use client";

import Link from "next/link";
import { useState } from "react";
import { cart, useCart } from "@/lib/cart";
import { type Item, price } from "@/lib/catalog";
import { site } from "@/lib/site";
import { Icon } from "./Icons";
import { LeadButton } from "./LeadModal";

/** Price, quantity and the two ways to buy: request cart or a quick call-back. */
export function BuyBox({ item }: { item: Item }) {
  const [qty, setQty] = useState(1);
  const inCart = useCart().find((l) => l.id === item.id)?.qty ?? 0;
  const kit = item.cat === "stantsii";
  return (
    <div className="buy">
      <div className="buy-price">
        <small>{kit ? "Під ключ, з монтажем" : item.price ? "Ціна за 1 шт." : "Вартість"}</small>
        <strong>{price(item)}</strong>
      </div>
      <div className="buy-row">
        {!kit && (
          <div className="qty" aria-label="Кількість">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Менше">
              <Icon name="minus" size={18} />
            </button>
            <input value={qty} inputMode="numeric" onChange={(e) => setQty(Math.max(1, Math.min(999, Number(e.target.value.replace(/\D/g, "")) || 1)))} aria-label="Кількість, шт." />
            <button type="button" onClick={() => setQty((q) => Math.min(999, q + 1))} aria-label="Більше">
              <Icon name="plus" size={18} />
            </button>
          </div>
        )}
        <button type="button" className="btn btn-primary btn-lg buy-add" onClick={() => cart.add(item.id, qty)}>
          <Icon name="cartAdd" size={20} /> {kit ? "Додати в заявку" : "У кошик"}
        </button>
      </div>
      {inCart > 0 && (
        <Link href="/koshyk" className="buy-incart">
          <Icon name="check" size={16} /> У кошику: {inCart} шт. — оформити заявку <Icon name="arrow" size={16} />
        </Link>
      )}
      <LeadButton
        title={kit ? "Розрахунок під ваш об’єкт" : "Уточнити наявність і ціну"}
        details={`Товар: ${item.name} — ${price(item)}${kit ? "" : `, кількість: ${qty}`}`}
        className="btn btn-outline btn-wide"
      >
        <Icon name="phone" size={18} /> {kit ? "Порахувати під мій об’єкт" : "Передзвоніть мені"}
      </LeadButton>
      <ul className="buy-notes">
        <li>
          <Icon name="truck" size={16} /> Власна доставка, при монтажі — безкоштовно
        </li>
        <li>
          <Icon name="shield" size={16} /> Офіційна гарантія виробника
        </li>
        <li>
          <Icon name="clock" size={16} /> Наявність підтверджуємо в робочий час: {site.hours}
        </li>
      </ul>
    </div>
  );
}
