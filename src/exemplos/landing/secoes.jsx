import { ArrowRight, Check, AlertTriangle, ShieldCheck, MessageCircle } from "lucide-react";
import { CATEGORIAS } from "../../data/catalogo.js";
import { linkWhatsApp, MSG } from "../../config.js";
import Wordmark from "../../components/Wordmark.jsx";
import { DORES, PASSOS, PROVAS, FAQ } from "./conteudo.js";

// Ação única de toda a página. Todo CTA aponta para cá.
export function BotaoDiagnostico({ children = "Agendar diagnóstico gratuito", grande = false }) {
  return (
    <a
      href={linkWhatsApp(MSG.diagnostico)}
      target="_blank"
      rel="noopener noreferrer"
      className={`glow-gold inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5 ${
        grande ? "px-7 py-4 text-base" : "px-5 py-3 text-sm"
      }`}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

export function CabecalhoLanding() {
  return (
    <header className="sticky top-11 z-40 border-b border-base-300 bg-base-100/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Wordmark className="h-7" />
        <BotaoDiagnostico>Falar agora</BotaoDiagnostico>
      </div>
    </header>
  );
}

export function HeroLanding() {
  return (
    <section id="topo" className="relative overflow-hidden bg-neutral text-neutral-content">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 65%)" }}
      />
      <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-20 text-center sm:pb-28 sm:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-neutral-content/15 bg-neutral-content/5 px-4 py-1.5 text-xs font-medium text-neutral-content/80">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Operação digital completa · um único responsável
        </span>

        <h1 className="mt-6 text-4xl font-bold leading-[1.1] sm:text-5xl md:text-6xl">
          Sua empresa inteira funcionando online, sob a responsabilidade de{" "}
          <span className="text-gradient-gold">uma pessoa só.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-content/70">
          Site, e-mail profissional, sistema de gestão e suporte. Em vez de quatro fornecedores que
          se culpam entre si, um número de telefone que resolve.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <BotaoDiagnostico grande />
          <a
            href="#pilares"
            className="cursor-pointer rounded-xl border border-neutral-content/20 px-6 py-4 text-base font-semibold text-neutral-content/80 transition-colors duration-200 hover:border-primary/50 hover:text-neutral-content"
          >
            Ver o que está incluso
          </a>
        </div>

        <p className="mt-6 text-sm text-neutral-content/50">
          Diagnóstico sem custo e sem compromisso · sem fidelidade
        </p>
      </div>
    </section>
  );
}

export function Problema() {
  return (
    <section id="problema" className="bg-base-200 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            O problema
          </span>
          <h2 className="mt-2 text-3xl font-bold text-base-content sm:text-4xl">
            Ninguém contrata quatro fornecedores por vontade própria
          </h2>
          <p className="mt-4 text-lg text-base-content/70">
            Acontece aos poucos, cada um resolvendo uma urgência. Até o dia em que dá problema e
            não há ninguém responsável pelo conjunto.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {DORES.map((dor) => (
            <div
              key={dor.titulo}
              className="flex gap-4 rounded-2xl border border-base-300 bg-base-100 p-6"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
              <div>
                <h3 className="font-semibold text-base-content">{dor.titulo}</h3>
                <p className="mt-2 text-sm text-base-content/70">{dor.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pilares() {
  return (
    <section id="pilares" className="bg-base-100 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            A solução
          </span>
          <h2 className="mt-2 text-3xl font-bold text-base-content sm:text-4xl">
            Quatro frentes, um responsável
          </h2>
          <p className="mt-4 text-lg text-base-content/70">
            Não é um serviço avulso: é a sua operação digital inteira, cuidada por quem responde
            pelo conjunto.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {CATEGORIAS.map((cat) => {
            const Icone = cat.icone;
            return (
              <div
                key={cat.slug}
                className="flex gap-5 rounded-2xl border border-base-300 bg-base-200 p-7"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-base-content">{cat.nome}</h3>
                  <p className="mt-2 text-sm text-base-content/70">{cat.promessa}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-base-content/60">
          Você não precisa de tudo no primeiro dia. Começamos pelo que dói mais.
        </p>
      </div>
    </section>
  );
}

export function Passos() {
  return (
    <section id="como-funciona" className="bg-base-200 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Como funciona
          </span>
          <h2 className="mt-2 text-3xl font-bold text-base-content sm:text-4xl">
            Do primeiro contato à sustentação
          </h2>
        </div>

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map((passo) => (
            <li
              key={passo.numero}
              className="rounded-2xl border border-base-300 bg-base-100 p-6"
            >
              <span className="font-display text-3xl font-bold text-primary/40">{passo.numero}</span>
              <h3 className="mt-3 font-semibold text-base-content">{passo.titulo}</h3>
              <p className="mt-2 text-sm text-base-content/70">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ResponsavelUnico() {
  const GARANTIAS = [
    "O domínio é registrado no CNPJ da sua empresa, sempre",
    "As contas de e-mail são suas, com as credenciais na sua mão",
    "Sem contrato de permanência e sem multa de cancelamento",
    "Se quiser sair, ajudamos na transferência para quem assumir",
  ];

  return (
    <section id="responsavel-unico" className="bg-base-100 py-20 sm:py-24">
      <div className="mx-auto grid max-w-5xl gap-12 px-5 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            A objeção honesta
          </span>
          <h2 className="mt-2 text-3xl font-bold text-base-content sm:text-4xl">
            &ldquo;Não é arriscado depender de um fornecedor só?&rdquo;
          </h2>
          <p className="mt-5 text-base-content/70">
            Seria, se depender significasse ficar sem acesso ao que é seu. É exatamente isso que
            acontece quando o domínio está no nome do fornecedor e ninguém sabe a senha do e-mail.
          </p>
          <p className="mt-4 text-base-content/70">
            Trabalhamos ao contrário: tudo o que é da sua empresa fica no nome da sua empresa.
            Você fica com um responsável — não com uma corda no pescoço.
          </p>
        </div>

        <ul className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-base-200 p-7">
          {GARANTIAS.map((g) => (
            <li key={g} className="flex items-start gap-3 text-sm text-base-content/80">
              <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-success" />
              {g}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Provas() {
  return (
    <section id="provas" className="bg-neutral py-16 text-neutral-content">
      <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:grid-cols-3">
        {PROVAS.map((prova) => (
          <div key={prova.rotulo} className="text-center">
            <span className="font-display text-4xl font-bold text-primary">{prova.numero}</span>
            <h3 className="mt-2 text-sm font-semibold uppercase tracking-wider text-neutral-content/80">
              {prova.rotulo}
            </h3>
            <p className="mt-2 text-sm text-neutral-content/60">{prova.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="bg-base-200 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="text-center text-3xl font-bold text-base-content sm:text-4xl">
          Perguntas que sempre aparecem
        </h2>

        <div className="mt-12 flex flex-col gap-3">
          {FAQ.map((item) => (
            <details
              key={item.pergunta}
              className="group rounded-2xl border border-base-300 bg-base-100 p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-base-content">
                {item.pergunta}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl leading-none text-primary transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-base-content/70">{item.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaFinal() {
  return (
    <section id="contato" className="bg-base-100 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <h2 className="text-3xl font-bold text-base-content sm:text-4xl">
          Comece pelo diagnóstico. É gratuito.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-base-content/70">
          Uma conversa de trinta minutos sobre como a sua empresa funciona hoje. Ao final você sabe
          o que vale mexer, o que vale manter e em que ordem — mesmo que não contrate nada.
        </p>

        <div className="mt-9 flex justify-center">
          <BotaoDiagnostico grande />
        </div>

        <p className="mt-6 inline-flex items-center gap-2 text-sm text-base-content/50">
          <MessageCircle className="h-4 w-4" />
          Resposta no mesmo dia útil
        </p>
      </div>
    </section>
  );
}

export function RodapeLanding() {
  return (
    <footer className="border-t border-base-300 bg-base-200 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 text-center">
        <Wordmark className="h-7" />
        <p className="text-xs text-base-content/50">
          Exemplar de landing page construído pela ogis.cloud · Curitiba/PR
        </p>
      </div>
    </footer>
  );
}
