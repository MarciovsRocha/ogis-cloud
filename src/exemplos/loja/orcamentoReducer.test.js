import { describe, it, expect } from "vitest";
import { ESTADO_INICIAL, orcamentoReducer, hidratar, serializar } from "./orcamentoReducer.js";

const comItens = (itens) => ({ itens });

describe("adicionar", () => {
  it("adiciona um item novo com quantidade 1 por padrao", () => {
    const estado = orcamentoReducer(ESTADO_INICIAL, { tipo: "adicionar", slug: "dominio" });
    expect(estado.itens).toEqual([{ slug: "dominio", quantidade: 1, observacao: "" }]);
  });

  it("respeita a quantidade e a observacao informadas", () => {
    const estado = orcamentoReducer(ESTADO_INICIAL, {
      tipo: "adicionar",
      slug: "email-profissional",
      quantidade: 5,
      observacao: "uma caixa por vendedor",
    });
    expect(estado.itens[0]).toEqual({
      slug: "email-profissional",
      quantidade: 5,
      observacao: "uma caixa por vendedor",
    });
  });

  it("soma a quantidade quando o item ja esta na lista", () => {
    const inicial = comItens([{ slug: "dominio", quantidade: 2, observacao: "" }]);
    const estado = orcamentoReducer(inicial, {
      tipo: "adicionar",
      slug: "dominio",
      quantidade: 3,
    });
    expect(estado.itens).toHaveLength(1);
    expect(estado.itens[0].quantidade).toBe(5);
  });

  it("substitui a observacao ao readicionar com observacao nova", () => {
    const inicial = comItens([{ slug: "dominio", quantidade: 1, observacao: "antiga" }]);
    const estado = orcamentoReducer(inicial, {
      tipo: "adicionar",
      slug: "dominio",
      observacao: "nova",
    });
    expect(estado.itens[0].observacao).toBe("nova");
  });

  it("preserva a observacao existente quando a nova vem vazia", () => {
    const inicial = comItens([{ slug: "dominio", quantidade: 1, observacao: "antiga" }]);
    const estado = orcamentoReducer(inicial, { tipo: "adicionar", slug: "dominio" });
    expect(estado.itens[0].observacao).toBe("antiga");
  });

  it("nao muta o estado anterior", () => {
    const inicial = comItens([{ slug: "dominio", quantidade: 1, observacao: "" }]);
    orcamentoReducer(inicial, { tipo: "adicionar", slug: "hospedagem" });
    expect(inicial.itens).toHaveLength(1);
  });
});

describe("remover", () => {
  it("tira o item da lista", () => {
    const inicial = comItens([
      { slug: "dominio", quantidade: 1, observacao: "" },
      { slug: "hospedagem", quantidade: 1, observacao: "" },
    ]);
    const estado = orcamentoReducer(inicial, { tipo: "remover", slug: "dominio" });
    expect(estado.itens.map((i) => i.slug)).toEqual(["hospedagem"]);
  });

  it("ignora slug que nao esta na lista", () => {
    const inicial = comItens([{ slug: "dominio", quantidade: 1, observacao: "" }]);
    const estado = orcamentoReducer(inicial, { tipo: "remover", slug: "nao-existe" });
    expect(estado.itens).toHaveLength(1);
  });
});

describe("quantidade", () => {
  it("altera a quantidade", () => {
    const inicial = comItens([{ slug: "dominio", quantidade: 1, observacao: "" }]);
    const estado = orcamentoReducer(inicial, { tipo: "quantidade", slug: "dominio", quantidade: 7 });
    expect(estado.itens[0].quantidade).toBe(7);
  });

  it("quantidade zero remove o item", () => {
    const inicial = comItens([{ slug: "dominio", quantidade: 3, observacao: "" }]);
    const estado = orcamentoReducer(inicial, { tipo: "quantidade", slug: "dominio", quantidade: 0 });
    expect(estado.itens).toEqual([]);
  });

  it("quantidade negativa remove o item", () => {
    const inicial = comItens([{ slug: "dominio", quantidade: 3, observacao: "" }]);
    const estado = orcamentoReducer(inicial, {
      tipo: "quantidade",
      slug: "dominio",
      quantidade: -2,
    });
    expect(estado.itens).toEqual([]);
  });
});

describe("observacao", () => {
  it("altera so a observacao do item indicado", () => {
    const inicial = comItens([
      { slug: "dominio", quantidade: 1, observacao: "" },
      { slug: "hospedagem", quantidade: 1, observacao: "manter" },
    ]);
    const estado = orcamentoReducer(inicial, {
      tipo: "observacao",
      slug: "dominio",
      observacao: "dois dominios",
    });
    expect(estado.itens[0].observacao).toBe("dois dominios");
    expect(estado.itens[1].observacao).toBe("manter");
  });
});

describe("limpar", () => {
  it("esvazia a lista", () => {
    const inicial = comItens([{ slug: "dominio", quantidade: 1, observacao: "" }]);
    expect(orcamentoReducer(inicial, { tipo: "limpar" })).toEqual(ESTADO_INICIAL);
  });
});

describe("acao desconhecida", () => {
  it("devolve o estado sem alteracao", () => {
    const inicial = comItens([{ slug: "dominio", quantidade: 1, observacao: "" }]);
    expect(orcamentoReducer(inicial, { tipo: "inventada" })).toBe(inicial);
  });
});

describe("hidratar", () => {
  it("aceita uma lista valida", () => {
    const bruto = [{ slug: "dominio", quantidade: 2, observacao: "urgente" }];
    expect(hidratar(bruto)).toEqual({ itens: bruto });
  });

  it("descarta entradas sem slug", () => {
    const bruto = [{ quantidade: 2 }, { slug: "dominio", quantidade: 1, observacao: "" }];
    expect(hidratar(bruto).itens).toHaveLength(1);
  });

  it("descarta itens que sairam do catalogo", () => {
    const bruto = [{ slug: "produto-descontinuado", quantidade: 1, observacao: "" }];
    expect(hidratar(bruto).itens).toEqual([]);
  });

  it("normaliza quantidade invalida para 1", () => {
    const bruto = [{ slug: "dominio", quantidade: "muitos", observacao: "" }];
    expect(hidratar(bruto).itens[0].quantidade).toBe(1);
  });

  it("normaliza observacao ausente para string vazia", () => {
    const bruto = [{ slug: "dominio", quantidade: 1 }];
    expect(hidratar(bruto).itens[0].observacao).toBe("");
  });

  it("devolve o estado inicial para entrada que nao e lista", () => {
    expect(hidratar(null)).toEqual(ESTADO_INICIAL);
    expect(hidratar("lixo")).toEqual(ESTADO_INICIAL);
    expect(hidratar(undefined)).toEqual(ESTADO_INICIAL);
  });
});

describe("serializar", () => {
  it("devolve a lista de itens", () => {
    const estado = comItens([{ slug: "dominio", quantidade: 1, observacao: "" }]);
    expect(serializar(estado)).toEqual(estado.itens);
  });

  it("o resultado sobrevive a uma volta por JSON", () => {
    const estado = comItens([{ slug: "dominio", quantidade: 3, observacao: "com acentuação" }]);
    const volta = hidratar(JSON.parse(JSON.stringify(serializar(estado))));
    expect(volta).toEqual(estado);
  });
});
