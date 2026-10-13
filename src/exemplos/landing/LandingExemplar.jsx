import "@fontsource-variable/archivo";
import "./landing.css";
import { useEffect } from "react";
import { ScrollTrigger } from "./useGsap.js";
import SEO from "../../components/SEO.jsx";
import Tema from "../../components/Tema.jsx";
import Cabecalho from "./secoes/Cabecalho.jsx";
import Hero from "./secoes/Hero.jsx";
import Problema from "./secoes/Problema.jsx";
import Solucao from "./secoes/Solucao.jsx";
import Passos from "./secoes/Passos.jsx";
import Provas from "./secoes/Provas.jsx";
import Faq from "./secoes/Faq.jsx";
import CtaFinal from "./secoes/CtaFinal.jsx";
import Rodape from "./secoes/Rodape.jsx";

export default function LandingExemplar() {
  // Archivo muda a altura dos títulos: recalcula os pins quando as fontes chegam.
  useEffect(() => {
    let ativo = true;
    document.fonts?.ready.then(() => {
      if (ativo) ScrollTrigger.refresh();
    });
    return () => {
      ativo = false;
    };
  }, []);

  return (
    // overflow-x: clip impede que larguras fixadas pelos pins alarguem a página ao
    // girar o celular ou estreitar a janela — senão o media query de 768px nunca
    // volta a falhar e os pins não se desfazem. "clip" não quebra o sticky.
    <Tema superficie="landing" className="overflow-x-clip">
      <SEO
        title="Exemplar — Landing Page"
        description="Exemplar de landing page construído pela ogis.cloud: uma página, uma promessa, uma ação."
        path="/exemplos/landing"
        noindex
      />
      <Cabecalho />
      <main id="conteudo">
        <Hero />
        <Problema />
        <Solucao />
        <Passos />
        <Provas />
        <Faq />
        <CtaFinal />
      </main>
      <Rodape />
    </Tema>
  );
}
