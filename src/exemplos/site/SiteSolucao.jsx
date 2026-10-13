import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { buscarItem, buscarCategoria, relacionados } from "../../data/catalogo.js";
import { linkWhatsApp } from "../../config.js";
import SeloEscopo from "../../components/SeloEscopo.jsx";
import SEO from "../../components/SEO.jsx";
import NaoEncontrado from "../NaoEncontrado.jsx";
import ListaSolucoes from "./ListaSolucoes.jsx";

export default function SiteSolucao() {
  const { slug } = useParams();
  const item = buscarItem(slug);

  if (!item) {
    return <NaoEncontrado voltarPara="/exemplos/site/solucoes" rotulo="Ver todas as soluções" />;
  }

  const categoria = buscarCategoria(item.categoria);
  const outros = relacionados(item.slug);
  const mensagem = `Olá! Vim pelo site da ogis.cloud e quero saber mais sobre "${item.nome}".`;

  return (
    <>
      <SEO
        title={`Exemplar — ${item.nome}`}
        description={item.resumo}
        path={`/exemplos/site/solucoes/${item.slug}`}
        noindex
      />

      <article className="bg-base-100 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5">
          <Link to="/exemplos/site/solucoes" className="link-sereno inline-flex items-center gap-2 text-sm text-base-content/70">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Todas as soluções
          </Link>

          <p className="mt-10 text-sm font-bold text-primary">{categoria.nome}</p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-base-content sm:text-5xl">{item.nome}</h1>
          <p className="mt-6 text-xl text-base-content/80">{item.resumo}</p>
          <SeloEscopo item={item} className="mt-5" />
          <p className="mt-10 text-lg leading-relaxed text-base-content/75">{item.descricao}</p>

          <h2 className="mt-14 text-xl font-bold tracking-[-0.02em] text-base-content">O que está incluso</h2>
          <ol className="mt-5 border-t border-base-300">
            {item.entregaveis.map((e, i) => (
              <li key={e} className="flex gap-5 border-b border-base-300 py-4 text-base-content/85">
                <span className="w-6 shrink-0 text-sm font-bold tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
                {e}
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-2xl bg-accent p-7 text-accent-content">
            <h2 className="font-bold">Ideal para</h2>
            <p className="mt-2">{item.idealPara}</p>
          </div>

          <div className="mt-14 flex flex-col items-start gap-5 border-t border-base-300 pt-10">
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-base-content">
              Quer saber se faz sentido para o seu negócio?
            </h2>
            <p className="text-base-content/75">O orçamento é feito sob medida, depois de entender o seu caso.</p>
            <a
              href={linkWhatsApp(mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-neutral px-6 py-3 text-sm font-bold text-neutral-content transition-transform duration-300 ease-mola active:scale-[0.98]"
            >
              Solicitar orçamento
            </a>
          </div>
        </div>

        {outros.length > 0 && (
          <div className="mx-auto mt-24 max-w-6xl px-5">
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-base-content">Também em {categoria.nome}</h2>
            <div className="mt-8">
              <ListaSolucoes itens={outros} colunas={2} />
            </div>
          </div>
        )}
      </article>
    </>
  );
}
