import { Check } from "@phosphor-icons/react";
import { SOLUCOES } from "../../data/solucoes.js";
import SectionHeading from "../SectionHeading.jsx";
import SeloEscopo from "../SeloEscopo.jsx";
import Revelar from "../Revelar.jsx";

// Bento assimétrico: um destaque grande, dois empilhados e um largo embaixo.
const POSICAO = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-12",
];

export default function Solucoes() {
  return (
    <section id="solucoes" className="bg-base-200 py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Soluções"
          title="Tudo o que o seu negócio precisa online, em um lugar só"
          subtitle="Você escolhe o resultado. A parte técnica é problema nosso."
        />

        <div className="mt-16 grid gap-4 md:grid-cols-12">
          {SOLUCOES.map((sol, i) => {
            const Icone = sol.icone;
            const grande = i === 0;
            return (
              <Revelar
                as="article"
                key={sol.slug}
                atraso={i * 80}
                className={`group min-w-0 rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/10 ${POSICAO[i]}`}
              >
                <div className="flex h-full flex-col rounded-[calc(2rem-0.375rem)] bg-base-100 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors duration-500 ease-mola group-hover:bg-[#181c1a] sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <Icone weight="light" className="h-8 w-8 text-primary" aria-hidden="true" />
                    <span className="font-mono text-xs text-base-content/60">0{i + 1}</span>
                  </div>
                  <h3
                    className={`mt-8 font-semibold tracking-[-0.03em] text-base-content ${
                      grande ? "text-3xl sm:text-4xl" : "text-xl"
                    }`}
                  >
                    {sol.nome}
                  </h3>
                  <p className="mt-3 max-w-[48ch] text-base-content/70">{sol.resumo}</p>
                  {grande && (
                    <ul className="mt-8 flex flex-col gap-3">
                      {sol.entregaveis.slice(0, 3).map((e) => (
                        <li key={e} className="flex items-start gap-3 text-sm text-base-content/80">
                          <Check weight="bold" className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  )}
                  <SeloEscopo item={sol} className="mt-auto pt-8" />
                </div>
              </Revelar>
            );
          })}
        </div>
      </div>
    </section>
  );
}
