import { Check } from "@phosphor-icons/react";
import { PLANOS, GARANTIAS } from "../../data/planos.js";
import { ASSUNTO, MSG } from "../../config.js";
import SectionHeading from "../SectionHeading.jsx";
import BotaoContato from "../BotaoContato.jsx";
import Revelar from "../Revelar.jsx";

export default function Planos() {
  return (
    <section id="planos" className="bg-base-100 py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Planos"
          title="Escolha por onde começar"
          subtitle="Cada orçamento é feito sob medida, depois de entender o seu negócio."
        />

        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {PLANOS.map((plano, i) => (
            <Revelar
              key={plano.nome}
              atraso={i * 80}
              className={`rounded-[2rem] p-1.5 ring-1 ${
                plano.destaque ? "bg-primary/[0.06] ring-primary/40" : "bg-white/[0.03] ring-white/10"
              }`}
            >
              <div
                className={`flex h-full flex-col rounded-[calc(2rem-0.375rem)] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${
                  plano.destaque ? "bg-[#171c19]" : "bg-base-200"
                }`}
              >
                <div className="flex min-h-7 items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-base-content">{plano.nome}</h3>
                  {plano.selo && <span className="font-mono text-[11px] text-primary">{plano.selo.toLowerCase()}</span>}
                </div>
                <p className="mt-3 min-h-[3lh] text-sm text-base-content/70">{plano.resumo}</p>
                <p className="mt-6 font-mono text-xs text-base-content/60">
                  sob consulta · orçamento depois de entender o seu negócio
                </p>
                <ul className="mt-6 flex flex-col gap-3 border-t border-white/[0.08] pt-6">
                  {plano.beneficios.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-base-content/80">
                      <Check weight="bold" className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <BotaoContato
                    mensagem={MSG.plano(plano.nome)}
                    assunto={ASSUNTO.plano(plano.nome)}
                    variante={plano.destaque ? "primario" : "secundario"}
                    className="w-full"
                  >
                    {plano.cta}
                  </BotaoContato>
                </div>
              </div>
            </Revelar>
          ))}
        </div>

        <p className="mt-10 text-center font-mono text-xs text-base-content/60">
          {GARANTIAS.map((g) => g.toLowerCase()).join(" · ")}
        </p>
      </div>
    </section>
  );
}
