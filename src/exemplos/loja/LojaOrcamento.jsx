import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, MessageCircle, Mail, FileText, ArrowLeft } from "lucide-react";
import { buscarItem, textoEscopo } from "../../data/catalogo.js";
import { linkWhatsApp, linkEmail, ASSUNTO } from "../../config.js";
import SEO from "../../components/SEO.jsx";
import { useOrcamento } from "./useOrcamento.js";
import { montarMensagem } from "./mensagemOrcamento.js";

const CAMPO =
  "w-full rounded-xl border border-base-300 bg-base-200 px-4 py-3 text-sm text-base-content outline-none transition-colors duration-200 placeholder:text-base-content/40 focus:border-primary";

function ListaVazia() {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 py-20 text-center">
      <FileText className="mx-auto h-10 w-10 text-base-content/30" />
      <h2 className="mt-5 text-lg font-semibold text-base-content">
        Sua lista de orçamento está vazia
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
        Navegue pelo catálogo e adicione o que faz sentido para o seu negócio. Você não paga nada
        para pedir um orçamento.
      </p>
      <Link
        to="/exemplos/loja"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
      >
        <ArrowLeft className="h-4 w-4" />
        Ver o catálogo
      </Link>
    </div>
  );
}

export default function LojaOrcamento() {
  const { itens, total, remover, alterarQuantidade, alterarObservacao, limpar } = useOrcamento();
  const [form, setForm] = useState({ nome: "", empresa: "", contato: "", observacoes: "" });

  const alterar = (campo) => (evento) =>
    setForm((atual) => ({ ...atual, [campo]: evento.target.value }));

  // Enriquece com o nome do produto na hora de montar a mensagem: o estado
  // guarda só o slug, e o catálogo é a fonte de verdade.
  const itensComNome = itens.map((i) => ({
    ...i,
    nome: buscarItem(i.slug)?.nome ?? i.slug,
  }));

  const mensagem = montarMensagem({ ...form, itens: itensComNome });

  return (
    <>
      <SEO
        title="Meu orçamento"
        description="Sua lista de soluções da ogis.cloud, pronta para virar um orçamento sob medida."
        path="/exemplos/loja/orcamento"
        noindex
      />

      <section id="orcamento" className="mx-auto max-w-6xl px-5 py-14">
        <h1 className="text-3xl font-bold text-base-content sm:text-4xl">Meu orçamento</h1>
        <p className="mt-4 max-w-2xl text-base-content/70">
          Confira os itens, conte o que precisa e envie. Respondemos com um orçamento sob medida —
          sem custo e sem compromisso.
        </p>

        {itens.length === 0 ? (
          <div className="mt-10">
            <ListaVazia />
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            {/* Itens */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
                  {total} {total === 1 ? "item" : "itens"}
                </h2>
                <button
                  type="button"
                  onClick={limpar}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-base-content/50 transition-colors duration-200 hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar tudo
                </button>
              </div>

              <ul className="mt-5 flex flex-col gap-4">
                {itens.map((linha) => {
                  const item = buscarItem(linha.slug);
                  if (!item) return null;
                  const Icone = item.icone;

                  return (
                    <li
                      key={linha.slug}
                      className="rounded-2xl border border-base-300 bg-base-100 p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                          <Icone className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-base-content">
                            <Link
                              to={`/exemplos/loja/p/${item.slug}`}
                              className="transition-colors duration-200 hover:text-primary"
                            >
                              {item.nome}
                            </Link>
                          </h3>
                          <p className="mt-0.5 text-xs text-base-content/50">{textoEscopo(item)}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => remover(linha.slug)}
                          aria-label={`Remover ${item.nome}`}
                          className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-base-content/40 transition-colors duration-200 hover:bg-base-200 hover:text-error"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => alterarQuantidade(linha.slug, linha.quantidade - 1)}
                          aria-label={`Diminuir quantidade de ${item.nome}`}
                          className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-base-300 transition-colors duration-200 hover:border-primary/50"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center font-semibold text-base-content">
                          {linha.quantidade}
                        </span>
                        <button
                          type="button"
                          onClick={() => alterarQuantidade(linha.slug, linha.quantidade + 1)}
                          aria-label={`Aumentar quantidade de ${item.nome}`}
                          className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-base-300 transition-colors duration-200 hover:border-primary/50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <label className="mt-4 block">
                        <span className="sr-only">Observação sobre {item.nome}</span>
                        <input
                          type="text"
                          value={linha.observacao}
                          onChange={(e) => alterarObservacao(linha.slug, e.target.value)}
                          placeholder="Observação sobre este item (opcional)"
                          className={CAMPO}
                        />
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Formulário de envio */}
            <aside className="rounded-2xl border border-primary/30 bg-base-100 p-7 lg:sticky lg:top-32">
              <h2 className="text-lg font-semibold text-base-content">Para onde respondemos?</h2>
              <p className="mt-1.5 text-sm text-base-content/60">
                Nenhum dado é enviado para servidor: os campos montam a mensagem que você envia.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-base-content/80">Seu nome</span>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={alterar("nome")}
                    placeholder="Como podemos te chamar"
                    className={CAMPO}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-base-content/80">Empresa</span>
                  <input
                    type="text"
                    value={form.empresa}
                    onChange={alterar("empresa")}
                    placeholder="Nome do seu negócio"
                    className={CAMPO}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-base-content/80">
                    E-mail ou telefone
                  </span>
                  <input
                    type="text"
                    value={form.contato}
                    onChange={alterar("contato")}
                    placeholder="Como preferir ser respondido"
                    className={CAMPO}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-base-content/80">
                    Observações gerais
                  </span>
                  <textarea
                    rows={3}
                    value={form.observacoes}
                    onChange={alterar("observacoes")}
                    placeholder="Prazo, contexto, o que já existe hoje..."
                    className={`${CAMPO} resize-y`}
                  />
                </label>
              </form>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={linkWhatsApp(mensagem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enviar por WhatsApp
                </a>
                <a
                  href={linkEmail(ASSUNTO.orcamento, mensagem)}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-base-300 px-5 py-3.5 text-sm font-semibold text-base-content transition-colors duration-200 hover:border-primary/50"
                >
                  <Mail className="h-4 w-4" />
                  Enviar por e-mail
                </a>
              </div>

              <p className="mt-5 text-center text-xs text-base-content/40">
                Sem preço na lista: o orçamento é montado depois de entender o seu caso.
              </p>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
