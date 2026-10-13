import "@fontsource-variable/manrope";
import { Routes, Route } from "react-router-dom";
import { CabecalhoSite, RodapeSite } from "./ChromeSite.jsx";
import SiteHome from "./SiteHome.jsx";
import SiteSobre from "./SiteSobre.jsx";
import SiteSolucoes from "./SiteSolucoes.jsx";
import SiteSolucao from "./SiteSolucao.jsx";
import SiteContato from "./SiteContato.jsx";
import NaoEncontrado from "../NaoEncontrado.jsx";
import Tema from "../../components/Tema.jsx";

export default function SiteExemplar() {
  return (
    <Tema superficie="site">
      <CabecalhoSite />
      <main id="conteudo">
        <Routes>
          <Route index element={<SiteHome />} />
          <Route path="sobre" element={<SiteSobre />} />
          <Route path="solucoes" element={<SiteSolucoes />} />
          <Route path="solucoes/:slug" element={<SiteSolucao />} />
          <Route path="contato" element={<SiteContato />} />
          <Route
            path="*"
            element={<NaoEncontrado voltarPara="/exemplos/site" rotulo="Voltar ao início" />}
          />
        </Routes>
      </main>
      <RodapeSite />
    </Tema>
  );
}
