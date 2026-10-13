import { ArrowDown } from "@phosphor-icons/react";
import BotaoContato from "../BotaoContato.jsx";
import Revelar from "../Revelar.jsx";
import PainelStatus from "./PainelStatus.jsx";

const CONFIANCA = ["sem fidelidade", "domínio sempre no seu nome", "tudo em um só lugar"];

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-base-200">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(60%_55%_at_80%_0%,#1c2b1f_0%,transparent_70%)]"
      />
      <div className="mx-auto grid min-h-[100dvh] max-w-6xl items-center gap-14 px-5 pb-24 pt-36 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <Revelar>
          <p className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.14em] text-primary">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            operação digital gerenciada · curitiba/pr
          </p>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-base-content sm:text-6xl lg:text-7xl">
            Sua presença digital e seus sistemas funcionando,{" "}
            <span className="text-base-content/45">com um único responsável.</span>
          </h1>

          <p className="mt-7 max-w-[52ch] text-lg leading-relaxed text-base-content/70">
            Do domínio ao sistema de gestão, uma mensalidade cuida de tudo. Você fala com uma pessoa
            só — e a tecnologia trabalha por trás, invisível.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BotaoContato />
            <a
              href="#exemplos"
              className="group inline-flex items-center gap-2 px-2 text-sm font-medium text-base-content/75 transition-colors duration-300 ease-mola hover:text-base-content"
            >
              Ver exemplos funcionando
              <ArrowDown
                className="h-4 w-4 transition-transform duration-500 ease-mola group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>

          <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-base-content/60">
            {CONFIANCA.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        </Revelar>

        <Revelar atraso={150}>
          <PainelStatus />
        </Revelar>
      </div>
    </section>
  );
}
