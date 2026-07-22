import { Outlet } from "react-router-dom";
import FaixaExemplar from "../components/FaixaExemplar.jsx";

// Chrome mínimo dos exemplares: a faixa de demonstração e nada mais.
// O pt-9 compensa a altura da faixa fixa.
export default function ExemplarLayout() {
  return (
    <div className="min-h-screen bg-base-200 pt-9 text-base-content">
      <FaixaExemplar />
      <Outlet />
    </div>
  );
}
