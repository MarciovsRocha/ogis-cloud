import { Children } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import SEO from "./SEO.jsx";
import Secao from "./Secao.jsx";
import { slugTitulo } from "../lib/slug.js";

// Páginas legais: coluna de leitura de ~68ch e índice lateral fixo (≥ lg),
// montado a partir dos filhos <Secao titulo="…">.
export default function LegalLayout({ title, description, path, atualizadoEm, children }) {
  const indice = Children.toArray(children)
    .filter((filho) => filho.type === Secao)
    .map((filho) => ({ id: slugTitulo(filho.props.titulo), titulo: filho.props.titulo }));

  return (
    <div className="bg-base-200">
      <SEO title={title} description={description} path={path} />
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-36 lg:grid lg:grid-cols-[14rem_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <nav aria-label="Nesta página" className="sticky top-32">
            <p className="font-mono text-xs text-base-content/60">nesta página</p>
            <ol className="mt-4 flex flex-col gap-2.5 border-l border-white/10">
              {indice.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px block border-l border-transparent pl-4 text-sm text-base-content/65 transition-colors duration-300 ease-mola hover:border-primary hover:text-base-content"
                  >
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="max-w-[68ch]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-base-content/65 transition-colors duration-300 ease-mola hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            voltar ao início
          </Link>
          <h1 className="mt-8 text-4xl font-semibold tracking-[-0.04em] text-base-content sm:text-5xl">{title}</h1>
          {atualizadoEm && (
            <p className="mt-3 font-mono text-xs text-base-content/60">
              última atualização · {atualizadoEm.toLowerCase()}
            </p>
          )}
          <div className="mt-10 flex flex-col gap-8 leading-relaxed text-base-content/75">{children}</div>
        </article>
      </div>
    </div>
  );
}
