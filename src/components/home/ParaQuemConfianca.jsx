import SectionHeading from "../SectionHeading.jsx";
import Revelar from "../Revelar.jsx";

const SEGMENTOS = [
  "Oficinas mecânicas",
  "Preparadoras",
  "Lojas de peças",
  "Eventos automotivos",
  "Clínicas",
  "Pet shops",
  "Academias",
  "Comércio local",
];

const SINAIS = [
  {
    titulo: "Domínio no seu nome",
    texto: "O endereço do seu negócio é sempre registrado no seu CPF/CNPJ. Você é o dono, não nós.",
  },
  {
    titulo: "Escopo definido por escrito",
    texto:
      "Você aprova por escrito o que será entregue, com prazo e preço combinados. Sem surpresa no meio do caminho.",
  },
  {
    titulo: "Sem fidelidade",
    texto: "Você fica porque quer. Sem multa, sem letras miúdas prendendo o seu negócio.",
  },
];

export default function ParaQuemConfianca() {
  return (
    <section id="para-quem" className="bg-base-200 py-28 sm:py-40">
      <div className="mx-auto grid max-w-6xl gap-16 px-5 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <Revelar>
          <SectionHeading
            eyebrow="Para quem é"
            title="Feito para o comércio e o serviço local de Curitiba"
            subtitle="Nascemos no universo automotivo e hoje atendemos negócios que querem ser encontrados e organizados — sem virar especialistas em tecnologia."
          />
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-base-content/75">
            {SEGMENTOS.map((s) => (
              <li key={s} className="flex items-center gap-2.5">
                <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
        </Revelar>

        <Revelar atraso={120} className="rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/10">
          <div className="rounded-[calc(2rem-0.375rem)] bg-base-100 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-8">
            <p className="font-mono text-xs text-base-content/60">garantias por escrito</p>
            <ul className="mt-2 divide-y divide-white/[0.06]">
              {SINAIS.map((s) => (
                <li key={s.titulo} className="py-5">
                  <p className="font-mono text-sm text-primary">✓ {s.titulo.toLowerCase()}</p>
                  <p className="mt-2 text-sm text-base-content/70">{s.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
