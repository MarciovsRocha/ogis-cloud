import { useRef } from "react";
import { PASSOS } from "../conteudo.js";
import { useGsap } from "../useGsap.js";
import { animarPassos } from "../animacoes.js";

export default function Passos() {
  const ref = useRef(null);
  useGsap(ref, animarPassos);

  return (
    <section ref={ref} id="como-funciona" className="bg-base-100">
      <div className="trilha-palco mx-auto max-w-6xl px-5 py-24">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">Como funciona</p>
        <h2 className="mt-4 max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
          Do primeiro contato à sustentação
        </h2>
        <div className="trilha-janela mt-12">
          <ol className="trilha grid gap-4 md:grid-cols-2">
            {PASSOS.map((passo) => (
              <li key={passo.numero} className="passo flex flex-col gap-8 bg-base-200 p-8 ring-2 ring-inset ring-base-content sm:p-10">
                <span className="text-[clamp(3.5rem,8vw,6rem)] font-black leading-none tracking-[-0.05em] text-primary">
                  {passo.numero}
                </span>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-[-0.03em]">{passo.titulo}</h3>
                  <p className="mt-3 max-w-[44ch] text-base-content/80">{passo.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
