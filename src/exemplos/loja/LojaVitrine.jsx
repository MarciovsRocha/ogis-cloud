import { useSearchParams } from "react-router-dom";
import { Search, X, SearchX } from "lucide-react";
import { CATEGORIAS, filtrarCatalogo } from "../../data/catalogo.js";
import CardCatalogo from "../../components/CardCatalogo.jsx";
import SEO from "../../components/SEO.jsx";
import BotaoAdicionar from "./BotaoAdicionar.jsx";

const ORDENS = [
  { valor: "categoria", rotulo: "Por categoria" },
  { valor: "nome", rotulo: "Nome (A–Z)" },
];

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

  const chipBase =
    "cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200";

  return (
    <>
      <SEO
        title="Catálogo de Soluções"
        description="Todos os produtos e soluções da ogis.cloud: presença digital, sistemas, infraestrutura e serviços contínuos. Monte sua lista e peça um orçamento."
        path="/exemplos/loja"
      />

      <section id="vitrine" className="mx-auto max-w-6xl px-5 py-14">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-base-content sm:text-4xl">
            Tudo o que a ogis.cloud faz
          </h1>
          <p className="mt-4 text-base-content/70">
            Monte a sua lista, conte o que precisa e devolvemos um orçamento sob medida. Você não
            paga nada para pedir.
          </p>
        </div>

        {/* Busca */}
        <div className="relative mt-10">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-base-content/40" />
          <input
            type="search"
            value={termo}
            onChange={(e) => definir("q", e.target.value)}
            placeholder="Buscar por nome ou por problema que você quer resolver"
            aria-label="Buscar no catálogo"
            className="w-full rounded-xl border border-base-300 bg-base-100 py-3.5 pl-12 pr-4 text-sm text-base-content outline-none transition-colors duration-200 placeholder:text-base-content/40 focus:border-primary"
          />
        </div>

        {/* Filtro e ordenação */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => definir("categoria", "")}
            className={`${chipBase} ${
              !categoria
                ? "border-primary bg-primary/15 text-primary"
                : "border-base-300 text-base-content/70 hover:border-primary/40"
            }`}
          >
            Todas
          </button>

          {CATEGORIAS.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => definir("categoria", cat.slug)}
              className={`${chipBase} ${
                categoria === cat.slug
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-base-300 text-base-content/70 hover:border-primary/40"
              }`}
            >
              {cat.nome}
            </button>
          ))}

          <label className="ml-auto flex items-center gap-2 text-sm text-base-content/60">
            Ordenar
            <select
              value={ordem}
              onChange={(e) => definir("ordem", e.target.value)}
              className="cursor-pointer rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-content outline-none focus:border-primary"
            >
              {ORDENS.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-6 text-sm text-base-content/50">
          {itens.length} {itens.length === 1 ? "solução encontrada" : "soluções encontradas"}
        </p>

        {itens.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {itens.map((item) => (
              <CardCatalogo key={item.slug} item={item} para={`/exemplos/loja/p/${item.slug}`}>
                <BotaoAdicionar slug={item.slug} />
              </CardCatalogo>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-base-300 bg-base-100 py-20 text-center">
            <SearchX className="mx-auto h-10 w-10 text-base-content/30" />
            <h2 className="mt-5 text-lg font-semibold text-base-content">
              Nada encontrado com esses filtros
            </h2>
            <p className="mt-2 text-sm text-base-content/60">
              Tente outro termo — ou fale com a gente: o que você precisa pode não estar no catálogo.
            </p>
            {temFiltro && (
              <button
                type="button"
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-base-300 px-5 py-2.5 text-sm font-semibold text-base-content transition-colors duration-200 hover:border-primary/50"
              >
                <X className="h-4 w-4" />
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </section>
    </>
  );
}
