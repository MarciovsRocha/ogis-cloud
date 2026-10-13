import { useRef } from "react";
import { Check } from "@phosphor-icons/react";
import { CATEGORIAS } from "../../../data/catalogo.js";
import { useGsap } from "../useGsap.js";
import { animarFrase } from "../animacoes.js";

const FRASE = ["UM", "CONTRATO.", "UMA", "PESSOA.", "TUDO", "NO", "AR."];

const GARANTIAS = [
  "O domínio é registrado no CNPJ da sua empresa, sempre",
  "As contas de e-mail são suas, com as credenciais na sua mão",
  "Sem contrato de permanência e sem multa de cancelamento",
  "Se quiser sair, ajudamos na transferência para quem assumir",
];

export default function Solucao() {
  const ref = useRef(null);
  useGsap(ref, animarFrase);

  return (
    <section ref={ref} id="pilares" className="bg-primary py-28 text-primary-content sm:py-40">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em]">A solução · quatro frentes, um responsável</p>
        <p className="frase mt-6 text-[clamp(2.75rem,9vw,7.5rem)] font-black leading-[0.88] tracking-[-0.05em] [--contorno:var(--color-primary-content)]">
          {FRASE.map((palavra, i) => (
            <span key={`${palavra}-${i}`} className="relative inline-block pr-[0.25em]">
              <span className="texto-contorno">{palavra}</span>
              <span aria-hidden="true" className="preenchida absolute left-0 top-0">
                {palavra}
              </span>
            </span>
          ))}
        </p>
        <p className="mt-8 max-w-[56ch] text-lg text-primary-content/90">
          Não é um serviço avulso: é a sua operação digital inteira, cuidada por quem responde pelo
          conjunto.
        </p>

        <ul className="mt-16 border-t-2 border-primary-content">
          {CATEGORIAS.map((cat) => (
            <li
              key={cat.slug}
              className="grid gap-3 border-b-2 border-primary-content py-7 md:grid-cols-[1fr_1fr] md:items-baseline md:gap-12"
            >
              <h3 className="text-[clamp(1.75rem,4.5vw,3.25rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
                {cat.nome}
              </h3>
              <p className="text-lg text-primary-content/90">{cat.promessa}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-primary-content/80">
          Você não precisa de tudo no primeiro dia. Começamos pelo que dói mais.
        </p>

        <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em]">A objeção honesta</p>
            <h3 className="mt-4 text-[clamp(2rem,4.5vw,3.25rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
              “Não é arriscado depender de um fornecedor só?”
            </h3>
            <p className="mt-6 text-primary-content/90">
              Seria, se depender significasse ficar sem acesso ao que é seu. É exatamente isso que
              acontece quando o domínio está no nome do fornecedor e ninguém sabe a senha do e-mail.
            </p>
            <p className="mt-4 text-primary-content/90">
              Trabalhamos ao contrário: tudo o que é da sua empresa fica no nome da sua empresa. Você
              fica com um responsável — não com uma corda no pescoço.
            </p>
          </div>
          <ul className="flex flex-col gap-5 bg-base-100 p-8 text-base-content sm:p-10">
            {GARANTIAS.map((g) => (
              <li key={g} className="flex items-start gap-3 font-medium">
                <Check weight="bold" className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
