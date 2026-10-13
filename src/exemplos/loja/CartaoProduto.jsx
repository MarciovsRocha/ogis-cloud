import { Link } from "react-router-dom";
import SeloEscopo from "../../components/SeloEscopo.jsx";
import BotaoAdicionar from "./BotaoAdicionar.jsx";
import { corDaCategoria } from "./corCategoria.js";

// A "capa" na cor da categoria, com o ícone grande, ocupa o lugar da foto.
export default function CartaoProduto({ item, className = "" }) {
  const cor = corDaCategoria(item.categoria);
  const Icone = item.icone;

  return (
    <article
      className={`group flex flex-col rounded-[1.75rem] bg-base-100 p-2 ring-1 ring-base-content/10 transition-transform duration-500 ease-mola hover:-translate-y-0.5 ${className}`}
    >
      <Link to={`/exemplos/loja/p/${item.slug}`} className="block rounded-[1.4rem]">
        <div className={`grid aspect-[4/3] place-items-center overflow-hidden rounded-[1.4rem] ${cor.fundo} ${cor.texto}`}>
          <Icone
            weight="duotone"
            aria-hidden="true"
            className="h-20 w-20 transition-transform duration-700 ease-mola group-hover:-rotate-6 group-hover:scale-110"
          />
        </div>
        <div className="px-3 pt-4">
          <h3 className="break-words text-lg font-extrabold tracking-[-0.02em] text-base-content">{item.nome}</h3>
          <p className="mt-1 text-sm text-base-content/75">{item.resumo}</p>
        </div>
      </Link>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 px-3 pb-2 pt-5">
        <SeloEscopo item={item} />
        <BotaoAdicionar slug={item.slug} />
      </div>
    </article>
  );
}
