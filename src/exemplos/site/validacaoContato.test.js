import { describe, it, expect } from "vitest";
import { validarContato, textoContato } from "./validacaoContato.js";

describe("validarContato", () => {
  it("aceita nome e mensagem preenchidos", () => {
    expect(validarContato({ nome: "Ana", mensagem: "Meu site saiu do ar ontem" })).toEqual({});
  });

  it("exige nome, ignorando espaços", () => {
    expect(validarContato({ nome: "   ", mensagem: "Meu site saiu do ar ontem" })).toEqual({
      nome: "Diga como podemos te chamar.",
    });
  });

  it("exige uma mensagem com pelo menos 10 caracteres úteis", () => {
    expect(validarContato({ nome: "Ana", mensagem: "  oi   " }).mensagem).toBe(
      "Conte em poucas palavras o que você precisa (mínimo de 10 caracteres).",
    );
  });

  it("devolve todos os erros de uma vez", () => {
    expect(Object.keys(validarContato({}))).toEqual(["nome", "mensagem"]);
  });
});

describe("textoContato", () => {
  it("monta a mensagem só com os campos preenchidos", () => {
    expect(textoContato({ nome: "Ana", empresa: "", mensagem: "Preciso de um site" })).toBe(
      "Olá! Vim pelo site da ogis.cloud.\nNome: Ana\nMensagem: Preciso de um site",
    );
  });
});
