import { useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { ArrowRight, List, X } from "@phosphor-icons/react";
import { BRAND, ASSUNTO, MSG, linkEmail, linkWhatsApp } from "../../config.js";
import Wordmark from "../../components/Wordmark.jsx";

const PAGINAS = [
  { para: "/exemplos/site", rotulo: "Início", exata: true },
  { para: "/exemplos/site/sobre", rotulo: "Sobre" },
  { para: "/exemplos/site/solucoes", rotulo: "Soluções" },
  { para: "/exemplos/site/contato", rotulo: "Contato" },
];

function classesLink({ isActive }) {
  return `link-sereno text-sm transition-colors duration-300 ease-mola ${
    isActive ? "font-bold text-base-content" : "text-base-content/70 hover:text-base-content"
  }`;
}

export function CabecalhoSite() {
  const painelRef = useRef(null);
  const abrir = () => painelRef.current?.showModal();
  const fechar = () => painelRef.current?.close();

  return (
    <header className="sticky top-11 z-(--z-cabecalho) border-b border-base-300 bg-base-100/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4" aria-label="Principal">
        <Link to="/exemplos/site" aria-label="Início">
          <Wordmark variante="mono" className="h-6 text-base-content" />
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {PAGINAS.map((p) => (
            <li key={p.para}>
              <NavLink to={p.para} end={p.exata} className={classesLink}>
                {p.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>

        <a
          href={linkWhatsApp(MSG.contato)}
          target="_blank"
          rel="noopener noreferrer"
          className="link-sereno hidden items-center gap-1.5 text-sm font-bold text-primary md:inline-flex"
        >
          Fale com a gente <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={abrir}
          aria-haspopup="dialog"
          aria-label="Abrir menu"
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-lg text-base-content md:hidden"
        >
          <List className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>

      {/* <dialog> modal: prende o foco, fecha com Esc e devolve o foco ao botão. */}
      <dialog
        ref={painelRef}
        aria-label="Menu"
        className="painel-site m-0 ml-auto h-dvh max-h-dvh w-[min(22rem,85vw)] max-w-none bg-base-100 p-6 text-base-content"
      >
        <div className="flex items-center justify-between">
          <Wordmark variante="mono" className="h-6" />
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar menu"
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-lg"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <ul className="mt-10 flex flex-col">
          {PAGINAS.map((p) => (
            <li key={p.para} className="border-b border-base-300">
              <NavLink
                to={p.para}
                end={p.exata}
                onClick={fechar}
                className={({ isActive }) =>
                  `block py-4 text-2xl tracking-[-0.02em] ${isActive ? "font-bold" : "font-medium text-base-content/75"}`
                }
              >
                {p.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>
      </dialog>
    </header>
  );
}

export function RodapeSite() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2">
        <div>
          <Wordmark variante="mono" className="h-6" />
          <p className="mt-4 max-w-xs text-sm text-base-content/70">{BRAND.tagline}</p>
          <p className="mt-6 text-sm text-base-content/70">
            {BRAND.cidade} · atendimento remoto para todo o Brasil
            <br />
            <a href={linkEmail(ASSUNTO.contato, MSG.contato)} className="link-sereno">
              {BRAND.email}
            </a>
          </p>
        </div>
        <nav aria-label="Mapa do site">
          <ul className="grid grid-cols-2 gap-3 text-sm">
            {PAGINAS.map((p) => (
              <li key={p.para}>
                <Link to={p.para} className="link-sereno text-base-content/75 hover:text-base-content">
                  {p.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl border-t border-base-300 px-5 py-6 text-xs text-base-content/70">
        © {ano} {BRAND.name} · Exemplar de site institucional construído pela ogis.cloud
      </p>
    </footer>
  );
}
