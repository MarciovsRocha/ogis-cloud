import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { EXEMPLARES } from "../data/exemplares.js";
import SectionHeading from "./SectionHeading.jsx";

export default function VejaFuncionando() {
  return (
    <section id="exemplos" className="bg-base-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Exemplos"
          title="Veja funcionando antes de decidir"
          subtitle="Três exemplares navegáveis, construídos por nós. Clique, navegue e veja o que cada formato entrega."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {EXEMPLARES.map((ex) => {
            const Icone = ex.icone;
            return (
              <Link
                key={ex.para}
                to={ex.para}
                className="group flex flex-col rounded-2xl border border-base-300 bg-base-200 p-7 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icone className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-base-content">{ex.nome}</h3>
                <p className="mt-2 flex-1 text-sm text-base-content/70">{ex.resumo}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Abrir exemplar
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
