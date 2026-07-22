import { Link } from "react-router-dom";
import SeloEscopo from "./SeloEscopo.jsx";

export default function CardCatalogo({ item, para, children }) {
  const Icone = item.icone;

  return (
    <article
      className={`group relative flex flex-col rounded-2xl border bg-base-100 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        item.destaque ? "border-primary/40 shadow-lg" : "border-base-300"
      }`}
    >
      {item.badge && (
        <span className="absolute right-4 top-4 rounded-full bg-base-300 px-2.5 py-1 text-xs font-medium text-base-content/70">
          {item.badge}
        </span>
      )}

      <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icone className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-base-content">
        <Link to={para} className="transition-colors duration-200 hover:text-primary">
          <span className="absolute inset-0" aria-hidden="true" />
          {item.nome}
        </Link>
      </h3>

      <p className="mt-2 flex-1 text-sm text-base-content/70">{item.resumo}</p>
      <SeloEscopo item={item} className="mt-4 self-start" />

      {children && <div className="relative z-10 mt-5">{children}</div>}
    </article>
  );
}
