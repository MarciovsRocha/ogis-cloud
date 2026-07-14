#!/usr/bin/env python3
"""
Gera o logo (PNG) e a assinatura de e-mail HTML da ogis.cloud.

O logo é embutido no HTML em base64 (data URI) — a assinatura NÃO depende de
nenhum link externo/imagem hospedada, exatamente como a assinatura do Ogis Garage.

Uso:
    python gerar-assinatura.py

Saídas (na pasta email-signature/):
    logo-mark.png                  -> o badge da marca (reaproveitável)
    assinatura-ogis-cloud.html     -> a assinatura pronta (edite os [placeholders])

Requisitos: Pillow  (pip install Pillow)
"""
import base64
import os

from PIL import Image, ImageDraw

OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# --- Cores da identidade "Premium Dark + Gold" da ogis.cloud ---
TILE = (28, 25, 23, 255)         # #1c1917  (tile do badge)
GOLD = (202, 138, 4, 255)        # #ca8a04  (anel)
GOLD_LIGHT = (234, 179, 8, 255)  # #eab308  (ponto)


def gerar_logo(size: int = 256, scale: int = 4) -> str:
    """Desenha o badge (tile arredondado + anel dourado + ponto) e salva o PNG.

    Renderiza em `scale`x e reduz com LANCZOS para bordas suaves (antialias).
    As proporções seguem o favicon.svg do site (viewBox 64).
    """
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Tile arredondado (fundo do badge)
    raio_tile = int(s * 0.22)
    d.rounded_rectangle([0, 0, s - 1, s - 1], radius=raio_tile, fill=TILE)

    # Anel (ring) — cx=0.42, cy=0.53, r=0.20, espessura=0.095 (normalizado)
    cx, cy, r = s * 0.42, s * 0.53, s * 0.20
    espessura = max(1, int(s * 0.095))
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=GOLD, width=espessura)

    # Ponto (dot) — lower-right do anel
    dx, dy, dr = s * 0.73, s * 0.655, s * 0.078
    d.ellipse([dx - dr, dy - dr, dx + dr, dy + dr], fill=GOLD_LIGHT)

    img = img.resize((size, size), Image.LANCZOS)
    caminho = os.path.join(OUT_DIR, "logo-mark.png")
    img.save(caminho, "PNG")
    return caminho


def base64_de(caminho: str) -> str:
    with open(caminho, "rb") as f:
        return base64.b64encode(f.read()).decode("ascii")


# Template da assinatura (HTML de e-mail: tabelas + estilos inline = máxima
# compatibilidade). O único campo dinâmico é {b64} (o logo). Os dados pessoais
# ficam entre [colchetes] para você substituir.
HTML = """<!-- ============================================================ -->
<!-- ASSINATURA DE E-MAIL - OGIS.CLOUD                            -->
<!-- Identidade: fundo asfalto (#0c0a09) + ouro (#ca8a04/#eab308) -->
<!-- Logo EMBUTIDA (base64) - nao depende de link externo.        -->
<!--                                                              -->
<!-- COMO USAR:                                                   -->
<!-- 1. Substitua os campos entre [colchetes] pelos seus dados.   -->
<!-- 2. Cole o HTML na configuracao de assinatura do cliente.     -->
<!-- Gerado por email-signature/gerar-assinatura.py               -->
<!-- ============================================================ -->

<table cellpadding="0" cellspacing="0" border="0" style="background-color: #0c0a09; border-radius: 12px; border: 1px solid #292524; font-family: Arial, Helvetica, sans-serif;">
  <tr>
    <td style="padding: 18px 22px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <!-- LOGO (embutida em base64) -->
          <td style="vertical-align: middle; padding-right: 20px; border-right: 2px solid #eab308;">
            <img src="data:image/png;base64,{b64}"
                 alt="ogis.cloud"
                 width="72"
                 style="display: block; width: 72px; height: auto; border: 0;">
          </td>

          <!-- DADOS -->
          <td style="vertical-align: middle; padding-left: 20px;">
            <div style="font-family: 'Poppins', Arial, Helvetica, sans-serif; font-size: 18px; font-weight: bold; color: #fafaf9; letter-spacing: 0.2px;">
              <a href="https://ogis.cloud" style="color: #fafaf9; text-decoration: none;">ogis<span style="color: #eab308;">.cloud</span></a>
            </div>

            <div style="font-size: 15px; font-weight: bold; color: #e7e5e4; padding-top: 6px;">
              [Marcio Rocha]
            </div>

            <div style="font-size: 12px; color: #eab308; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; padding-top: 2px; padding-bottom: 12px;">
              [Desenvolvedor Full-Stack &amp; Arquiteto de Software]
            </div>

            <div style="font-size: 13px; color: #d6d3d1; padding-bottom: 4px;">
              <span style="color: #eab308;">&#9993;</span>&nbsp;
              <a href="mailto:[contato@ogis.cloud]" style="color: #d6d3d1; text-decoration: none;">[contato@ogis.cloud]</a>
            </div>

            <div style="font-size: 13px; color: #d6d3d1; padding-bottom: 4px;">
              <span style="color: #eab308;">&#9742;</span>&nbsp;
              <a href="tel:+5541999999999" style="color: #d6d3d1; text-decoration: none;">[+55 (41) 99999-9999]</a>
            </div>

            <div style="font-size: 13px; color: #d6d3d1;">
              <span style="color: #eab308; font-weight: bold;">&#9873;</span>&nbsp;
              [Curitiba, PR &mdash; Brasil]
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
"""


def main():
    caminho_logo = gerar_logo()
    b64 = base64_de(caminho_logo)
    html = HTML.format(b64=b64)
    caminho_html = os.path.join(OUT_DIR, "assinatura-ogis-cloud.html")
    with open(caminho_html, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Logo gerado:     {caminho_logo}")
    print(f"Assinatura:      {caminho_html}")
    print(f"Base64 do logo:  {len(b64)} chars embutidos (sem link externo)")


if __name__ == "__main__":
    main()
