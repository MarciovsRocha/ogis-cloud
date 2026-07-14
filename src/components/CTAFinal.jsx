import { MessageCircle, Mail, Rocket } from "lucide-react";
import { linkWhatsApp, linkEmail, MSG, ASSUNTO } from "../config.js";

const GANHOS = [
  "Um único responsável pelo seu digital",
  "Proposta clara, com preço e prazo combinados",
  "Site, e-mail e sistema sob o mesmo teto",
];

export default function CTAFinal() {
  return (
    <section className="bg-base-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="relative overflow-hidden rounded-3xl bg-neutral px-6 py-14 text-neutral-content sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 65%)" }}
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-content/15 bg-neutral-content/5 px-4 py-1.5 text-xs font-medium text-neutral-content/80">
                <Rocket className="h-3.5 w-3.5 text-primary" />
                Vamos começar
              </span>
              <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
                Pronto para colocar seu negócio no digital?
              </h2>
              <p className="mt-4 text-neutral-content/70">
                Fale com a gente e receba uma proposta sob medida para o seu negócio — sem
                compromisso e em linguagem que você entende.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={linkWhatsApp(MSG.contato)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-gold inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-5 w-5" />
                  Falar no WhatsApp
                </a>
                <a
                  href={linkEmail(ASSUNTO.contato, MSG.contato)}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-content/20 px-6 py-3.5 text-base font-semibold transition-colors duration-200 hover:bg-neutral-content/10"
                >
                  <Mail className="h-5 w-5" />
                  Falar por e-mail
                </a>
              </div>
            </div>

            <ul className="flex flex-col gap-4 rounded-2xl border border-neutral-content/10 bg-neutral-content/5 p-6">
              <li className="text-sm font-semibold uppercase tracking-wider text-primary">
                O que você ganha
              </li>
              {GANHOS.map((g) => (
                <li key={g} className="flex items-start gap-3 text-neutral-content/85">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
