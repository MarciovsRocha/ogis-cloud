import { describe, it, expect } from "vitest";
import {
  CATEGORIAS,
  CATALOGO,
  buscarItem,
  itensPorCategoria,
  filtrarCatalogo,
  relacionados,
  textoEscopo,
} from "./catalogo.js";

describe("estrutura do catalogo", () => {
  it("tem 4 categorias e 12 itens", () => {
    expect(CATEGORIAS).toHaveLength(4);
    expect(CATALOGO).toHaveLength(12);
  });

  it("todo item aponta para uma categoria existente", () => {
    const slugs = CATEGORIAS.map((c) => c.slug);
    for (const item of CATALOGO) {
      expect(slugs).toContain(item.categoria);
    }
  });

  it("nao tem slug repetido", () => {
    const slugs = CATALOGO.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("nao menciona preco em nenhum campo de texto", () => {
    expect(JSON.stringify(CATALOGO)).not.toMatch(/R\$/);
  });
});

describe("buscarItem", () => {
  it("encontra pelo slug", () => {
    expect(buscarItem("site-institucional").nome).toBe("Site Institucional");
  });

  it("devolve undefined para slug inexistente", () => {
    expect(buscarItem("nao-existe")).toBeUndefined();
  });
});

describe("itensPorCategoria", () => {
  it("devolve so os itens da categoria pedida", () => {
    const itens = itensPorCategoria("infraestrutura");
    expect(itens.length).toBeGreaterThan(0);
    expect(itens.every((i) => i.categoria === "infraestrutura")).toBe(true);
  });
});

describe("filtrarCatalogo", () => {
  it("sem filtro devolve tudo", () => {
    expect(filtrarCatalogo({})).toHaveLength(12);
  });

  it("filtra por termo no nome, ignorando caixa", () => {
    expect(filtrarCatalogo({ termo: "E-COMMERCE" }).map((i) => i.slug)).toContain("e-commerce");
  });

  it("filtra por termo presente no resumo", () => {
    expect(filtrarCatalogo({ termo: "nota" }).map((i) => i.slug)).toContain("nota-fiscal");
  });

  it("ignora acento no termo digitado", () => {
    expect(filtrarCatalogo({ termo: "manutencao" }).map((i) => i.slug)).toContain("manutencao");
  });

  it("filtra por categoria", () => {
    const itens = filtrarCatalogo({ categoria: "sistemas" });
    expect(itens.length).toBeGreaterThan(0);
    expect(itens.every((i) => i.categoria === "sistemas")).toBe(true);
  });

  it("combina termo e categoria", () => {
    expect(filtrarCatalogo({ termo: "zzzzzz", categoria: "sistemas" })).toEqual([]);
  });

  it("ordena por nome quando pedido", () => {
    const nomes = filtrarCatalogo({ ordem: "nome" }).map((i) => i.nome);
    expect(nomes).toEqual([...nomes].sort((a, b) => a.localeCompare(b, "pt-BR")));
  });

  it("devolve lista vazia quando nada casa", () => {
    expect(filtrarCatalogo({ termo: "zzzzzz" })).toEqual([]);
  });
});

describe("relacionados", () => {
  it("traz itens da mesma categoria, sem incluir o proprio", () => {
    const itens = relacionados("site-institucional");
    expect(itens.every((i) => i.categoria === "presenca-digital")).toBe(true);
    expect(itens.map((i) => i.slug)).not.toContain("site-institucional");
  });

  it("respeita o limite", () => {
    expect(relacionados("site-institucional", 2)).toHaveLength(2);
  });

  it("devolve lista vazia para slug inexistente", () => {
    expect(relacionados("nao-existe")).toEqual([]);
  });
});

describe("textoEscopo", () => {
  it("projeto com prazo", () => {
    expect(textoEscopo(buscarItem("site-institucional"))).toBe(
      "Projeto · prazo típico 2 a 3 semanas",
    );
  });

  it("projeto sem prazo", () => {
    expect(textoEscopo(buscarItem("sistema-gestao"))).toBe("Projeto · sob escopo");
  });

  it("mensal", () => {
    expect(textoEscopo(buscarItem("dominio"))).toBe("Mensal · sob consulta");
  });
});
