import SEO from "../../components/SEO.jsx";
import {
  CabecalhoLanding,
  HeroLanding,
  Problema,
  Pilares,
  Passos,
  ResponsavelUnico,
  Provas,
  Faq,
  CtaFinal,
  RodapeLanding,
} from "./secoes.jsx";

export default function LandingExemplar() {
  return (
    <>
      <SEO
        title="Exemplar — Landing Page"
        description="Exemplar de landing page construído pela ogis.cloud: uma página, uma promessa, uma ação."
        path="/exemplos/landing"
        noindex
      />
      <CabecalhoLanding />
      <main>
        <HeroLanding />
        <Problema />
        <Pilares />
        <Passos />
        <ResponsavelUnico />
        <Provas />
        <Faq />
        <CtaFinal />
      </main>
      <RodapeLanding />
    </>
  );
}
