import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import FaixaExemplar from "../components/FaixaExemplar.jsx";

// Chrome mínimo dos exemplares: a faixa da OGIS e nada mais. Cada exemplar
// aplica o próprio tema com <Tema>. A faixa mede exatamente 44px (h-11):
// pt-11 aqui e top-11 nos cabeçalhos dos exemplares dependem disso.
export default function ExemplarLayout() {
  return (
    <div className="min-h-screen pt-11">
      <a href="#conteudo" className="pular-conteudo">
        Pular para o conteúdo
      </a>
      <FaixaExemplar />
      <Suspense fallback={<div className="min-h-screen" />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
