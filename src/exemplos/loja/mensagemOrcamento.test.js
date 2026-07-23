import { describe, it, expect } from "vitest";
import { montarMensagem } from "./mensagemOrcamento.js";

const ITENS = [
  { nome: "Site Institucional", quantidade: 1, observacao: "preciso de blog" },
  { nome: "E-mail Profissional", quantidade: 5, observacao: "" },
];

describe("montarMensagem", () => {
  it("lista os itens com quantidade", () => {
    const texto = montarMensagem({ itens: ITENS });
    expect(texto).toContain("- Site Institucional (1)");
    expect(texto).toContain("- E-mail Profissional (5)");
  });

  it("inclui a observacao do item quando existe", () => {
    expect(montarMensagem({ itens: ITENS })).toContain("preciso de blog");
  });

  it("nao deixa sobrar separador quando a observacao esta vazia", () => {
    const texto = montarMensagem({ itens: ITENS });
    expect(texto).toContain("- E-mail Profissional (5)");
    // Sem observação, a linha termina na quantidade — nada de travessão solto.
    expect(texto).not.toContain("(5) —");
  });

  it("inclui os dados de contato preenchidos", () => {
    const texto = montarMensagem({
      nome: "Marcio",
      empresa: "Padaria do Bairro",
      contato: "41999999999",
      itens: ITENS,
    });
    expect(texto).toContain("Nome: Marcio");
    expect(texto).toContain("Empresa: Padaria do Bairro");
    expect(texto).toContain("Contato: 41999999999");
  });

  it("omite as linhas de contato que nao foram preenchidas", () => {
    const texto = montarMensagem({ nome: "Marcio", itens: ITENS });
    expect(texto).toContain("Nome: Marcio");
    expect(texto).not.toContain("Empresa:");
    expect(texto).not.toContain("Contato:");
  });

  it("inclui as observacoes gerais quando existem", () => {
    const texto = montarMensagem({ itens: ITENS, observacoes: "urgente para janeiro" });
    expect(texto).toContain("Observações: urgente para janeiro");
  });

  it("funciona com a lista vazia, sem quebrar", () => {
    const texto = montarMensagem({ itens: [] });
    expect(typeof texto).toBe("string");
    expect(texto).not.toContain("Itens:");
  });

  it("nao menciona preco", () => {
    expect(montarMensagem({ itens: ITENS })).not.toMatch(/R\$/);
  });
});
