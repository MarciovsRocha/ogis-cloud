import { ArrowUpRight } from "@phosphor-icons/react";
import { linkWhatsApp, MSG } from "../../../config.js";

// A ação única da página: todo CTA leva ao diagnóstico no WhatsApp.
export default function BotaoDiagnostico({ children = "Agendar diagnóstico gratuito", sobreCobalto = false, grande = false }) {
  const cores = sobreCobalto ? "bg-base-100 text-primary" : "bg-primary text-primary-content";
  const circulo = sobreCobalto ? "bg-primary text-primary-content" : "bg-base-100 text-primary";

  return (
    <a
      href={linkWhatsApp(MSG.diagnostico)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-4 rounded-full font-extrabold uppercase tracking-tight transition-transform duration-500 ease-mola active:scale-[0.98] ${
        grande ? "py-2.5 pl-7 pr-2.5 text-base" : "py-1.5 pl-4 pr-1.5 text-xs"
      } ${cores}`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`grid place-items-center rounded-full transition-transform duration-500 ease-mola group-hover:-translate-y-0.5 group-hover:translate-x-1 ${
          grande ? "h-11 w-11" : "h-7 w-7"
        } ${circulo}`}
      >
        <ArrowUpRight weight="bold" className={grande ? "h-5 w-5" : "h-3.5 w-3.5"} />
      </span>
    </a>
  );
}
