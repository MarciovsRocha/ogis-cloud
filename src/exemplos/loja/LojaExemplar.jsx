import { Routes, Route } from "react-router-dom";
import OrcamentoProvider from "./OrcamentoProvider.jsx";
import { CabecalhoLoja, RodapeLoja } from "./ChromeLoja.jsx";
import LojaVitrine from "./LojaVitrine.jsx";
import LojaProduto from "./LojaProduto.jsx";
import LojaOrcamento from "./LojaOrcamento.jsx";
import NaoEncontrado from "../NaoEncontrado.jsx";

export default function LojaExemplar() {
  return (
    <OrcamentoProvider>
      <CabecalhoLoja />
      <main>
        <Routes>
          <Route index element={<LojaVitrine />} />
          <Route path="p/:slug" element={<LojaProduto />} />
          <Route path="orcamento" element={<LojaOrcamento />} />
          <Route
            path="*"
            element={<NaoEncontrado voltarPara="/exemplos/loja" rotulo="Voltar à vitrine" />}
          />
        </Routes>
      </main>
      <RodapeLoja />
    </OrcamentoProvider>
  );
}
