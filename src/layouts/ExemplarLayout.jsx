import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import FaixaExemplar from "../components/FaixaExemplar.jsx";
import ErroCarregamento, { CHAVE_RECARGA } from "../components/ErroCarregamento.jsx";

// Só monta quando o exemplar carregou de verdade: libera uma nova recarga
// automática caso outro chunk falhe mais tarde nesta aba.
function CarregouComSucesso() {
  useEffect(() => {
    try {
      window.sessionStorage.removeItem(CHAVE_RECARGA);
    } catch {
      // Sem sessionStorage: nada a limpar.
    }
  }, []);
  return null;
}

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
      <ErroCarregamento>
        <Suspense fallback={<div className="min-h-screen" />}>
          <Outlet />
          <CarregouComSucesso />
        </Suspense>
      </ErroCarregamento>
    </div>
  );
}
