import { useParams, Link } from "react-router-dom";
import { Check, ArrowLeft, ArrowRight, Target } from "lucide-react";
import { buscarItem, buscarCategoria, relacionados } from "../../data/catalogo.js";
import { linkWhatsApp } from "../../config.js";
import SeloEscopo from "../../components/SeloEscopo.jsx";
import CardCatalogo from "../../components/CardCatalogo.jsx";
import NaoEncontrado from "../NaoEncontrado.jsx";
import SEO from "../../components/SEO.jsx";

export default function SiteSolucao() {
  const { slug } = useParams();
  const item = buscarItem(slug);

  if (!item) {
    return (
      <NaoEncontrado voltarPara="/exemplos/site/solucoes" rotulo="Ver todas as soluções" />
    );
  }

  const categoria = buscarCategoria(item.categoria);
  const outros = relacionados(item.slug);
  const Icone = item.icone;
  const mensagem = `Olá! Vim pelo site da ogis.cloud e quero saber mais sobre "${item.nome}".`;

  return (
    <>
      <SEO
        title={`Exemplar — ${item.nome}`}
        description={item.resumo}
        path={`/exemplos/site/solucoes/${item.slug}`}
        noindex
      />

      <article className="bg-base-100 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5">
          <Link
            to="/exemplos/site/solucoes"
            className="inline-flex items-center gap-2 text-sm text-base-content/60 transition-colors duration-200 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Todas as soluções
          </Link>

          <div className="mt-8 flex items-start gap-5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Icone className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                {categoria.nome}
              </p>
              <h1 className="mt-1 text-3xl font-bold text-base-content sm:text-4xl">{item.nome}</h1>
            </div>
          </div>

          <p className="mt-6 text-lg text-base-content/80">{item.resumo}</p>
          <SeloEscopo item={item} className="mt-5" />

          <p className="mt-8 leading-relaxed text-base-content/70">{item.descricao}</p>

          <h2 className="mt-12 text-xl font-semibold text-base-content">O que está incluso</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {item.entregaveis.map((e) => (
              <li key={e} className="flex items-start gap-3 text-base-content/80">
                <Check className="mt-1 h-4.5 w-4.5 shrink-0 text-success" />
                {e}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-base-300 bg-base-200 p-6">
            <Target className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <h2 className="font-semibold text-base-content">Ideal para</h2>
              <p className="mt-1 text-sm text-base-content/70">{item.idealPara}</p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-primary/30 bg-base-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-base-content">
              Quer saber se faz sentido para o seu negócio?
            </h2>
            <p className="mt-3 text-sm text-base-content/70">
              O orçamento é feito sob medida, depois de entender o seu caso.
            </p>
            <a
              href={linkWhatsApp(mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
            >
              Solicitar orçamento
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {outros.length > 0 && (
          <div className="mx-auto mt-20 max-w-6xl px-5">
            <h2 className="text-2xl font-bold text-base-content">Também em {categoria.nome}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {outros.map((outro) => (
                <CardCatalogo
                  key={outro.slug}
                  item={outro}
                  para={`/exemplos/site/solucoes/${outro.slug}`}
                />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
