import { describe, it, expect, vi } from "vitest";
import { abrirExterno } from "./abrirExterno.js";

function janelaFalsa(retornoDoOpen) {
  return { open: vi.fn(() => retornoDoOpen), location: { href: "https://ogis.cloud/exemplos/loja" } };
}

describe("abrirExterno", () => {
  it("abre em aba nova, corta o opener e não mexe na aba atual", () => {
    const aba = { opener: "pai" };
    const janela = janelaFalsa(aba);

    expect(abrirExterno("https://wa.me/55?text=oi", janela)).toBe(true);
    expect(janela.open).toHaveBeenCalledWith("https://wa.me/55?text=oi", "_blank");
    expect(aba.opener).toBeNull();
    expect(janela.location.href).toBe("https://ogis.cloud/exemplos/loja");
  });

  it("com pop-up bloqueado, segue na mesma aba para a mensagem não se perder", () => {
    const janela = janelaFalsa(null);

    expect(abrirExterno("https://wa.me/55?text=oi", janela)).toBe(false);
    expect(janela.location.href).toBe("https://wa.me/55?text=oi");
  });
});
