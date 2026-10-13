import { Fragment, useRef } from "react";
import { CATALOGO } from "../../../data/catalogo.js";
import BotaoDiagnostico from "./BotaoDiagnostico.jsx";

const PALAVRAS = [
  { texto: "Um" },
  { texto: "responsável." },
  { texto: "Zero", contorno: true },
  { texto: "dor" },
  { texto: "de" },
  { texto: "cabeça." },
];

const LETREIRO = CATALOGO.map((item) => item.nome.toUpperCase());

export default function Hero() {
  const ref = useRef(null);

  return (
    <section
      ref={ref}
      id="topo"
      className="relative flex min-h-[calc(100dvh-2.75rem)] flex-col overflow-hidden bg-primary text-primary-content"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pb-28 pt-16">
        <h1 className="text-[clamp(2.25rem,10.5vw,9.5rem)] font-black uppercase leading-[0.86] tracking-[-0.05em] [--contorno:var(--color-primary-content)]">
          {/* O espaço fica FORA da máscara: é ele que permite quebrar a linha entre palavras. */}
          {PALAVRAS.map(({ texto, contorno }) => (
            <Fragment key={texto}>
              <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                <span className={`palavra inline-block ${contorno ? "texto-contorno" : ""}`}>{texto}</span>
              </span>{" "}
            </Fragment>
          ))}
        </h1>

        <div className="hero-resto mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[46ch] text-lg font-medium leading-relaxed text-primary-content/90">
            Sua empresa inteira funcionando online, sob a responsabilidade de uma pessoa só. Site,
            e-mail profissional, sistema de gestão e suporte — em vez de quatro fornecedores que se
            culpam entre si, um número de telefone que resolve.
          </p>
          <div className="flex flex-col items-start gap-3">
            <BotaoDiagnostico sobreCobalto grande />
            <p className="text-sm text-primary-content/80">Diagnóstico sem custo e sem compromisso · sem fidelidade</p>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="overflow-hidden bg-base-100 py-3 text-primary">
        <div className="letreiro-trilha">
          {[0, 1].map((copia) => (
            <span key={copia} className="flex shrink-0 items-center text-lg font-black uppercase tracking-tight">
              {LETREIRO.map((nome) => (
                <span key={nome} className="px-5">
                  {nome} <span className="pl-5">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
