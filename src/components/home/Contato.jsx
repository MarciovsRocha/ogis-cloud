import { BRAND } from "../../config.js";
import BotaoContato from "../BotaoContato.jsx";
import Revelar from "../Revelar.jsx";

const GANHOS = [
  "Um único responsável pelo seu digital",
  "Proposta clara, com preço e prazo combinados",
  "Site, e-mail e sistema sob o mesmo teto",
];

export default function Contato() {
  return (
    <section id="contato" className="bg-base-100 py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5">
        <Revelar className="rounded-[2.5rem] bg-white/[0.03] p-2 ring-1 ring-white/10">
          <div className="relative overflow-hidden rounded-[calc(2.5rem-0.5rem)] bg-base-200 px-7 py-14 sm:px-14 sm:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 bg-[radial-gradient(circle,#1c2b1f_0%,transparent_70%)]"
            />
            <div className="relative grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  contato
                </p>
                <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-base-content sm:text-5xl">
                  Vamos conversar sobre o seu negócio.
                </h2>
                <p className="mt-6 max-w-[50ch] text-lg text-base-content/70">
                  Fale com a gente e receba uma proposta sob medida — sem compromisso e em linguagem
                  que você entende. Sem robô, sem call center.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <BotaoContato />
                  <BotaoContato canal="email" variante="secundario" />
                </div>
              </div>

              <div>
                <p className="font-mono text-xs text-base-content/60">o que você ganha</p>
                <ul className="mt-3 divide-y divide-white/[0.08]">
                  {GANHOS.map((g) => (
                    <li key={g} className="py-4 text-base-content/85">
                      {g}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 font-mono text-xs text-base-content/60">
                  {BRAND.email} · atendimento em {BRAND.cidade} e região
                </p>
              </div>
            </div>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
