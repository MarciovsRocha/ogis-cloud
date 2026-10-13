import { useEffect, useRef, useState } from "react";
import { NAV } from "../../config.js";
import Wordmark from "../Wordmark.jsx";
import BotaoContato from "../BotaoContato.jsx";

// Navbar "ilha": pílula de vidro solta do topo. No mobile, o hambúrguer vira X e
// abre uma camada de tela cheia com os links entrando em cascata.
export default function Navbar() {
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef(null);

  useEffect(() => {
    if (!aberto) return undefined;

    function aoTeclar(evento) {
      if (evento.key === "Escape") {
        setAberto(false);
        botaoRef.current?.focus();
      }
    }

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  return (
    <header className="fixed inset-x-0 top-0 z-(--z-cabecalho) px-4 pt-4">
      {/* Camada do menu mobile — vem antes da nav no DOM para ficar por baixo dela. */}
      <div
        id="menu-movel"
        inert={!aberto}
        className={`fixed inset-0 bg-base-200/95 px-6 pt-28 backdrop-blur-2xl transition-opacity duration-500 ease-mola md:hidden ${
          aberto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-2">
          {NAV.map((item, i) => (
            <li
              key={item.href}
              style={{ transitionDelay: aberto ? `${100 + i * 50}ms` : "0ms" }}
              className={`transition-all duration-700 ease-mola ${
                aberto ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <a
                href={`/${item.href}`}
                onClick={() => setAberto(false)}
                className="block py-3 text-3xl font-semibold tracking-[-0.03em] text-base-content"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <BotaoContato className="mt-10 w-full">Fale com a gente</BotaoContato>
      </div>

      <nav
        aria-label="Principal"
        className="relative mx-auto flex w-full max-w-5xl items-center justify-between gap-6 rounded-full bg-base-100/70 py-2 pl-5 pr-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/10 backdrop-blur-xl"
      >
        <a href="/#top" aria-label="ogis.cloud — início">
          <Wordmark className="h-6" />
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={`/${item.href}`}
                className="text-sm text-base-content/65 transition-colors duration-300 ease-mola hover:text-base-content"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* A visibilidade fica no wrapper: o inline-flex do botão venceria o "hidden". */}
          <span className="hidden sm:contents">
            <BotaoContato>Fale com a gente</BotaoContato>
          </span>
          <button
            ref={botaoRef}
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
            aria-controls="menu-movel"
            className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-full ring-1 ring-white/10 md:hidden"
          >
            <span
              aria-hidden="true"
              className={`absolute h-px w-4 bg-base-content transition-transform duration-500 ease-mola ${
                aberto ? "rotate-45" : "-translate-y-1"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-px w-4 bg-base-content transition-transform duration-500 ease-mola ${
                aberto ? "-rotate-45" : "translate-y-1"
              }`}
            />
          </button>
        </div>
      </nav>
    </header>
  );
}
