import { Link } from "react-router-dom";
import { ASSUNTO, BRAND, MSG, linkEmail } from "../../config.js";
import Wordmark from "../Wordmark.jsx";

const LINK = "transition-colors duration-300 ease-mola hover:text-base-content";

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-base-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 md:flex-row md:items-end md:justify-between">
        <div>
          <Wordmark className="h-6" />
          <p className="mt-4 max-w-xs text-sm text-base-content/65">{BRAND.tagline}</p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-base-content/65">
            <li>
              <Link to="/exemplos" className={LINK}>
                Exemplos
              </Link>
            </li>
            <li>
              <Link to="/termos" className={LINK}>
                Termos de uso
              </Link>
            </li>
            <li>
              <Link to="/privacidade" className={LINK}>
                Privacidade
              </Link>
            </li>
            <li>
              <a href={linkEmail(ASSUNTO.contato, MSG.contato)} className={LINK}>
                {BRAND.email}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-10">
        <p className="font-mono text-xs text-base-content/60">
          © {ano} {BRAND.name} · {BRAND.cnpj} · {BRAND.cidade}
        </p>
      </div>
    </footer>
  );
}
