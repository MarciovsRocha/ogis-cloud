import { useReducer, useEffect, useMemo, useCallback } from "react";
import { OrcamentoContexto } from "./orcamentoContexto.js";
import { ESTADO_INICIAL, orcamentoReducer, hidratar, serializar } from "./orcamentoReducer.js";

const CHAVE = "ogis:orcamento";

/** Lê o que foi salvo. Em aba anônima o localStorage pode lançar — cai para vazio. */
function lerSalvo() {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    return bruto ? hidratar(JSON.parse(bruto)) : ESTADO_INICIAL;
  } catch {
    return ESTADO_INICIAL;
  }
}

export default function OrcamentoProvider({ children }) {
  const [estado, despachar] = useReducer(orcamentoReducer, ESTADO_INICIAL, lerSalvo);

  // Persiste a cada mudança. Se o navegador bloquear, seguimos só em memória.
  useEffect(() => {
    try {
      window.localStorage.setItem(CHAVE, JSON.stringify(serializar(estado)));
    } catch {
      // Sem persistência: a lista continua funcionando até recarregar a página.
    }
  }, [estado]);

  const adicionar = useCallback(
    (slug, quantidade = 1, observacao = "") =>
      despachar({ tipo: "adicionar", slug, quantidade, observacao }),
    [],
  );
  const remover = useCallback((slug) => despachar({ tipo: "remover", slug }), []);
  const alterarQuantidade = useCallback(
    (slug, quantidade) => despachar({ tipo: "quantidade", slug, quantidade }),
    [],
  );
  const alterarObservacao = useCallback(
    (slug, observacao) => despachar({ tipo: "observacao", slug, observacao }),
    [],
  );
  const limpar = useCallback(() => despachar({ tipo: "limpar" }), []);

  const valor = useMemo(
    () => ({
      itens: estado.itens,
      total: estado.itens.reduce((soma, i) => soma + i.quantidade, 0),
      temItem: (slug) => estado.itens.some((i) => i.slug === slug),
      adicionar,
      remover,
      alterarQuantidade,
      alterarObservacao,
      limpar,
    }),
    [estado.itens, adicionar, remover, alterarQuantidade, alterarObservacao, limpar],
  );

  return <OrcamentoContexto.Provider value={valor}>{children}</OrcamentoContexto.Provider>;
}
