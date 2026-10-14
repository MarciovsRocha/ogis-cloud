import { FAQ } from "../conteudo.js";

// Lista de duas colunas, respostas sempre visíveis (sem acordeão).
export default function Faq() {
  return (
    <section id="faq" className="bg-base-200 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
          Perguntas que sempre aparecem
        </h2>
        <dl className="mt-14 border-b-2 border-base-content">
          {FAQ.map((item) => (
            <div key={item.pergunta} className="grid gap-4 border-t-2 border-base-content py-8 md:grid-cols-[1fr_1.2fr] md:gap-12">
              <dt className="text-2xl font-black uppercase leading-[0.95] tracking-[-0.03em]">{item.pergunta}</dt>
              <dd className="text-base leading-relaxed text-base-content/85">{item.resposta}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
