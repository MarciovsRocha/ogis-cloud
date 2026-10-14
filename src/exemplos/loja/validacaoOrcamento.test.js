import { describe, it, expect } from "vitest";
import { contatoValido, validarOrcamento } from "./validacaoOrcamento.js";

describe("contatoValido", () => {
  it.each(["ana@oficina.com.br", "  ana@oficina.com  ", "(41) 99867-8072", "+55 41 99867-8072", "4133334444"])(
    "aceita %s",
    (texto) => expect(contatoValido(texto)).toBe(true),
  );

  it.each(["ana@", "ana@oficina", "9999", "41 abc 9999-9999", "a".repeat(300)])("recusa %s", (texto) =>
    expect(contatoValido(texto)).toBe(false),
  );
});

describe("validarOrcamento", () => {
  it("exige o nome", () => {
    expect(validarOrcamento({ nome: " ", contato: "" })).toEqual({ nome: "Diga como podemos te chamar." });
  });

  it("contato é opcional, mas se vier precisa ser e-mail ou telefone", () => {
    expect(validarOrcamento({ nome: "Ana", contato: "" })).toEqual({});
    expect(validarOrcamento({ nome: "Ana", contato: "ana@" })).toEqual({
      contato: "Use um e-mail (nome@empresa.com.br) ou um telefone com DDD.",
    });
  });
});
