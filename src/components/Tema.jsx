import { useLayoutEffect } from "react";
import { temaDe } from "../styles/temas.js";

// Aplica o tema da superfície na própria div e no <html>. O <html> garante que o
// fundo de overscroll, a color-scheme e o fallback do Suspense acompanhem a
// página atual, inclusive ao voltar pelo histórico.
export default function Tema({ superficie, className = "", children }) {
  const tema = temaDe(superficie);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = tema;
  }, [tema]);

  return (
    <div data-theme={tema} className={`min-h-screen ${className}`}>
      {children}
    </div>
  );
}
