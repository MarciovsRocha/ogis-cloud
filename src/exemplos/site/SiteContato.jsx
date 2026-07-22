import { useState } from "react";
import { MessageCircle, Mail, MapPin, ArrowRight } from "lucide-react";
import { BRAND, linkWhatsApp, linkEmail, MSG, ASSUNTO } from "../../config.js";
import SEO from "../../components/SEO.jsx";

export default function SiteContato() {
  const [form, setForm] = useState({ nome: "", empresa: "", mensagem: "" });

  const alterar = (campo) => (evento) =>
    setForm((atual) => ({ ...atual, [campo]: evento.target.value }));

  const texto = [
    "Olá! Vim pelo site da ogis.cloud.",
    form.nome && `Nome: ${form.nome}`,
    form.empresa && `Empresa: ${form.empresa}`,
    form.mensagem && `Mensagem: ${form.mensagem}`,
  ]
    .filter(Boolean)
    .join("\n");

  const campo =
    "w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-sm text-base-content outline-none transition-colors duration-200 placeholder:text-base-content/40 focus:border-primary";

  return (
    <>
      <SEO
        title="Exemplar — Contato"
        description="Página de contato do exemplar de site institucional da ogis.cloud."
        path="/exemplos/site/contato"
        noindex
      />

      <section id="contato" className="bg-base-100 py-20 sm:py-28">
        <div className="mx-auto grid max-w-5xl gap-14 px-5 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold text-base-content sm:text-5xl">Fale com a gente</h1>
            <p className="mt-6 text-lg text-base-content/70">
              Conte o que está acontecendo hoje no seu negócio. Respondemos no mesmo dia útil.
            </p>

            <ul className="mt-10 flex flex-col gap-5">
              <li>
                <a
                  href={linkWhatsApp(MSG.contato)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-200 p-5 transition-colors duration-200 hover:border-primary/40"
                >
                  <MessageCircle className="h-5 w-5 shrink-0 text-primary" />
                  <span>
                    <span className="block font-semibold text-base-content">WhatsApp</span>
                    <span className="block text-sm text-base-content/60">
                      O canal mais rápido para falar conosco
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={linkEmail(ASSUNTO.contato, MSG.contato)}
                  className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-200 p-5 transition-colors duration-200 hover:border-primary/40"
                >
                  <Mail className="h-5 w-5 shrink-0 text-primary" />
                  <span>
                    <span className="block font-semibold text-base-content">E-mail</span>
                    <span className="block text-sm text-base-content/60">{BRAND.email}</span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-4 rounded-2xl border border-base-300 p-5">
                <MapPin className="h-5 w-5 shrink-0 text-accent" />
                <span>
                  <span className="block font-semibold text-base-content">Onde estamos</span>
                  <span className="block text-sm text-base-content/60">
                    {BRAND.cidade} · atendimento remoto para todo o Brasil
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-200 p-7"
          >
            <h2 className="text-lg font-semibold text-base-content">Prefere escrever?</h2>
            <p className="-mt-2 text-sm text-base-content/60">
              Preencha e continue a conversa no WhatsApp, com tudo já escrito.
            </p>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-base-content/80">Seu nome</span>
              <input
                type="text"
                value={form.nome}
                onChange={alterar("nome")}
                placeholder="Como podemos te chamar"
                className={campo}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-base-content/80">Empresa</span>
              <input
                type="text"
                value={form.empresa}
                onChange={alterar("empresa")}
                placeholder="Nome do seu negócio"
                className={campo}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-base-content/80">Mensagem</span>
              <textarea
                rows={4}
                value={form.mensagem}
                onChange={alterar("mensagem")}
                placeholder="O que está acontecendo hoje?"
                className={`${campo} resize-y`}
              />
            </label>

            <a
              href={linkWhatsApp(texto)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
            >
              Continuar no WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          </form>
        </div>
      </section>
    </>
  );
}
