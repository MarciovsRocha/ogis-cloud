import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import ExemplarLayout from "./layouts/ExemplarLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Termos from "./pages/Termos.jsx";
import Privacidade from "./pages/Privacidade.jsx";
import Tema from "./components/Tema.jsx";

// Exemplares em chunks próprios: GSAP e as fontes de cada um não pesam na home.
const IndiceExemplos = lazy(() => import("./exemplos/IndiceExemplos.jsx"));
const NaoEncontrado = lazy(() => import("./exemplos/NaoEncontrado.jsx"));
const LandingExemplar = lazy(() => import("./exemplos/landing/LandingExemplar.jsx"));
const SiteExemplar = lazy(() => import("./exemplos/site/SiteExemplar.jsx"));
const LojaExemplar = lazy(() => import("./exemplos/loja/LojaExemplar.jsx"));

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

        {/* Exemplares — cada um traz o próprio tema, cabeçalho e rodapé */}
        <Route element={<ExemplarLayout />}>
          <Route path="/exemplos" element={<IndiceExemplos />} />
          <Route path="/exemplos/landing" element={<LandingExemplar />} />
          <Route path="/exemplos/site/*" element={<SiteExemplar />} />
          <Route path="/exemplos/loja/*" element={<LojaExemplar />} />
          <Route
            path="/exemplos/*"
            element={
              <Tema superficie="indice">
                <NaoEncontrado />
              </Tema>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
