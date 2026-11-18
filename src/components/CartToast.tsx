"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cart } from "@/lib/cart";
import { byId, itemImage } from "@/lib/catalog";
import { Icon } from "./Icons";

/** «Додано в кошик» pill, bottom-right; links straight to the request cart. */
export function CartToast() {
  const [id, setId] = useState<string | null>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    let t = 0;
    const on = (e: Event) => {
      setId((e as CustomEvent<string>).detail);
      setN((k) => k + 1);
      window.clearTimeout(t);
      t = window.setTimeout(() => setId(null), 4200);
    };
    window.addEventListener("ms-toast", on);
    return () => {
      window.removeEventListener("ms-toast", on);
      window.clearTimeout(t);
    };
  }, []);

  const item = id ? byId.get(id) : null;
  return (
    <div className={`toast${item ? " is-on" : ""}`} role="status" aria-live="polite">
      {item && (
        <div className="toast-box" key={n}>
          <span className="toast-img">{item.img && item.cat !== "stantsii" ? <Image src={itemImage(item)} alt="" fill sizes="56px" /> : <Icon name="check" size={22} />}</span>
          <span className="toast-text">
            <span className="mono">Додано в кошик-заявку</span>
            <strong>{item.name}</strong>
          </span>
          <Link href="/koshyk" className="btn btn-primary btn-sm" onClick={() => setId(null)}>
            Кошик <Icon name="arrow" size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}

export function AddToCart({ id, className = "btn btn-primary", label = "У кошик", compact = false }: { id: string; className?: string; label?: string; compact?: boolean }) {
  return (
    <button
      type="button"
      className={className}
      aria-label={compact ? `${label}: ${byId.get(id)?.name ?? ""}` : undefined}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        cart.add(id);
      }}
    >
      <Icon name="cartAdd" size={compact ? 20 : 18} />
      {!compact && label}
    </button>
  );
}
