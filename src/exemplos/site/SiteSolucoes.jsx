import { CATEGORIAS, itensPorCategoria } from "../../data/catalogo.js";
import CardCatalogo from "../../components/CardCatalogo.jsx";
import SEO from "../../components/SEO.jsx";

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
            <h1 className="text-4xl font-bold text-base-content sm:text-5xl">Soluções</h1>
            <p className="mt-6 text-lg text-base-content/70">
              Tudo o que fazemos, agrupado pelas quatro frentes que sustentam a operação digital de
              um negócio. Cada orçamento é feito sob medida.
            </p>
          </div>

          {CATEGORIAS.map((cat) => {
            const Icone = cat.icone;
            const itens = itensPorCategoria(cat.slug);
            return (
              <div key={cat.slug} className="mt-16">
                <div className="flex items-center gap-4 border-b border-base-300 pb-5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icone className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-base-content">{cat.nome}</h2>
                    <p className="text-sm text-base-content/60">{cat.promessa}</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {itens.map((item) => (
                    <CardCatalogo
                      key={item.slug}
                      item={item}
                      para={`/exemplos/site/solucoes/${item.slug}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
