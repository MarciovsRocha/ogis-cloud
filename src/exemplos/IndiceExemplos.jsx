import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { EXEMPLARES } from "../data/exemplares.js";
import SEO from "../components/SEO.jsx";
import Wordmark from "../components/Wordmark.jsx";

export default function IndiceExemplos() {
  return (
    <>
      <SEO
        title="Exemplares"
        description="Três exemplares navegáveis feitos pela ogis.cloud: landing page, site institucional e e-commerce."
        path="/exemplos"
        noindex
      />

      <section id="exemplares" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Wordmark className="mx-auto h-8" />
          <h1 className="mt-8 text-3xl font-bold text-base-content sm:text-4xl">
            Veja funcionando antes de decidir
          </h1>
          <p className="mt-4 text-lg text-base-content/70">
            Três exemplares navegáveis, construídos por nós, com o conteúdo real da ogis.cloud.
            Clique, navegue e veja o que cada formato entrega.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {EXEMPLARES.map((ex) => {
            const Icone = ex.icone;
            return (
              <Link
                key={ex.para}
                to={ex.para}
                className="group flex flex-col rounded-2xl border border-base-300 bg-base-100 p-7 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icone className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-base-content">{ex.nome}</h2>
                <p className="mt-2 text-sm text-base-content/70">{ex.resumo}</p>
                <p className="mt-4 flex-1 text-sm text-base-content/50">{ex.detalhe}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Abrir exemplar
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mx-auto mt-14 max-w-xl text-center text-sm text-base-content/50">
          Nenhum dos exemplares mostra preço: cada orçamento é feito sob medida, depois de
          entender o seu negócio.
        </p>
      </section>
    </>
  );
}
