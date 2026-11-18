"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { type Item, itemHref, kitTitle, kits, price } from "@/lib/catalog";
import { AddToCart } from "./CartToast";
import { Icon } from "./Icons";
import { LeadButton } from "./LeadModal";
import { KitVisual } from "./Shared";

/** kWh a year per installed kW: the client's own 12 kW station gives ≈14 MWh a year. */
export const YIELD = 1167;
const STEPS = [150, 200, 300, 400, 500, 700, 1000, 1500, 2000, 3000, 4000, 6000, 8000, 12000, 16000, 20000, 25000, 30000];
const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

function pick(type: "hybrid" | "grid", kw: number): Item {
  const list = kits.filter((k) => k.sub === type).sort((a, b) => (a.value ?? 0) - (b.value ?? 0));
  return list.find((k) => (k.value ?? 0) >= kw * 0.92) ?? list[list.length - 1];
}

/** Monthly consumption → the matching ready-made station from the catalogue, with its real price. */
export function Savings() {
  const [i, setI] = useState(6);
  const [backup, setBackup] = useState(true);
  const kwh = STEPS[i];
  const need = (kwh * 12) / YIELD;
  const type = backup ? "hybrid" : "grid";
  const kit = useMemo(() => pick(type, need), [type, need]);
  const kw = kit.value ?? 0;
  const gen = kw * YIELD;
  const cover = Math.round((gen / (kwh * 12)) * 100);
  const t = kitTitle(kit);
  const details = `Калькулятор: споживання ${fmt(kwh)} кВт·год/міс, ${backup ? "потрібен резерв (гібрид)" : "без резерву (мережева)"}. Підібрано: ${kit.name} — ${price(kit)}.`;

  return (
    <div className="calc">
      <div className="calc-inputs">
        <div className="calc-field">
          <label className="calc-label" htmlFor="kwh">
            Скільки ви споживаєте за місяць
            <output htmlFor="kwh">
              <b>{fmt(kwh)}</b> кВт·год
            </output>
          </label>
          <input
            id="kwh"
            type="range"
            min={0}
            max={STEPS.length - 1}
            step={1}
            value={i}
            onChange={(e) => setI(Number(e.target.value))}
            style={{ ["--fill" as string]: `${(i / (STEPS.length - 1)) * 100}%` }}
            aria-valuetext={`${kwh} кВт·год на місяць`}
          />
          <div className="calc-presets">
            {[
              { k: "Квартира", v: 3 },
              { k: "Будинок", v: 6 },
              { k: "Котедж з котлом", v: 9 },
              { k: "Магазин, СТО", v: 11 },
              { k: "Склад, цех", v: 15 },
            ].map((p) => (
              <button key={p.k} type="button" className={i === p.v ? "is-on" : undefined} onClick={() => setI(p.v)}>
                {p.k}
              </button>
            ))}
          </div>
          <p className="calc-hint">Подивіться в платіжку: там вказані кВт·год за місяць. Для точності візьміть середнє за рік.</p>
        </div>
        <div className="calc-field">
          <span className="calc-label">Потрібне світло під час відключень?</span>
          <div className="seg seg-lg" role="radiogroup" aria-label="Тип станції">
            <button type="button" role="radio" aria-checked={backup} className={backup ? "is-on" : undefined} onClick={() => setBackup(true)}>
              Так, з акумуляторами
            </button>
            <button type="button" role="radio" aria-checked={!backup} className={!backup ? "is-on" : undefined} onClick={() => setBackup(false)}>
              Ні, лише економія
            </button>
          </div>
          <p className="calc-hint">
            {backup
              ? "Гібридна станція накопичує денний надлишок в акумуляторах і тримає дім чи бізнес під час відключень."
              : "Мережева станція — максимальна економія та зелений тариф, але під час відключення вона зупиняється."}
          </p>
          <div className="calc-need">
            <span>
              Потрібно ≈ <b>{need < 10 ? need.toFixed(1).replace(".", ",") : Math.round(need)} кВт</b>
            </span>
            <small>{fmt(kwh * 12)} кВт·год на рік</small>
          </div>
        </div>
      </div>

      <div className="calc-result spot" aria-live="polite">
        <div className="calc-result-visual">
          <KitVisual item={kit} />
        </div>
        <div className="calc-result-main">
          <span className="mono">
            Підібрали з каталогу · {t.type} «{t.tier}»
          </span>
          <p className="calc-kw">
            {kw}
            <small> кВт</small>
          </p>
          <ul className="calc-stats">
            <li>
              <b>{fmt(gen)}</b>
              <span>кВт·год генерації на рік</span>
            </li>
            <li>
              <b>{cover > 150 ? ">150" : cover}%</b>
              <span>вашого річного споживання</span>
            </li>
            {kit.kit?.area && (
              <li>
                <b>{/м/.test(kit.kit.area) ? kit.kit.area : `${kit.kit.area} м²`}</b>
                <span>площа під панелі</span>
              </li>
            )}
          </ul>
        </div>
        <div className="calc-result-side">
          <span className="calc-price">
            <small>Станція під ключ</small>
            {price(kit)}
          </span>
          <LeadButton title="Точний кошторис під ваш об’єкт" details={details} className="btn btn-primary btn-wide">
            Точний кошторис <Icon name="arrow" size={18} />
          </LeadButton>
          <div className="calc-result-links">
            <Link href={itemHref(kit)} className="text-link">
              Склад станції <Icon name="arrow" size={16} />
            </Link>
            <AddToCart id={kit.id} className="btn btn-outline btn-sm" label="У кошик" />
          </div>
        </div>
      </div>
      <p className="calc-note">
        Розрахунок орієнтовний: 1 кВт станції на Полтавщині дає близько {fmt(YIELD)} кВт·год на рік (наша гібридна станція на 12 кВт — ≈14 МВт·год). Реальна генерація залежить від
        орієнтації, кута, тіней і погоди. Точний проєкт — безкоштовно.
      </p>
    </div>
  );
}
