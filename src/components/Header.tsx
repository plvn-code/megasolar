"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cartRows, useCart } from "@/lib/cart";
import { nav, site } from "@/lib/site";
import { Icon } from "./Icons";
import { LeadButton } from "./LeadModal";
import { Logo } from "./Logo";

export function CartLink({ className = "header-cart" }: { className?: string }) {
  const { count } = cartRows(useCart());
  return (
    <Link href="/koshyk" className={className} aria-label={count ? `Кошик-заявка: ${count} шт.` : "Кошик-заявка порожній"}>
      <Icon name="cart" size={22} />
      {count > 0 && (
        <span className="cart-badge" key={count}>
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    return () => document.documentElement.classList.remove("menu-open");
  }, [open]);

  return (
    <>
      <span className="scroll-line" aria-hidden="true" />
      <header className={`header${scrolled ? " is-solid" : ""}${open ? " is-open" : ""}`}>
        <div className="container header-row">
          <Link href="/" className="header-logo" aria-label="MEGASOLAR — на головну">
            <Logo id="hd" />
          </Link>

          <nav className="header-nav" aria-label="Головне меню">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) || (item.href === "/katalog" && pathname.startsWith("/tovar")) ? "is-active" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <a href={site.phoneHref} className="header-phone">
              <span>{site.hours}</span>
              {site.phone}
            </a>
            <CartLink />
            <LeadButton className="btn btn-primary btn-sm header-cta">
              Розрахунок <Icon name="arrow" size={16} />
            </LeadButton>
            <button
              type="button"
              className="header-burger"
              aria-label={open ? "Закрити меню" : "Відкрити меню"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} size={26} />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu${open ? " is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Мобільне меню">
          {[{ label: "Головна", href: "/" }, ...nav, { label: "Кошик-заявка", href: "/koshyk" }].map((item, i) => (
            <Link key={item.href} href={item.href} style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }} tabIndex={open ? 0 : -1}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu-foot">
          <div onClick={() => setOpen(false)}>
            <LeadButton className="btn btn-primary btn-lg btn-wide">
              Безкоштовний розрахунок <Icon name="arrow" size={18} />
            </LeadButton>
          </div>
          {site.phones.map((p) => (
            <a key={p.href} href={p.href} tabIndex={open ? 0 : -1}>
              {p.phone}
              <small>{p.label}</small>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
