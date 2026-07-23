import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// Chrome do site real da ogis.cloud.
export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
