import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import ExemplarLayout from "./layouts/ExemplarLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Termos from "./pages/Termos.jsx";
import Privacidade from "./pages/Privacidade.jsx";
import IndiceExemplos from "./exemplos/IndiceExemplos.jsx";
import NaoEncontrado from "./exemplos/NaoEncontrado.jsx";
import LandingExemplar from "./exemplos/landing/LandingExemplar.jsx";
import SiteExemplar from "./exemplos/site/SiteExemplar.jsx";
import LojaExemplar from "./exemplos/loja/LojaExemplar.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Site real da holding */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/privacidade" element={<Privacidade />} />
        </Route>

        {/* Exemplares — cada um traz o próprio cabeçalho e rodapé */}
        <Route element={<ExemplarLayout />}>
          <Route path="/exemplos" element={<IndiceExemplos />} />
          <Route path="/exemplos/landing" element={<LandingExemplar />} />
          <Route path="/exemplos/site/*" element={<SiteExemplar />} />
          <Route path="/exemplos/loja/*" element={<LojaExemplar />} />
          <Route path="/exemplos/*" element={<NaoEncontrado />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
