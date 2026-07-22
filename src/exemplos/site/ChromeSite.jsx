import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Mail, MessageCircle, MapPin } from "lucide-react";
import { BRAND, linkWhatsApp, linkEmail, MSG, ASSUNTO } from "../../config.js";
import Wordmark from "../../components/Wordmark.jsx";

const PAGINAS = [
  { para: "/exemplos/site", rotulo: "Início", exata: true },
  { para: "/exemplos/site/sobre", rotulo: "Sobre" },
  { para: "/exemplos/site/solucoes", rotulo: "Soluções" },
  { para: "/exemplos/site/contato", rotulo: "Contato" },
];

function classesLink({ isActive }) {
  return `text-sm font-medium transition-colors duration-200 ${
    isActive ? "text-primary" : "text-base-content/70 hover:text-base-content"
  }`;
}

export function CabecalhoSite() {
  const [aberto, setAberto] = useState(false);

  return (
    <header className="sticky top-11 z-40 border-b border-base-300 bg-base-100/85 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5"
        aria-label="Principal"
      >
        <Link to="/exemplos/site" aria-label="Início">
          <Wordmark className="h-7" />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {PAGINAS.map((p) => (
            <li key={p.para}>
              <NavLink to={p.para} end={p.exata} className={classesLink}>
                {p.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <a
            href={linkWhatsApp(MSG.contato)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden cursor-pointer rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5 sm:inline-block"
          >
            Fale com a gente
          </a>
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl text-base-content/70 transition-colors duration-200 hover:bg-base-200 md:hidden"
          >
            {aberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {aberto && (
        <ul className="flex flex-col border-t border-base-300 px-3 py-2 md:hidden">
          {PAGINAS.map((p) => (
            <li key={p.para}>
              <NavLink
                to={p.para}
                end={p.exata}
                onClick={() => setAberto(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-base-content/80 transition-colors duration-200 hover:bg-base-200"
              >
                {p.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

export function RodapeSite() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark className="h-8" />
            <p className="mt-4 max-w-xs text-sm text-base-content/70">{BRAND.tagline}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-base-content/60">
              <MapPin className="h-4 w-4" />
              {BRAND.cidade}
            </p>
          </div>

          <nav aria-label="Mapa do site">
            <h2 className="text-sm font-semibold text-base-content">Mapa do site</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {PAGINAS.map((p) => (
                <li key={p.para}>
                  <Link
                    to={p.para}
                    className="text-sm text-base-content/70 transition-colors duration-200 hover:text-primary"
                  >
                    {p.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-base-content">Fale com a gente</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a
                  href={linkWhatsApp(MSG.contato)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-base-content/70 transition-colors duration-200 hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={linkEmail(ASSUNTO.contato, MSG.contato)}
                  className="inline-flex items-center gap-2 text-sm text-base-content/70 transition-colors duration-200 hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                  {BRAND.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-base-300 pt-6 text-xs text-base-content/50">
          © {ano} {BRAND.name} · Exemplar de site institucional construído pela ogis.cloud
        </p>
      </div>
    </footer>
  );
}
