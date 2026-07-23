import { Check } from "lucide-react";
import { SOLUCOES } from "../data/solucoes.js";
import SectionHeading from "./SectionHeading.jsx";
import SeloEscopo from "./SeloEscopo.jsx";

export default function Solucoes() {
  return (
    <section id="solucoes" className="bg-base-200 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Soluções"
          title="Tudo o que o seu negócio precisa online, em um lugar só"
          subtitle="Você escolhe o resultado. A parte técnica é problema nosso."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUCOES.map((sol) => {
            const Icon = sol.icone;
            return (
              <article
                key={sol.nome}
                className={`group relative flex flex-col rounded-2xl border bg-base-100 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                  sol.destaque ? "border-primary/40 shadow-lg" : "border-base-300"
                }`}
              >
                {sol.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-base-300 px-2.5 py-1 text-xs font-medium text-base-content/70">
                    {sol.badge}
                  </span>
                )}
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-base-content">{sol.nome}</h3>
                <p className="mt-2 text-sm text-base-content/70">{sol.resumo}</p>
                <SeloEscopo item={sol} className="mt-4 self-start" />
                <ul className="mt-5 flex flex-1 flex-col gap-2.5 border-t border-base-300 pt-5">
                  {sol.entregaveis.slice(0, 3).map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-base-content/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
