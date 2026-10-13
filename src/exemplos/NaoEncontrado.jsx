import { Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";

// 404 neutro: usa só tokens do tema, então herda o visual do exemplar em volta.
export default function NaoEncontrado({ voltarPara = "/exemplos", rotulo = "Ver os exemplares" }) {
  return (
    <section
      id="nao-encontrado"
      className="mx-auto flex min-h-[70dvh] max-w-2xl flex-col items-start justify-center px-5 py-28"
    >
      <p className="text-sm font-semibold text-base-content/70">Erro 404</p>
      <h1 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-base-content sm:text-5xl">
        Esta página não existe.
      </h1>
      <p className="mt-5 max-w-[50ch] text-base-content/70">
        O endereço que você abriu não existe neste exemplar. Ele pode ter mudado de nome.
      </p>
      <Link
        to={voltarPara}
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-content transition-transform duration-300 ease-mola active:scale-[0.98]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {rotulo}
      </Link>
    </section>
  );
}
