import "@fontsource-variable/manrope";
import { Routes, Route } from "react-router-dom";
import OrcamentoProvider from "./OrcamentoProvider.jsx";
import { CabecalhoLoja, RodapeLoja } from "./ChromeLoja.jsx";
import LojaVitrine from "./LojaVitrine.jsx";
import LojaProduto from "./LojaProduto.jsx";
import LojaOrcamento from "./LojaOrcamento.jsx";
import NaoEncontrado from "../NaoEncontrado.jsx";
import Tema from "../../components/Tema.jsx";

export default function LojaExemplar() {
  return (
    <Tema superficie="loja">
      <OrcamentoProvider>
        <CabecalhoLoja />
        <main id="conteudo">
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
    </Tema>
  );
}
