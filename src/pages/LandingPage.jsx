import SEO from "../components/SEO.jsx";
import Hero from "../components/home/Hero.jsx";
import Solucoes from "../components/home/Solucoes.jsx";
import ComoFunciona from "../components/home/ComoFunciona.jsx";
import VejaFuncionando from "../components/home/VejaFuncionando.jsx";
import Planos from "../components/home/Planos.jsx";
import ParaQuemConfianca from "../components/home/ParaQuemConfianca.jsx";
import Contato from "../components/home/Contato.jsx";

export default function LandingPage() {
  return (
    <>
      <SEO />
      <Hero />
      <Solucoes />
      <ComoFunciona />
      <VejaFuncionando />
      <Planos />
      <ParaQuemConfianca />
      <Contato />
    </>
  );
}
