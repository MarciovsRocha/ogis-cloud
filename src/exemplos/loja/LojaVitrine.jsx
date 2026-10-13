import { useSearchParams } from "react-router-dom";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { CATEGORIAS, filtrarCatalogo, itensPorCategoria } from "../../data/catalogo.js";
import SEO from "../../components/SEO.jsx";
import CartaoProduto from "./CartaoProduto.jsx";
import { corDaCategoria } from "./corCategoria.js";

const ORDENS = [
  { valor: "categoria", rotulo: "Por categoria" },
  { valor: "nome", rotulo: "Nome (A–Z)" },
];

// Bento das categorias: 1 grande, 2 menores e 1 largo.
const POSICAO = ["md:row-span-2 md:min-h-full", "", "", "md:col-span-2"];

export default function LojaVitrine() {
  const [params, setParams] = useSearchParams();

  const termo = params.get("q") ?? "";
  const categoria = params.get("categoria") ?? "";
  const ordem = params.get("ordem") ?? "categoria";

  // Mantém os filtros na URL: o link filtrado pode ser copiado e enviado.
  function definir(chave, valor) {
    const proximos = new URLSearchParams(params);
    if (valor) proximos.set(chave, valor);
    else proximos.delete(chave);
    setParams(proximos, { replace: true });
  }

  const itens = filtrarCatalogo({ termo, categoria, ordem });
  const temFiltro = Boolean(termo || categoria);
  const categoriaAtiva = CATEGORIAS.find((c) => c.slug === categoria);

  return (
    <>
      <SEO
        title="Catálogo de Soluções"
        description="Todos os produtos e soluções da ogis.cloud: presença digital, sistemas, infraestrutura e serviços contínuos. Monte sua lista e peça um orçamento."
        path="/exemplos/loja"
      />

      <section id="vitrine" className="mx-auto max-w-6xl px-5 py-14">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-base-content sm:text-5xl">
            Tudo o que a ogis.cloud faz
          </h1>
          <p className="mt-4 text-lg text-base-content/75">
            Monte a sua lista, conte o que precisa e devolvemos um orçamento sob medida. Você não paga
            nada para pedir.
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3 md:grid-rows-2">
          {CATEGORIAS.map((cat, i) => {
            const cor = corDaCategoria(cat.slug);
            const ativa = categoria === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                aria-pressed={ativa}
                onClick={() => definir("categoria", ativa ? "" : cat.slug)}
                className={`flex min-h-36 cursor-pointer flex-col justify-between rounded-[1.75rem] p-6 text-left transition-transform duration-500 ease-mola hover:-translate-y-1 active:scale-[0.98] ${cor.fundo} ${cor.texto} ${POSICAO[i]} ${
                  ativa ? "ring-4 ring-base-content ring-offset-4 ring-offset-base-100" : ""
                }`}
              >
                <span className={`font-extrabold tracking-[-0.03em] ${i === 0 ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
                  {cat.nome}
                </span>
                <span className="mt-6 flex items-end justify-between gap-4 text-sm">
                  <span className="max-w-[34ch] opacity-90">{cat.promessa}</span>
                  <span className="shrink-0 font-bold">{itensPorCategoria(cat.slug).length} itens</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <MagnifyingGlass
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/50"
              aria-hidden="true"
            />
            <input
              type="search"
              value={termo}
              onChange={(e) => definir("q", e.target.value)}
              placeholder="Buscar por nome ou pelo problema que você quer resolver"
              aria-label="Buscar no catálogo"
              className="w-full rounded-full bg-base-100 py-4 pl-13 pr-5 text-base text-base-content outline-none ring-1 ring-base-content/15 transition-shadow duration-300 ease-mola placeholder:text-base-content/50 focus:ring-2 focus:ring-base-content"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-bold text-base-content/80">
            Ordenar
            <select
              value={ordem}
              onChange={(e) => definir("ordem", e.target.value)}
              className="cursor-pointer rounded-full bg-base-100 px-4 py-3 text-sm text-base-content outline-none ring-1 ring-base-content/15 focus:ring-2 focus:ring-base-content"
            >
              {ORDENS.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <p className="text-base-content/70">
            {itens.length} {itens.length === 1 ? "solução encontrada" : "soluções encontradas"}
          </p>
          {categoriaAtiva && (
            <button
              type="button"
              onClick={() => definir("categoria", "")}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-base-200 px-3 py-1.5 font-bold text-base-content"
            >
              {categoriaAtiva.nome}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">remover filtro</span>
            </button>
          )}
        </div>

        {itens.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {itens.map((item) => (
              <CartaoProduto key={item.slug} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-start gap-4 rounded-[1.75rem] bg-base-200 p-10">
            <MagnifyingGlass weight="duotone" className="h-12 w-12 text-primary" aria-hidden="true" />
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-base-content">Nada encontrado com esses filtros</h2>
            <p className="max-w-[52ch] text-base-content/75">
              Tente outro termo — ou fale com a gente: o que você precisa pode não estar no catálogo.
            </p>
            {temFiltro && (
              <button
                type="button"
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-bold text-secondary-content transition-transform duration-300 ease-mola active:scale-[0.97]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </section>
    </>
  );
}
