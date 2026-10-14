import SectionHeading from "../SectionHeading.jsx";
import Revelar from "../Revelar.jsx";

const PILARES = [
  {
    titulo: "Um único responsável",
    texto:
      "Nada de coordenar cinco fornecedores. Uma pessoa cuida do domínio, do site, do e-mail e do sistema — e resolve com você.",
  },
  {
    titulo: "Uma mensalidade cuida de tudo",
    texto:
      "Previsível e sem surpresa: hospedagem, manutenção, atualizações e suporte entram no mesmo valor todo mês.",
  },
  {
    titulo: "Cresce com o seu negócio",
    texto:
      "Começa simples e escala quando você precisar — do site à gestão completa — sem trocar de fornecedor no meio do caminho.",
  },
  {
    titulo: "Tecnologia invisível",
    texto:
      "Você compra resultado, não jargão. A parte complexa roda nos bastidores para o seu negócio simplesmente funcionar.",
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-base-100 py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Como funciona"
          title="Menos fornecedor, menos dor de cabeça"
          subtitle="O jeito ogis.cloud de tirar a tecnologia da sua lista de preocupações."
        />

        <ol className="relative mt-20 grid gap-x-20 gap-y-14 md:grid-cols-2 md:before:absolute md:before:inset-y-0 md:before:left-1/2 md:before:w-px md:before:bg-white/10">
          {PILARES.map((pilar, i) => (
            <Revelar as="li" key={pilar.titulo} atraso={i * 80} className={i % 2 === 1 ? "md:mt-20" : ""}>
              <span className="font-mono text-sm text-primary">0{i + 1}</span>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-base-content">{pilar.titulo}</h3>
              <p className="mt-3 max-w-[44ch] text-base-content/70">{pilar.texto}</p>
            </Revelar>
          ))}
        </ol>
      </div>
    </section>
  );
}
