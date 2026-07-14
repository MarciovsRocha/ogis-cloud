import { MessageCircle, Mail, MapPin } from "lucide-react";
import { BRAND, linkWhatsApp, linkEmail, MSG, ASSUNTO } from "../config.js";
import SectionHeading from "./SectionHeading.jsx";

export default function Contato() {
  const canais = [
    {
      icon: MessageCircle,
      titulo: "WhatsApp",
      texto: "Resposta rápida, direto com quem resolve.",
      acao: "Chamar no WhatsApp",
      href: linkWhatsApp(MSG.contato),
      external: true,
    },
    {
      icon: Mail,
      titulo: "E-mail",
      texto: BRAND.email,
      acao: "Enviar e-mail",
      href: linkEmail(ASSUNTO.contato, MSG.contato),
      external: false,
    },
  ];

  return (
    <section id="contato" className="bg-base-200 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Contato"
          title="Vamos conversar sobre o seu negócio"
          subtitle="Escolha o canal que preferir. Sem robô, sem call center."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {canais.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.titulo}
                className="flex flex-col items-start gap-4 rounded-2xl border border-base-300 bg-base-100 p-7"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-base-content">{c.titulo}</h3>
                  <p className="mt-1 text-sm text-base-content/70">{c.texto}</p>
                </div>
                <a
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className="mt-auto cursor-pointer rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {c.acao}
                </a>
              </div>
            );
          })}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-base-content/60">
          <MapPin className="h-4 w-4 text-accent" />
          Atendimento em {BRAND.cidade} e região
        </p>
      </div>
    </section>
  );
}
