import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { TEMA_POR_SUPERFICIE, temaDe } from "./temas.js";

const PASTA = new URL("./temas/", import.meta.url);
const cssDosTemas = readdirSync(PASTA)
  .filter((arquivo) => arquivo.endsWith(".css"))
  .map((arquivo) => readFileSync(new URL(arquivo, PASTA), "utf8"))
  .join("\n");

describe("temas por superfície", () => {
  it("cobre exatamente as seis superfícies", () => {
    expect(Object.keys(TEMA_POR_SUPERFICIE).sort()).toEqual(
      ["faixa", "home", "indice", "landing", "loja", "site"],
    );
  });

  it("todo tema usado está declarado em algum arquivo de tema", () => {
    for (const tema of new Set(Object.values(TEMA_POR_SUPERFICIE))) {
      expect(cssDosTemas).toContain(`name: "${tema}"`);
      expect(cssDosTemas).toContain(`[data-theme="${tema}"]`);
    }
  });

  it("a faixa de exemplar é sempre da OGIS", () => {
    expect(TEMA_POR_SUPERFICIE.faixa).toBe("ogis-infra");
    expect(TEMA_POR_SUPERFICIE.faixa).toBe(TEMA_POR_SUPERFICIE.home);
  });

  it("cada exemplar tem um tema diferente da home e dos outros", () => {
    const { home, landing, site, loja } = TEMA_POR_SUPERFICIE;
    expect(new Set([home, landing, site, loja]).size).toBe(4);
  });

  it("temaDe devolve o tema e falha alto para superfície desconhecida", () => {
    expect(temaDe("loja")).toBe("exemplar-bento");
    expect(() => temaDe("blog")).toThrow(/superfície desconhecida/i);
  });
});
