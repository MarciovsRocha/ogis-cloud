import { EXEMPLARES } from "../data/exemplares.js";
import SEO from "../components/SEO.jsx";
import Tema from "../components/Tema.jsx";
import Wordmark from "../components/Wordmark.jsx";
import Revelar from "../components/Revelar.jsx";
import CartaoExemplar from "../components/home/CartaoExemplar.jsx";

export default function IndiceExemplos() {
  return (
    <Tema superficie="indice">
      <SEO
        title="Exemplares"
        description="Três exemplares navegáveis feitos pela ogis.cloud: landing page, site institucional e e-commerce."
        path="/exemplos"
        noindex
      />

      <main id="conteudo">
        <section id="exemplares" className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <div className="max-w-2xl">
            <Wordmark className="h-7" />
            <h1 className="mt-10 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-base-content sm:text-6xl">
              Veja funcionando antes de decidir
            </h1>
            <p className="mt-6 max-w-[56ch] text-lg text-base-content/70">
              Três exemplares navegáveis, construídos por nós, com o conteúdo real da ogis.cloud.
              Clique, navegue e veja o que cada formato entrega.
            </p>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {EXEMPLARES.map((exemplar, i) => (
              <Revelar key={exemplar.para} atraso={i * 90}>
                <CartaoExemplar exemplar={exemplar} mostrarDetalhe />
              </Revelar>
            ))}
          </div>

          <p className="mt-16 max-w-xl font-mono text-xs text-base-content/60">
            nenhum dos exemplares mostra preço: cada orçamento é feito sob medida, depois de entender o
            seu negócio.
          </p>
        </section>
      </main>
    </Tema>
  );
}
