import { gsap, ScrollTrigger, MOVIMENTO_COMPLETO, MOVIMENTO_SIMPLES } from "./useGsap.js";

// Cada função recebe o gsap.matchMedia (mm) e o elemento raiz da seção.
// Seletores em string ficam escopados na raiz. Animamos só transform e opacity.

export function animarCabecalho(mm, raiz) {
  mm.add("all", () => {
    ScrollTrigger.create({
      start: 80,
      end: "max",
      toggleClass: { targets: raiz, className: "rolado" },
    });
  });
}

export function animarHero(mm) {
  mm.add(MOVIMENTO_SIMPLES, () => {
    gsap.from(".palavra", { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.07, delay: 0.1 });
    gsap.from(".hero-resto", { opacity: 0, y: 24, duration: 0.9, ease: "power3.out", delay: 0.55 });
  });
}

export function animarProblema(mm, raiz) {
  mm.add(MOVIMENTO_COMPLETO, (contexto) => {
    const palco = raiz.querySelector(".palco");
    const cartas = contexto.selector(".carta");
    palco.classList.add("ativa");
    gsap.set(cartas.slice(1), { yPercent: 115 });

    const linha = gsap.timeline({
      scrollTrigger: {
        trigger: palco,
        start: "top top",
        end: () => `+=${window.innerHeight * (cartas.length - 1)}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    cartas.slice(1).forEach((carta, i) => {
      linha
        .to(carta, { yPercent: 0, ease: "none" })
        .to(cartas[i], { scale: 0.92, opacity: 0.5, ease: "none" }, "<");
    });

    return () => palco.classList.remove("ativa");
  });
}

export function animarFrase(mm) {
  mm.add(MOVIMENTO_SIMPLES, () => {
    gsap.fromTo(
      ".preenchida",
      { opacity: 0 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: { trigger: ".frase", start: "top 80%", end: "bottom 35%", scrub: true },
      },
    );
  });
}

export function animarPassos(mm, raiz) {
  mm.add(MOVIMENTO_COMPLETO, () => {
    const palco = raiz.querySelector(".trilha-palco");
    const janela = raiz.querySelector(".trilha-janela");
    const trilha = raiz.querySelector(".trilha");
    palco.classList.add("ativa");
    const distancia = () => Math.max(0, trilha.scrollWidth - janela.clientWidth);

    gsap.to(trilha, {
      x: () => -distancia(),
      ease: "none",
      scrollTrigger: {
        trigger: palco,
        start: "top top",
        end: () => `+=${distancia()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    return () => palco.classList.remove("ativa");
  });
}

export function animarProvas(mm) {
  mm.add(MOVIMENTO_SIMPLES, () => {
    gsap.from(".prova-numero", {
      yPercent: 105,
      duration: 1,
      ease: "power4.out",
      stagger: 0.12,
      scrollTrigger: { trigger: ".provas-grade", start: "top 80%" },
    });
  });
}
