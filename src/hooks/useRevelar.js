import { useEffect, useRef } from "react";

// Marca o elemento com .revelado quando ele entra na tela (uma vez só).
// O CSS de .revelar mora em src/index.css e respeita prefers-reduced-motion.
export function useRevelar() {
  const ref = useRef(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      elemento.classList.add("revelado");
      return undefined;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          elemento.classList.add("revelado");
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return ref;
}
