import { Check, Star } from "lucide-react";
import { PLANOS, GARANTIAS } from "../data/planos.js";
import { linkWhatsApp, MSG } from "../config.js";
import SectionHeading from "./SectionHeading.jsx";

export default function Planos() {
  return (
    <section id="planos" className="bg-base-200 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Planos"
          title="Escolha por onde começar"
          subtitle="Valores a partir de — o setup é orçado conforme o escopo do seu negócio."
        />

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {PLANOS.map((plano) => {
            const isFeatured = plano.destaque;
            return (
              <div
                key={plano.nome}
                className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-200 ${
                  isFeatured
                    ? "border-primary bg-base-100 shadow-xl lg:-translate-y-3"
                    : "border-base-300 bg-base-100 hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                {plano.selo && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-content">
                    <Star className="h-3.5 w-3.5" />
                    {plano.selo}
                  </span>
                )}

                <h3 className="text-lg font-semibold text-base-content">{plano.nome}</h3>
                <p className="mt-1 min-h-10 text-sm text-base-content/70">{plano.resumo}</p>

                <div className="mt-5 flex items-end gap-1.5">
                  {plano.precoPrefixo && (
                    <span className="mb-1 text-xs font-medium text-base-content/60">
                      {plano.precoPrefixo}
                    </span>
                  )}
                  <span className="font-display text-4xl font-bold text-base-content">
                    {plano.preco}
                  </span>
                  {plano.periodo && (
                    <span className="mb-1.5 text-sm text-base-content/60">{plano.periodo}</span>
                  )}
                </div>

                <a
                  href={linkWhatsApp(MSG.plano(plano.nome))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 cursor-pointer rounded-xl px-5 py-3 text-center text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 ${
                    isFeatured
                      ? "bg-primary text-primary-content"
                      : "border border-base-300 bg-base-200 text-base-content hover:border-primary/50"
                  }`}
                >
                  {plano.cta}
                </a>

                <ul className="mt-7 flex flex-col gap-3 border-t border-base-300 pt-6">
                  {plano.beneficios.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-base-content/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-base-content/70">
          {GARANTIAS.map((g) => (
            <li key={g} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              {g}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
