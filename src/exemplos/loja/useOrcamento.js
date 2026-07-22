import { useContext } from "react";
import { OrcamentoContexto } from "./orcamentoContexto.js";

export function useOrcamento() {
  const contexto = useContext(OrcamentoContexto);
  if (!contexto) {
    throw new Error("useOrcamento precisa estar dentro de <OrcamentoProvider>");
  }
  return contexto;
}
