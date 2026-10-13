import { useRef } from "react";
import { DORES } from "../conteudo.js";

export default function Problema() {
  const ref = useRef(null);

  return (
    <section ref={ref} id="problema" className="bg-base-100">
      <div className="palco mx-auto max-w-6xl px-5 py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">O problema</p>
          <h2 className="mt-4 text-[clamp(2.25rem,6vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
            Ninguém contrata quatro fornecedores por vontade própria
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg text-base-content/80">
            Acontece aos poucos, cada um resolvendo uma urgência. Até o dia em que dá problema e não há
            ninguém responsável pelo conjunto.
          </p>
        </div>

        <div className="pilha mt-12 grid gap-4 sm:grid-cols-2">
          {DORES.map((dor, i) => (
            <article
              key={dor.titulo}
              className={`carta flex flex-col justify-between gap-10 p-8 sm:p-10 ${
                i % 2 === 0 ? "bg-primary text-primary-content" : "bg-base-200 text-base-content ring-2 ring-inset ring-base-content"
              }`}
            >
              <span className="text-sm font-extrabold tracking-[0.2em]">
                {String(i + 1).padStart(2, "0")}/{String(DORES.length).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[clamp(1.75rem,4vw,3rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
                  {dor.titulo}
                </h3>
                <p className="mt-4 max-w-[48ch] text-base leading-relaxed opacity-90">{dor.texto}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
