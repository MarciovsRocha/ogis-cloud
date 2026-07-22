import { Link } from "react-router-dom";
import { SearchX, ArrowLeft } from "lucide-react";

export default function NaoEncontrado({ voltarPara = "/exemplos", rotulo = "Ver os exemplares" }) {
  return (
    <section id="nao-encontrado" className="mx-auto max-w-2xl px-5 py-28 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-base-300 text-base-content/50">
        <SearchX className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-base-content">Página não encontrada</h1>
      <p className="mt-4 text-base-content/70">
        O endereço que você abriu não existe neste exemplar. Ele pode ter mudado de nome.
      </p>
      <Link
        to={voltarPara}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
      >
        <ArrowLeft className="h-4 w-4" />
        {rotulo}
      </Link>
    </section>
  );
}
