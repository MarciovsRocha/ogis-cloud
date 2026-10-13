import { CATEGORIAS, itensPorCategoria } from "../../data/catalogo.js";
import SEO from "../../components/SEO.jsx";
import ListaSolucoes from "./ListaSolucoes.jsx";

export default function SiteSolucoes() {
  return (
    <>
      <SEO
        title="Exemplar — Soluções"
        description="Todas as soluções da ogis.cloud, agrupadas por frente de atuação."
        path="/exemplos/site/solucoes"
        noindex
      />

      <section id="solucoes" className="bg-base-100 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-[-0.035em] text-base-content sm:text-5xl">Soluções</h1>
            <p className="mt-6 text-lg text-base-content/75">
              Tudo o que fazemos, agrupado pelas quatro frentes que sustentam a operação digital de um
              negócio. Cada orçamento é feito sob medida.
            </p>
          </div>

          {CATEGORIAS.map((cat) => (
            <section key={cat.slug} id={`cat-${cat.slug}`} className="mt-20">
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-base-content">{cat.nome}</h2>
              <p className="mt-2 max-w-[56ch] text-lg text-base-content/70">{cat.promessa}</p>
              <div className="mt-8">
                <ListaSolucoes itens={itensPorCategoria(cat.slug)} colunas={2} />
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
