import { Outlet } from "react-router-dom";
import Tema from "../components/Tema.jsx";
import Navbar from "../components/home/Navbar.jsx";
import Footer from "../components/home/Footer.jsx";

// Chrome do site real da ogis.cloud.
export default function SiteLayout() {
  return (
    <Tema superficie="home">
      <a href="#conteudo" className="pular-conteudo">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <Outlet />
      </main>
      <Footer />
    </Tema>
  );
}
