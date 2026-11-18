"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";
import { LeadForm } from "./LeadForm";

const EVENT = "lead:open";
type Detail = { title?: string; details?: string };

/** Opens the request dialog from anywhere; `details` travels with the lead (object name, calculator result…). */
export function LeadButton({
  title,
  details,
  className = "btn btn-primary",
  children,
}: {
  title?: string;
  details?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new CustomEvent<Detail>(EVENT, { detail: { title, details } }))}>
      {children}
    </button>
  );
}

export function LeadModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const [detail, setDetail] = useState<Detail>({});
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const open = (e: Event) => {
      setDetail((e as CustomEvent<Detail>).detail ?? {});
      setFormKey((k) => k + 1);
      ref.current?.showModal();
    };
    window.addEventListener(EVENT, open);
    return () => window.removeEventListener(EVENT, open);
  }, []);

  return (
    <dialog
      ref={ref}
      className="lead-modal"
      aria-labelledby="leadTitle"
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <div className="lead-modal-box">
        <button type="button" className="lead-modal-close" aria-label="Закрити" onClick={() => ref.current?.close()}>
          <Icon name="close" size={22} />
        </button>
        <p className="eyebrow">Безкоштовна консультація</p>
        <h2 id="leadTitle">{detail.title ?? "Розрахуємо станцію під ваш об’єкт"}</h2>
        <p className="muted">Залиште телефон — фахівець зателефонує, уточнить споживання й об’єкт і підготує кошторис без прихованих доплат.</p>
        <LeadForm key={formKey} details={detail.details} source="modal" />
      </div>
    </dialog>
  );
}
