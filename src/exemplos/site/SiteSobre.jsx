import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { BRAND } from "../../config.js";
import SEO from "../../components/SEO.jsx";

const PRINCIPIOS = [
  {
    titulo: "Um responsável, não um fornecedor a mais",
    texto:
      "Você não deveria precisar saber de quem é a culpa quando o e-mail para de funcionar. Assumimos o conjunto: se está no ar, é problema nosso.",
  },
  {
    titulo: "O que é seu fica no seu nome",
    texto:
      "Domínio registrado no CNPJ da sua empresa, contas com as credenciais na sua mão. Você fica conosco por vontade, não por dependência.",
  },
  {
    titulo: "A tecnologia é invisível",
    texto:
      "Você não precisa entender de servidor, fila ou banco de dados. Precisa que funcione. A complexidade é problema nosso, não seu.",
  },
  {
    titulo: "Falar com quem desenvolve",
    texto:
      "Sem central de atendimento e sem protocolo. Quando você chama, fala com quem escreveu o código e pode resolver.",
  },
];

export default function SiteSobre() {
  return (
    <>
      <SEO
        title="Exemplar — Sobre"
        description="Página Sobre do exemplar de site institucional da ogis.cloud."
        path="/exemplos/site/sobre"
        noindex
      />

      <section id="sobre" className="bg-base-100 py-20 sm:py-28">
        <div className="mx-auto max-w-[62ch] px-5">
          <p className="text-sm font-bold text-primary">Quem somos</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-base-content sm:text-5xl">
            {BRAND.tagline}
          </h1>
          <div className="mt-10 flex flex-col gap-6 text-lg leading-relaxed text-base-content/80">
            <p>
              A ogis.cloud nasceu de uma constatação simples: pequenas e médias empresas não têm
              problema de tecnologia — têm problema de responsabilidade. Sobra fornecedor e falta
              alguém que responda pelo conjunto.
            </p>
            <p>
              Trabalhamos com empresas de {BRAND.cidade} e de todo o Brasil que já passaram por aquele
              ciclo: um site feito por alguém que sumiu, um e-mail configurado às pressas, um sistema
              que ninguém mais mantém. Nosso trabalho começa arrumando o que existe e continua
              garantindo que continue funcionando.
            </p>
          </div>
          <blockquote className="my-14 border-l-2 border-primary pl-6 text-2xl font-bold leading-snug tracking-[-0.02em] text-base-content">
            Não vendemos horas nem pacote fechado de prateleira.
          </blockquote>
          <p className="text-lg leading-relaxed text-base-content/80">
            Entendemos o processo, propomos o escopo por escrito e ficamos responsáveis pela
            sustentação depois que entra no ar.
          </p>
        </div>
      </section>

      <section id="principios" className="bg-base-200 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold tracking-[-0.035em] text-base-content sm:text-4xl">Como trabalhamos</h2>
          <ol className="mt-12 border-t border-base-300">
            {PRINCIPIOS.map((p, i) => (
              <li key={p.titulo} className="grid gap-3 border-b border-base-300 py-8 md:grid-cols-[4rem_1fr_1.4fr] md:gap-10">
                <span className="text-sm font-bold tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-bold tracking-[-0.02em] text-base-content">{p.titulo}</h3>
                <p className="text-base-content/75">{p.texto}</p>
              </li>
            ))}
          </ol>
          <Link to="/exemplos/site/contato" className="link-sereno mt-12 inline-flex items-center gap-1.5 text-lg font-bold text-primary">
            Conversar com a gente <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
