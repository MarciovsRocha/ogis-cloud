import { describe, it, expect } from "vitest";
import { slugTitulo } from "./slug.js";

describe("slugTitulo", () => {
  it("tira acento, pontuação e caixa", () => {
    expect(slugTitulo("3. Domínio e propriedade")).toBe("3-dominio-e-propriedade");
    expect(slugTitulo("5. Pagamento e suspensão")).toBe("5-pagamento-e-suspensao");
  });

  it("não deixa hífen sobrando nas pontas", () => {
    expect(slugTitulo("  — Contato —  ")).toBe("contato");
  });
});
