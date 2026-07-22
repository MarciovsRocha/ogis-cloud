import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
        <div className="mx-auto max-w-3xl px-5">
          <h1 className="text-4xl font-bold text-base-content sm:text-5xl">Quem somos</h1>
          <p className="mt-6 text-lg text-base-content/70">{BRAND.tagline}</p>
          <div className="mt-8 flex flex-col gap-5 text-base-content/70">
            <p>
              A ogis.cloud nasceu de uma constatação simples: pequenas e médias empresas não têm
              problema de tecnologia — têm problema de responsabilidade. Sobra fornecedor e falta
              alguém que responda pelo conjunto.
            </p>
            <p>
              Trabalhamos com empresas de {BRAND.cidade} e de todo o Brasil que já passaram por
              aquele ciclo: um site feito por alguém que sumiu, um e-mail configurado às pressas, um
              sistema que ninguém mais mantém. Nosso trabalho começa arrumando o que existe e
              continua garantindo que continue funcionando.
            </p>
            <p>
              Não vendemos horas nem pacote fechado de prateleira. Entendemos o processo, propomos o
              escopo por escrito e ficamos responsáveis pela sustentação depois que entra no ar.
            </p>
          </div>
        </div>
      </section>

      <section id="principios" className="bg-base-200 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-3xl font-bold text-base-content sm:text-4xl">Como trabalhamos</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {PRINCIPIOS.map((p) => (
              <div key={p.titulo} className="rounded-2xl border border-base-300 bg-base-100 p-7">
                <h3 className="text-lg font-semibold text-base-content">{p.titulo}</h3>
                <p className="mt-3 text-sm text-base-content/70">{p.texto}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/exemplos/site/contato"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
            >
              Conversar com a gente
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
