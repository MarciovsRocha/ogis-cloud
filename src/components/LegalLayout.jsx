import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "./SEO.jsx";

// Layout enxuto para páginas legais (Termos/Privacidade). Compensa a navbar fixa.
export default function LegalLayout({ title, description, path, atualizadoEm, children }) {
  return (
    <div className="bg-base-200">
      <SEO title={title} description={description} path={path} />
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-32">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-base-content/60 transition-colors duration-200 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-base-content sm:text-4xl">{title}</h1>
        {atualizadoEm && (
          <p className="mt-2 text-sm text-base-content/60">Última atualização: {atualizadoEm}</p>
        )}

        <div className="mt-8 flex flex-col gap-6 text-base-content/80 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-base-content [&_p]:leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
