import { describe, it, expect } from "vitest";
import { CATEGORIAS } from "../../data/catalogo.js";
import { COR_CATEGORIA, corDaCategoria } from "./corCategoria.js";

describe("cor por categoria", () => {
  it("toda categoria do catálogo tem cor, e não sobra cor órfã", () => {
    expect(Object.keys(COR_CATEGORIA).sort()).toEqual(CATEGORIAS.map((c) => c.slug).sort());
  });

  it("cada cor traz classes completas de fundo e de texto", () => {
    for (const cor of Object.values(COR_CATEGORIA)) {
      expect(cor.fundo).toMatch(/^bg-\[#[0-9a-f]{6}\]$/);
      expect(cor.texto).toMatch(/^text-\[#[0-9a-f]{6}\]$/);
    }
  });

  it("falha alto para categoria sem cor", () => {
    expect(corDaCategoria("sistemas").fundo).toBe("bg-[#ffd249]");
    expect(() => corDaCategoria("inexistente")).toThrow(/sem cor/i);
  });
});
