import { buscarItem } from "../../data/catalogo.js";

// =============================================================================
// Lógica da lista de orçamento. Função pura: não conhece React nem
// localStorage. Guarda apenas { slug, quantidade, observacao } — os dados do
// produto vêm sempre do catálogo na hora de renderizar.
// =============================================================================

export const ESTADO_INICIAL = { itens: [] };

function normalizarQuantidade(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) && numero > 0 ? Math.floor(numero) : 1;
}

export function orcamentoReducer(estado, acao) {
  switch (acao.tipo) {
    case "adicionar": {
      const quantidade = normalizarQuantidade(acao.quantidade ?? 1);
      const observacao = acao.observacao ?? "";
      const existente = estado.itens.find((i) => i.slug === acao.slug);

      if (!existente) {
        return { itens: [...estado.itens, { slug: acao.slug, quantidade, observacao }] };
      }

      return {
        itens: estado.itens.map((i) =>
          i.slug === acao.slug
            ? {
                ...i,
                quantidade: i.quantidade + quantidade,
                // Observação nova sobrescreve; vazia preserva a que já existia.
                observacao: observacao || i.observacao,
              }
            : i,
        ),
      };
    }

    case "remover":
      return { itens: estado.itens.filter((i) => i.slug !== acao.slug) };

    case "quantidade": {
      const quantidade = Number(acao.quantidade);
      if (!Number.isFinite(quantidade) || quantidade <= 0) {
        return { itens: estado.itens.filter((i) => i.slug !== acao.slug) };
      }
      return {
        itens: estado.itens.map((i) =>
          i.slug === acao.slug ? { ...i, quantidade: Math.floor(quantidade) } : i,
        ),
      };
    }

    case "observacao":
      return {
        itens: estado.itens.map((i) =>
          i.slug === acao.slug ? { ...i, observacao: acao.observacao } : i,
        ),
      };

    case "limpar":
      return ESTADO_INICIAL;

    case "hidratar":
      return hidratar(acao.itens);

    default:
      return estado;
  }
}

/**
 * Transforma o que veio do localStorage em estado confiável.
 * Descarta o que não tem slug e o que saiu do catálogo — assim um item
 * removido do catálogo simplesmente some da lista salva, sem quebrar a tela.
 */
export function hidratar(bruto) {
  if (!Array.isArray(bruto)) return ESTADO_INICIAL;

  const itens = bruto
    .filter((i) => i && typeof i.slug === "string" && buscarItem(i.slug))
    .map((i) => ({
      slug: i.slug,
      quantidade: normalizarQuantidade(i.quantidade),
      observacao: typeof i.observacao === "string" ? i.observacao : "",
    }));

  return { itens };
}

/** Só o que precisa ser gravado — os dados do produto vêm do catálogo. */
export function serializar(estado) {
  return estado.itens;
}
