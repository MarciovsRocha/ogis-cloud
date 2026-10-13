import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Minus, Plus } from "@phosphor-icons/react";
import { buscarItem, buscarCategoria, relacionados } from "../../data/catalogo.js";
import SeloEscopo from "../../components/SeloEscopo.jsx";
import SEO from "../../components/SEO.jsx";
import NaoEncontrado from "../NaoEncontrado.jsx";
import BotaoAdicionar from "./BotaoAdicionar.jsx";
import CartaoProduto from "./CartaoProduto.jsx";
import { corDaCategoria } from "./corCategoria.js";

const BOTAO_QTD =
  "grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-base-200 text-base-content transition-transform duration-300 ease-mola active:scale-[0.95]";

export default function LojaProduto() {
  const { slug } = useParams();
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");

  const item = buscarItem(slug);
  if (!item) {
    return <NaoEncontrado voltarPara="/exemplos/loja" rotulo="Voltar à vitrine" />;
  }

  const categoria = buscarCategoria(item.categoria);
  const cor = corDaCategoria(item.categoria);
  const outros = relacionados(item.slug);
  const Icone = item.icone;

  return (
    <>
      <SEO title={item.nome} description={item.resumo} path={`/exemplos/loja/p/${item.slug}`} />

      <article className="mx-auto max-w-6xl px-5 pb-36 pt-10 lg:pb-20">
        <Link to="/exemplos/loja" className="inline-flex items-center gap-2 text-sm font-bold text-base-content/70 hover:text-base-content">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar à vitrine
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className={`grid aspect-square place-items-center rounded-[2rem] lg:sticky lg:top-32 ${cor.fundo} ${cor.texto}`}>
            <Icone weight="duotone" className="h-40 w-40" aria-hidden="true" />
          </div>

          <div>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${cor.fundo} ${cor.texto}`}>
              {categoria.nome}
            </span>
            <h1 className="mt-4 break-words text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-base-content sm:text-5xl">
              {item.nome}
            </h1>
            <p className="mt-5 text-xl text-base-content/80">{item.resumo}</p>
            <SeloEscopo item={item} className="mt-4" />
            <p className="mt-8 leading-relaxed text-base-content/80">{item.descricao}</p>

            <h2 className="mt-10 text-lg font-extrabold text-base-content">O que está incluso</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {item.entregaveis.map((e) => (
                <li key={e} className="flex items-start gap-3 text-base-content/85">
                  <Check weight="bold" className="mt-1 h-4 w-4 shrink-0 text-base-content" aria-hidden="true" />
                  {e}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-[1.5rem] bg-base-200 p-6">
              <h2 className="font-extrabold text-base-content">Ideal para</h2>
              <p className="mt-1 text-base-content/80">{item.idealPara}</p>
            </div>

            <div className="mt-10 rounded-[1.75rem] bg-base-100 p-6 ring-1 ring-base-content/10">
              <p className="text-sm text-base-content/75">
                Não publicamos preço porque cada caso é diferente. Monte a sua lista e devolvemos um
                orçamento sob medida.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="text-sm font-bold text-base-content">Quantidade</span>
                <button type="button" onClick={() => setQuantidade((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade" className={BOTAO_QTD}>
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="w-8 text-center text-lg font-extrabold tabular-nums text-base-content">{quantidade}</span>
                <button type="button" onClick={() => setQuantidade((q) => q + 1)} aria-label="Aumentar quantidade" className={BOTAO_QTD}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <label className="mt-5 flex flex-col gap-2">
                <span className="text-sm font-bold text-base-content">
                  Alguma observação? <span className="font-normal text-base-content/75">(opcional)</span>
                </span>
                <textarea
                  rows={3}
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Ex.: preciso migrar de outro fornecedor"
                  className="w-full resize-y break-words rounded-2xl bg-base-200 px-4 py-3 text-base text-base-content outline-none ring-1 ring-transparent placeholder:text-base-content/50 focus:ring-2 focus:ring-base-content"
                />
              </label>
              {/* No mobile o botão fica preso ao rodapé da tela. */}
              <div className="fixed inset-x-0 bottom-0 z-(--z-cabecalho) border-t border-base-300 bg-base-100/95 p-4 backdrop-blur-md lg:static lg:mt-6 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
                <BotaoAdicionar slug={item.slug} quantidade={quantidade} observacao={observacao} largo />
              </div>
            </div>
          </div>
        </div>

        {outros.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-base-content">Também em {categoria.nome}</h2>
            <div className="-mx-5 mt-6 flex snap-x gap-4 overflow-x-auto px-5 pb-4">
              {outros.map((outro) => (
                <CartaoProduto key={outro.slug} item={outro} className="w-72 shrink-0 snap-start" />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
