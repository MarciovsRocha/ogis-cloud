import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import { BRAND, NAV, linkWhatsApp, linkEmail, MSG, ASSUNTO } from "../config.js";
import Wordmark from "./Wordmark.jsx";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark className="h-8" />
            <p className="mt-4 max-w-xs text-sm text-base-content/70">{BRAND.tagline}</p>
            <p className="mt-4 text-sm text-base-content/60">{BRAND.cidade}</p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h4 className="text-sm font-semibold text-base-content">Navegação</h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={`/${item.href}`}
                    className="text-sm text-base-content/70 transition-colors duration-200 hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="text-sm font-semibold text-base-content">Fale com a gente</h4>
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-base-300 pt-6 sm:flex-row">
          <p className="text-xs text-base-content/60">
            © {year} {BRAND.name} · {BRAND.cnpj}
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="/termos"
              className="text-xs text-base-content/60 transition-colors duration-200 hover:text-primary"
            >
              Termos de uso
            </Link>
            <Link
              to="/privacidade"
              className="text-xs text-base-content/60 transition-colors duration-200 hover:text-primary"
            >
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
