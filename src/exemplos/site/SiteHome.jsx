import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { CATEGORIAS, CATALOGO } from "../../data/catalogo.js";
import { linkWhatsApp, MSG } from "../../config.js";
import SEO from "../../components/SEO.jsx";
import ListaSolucoes from "./ListaSolucoes.jsx";

const DIFERENCIAIS = [
  "Um único responsável, do domínio ao suporte",
  "Domínio e contas sempre no nome da sua empresa",
  "Monitoramento 24/7 com alerta automático",
  "Sem fidelidade e sem multa de cancelamento",
];

// Bento plano: tamanhos diferentes, sem sombra e sem borda — só tom de fundo.
const BENTO = ["col-span-2 bg-accent min-h-40", "bg-base-200 min-h-36", "bg-base-200 min-h-36", "col-span-2 bg-base-200 min-h-28"];

export default function SiteHome() {
  const destaques = CATALOGO.filter((item) => item.destaque);

  return (
    <>
      <SEO
        title="Exemplar — Site Institucional"
        description="Exemplar de site institucional construído pela ogis.cloud."
        path="/exemplos/site"
        noindex
      />

      <section id="topo" className="bg-base-100">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-20 sm:py-28 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-base-content sm:text-6xl">
              Tecnologia que funciona, sem você precisar entender dela.
            </h1>
            <p className="mt-7 max-w-[54ch] text-lg leading-relaxed text-base-content/75">
              Somos a empresa que cuida da parte digital do seu negócio: site, e-mail profissional,
              sistemas sob medida e a sustentação de tudo isso. Você fala com uma pessoa só.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link to="/exemplos/site/solucoes" className="link-sereno inline-flex items-center gap-1.5 font-bold text-base-content">
                Conhecer as soluções <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={linkWhatsApp(MSG.contato)}
                target="_blank"
                rel="noopener noreferrer"
                className="link-sereno font-bold text-primary"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {CATEGORIAS.map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/exemplos/site/solucoes#cat-${cat.slug}`}
                className={`group flex flex-col justify-between rounded-2xl p-5 transition-colors duration-500 ease-mola hover:bg-base-300 ${BENTO[i]}`}
              >
                <span className="text-lg font-bold tracking-[-0.02em] text-base-content">{cat.nome}</span>
                <span className="mt-6 text-sm text-base-content/70">{cat.promessa}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="diferenciais" className="bg-base-200 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="max-w-2xl text-3xl font-bold tracking-[-0.035em] text-base-content sm:text-4xl">
            Por que trabalhar com a gente
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg text-base-content/75">
            A maior parte dos problemas que encontramos não é falta de tecnologia — é falta de alguém
            responsável. Nosso trabalho é ser esse alguém.
          </p>
          <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {DIFERENCIAIS.map((d, i) => (
              <li key={d}>
                <span className="text-sm font-bold tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 font-medium text-base-content">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="destaques" className="bg-base-100 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-3xl font-bold tracking-[-0.035em] text-base-content sm:text-4xl">
              O que mais nos procuram
            </h2>
            <Link to="/exemplos/site/solucoes" className="link-sereno inline-flex items-center gap-1.5 font-bold text-primary">
              Ver todas as soluções <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-10">
            <ListaSolucoes itens={destaques} colunas={2} />
          </div>
        </div>
      </section>

      <section id="chamada" className="bg-base-200 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="max-w-3xl text-2xl font-bold leading-snug tracking-[-0.03em] text-base-content sm:text-3xl">
            Conte o que está acontecendo hoje no seu negócio.{" "}
            <Link to="/exemplos/site/contato" className="link-sereno text-primary">
              Respondemos no mesmo dia útil.
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
