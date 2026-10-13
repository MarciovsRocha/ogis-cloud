import "@fontsource-variable/archivo";
import "./landing.css";
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
  return (
    <Tema superficie="landing">
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
