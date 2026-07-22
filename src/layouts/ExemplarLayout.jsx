import { Outlet } from "react-router-dom";
import FaixaExemplar from "../components/FaixaExemplar.jsx";

// Chrome mínimo dos exemplares: a faixa de demonstração e nada mais.
// A faixa fixa mede 41px (py-2 + linha de texto + borda); pt-11 = 44px a
// compensa com folga. NAO reduza para pt-9: sobrepoe o topo do conteudo.
export default function ExemplarLayout() {
  return (
    <div className="min-h-screen bg-base-200 pt-11 text-base-content">
      <FaixaExemplar />
      <Outlet />
    </div>
  );
}
