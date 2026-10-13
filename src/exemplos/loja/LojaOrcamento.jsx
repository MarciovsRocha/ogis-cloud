import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Envelope, FileText, Minus, Plus, Trash, WhatsappLogo } from "@phosphor-icons/react";
import { buscarItem, textoEscopo } from "../../data/catalogo.js";
import { ASSUNTO, linkEmail, linkWhatsApp } from "../../config.js";
import SEO from "../../components/SEO.jsx";
import { abrirExterno } from "../../lib/abrirExterno.js";
import { useOrcamento } from "./useOrcamento.js";
import { montarMensagem } from "./mensagemOrcamento.js";
import { corDaCategoria } from "./corCategoria.js";
import { validarOrcamento } from "./validacaoOrcamento.js";

// Mesmo campo em dois fundos: claro-escuro dentro dos tickets (base-100) e
// claro dentro do cartão do formulário (base-200).
const CAMPO_BASE =
  "w-full min-w-0 rounded-2xl px-4 py-3 text-base text-base-content outline-none ring-1 ring-transparent transition-shadow duration-300 ease-mola placeholder:text-base-content/50 focus:ring-2 focus:ring-base-content aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-error";
const CAMPO_TICKET = `${CAMPO_BASE} bg-base-200`;
const CAMPO_FORM = `${CAMPO_BASE} bg-base-100`;
const BOTAO_QTD =
  "grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-base-100/70 transition-transform duration-300 ease-mola active:scale-[0.95]";
const ORDEM_CAMPOS = ["nome", "contato"];

function ListaVazia() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-[1.75rem] bg-base-200 p-10">
      <FileText weight="duotone" className="h-12 w-12 text-primary" aria-hidden="true" />
      <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-base-content">Sua lista de orçamento está vazia</h2>
      <p className="max-w-md text-base-content/75">
        Navegue pelo catálogo e adicione o que faz sentido para o seu negócio. Você não paga nada para
        pedir um orçamento.
      </p>
      <Link
        to="/exemplos/loja"
        className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-bold text-secondary-content transition-transform duration-300 ease-mola active:scale-[0.97]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Ver o catálogo
      </Link>
    </div>
  );
}

export default function LojaOrcamento() {
  const { itens, total, remover, alterarQuantidade, alterarObservacao, limpar } = useOrcamento();
  const [form, setForm] = useState({ nome: "", empresa: "", contato: "", observacoes: "" });
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

  // O estado guarda só o slug; o nome vem do catálogo na hora de montar a mensagem.
  const itensComNome = itens.map((i) => ({ ...i, nome: buscarItem(i.slug)?.nome ?? i.slug }));
  const mensagem = montarMensagem({ ...form, itens: itensComNome });

  function enviar(canal) {
    const encontrados = validarOrcamento(form);
    setErros(encontrados);
    const primeiro = ORDEM_CAMPOS.find((campo) => encontrados[campo]);
    if (primeiro) {
      document.getElementById(`orcamento-${primeiro}`)?.focus();
      return;
    }
    if (canal === "whatsapp") abrirExterno(linkWhatsApp(mensagem));
    else window.location.href = linkEmail(ASSUNTO.orcamento, mensagem);
  }

  function propsCampo(campo) {
    return {
      id: `orcamento-${campo}`,
      value: form[campo],
      onChange: alterar(campo),
      "aria-invalid": Boolean(erros[campo]),
      "aria-describedby": erros[campo] ? `orcamento-${campo}-erro` : undefined,
      className: CAMPO_FORM,
    };
  }

  return (
    <>
      <SEO
        title="Meu orçamento"
        description="Sua lista de soluções da ogis.cloud, pronta para virar um orçamento sob medida."
        path="/exemplos/loja/orcamento"
        noindex
      />

      <section id="orcamento" className="mx-auto max-w-6xl px-5 py-14">
        <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-base-content sm:text-5xl">Meu orçamento</h1>
        <p className="mt-4 max-w-2xl text-lg text-base-content/75">
          Confira os itens, conte o que precisa e envie. Respondemos com um orçamento sob medida — sem
          custo e sem compromisso.
        </p>

        {itens.length === 0 ? (
          <div className="mt-10">
            <ListaVazia />
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            <div className="min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-base-content">
                  {total} {total === 1 ? "item" : "itens"}
                </h2>
                <button
                  type="button"
                  onClick={limpar}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-base-content/70 hover:text-error"
                >
                  <Trash className="h-4 w-4" aria-hidden="true" />
                  Limpar tudo
                </button>
              </div>

              <ul className="mt-5 flex flex-col gap-4">
                {itens.map((linha) => {
                  const item = buscarItem(linha.slug);
                  if (!item) return null;
                  const cor = corDaCategoria(item.categoria);
                  const Icone = item.icone;

                  return (
                    <li key={linha.slug} className="flex overflow-hidden rounded-[1.75rem] bg-base-100 ring-1 ring-base-content/10">
                      <div className={`grid w-20 shrink-0 place-items-center sm:w-28 ${cor.fundo} ${cor.texto}`}>
                        <Icone weight="duotone" className="h-9 w-9 sm:h-11 sm:w-11" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="break-words font-extrabold tracking-[-0.02em] text-base-content">
                              <Link to={`/exemplos/loja/p/${item.slug}`} className="hover:underline">
                                {item.nome}
                              </Link>
                            </h3>
                            <p className="mt-0.5 text-xs text-base-content/70">{textoEscopo(item)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => remover(linha.slug)}
                            aria-label={`Remover ${item.nome}`}
                            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-base-content/60 hover:bg-base-200 hover:text-error"
                          >
                            <Trash className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        <div className={`mt-4 inline-flex items-center gap-2 rounded-full p-1 ${cor.fundo} ${cor.texto}`}>
                          <button
                            type="button"
                            onClick={() => alterarQuantidade(linha.slug, linha.quantidade - 1)}
                            aria-label={`Diminuir quantidade de ${item.nome}`}
                            className={BOTAO_QTD}
                          >
                            <Minus className="h-3.5 w-3.5 text-base-content" aria-hidden="true" />
                          </button>
                          <span className="w-7 text-center font-extrabold tabular-nums">{linha.quantidade}</span>
                          <button
                            type="button"
                            onClick={() => alterarQuantidade(linha.slug, linha.quantidade + 1)}
                            aria-label={`Aumentar quantidade de ${item.nome}`}
                            className={BOTAO_QTD}
                          >
                            <Plus className="h-3.5 w-3.5 text-base-content" aria-hidden="true" />
                          </button>
                        </div>

                        <label className="mt-4 block">
                          <span className="sr-only">Observação sobre {item.nome}</span>
                          <input
                            type="text"
                            value={linha.observacao}
                            onChange={(e) => alterarObservacao(linha.slug, e.target.value)}
                            placeholder="Observação sobre este item (opcional)"
                            className={CAMPO_TICKET}
                          />
                        </label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Cartão creme mais escuro: campos claros e erro em vermelho legível (AA). */}
            <aside className="min-w-0 rounded-[1.75rem] bg-base-200 p-7 text-base-content lg:sticky lg:top-32">
              <h2 className="text-xl font-extrabold tracking-[-0.02em]">Para onde respondemos?</h2>
              <p className="mt-1.5 text-sm text-base-content/75">
                Nenhum dado é enviado para servidor: os campos montam a mensagem que você envia.
              </p>

              <form noValidate onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="orcamento-nome" className="text-sm font-bold">Seu nome</label>
                  <input type="text" autoComplete="name" placeholder="Como podemos te chamar" {...propsCampo("nome")} />
                  {erros.nome && <p id="orcamento-nome-erro" className="text-sm font-bold text-error">{erros.nome}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="orcamento-empresa" className="text-sm font-bold">
                    Empresa <span className="font-normal text-base-content/75">(opcional)</span>
                  </label>
                  <input type="text" autoComplete="organization" placeholder="Nome do seu negócio" {...propsCampo("empresa")} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="orcamento-contato" className="text-sm font-bold">
                    E-mail ou telefone <span className="font-normal text-base-content/75">(opcional)</span>
                  </label>
                  <input type="text" autoComplete="email" placeholder="Como prefere ser respondido" {...propsCampo("contato")} />
                  {erros.contato && <p id="orcamento-contato-erro" className="text-sm font-bold text-error">{erros.contato}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="orcamento-observacoes" className="text-sm font-bold">Observações gerais</label>
                  <textarea rows={3} placeholder="Prazo, contexto, o que já existe hoje…" {...propsCampo("observacoes")} />
                </div>
              </form>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => enviar("whatsapp")}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-secondary px-5 py-3.5 text-sm font-bold text-secondary-content transition-transform duration-300 ease-mola active:scale-[0.97]"
                >
                  <WhatsappLogo className="h-4.5 w-4.5" aria-hidden="true" />
                  Enviar por WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => enviar("email")}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-base-100 px-5 py-3.5 text-sm font-bold text-base-content ring-1 ring-base-content/20 transition-transform duration-300 ease-mola active:scale-[0.97]"
                >
                  <Envelope className="h-4.5 w-4.5" aria-hidden="true" />
                  Enviar por e-mail
                </button>
              </div>
              <p className="mt-5 text-center text-xs text-base-content/70">
                Sem preço na lista: o orçamento é montado depois de entender o seu caso.
              </p>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
