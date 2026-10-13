import { ArrowUpRight, Envelope, WhatsappLogo } from "@phosphor-icons/react";
import { ASSUNTO, MSG, linkEmail, linkWhatsApp } from "../config.js";

const ESTILOS = {
  primario: {
    botao: "bg-primary text-primary-content",
    circulo: "bg-primary-content/10",
  },
  secundario: {
    botao:
      "bg-base-content/[0.04] text-base-content ring-1 ring-base-content/15 hover:bg-base-content/[0.08]",
    circulo: "bg-base-content/10",
  },
};

// Botão "ilha": pílula com o ícone de seta dentro de um círculo próprio.
export default function BotaoContato({
  canal = "whatsapp",
  mensagem = MSG.contato,
  assunto = ASSUNTO.contato,
  variante = "primario",
  className = "",
  children,
}) {
  const whatsapp = canal === "whatsapp";
  const Icone = whatsapp ? WhatsappLogo : Envelope;
  const estilo = ESTILOS[variante];

  return (
    <a
      href={whatsapp ? linkWhatsApp(mensagem) : linkEmail(assunto, mensagem)}
      {...(whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center justify-between gap-3 rounded-full py-2 pl-5 pr-2 text-sm font-semibold transition-all duration-500 ease-mola active:scale-[0.98] ${estilo.botao} ${className}`}
    >
      <span className="inline-flex items-center gap-2">
        <Icone className="h-4.5 w-4.5" aria-hidden="true" />
        {children ?? (whatsapp ? "Falar no WhatsApp" : "Falar por e-mail")}
      </span>
      <span
        aria-hidden="true"
        className={`grid h-8 w-8 place-items-center rounded-full transition-transform duration-500 ease-mola group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-105 ${estilo.circulo}`}
      >
        <ArrowUpRight weight="bold" className="h-4 w-4" />
      </span>
    </a>
  );
}
