import { buscarItem } from "./catalogo.js";

// As 4 soluções em destaque na home. O conteúdo mora em catalogo.js —
// aqui só escolhemos quais aparecem e em que ordem.
const DESTAQUES = ["site-institucional", "landing-page", "sistema-gestao", "nota-fiscal"];

export const SOLUCOES = DESTAQUES.map(buscarItem);
