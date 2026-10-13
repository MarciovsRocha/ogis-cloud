import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { BRAND, ASSUNTO, MSG, linkEmail, linkWhatsApp } from "../../config.js";
import SEO from "../../components/SEO.jsx";
import { abrirExterno } from "../../lib/abrirExterno.js";
import { validarContato, textoContato } from "./validacaoContato.js";

const CAMPOS = ["nome", "empresa", "mensagem"];

const CLASSE_CAMPO =
  "w-full rounded-xl bg-base-200 px-4 py-3 text-base text-base-content outline-none ring-1 ring-transparent transition-shadow duration-300 ease-mola placeholder:text-base-content/50 focus:ring-primary aria-[invalid=true]:ring-error";

export default function SiteContato() {
  const [form, setForm] = useState({ nome: "", empresa: "", mensagem: "" });
  const [erros, setErros] = useState({});

  function alterar(campo) {
    return (evento) => {
      setForm((atual) => ({ ...atual, [campo]: evento.target.value }));
      if (erros[campo]) {
        setErros((atual) => {
          const proximo = { ...atual };
          delete proximo[campo];
          return proximo;
        });
      }
    };
  }

  function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarContato(form);
    setErros(encontrados);
    const primeiro = CAMPOS.find((campo) => encontrados[campo]);
    if (primeiro) {
      document.getElementById(`contato-${primeiro}`)?.focus();
      return;
    }
    abrirExterno(linkWhatsApp(textoContato(form)));
  }

  function propsCampo(campo) {
    return {
      id: `contato-${campo}`,
      value: form[campo],
      onChange: alterar(campo),
      "aria-invalid": Boolean(erros[campo]),
      "aria-describedby": erros[campo] ? `contato-${campo}-erro` : undefined,
      className: CLASSE_CAMPO,
    };
  }

  return (
    <>
      <SEO
        title="Exemplar — Contato"
        description="Página de contato do exemplar de site institucional da ogis.cloud."
        path="/exemplos/site/contato"
        noindex
      />

      <section id="contato" className="bg-base-100 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-16 px-5 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h1 className="text-4xl font-bold tracking-[-0.035em] text-base-content sm:text-5xl">Fale com a gente</h1>
            <p className="mt-6 max-w-[48ch] text-lg text-base-content/75">
              Conte o que está acontecendo hoje no seu negócio. Respondemos no mesmo dia útil.
            </p>

            <dl className="mt-12 border-t border-base-300">
              <div className="border-b border-base-300 py-5">
                <dt className="text-sm font-bold text-base-content">WhatsApp</dt>
                <dd className="mt-1">
                  <a href={linkWhatsApp(MSG.contato)} target="_blank" rel="noopener noreferrer" className="link-sereno text-primary">
                    O canal mais rápido para falar conosco
                  </a>
                </dd>
              </div>
              <div className="border-b border-base-300 py-5">
                <dt className="text-sm font-bold text-base-content">E-mail</dt>
                <dd className="mt-1">
                  <a href={linkEmail(ASSUNTO.contato, MSG.contato)} className="link-sereno text-primary">
                    {BRAND.email}
                  </a>
                </dd>
              </div>
              <div className="border-b border-base-300 py-5">
                <dt className="text-sm font-bold text-base-content">Onde estamos</dt>
                <dd className="mt-1 text-base-content/75">{BRAND.cidade} · atendimento remoto para todo o Brasil</dd>
              </div>
            </dl>
          </div>

          <form noValidate onSubmit={enviar} className="flex flex-col gap-6 rounded-2xl bg-base-200/60 p-7 sm:p-9">
            <div>
              <h2 className="text-xl font-bold tracking-[-0.02em] text-base-content">Prefere escrever?</h2>
              <p className="mt-1 text-sm text-base-content/70">
                Preencha e continue a conversa no WhatsApp, com tudo já escrito.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contato-nome" className="text-sm font-bold text-base-content">Seu nome</label>
              <input type="text" autoComplete="name" placeholder="Como podemos te chamar" {...propsCampo("nome")} />
              {erros.nome && <p id="contato-nome-erro" className="text-sm font-medium text-error">{erros.nome}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contato-empresa" className="text-sm font-bold text-base-content">
                Empresa <span className="font-normal text-base-content/60">(opcional)</span>
              </label>
              <input type="text" autoComplete="organization" placeholder="Nome do seu negócio" {...propsCampo("empresa")} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contato-mensagem" className="text-sm font-bold text-base-content">Mensagem</label>
              <textarea rows={5} placeholder="O que está acontecendo hoje?" {...propsCampo("mensagem")} />
              {erros.mensagem && (
                <p id="contato-mensagem-erro" className="text-sm font-medium text-error">{erros.mensagem}</p>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-neutral px-6 py-3.5 text-sm font-bold text-neutral-content transition-transform duration-300 ease-mola active:scale-[0.98]"
            >
              Continuar no WhatsApp <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
