import { EXEMPLARES } from "../../data/exemplares.js";
import SectionHeading from "../SectionHeading.jsx";
import Revelar from "../Revelar.jsx";
import CartaoExemplar from "./CartaoExemplar.jsx";

export default function VejaFuncionando() {
  return (
    <section id="exemplos" className="bg-base-200 py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Exemplos"
          title="Veja funcionando antes de decidir"
          subtitle="Três exemplares navegáveis, construídos por nós — cada um com uma linguagem visual diferente. Clique, navegue e veja o que cada formato entrega."
        />
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {EXEMPLARES.map((exemplar, i) => (
            <Revelar key={exemplar.para} atraso={i * 90}>
              <CartaoExemplar exemplar={exemplar} />
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
