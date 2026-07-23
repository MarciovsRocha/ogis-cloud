import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Check, ArrowLeft, Target, Minus, Plus } from "lucide-react";
import { buscarItem, buscarCategoria, relacionados } from "../../data/catalogo.js";
import SeloEscopo from "../../components/SeloEscopo.jsx";
import CardCatalogo from "../../components/CardCatalogo.jsx";
import SEO from "../../components/SEO.jsx";
import NaoEncontrado from "../NaoEncontrado.jsx";
import BotaoAdicionar from "./BotaoAdicionar.jsx";

export default function LojaProduto() {
  const { slug } = useParams();
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");

  const item = buscarItem(slug);
  if (!item) {
    return <NaoEncontrado voltarPara="/exemplos/loja" rotulo="Voltar à vitrine" />;
  }

  const categoria = buscarCategoria(item.categoria);
  const outros = relacionados(item.slug);
  const Icone = item.icone;

  return (
    <>
      <SEO
        title={item.nome}
        description={item.resumo}
        path={`/exemplos/loja/p/${item.slug}`}
      />

      <article className="mx-auto max-w-6xl px-5 py-14">
        <Link
          to="/exemplos/loja"
          className="inline-flex items-center gap-2 text-sm text-base-content/60 transition-colors duration-200 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar à vitrine
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* Conteúdo */}
          <div>
            <div className="flex items-start gap-5">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Icone className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                  {categoria.nome}
                </p>
                <h1 className="mt-1 text-3xl font-bold text-base-content">{item.nome}</h1>
              </div>
            </div>

            {item.badge && (
              <span className="mt-5 inline-block rounded-full bg-base-300 px-3 py-1 text-xs font-medium text-base-content/70">
                {item.badge}
              </span>
            )}

            <p className="mt-6 text-lg text-base-content/80">{item.resumo}</p>
            <p className="mt-6 leading-relaxed text-base-content/70">{item.descricao}</p>

            <h2 className="mt-10 text-xl font-semibold text-base-content">O que está incluso</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {item.entregaveis.map((e) => (
                <li key={e} className="flex items-start gap-3 text-base-content/80">
                  <Check className="mt-1 h-4.5 w-4.5 shrink-0 text-success" />
                  {e}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-base-300 bg-base-100 p-6">
              <Target className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <h2 className="font-semibold text-base-content">Ideal para</h2>
                <p className="mt-1 text-sm text-base-content/70">{item.idealPara}</p>
              </div>
            </div>
          </div>

          {/* Caixa de ação */}
          <aside className="rounded-2xl border border-base-300 bg-base-100 p-7 lg:sticky lg:top-32">
            <SeloEscopo item={item} />

            <p className="mt-5 text-sm text-base-content/60">
              Não publicamos preço porque cada caso é diferente. Monte a sua lista e devolvemos um
              orçamento sob medida.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <span className="text-sm font-medium text-base-content/80">Quantidade</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                  aria-label="Diminuir quantidade"
                  className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-base-300 text-base-content transition-colors duration-200 hover:border-primary/50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-display text-lg font-semibold text-base-content">
                  {quantidade}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantidade((q) => q + 1)}
                  aria-label="Aumentar quantidade"
                  className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-base-300 text-base-content transition-colors duration-200 hover:border-primary/50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <label className="mt-5 flex flex-col gap-2">
              <span className="text-sm font-medium text-base-content/80">
                Alguma observação? <span className="text-base-content/40">(opcional)</span>
              </span>
              <textarea
                rows={3}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex.: preciso migrar de outro fornecedor"
                className="w-full resize-y rounded-xl border border-base-300 bg-base-200 px-4 py-3 text-sm text-base-content outline-none transition-colors duration-200 placeholder:text-base-content/40 focus:border-primary"
              />
            </label>

            <div className="mt-6">
              <BotaoAdicionar
                slug={item.slug}
                quantidade={quantidade}
                observacao={observacao}
                largo
              />
            </div>
          </aside>
        </div>

        {outros.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-base-content">Também em {categoria.nome}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {outros.map((outro) => (
                <CardCatalogo key={outro.slug} item={outro} para={`/exemplos/loja/p/${outro.slug}`}>
                  <BotaoAdicionar slug={outro.slug} />
                </CardCatalogo>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
