import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Pins e scrubs só em tela larga e sem pedido de movimento reduzido.
export const MOVIMENTO_COMPLETO = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
// Entradas simples (máscaras, fades) valem em qualquer largura.
export const MOVIMENTO_SIMPLES = "(prefers-reduced-motion: no-preference)";

/**
 * Roda `configurar(mm, raiz)` num gsap.matchMedia escopado no elemento do ref.
 * Tudo é desfeito ao desmontar (seguro no StrictMode). `configurar` precisa ser
 * estável: defina-a fora do componente (ver animacoes.js).
 */
export function useGsap(escopo, configurar) {
  useLayoutEffect(() => {
    const raiz = escopo.current;
    const mm = gsap.matchMedia(raiz);
    configurar(mm, raiz);
    return () => mm.revert();
  }, [escopo, configurar]);
}

export { gsap, ScrollTrigger };
