import Link from "next/link";
import { Icon } from "@/components/Icons";

export default function NotFound() {
  return (
    <section className="page-hero not-found">
      <div className="page-hero-rays" aria-hidden="true" />
      <div className="container page-hero-inner">
        <p className="eyebrow">Помилка 404</p>
        <h1 className="page-title">
          Тут <span className="accent">блекаут</span>
        </h1>
        <p className="page-lead">Такої сторінки немає. Але світло на решті сайту є — почніть із наших об’єктів.</p>
        <div className="page-hero-actions">
          <Link className="btn btn-primary btn-lg" href="/obiekty">
            До об’єктів <Icon name="arrow" size={18} />
          </Link>
          <Link className="btn btn-outline btn-lg" href="/">
            На головну
          </Link>
        </div>
      </div>
    </section>
  );
}
