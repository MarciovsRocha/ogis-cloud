import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV, linkWhatsApp, MSG } from "../config.js";
import Wordmark from "./Wordmark.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border border-base-300 bg-base-100/80 px-4 py-2.5 shadow-sm backdrop-blur-md sm:px-5"
        aria-label="Principal"
      >
        <a href="#top" className="flex items-center gap-2" aria-label="ogis.cloud — início">
          <Wordmark className="h-7 w-auto" />
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm font-medium text-base-content/70 transition-colors duration-200 hover:text-base-content"
              >
                {item.label}
              </a>
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
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl text-base-content/70 transition-colors duration-200 hover:bg-base-200 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-base-300 bg-base-100/95 p-3 shadow-lg backdrop-blur-md md:hidden">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-base-content/80 transition-colors duration-200 hover:bg-base-200"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={linkWhatsApp(MSG.contato)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-1 block cursor-pointer rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-content"
          >
            Fale com a gente
          </a>
        </div>
      )}
    </header>
  );
}
