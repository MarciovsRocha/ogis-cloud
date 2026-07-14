import { Mail, ArrowRight, MapPin } from "lucide-react";
import { linkWhatsApp, linkEmail, MSG, ASSUNTO } from "../config.js";

const TRUST = ["Sem fidelidade", "Domínio sempre no seu nome", "Tudo em um só lugar"];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-neutral text-neutral-content">
      {/* Brilho dourado decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 65%)" }}
      />
      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-32 sm:pb-28 sm:pt-40">
        <div className="mx-auto max-w-3xl text-center animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-content/15 bg-neutral-content/5 px-4 py-1.5 text-xs font-medium text-neutral-content/80">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Holding de tecnologia · Curitiba/PR
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] sm:text-5xl md:text-6xl">
            Sua presença digital e seus sistemas funcionando, com um{" "}
            <span className="text-gradient-gold">único responsável.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-content/70">
            Do domínio ao sistema de gestão, uma mensalidade cuida de tudo. Você fala com uma pessoa
            só — e a tecnologia trabalha por trás, invisível.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={linkWhatsApp(MSG.contato)}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-gold inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
            >
              Falar no WhatsApp
              <ArrowRight className="h-4.5 w-4.5" />
            </a>
            <a
              href={linkEmail(ASSUNTO.contato, MSG.contato)}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-content/20 px-6 py-3.5 text-base font-semibold text-neutral-content transition-colors duration-200 hover:bg-neutral-content/10 sm:w-auto"
            >
              <Mail className="h-5 w-5" />
              Falar por e-mail
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-content/60">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
