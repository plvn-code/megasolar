"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "./Icons";

type State = "idle" | "sending" | "done" | "error";
const OBJECTS = ["Будинок", "Бізнес", "Лише обладнання"] as const;

/** Name + phone + what kind of object. `details` carries calculator / planner answers. */
export function LeadForm({
  details,
  source,
  button = "Отримати розрахунок",
  onDone,
  defaultObject = "Будинок",
}: {
  details?: string;
  source: string;
  button?: string;
  onDone?: () => void;
  defaultObject?: (typeof OBJECTS)[number];
}) {
  const pathname = usePathname();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [object, setObject] = useState<string>(defaultObject);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, object, details, source, page: pathname }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Не вдалося надіслати заявку.");
      form.reset();
      setState("done");
      onDone?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося надіслати заявку.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="lead-done" role="status">
        <span className="lead-done-icon">
          <Icon name="check" size={30} />
        </span>
        <h3>Дякуємо! Ми скоро зв’яжемося з вами</h3>
        <p>Менеджер MEGASOLAR зателефонує в робочий час ({site.hours}), уточнить деталі й підготує безкоштовний розрахунок.</p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={onSubmit}>
      <div className="seg" role="radiogroup" aria-label="Тип об’єкта">
        {OBJECTS.map((o) => (
          <button key={o} type="button" role="radio" aria-checked={object === o} className={object === o ? "is-on" : undefined} onClick={() => setObject(o)}>
            {o}
          </button>
        ))}
      </div>
      <label className="field">
        <input name="name" maxLength={80} placeholder=" " autoComplete="name" />
        <span>Ім’я</span>
      </label>
      <label className="field">
        <input name="phone" type="tel" inputMode="tel" required maxLength={24} placeholder=" " autoComplete="tel" />
        <span>Телефон</span>
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      {state === "error" && (
        <p className="form-error" role="alert">
          {error} Зателефонуйте нам: <a href={site.phoneHref}>{site.phone}</a> або напишіть у{" "}
          <a href={site.direct} target="_blank" rel="noreferrer">
            Direct
          </a>
          .
        </p>
      )}
      <button type="submit" className="btn btn-primary btn-lg btn-wide" disabled={state === "sending"}>
        {state === "sending" ? "Надсилаємо…" : button}
        <Icon name="arrow" size={18} />
      </button>
      <p className="form-note">Консультація й розрахунок безкоштовні та ні до чого не зобов’язують. Контакти використовуємо лише для зв’язку з вами.</p>
    </form>
  );
}
