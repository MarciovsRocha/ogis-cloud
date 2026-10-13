import { useRef } from "react";
import { PROVAS } from "../conteudo.js";

export default function Provas() {
  const ref = useRef(null);

  return (
    <section ref={ref} id="provas" className="bg-primary py-24 text-primary-content sm:py-32">
      <div className="provas-grade mx-auto grid max-w-6xl gap-14 px-5 md:grid-cols-3">
        {PROVAS.map((prova) => (
          <div key={prova.rotulo}>
            <span className="block overflow-hidden">
              <span className="prova-numero block text-[clamp(5rem,14vw,10rem)] font-black leading-[0.85] tracking-[-0.06em]">
                {prova.numero}
              </span>
            </span>
            <h3 className="mt-6 text-sm font-extrabold uppercase tracking-[0.2em]">{prova.rotulo}</h3>
            <p className="mt-2 max-w-[32ch] text-primary-content/90">{prova.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
