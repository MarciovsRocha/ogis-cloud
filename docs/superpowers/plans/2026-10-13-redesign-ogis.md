# Redesign ogis.cloud — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar a identidade "Premium Dark + Gold" pela marca `ogis-infra` (grafite + verde-sinal) na home e dar a cada exemplar (landing, site, loja) uma direção de arte própria, sem mudar conteúdo, rotas nem a lógica testada.

**Architecture:** Quatro temas daisyUI v5 (um arquivo cada) aplicados por superfície através de um componente `<Tema superficie="…">`, que marca a div raiz e o `<html>` com `data-theme`. Exemplares carregados com `React.lazy`, para que GSAP e as fontes de cada exemplar fiquem fora do bundle da home. Componentes visuais reescritos por superfície; `catalogo.js`, reducer, provider e mensagem do orçamento permanecem.

**Tech Stack:** React 19 · Vite 7 · Tailwind v4 · daisyUI 5 · react-router-dom 7 · `@phosphor-icons/react` 2.1.10 · `@fontsource-variable/{geist,geist-mono,archivo,manrope}` 5.3.0 · `gsap` 3.15.0 · Vitest 3 (ambiente node)

**Spec:** `docs/superpowers/specs/2026-10-13-redesign-ogis-design.md`

## Global Constraints

- Nenhum preço em nenhuma página ou arquivo (teste existente `catalogo.test.js` "nao menciona preco" continua verde).
- Conteúdo vem de `src/data/catalogo.js`, `src/data/planos.js`, `src/data/solucoes.js`, `src/exemplos/landing/conteudo.js` e das constantes de copy já existentes; não inventar copy nova além da indicada neste plano.
- Rotas inalteradas: `/`, `/termos`, `/privacidade`, `/exemplos`, `/exemplos/landing`, `/exemplos/site/{,sobre,solucoes,solucoes/:slug,contato}`, `/exemplos/loja/{,p/:slug,orcamento}`.
- Chave do `localStorage` continua `ogis:orcamento`; `orcamentoReducer.js`, `OrcamentoProvider.jsx`, `orcamentoContexto.js`, `useOrcamento.js`, `mensagemOrcamento.js` e `filtrarCatalogo` NÃO são modificados.
- `SEO` por página e `noindex` nos exemplares preservados exatamente como estão hoje (mesmos `title`/`description`/`path`/`noindex`).
- Temas: `ogis-infra` (home, termos, privacidade, índice, faixa) · `exemplar-campanha` (landing) · `exemplar-sereno` (site) · `exemplar-bento` (loja).
- Todo par texto/fundo usado passa WCAG AA (4.5:1 normal; 3:1 para texto ≥ 24px). Em `ogis-infra`, texto secundário pequeno nunca abaixo de `text-base-content/55`.
- Ícones: só `@phosphor-icons/react`. Ao fim, `lucide-react` não aparece em `src/` nem no `package.json`.
- Movimento: só `transform` e `opacity` (exceção: o `filter: blur` de entrada do `.revelar`, previsto na spec). Curva padrão `cubic-bezier(0.32,0.72,0,1)` (utilitário `ease-mola`). `prefers-reduced-motion: reduce` mostra tudo no estado final.
- `gsap` só pode ser importado dentro de `src/exemplos/landing/`.
- Commits pequenos, mensagem em português no estilo do repo (`feat:`, `refactor:`, `docs:`, `test:`), terminando com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

**Ajustes técnicos em relação à spec (decididos ao planejar):**
- Fontes por tema: cada tema sobrescreve `--font-sans`, `--font-display` e `--font-mono` diretamente em `[data-theme="…"]`. Um `--font-sans: var(--font-body)` no `@theme` seria resolvido no `:root`, antes de o tema do exemplar existir, e não trocaria a fonte.
- No tema `exemplar-campanha`, o cobalto `#2734E8` vive em `primary` (e não em `base-200`), para que `bg-base-200` nunca coloque texto escuro sobre cobalto. Blocos cobalto usam `bg-primary text-primary-content`.
- Provas da landing: revelação por máscara em vez de contagem (os valores são `1`, `24/7`, `0`).
- Cabeçalho da landing: ao rolar, ganha régua e fundo sólido, sem mudar de altura (não se anima altura).
- O contador do botão de orçamento da loja pulsa sempre que `total` muda.
- `<Tema>` também grava `data-theme` no `<html>`, para que o fundo de overscroll, a `color-scheme` e o fallback do `Suspense` acompanhem a superfície.
- Envio para WhatsApp em formulários com validação passa por `abrirExterno(url)`. `window.open(url, "_blank", "noopener")` sempre devolve `null`, então o helper abre sem `noopener`, zera `opener` e cai para `location.href` só quando o pop-up foi de fato bloqueado.
- Contato no orçamento é opcional, mas, se preenchido, precisa ser e-mail ou telefone válido. Nome é obrigatório nos dois formulários.

## Review Focus

1. **Troca de superfície pelo histórico** (home → loja → botão Voltar → home): o `<html>`, o fundo e a `color-scheme` precisam voltar a `ogis-infra`, sem fundo creme atrás da home. Verificado no Task 1, Step 9.
2. **Redimensionar a landing com pins ativos** (1280px → 375px → 1280px): as cartas e a trilha não podem ficar `absolute`/deslocadas no mobile, e os pins voltam ao crescer. Verificado no Task 7, Step 6.
3. **Pop-up bloqueado** ao enviar para o WhatsApp a partir dos formulários: a mensagem ainda chega (fallback para a mesma aba), e nada navega duas vezes quando o pop-up abre. Teste em `abrirExterno.test.js` (Task 2).
4. **Entrada longa sem espaços** (300 caracteres em nome/observação) e item com nome longo: tickets, cards e campos não estouram a largura no mobile. Verificado no Task 11, Step 8.
5. **Teclado nos menus**: Esc fecha o menu da home e o painel do site, e o foco volta ao botão que abriu. Verificado no Task 3, Step 7 e no Task 8, Step 7.

---

## File Structure

```
index.html                                   MOD  sem data-theme fixo de ogis-dark, sem Google Fonts, theme-color #0D0F0E
vite.config.js                               MOD  build.manifest = true
package.json                                 MOD  deps novas; remove lucide-react; script verificar:bundle
scripts/verificar-bundle.mjs                 NEW  gate: entrada da home sem GSAP nem @font-face de Archivo/Manrope
.claude/launch.json                          NEW  config do dev server para o navegador do app
public/favicon.svg                           MOD  grafite + verde-sinal
src/main.jsx                                 MOD  importa Geist + Geist Mono
src/index.css                                MOD  imports dos temas, tokens, .revelar, z-index, skip link, foco
src/styles/temas.js                          NEW  TEMA_POR_SUPERFICIE + temaDe()
src/styles/temas.test.js                     NEW
src/styles/temas/ogis-infra.css              NEW
src/styles/temas/exemplar-campanha.css       NEW
src/styles/temas/exemplar-sereno.css         NEW
src/styles/temas/exemplar-bento.css          NEW
src/lib/abrirExterno.js (+ .test.js)         NEW  abre link externo com fallback de pop-up bloqueado
src/lib/slug.js (+ .test.js)                 NEW  slugTitulo() para âncoras das páginas legais
src/hooks/useRevelar.js                      NEW  IntersectionObserver → .revelado
src/components/Tema.jsx                      NEW  aplica data-theme na div e no <html>
src/components/Revelar.jsx                   NEW  wrapper com .revelar + atraso
src/components/Wordmark.jsx                  MOD  variantes infra | mono | simbolo
src/components/BotaoContato.jsx              NEW  botão ilha WhatsApp/e-mail
src/components/SeloEscopo.jsx                MOD  versão neutra por tokens
src/components/SectionHeading.jsx            MOD  rótulo mono + título alinhado à esquerda
src/components/FaixaExemplar.jsx             MOD  sempre ogis-infra, h-11 exato
src/components/LegalLayout.jsx               MOD  coluna 68ch + índice lateral
src/components/Secao.jsx                     NEW  seção legal com âncora
src/components/home/*.jsx                    NEW  Navbar, Hero, PainelStatus, Solucoes, ComoFunciona,
                                                  VejaFuncionando, CartaoExemplar, MiniaturaExemplar, Planos,
                                                  ParaQuemConfianca, Contato, Footer
src/components/{Hero,Navbar,Solucoes,ComoFunciona,VejaFuncionando,Planos,ParaQuem,Confianca,
               CTAFinal,Contato,Footer,CardCatalogo}.jsx      DEL  substituídos
src/layouts/SiteLayout.jsx, ExemplarLayout.jsx                  MOD
src/App.jsx                                  MOD  lazy + Tema na rota curinga
src/pages/LandingPage.jsx, Termos.jsx, Privacidade.jsx          MOD
src/data/catalogo.js, exemplares.js          MOD  só ícones (e campo `estilo` em exemplares)
src/exemplos/IndiceExemplos.jsx, NaoEncontrado.jsx              MOD
src/exemplos/landing/LandingExemplar.jsx     MOD
src/exemplos/landing/secoes.jsx              DEL  → landing/secoes/*.jsx
src/exemplos/landing/secoes/*.jsx            NEW  BotaoDiagnostico, Cabecalho, Hero, Problema, Solucao, Passos,
                                                  Provas, Faq, CtaFinal, Rodape
src/exemplos/landing/landing.css             NEW  contorno, letreiro, estados .ativa dos pins
src/exemplos/landing/useGsap.js              NEW  gsap.matchMedia escopado + constantes de mídia
src/exemplos/landing/animacoes.js            NEW  funções de animação por seção (estáveis, fora dos componentes)
src/exemplos/site/*.jsx                      MOD  visual S1
src/exemplos/site/ListaSolucoes.jsx          NEW  lista editorial (substitui CardCatalogo no site)
src/exemplos/site/site.css                   NEW  sublinhado animado + painel <dialog>
src/exemplos/site/validacaoContato.js (+ .test.js)              NEW
src/exemplos/loja/*.jsx                      MOD  visual J2 (exceto provider/contexto/hook)
src/exemplos/loja/CartaoProduto.jsx          NEW
src/exemplos/loja/corCategoria.js (+ .test.js)                  NEW
src/exemplos/loja/validacaoOrcamento.js (+ .test.js)            NEW
src/exemplos/loja/loja.css                   NEW  keyframes do contador
email-signature/gerar-assinatura.py          MOD  paleta B
email-signature/logo-mark.png, assinatura-ogis-cloud.html      REGEN
README.md                                    MOD
```

---

### Task 1: Base de temas, fontes e carregamento sob demanda

**Files:**
- Create: `src/styles/temas.js`, `src/styles/temas.test.js`, `src/styles/temas/ogis-infra.css`, `src/styles/temas/exemplar-campanha.css`, `src/styles/temas/exemplar-sereno.css`, `src/styles/temas/exemplar-bento.css`, `src/components/Tema.jsx`, `.claude/launch.json`
- Modify: `package.json`, `index.html`, `src/main.jsx`, `src/index.css`, `src/App.jsx`, `src/layouts/SiteLayout.jsx`, `src/layouts/ExemplarLayout.jsx`, `src/exemplos/IndiceExemplos.jsx`, `src/exemplos/landing/LandingExemplar.jsx`, `src/exemplos/site/SiteExemplar.jsx`, `src/exemplos/loja/LojaExemplar.jsx`

**Interfaces:**
- Produces: `TEMA_POR_SUPERFICIE: { home, indice, faixa, landing, site, loja }` (strings) e `temaDe(superficie: string): string` (lança `Error` para superfície desconhecida) em `src/styles/temas.js`; componente `<Tema superficie: keyof TEMA_POR_SUPERFICIE className?: string>` em `src/components/Tema.jsx`; utilitário Tailwind `ease-mola`; classes globais `.pular-conteudo`, `.revelar`/`.revelado`; variáveis CSS `--z-conteudo`, `--z-cabecalho`, `--z-faixa`, `--z-menu`. Todo `<main>` passa a ter `id="conteudo"`.

- [ ] **Step 1: Instalar dependências**

```bash
npm install @phosphor-icons/react@2.1.10 @fontsource-variable/geist@5.3.0 @fontsource-variable/geist-mono@5.3.0 @fontsource-variable/archivo@5.3.0 @fontsource-variable/manrope@5.3.0 gsap@3.15.0
```

Expected: as seis aparecem em `dependencies`. (`lucide-react` só sai no Task 12.)

- [ ] **Step 2: Escrever o teste que falha**

`src/styles/temas.test.js`:

```js
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
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `npx vitest run src/styles/temas.test.js`
Expected: FAIL — `Failed to resolve import "./temas.js"`.

- [ ] **Step 4: Implementar `temas.js` e os quatro temas**

`src/styles/temas.js`:

```js
// Qual tema daisyUI cada superfície do site usa. Fonte única: layouts,
// <Tema> e a faixa de exemplar leem daqui. Os temas moram em ./temas/*.css.
export const TEMA_POR_SUPERFICIE = {
  home: "ogis-infra",
  indice: "ogis-infra",
  faixa: "ogis-infra",
  landing: "exemplar-campanha",
  site: "exemplar-sereno",
  loja: "exemplar-bento",
};

export function temaDe(superficie) {
  const tema = TEMA_POR_SUPERFICIE[superficie];
  if (!tema) throw new Error(`Superfície desconhecida: ${superficie}`);
  return tema;
}
```

`src/styles/temas/ogis-infra.css`:

```css
/* Marca da holding — "Infraestrutura noturna": grafite + verde-sinal. */
@plugin "daisyui/theme" {
  name: "ogis-infra";
  default: true;
  prefersdark: false;
  color-scheme: dark;

  --color-base-100: #141716;
  --color-base-200: #0d0f0e;
  --color-base-300: #222725;
  --color-base-content: #e8ece9;

  --color-primary: #b8f25b;
  --color-primary-content: #0d0f0e;
  --color-secondary: #e8ece9;
  --color-secondary-content: #0d0f0e;
  --color-accent: #b8f25b;
  --color-accent-content: #0d0f0e;
  --color-neutral: #1b201e;
  --color-neutral-content: #c9d0cc;

  --color-info: #7dd3fc;
  --color-info-content: #0d0f0e;
  --color-success: #b8f25b;
  --color-success-content: #0d0f0e;
  --color-warning: #facc15;
  --color-warning-content: #0d0f0e;
  --color-error: #f87171;
  --color-error-content: #0d0f0e;

  --radius-selector: 1rem;
  --radius-field: 0.75rem;
  --radius-box: 1.5rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 0;
  --noise: 0;
}

[data-theme="ogis-infra"] {
  --font-sans: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

`src/styles/temas/exemplar-campanha.css`:

```css
/* Exemplar landing — "Campanha cinética": osso + cobalto, Archivo 900. */
@plugin "daisyui/theme" {
  name: "exemplar-campanha";
  default: false;
  prefersdark: false;
  color-scheme: light;

  --color-base-100: #f2f1ec;
  --color-base-200: #e8e6de;
  --color-base-300: #d6d3c8;
  --color-base-content: #0e1240;

  --color-primary: #2734e8;
  --color-primary-content: #f2f1ec;
  --color-secondary: #0e1240;
  --color-secondary-content: #f2f1ec;
  --color-accent: #2734e8;
  --color-accent-content: #f2f1ec;
  --color-neutral: #0e1240;
  --color-neutral-content: #f2f1ec;

  --color-info: #2734e8;
  --color-info-content: #f2f1ec;
  --color-success: #1f7a4d;
  --color-success-content: #f2f1ec;
  --color-warning: #b45309;
  --color-warning-content: #f2f1ec;
  --color-error: #b42318;
  --color-error-content: #f2f1ec;

  --radius-selector: 2rem;
  --radius-field: 2rem;
  --radius-box: 0rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 2px;
  --depth: 0;
  --noise: 0;
}

[data-theme="exemplar-campanha"] {
  --font-sans: "Archivo Variable", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Archivo Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

`src/styles/temas/exemplar-sereno.css`:

```css
/* Exemplar site institucional — "Corporativo sereno": marfim, tinta, sálvia. */
@plugin "daisyui/theme" {
  name: "exemplar-sereno";
  default: false;
  prefersdark: false;
  color-scheme: light;

  --color-base-100: #fbfaf8;
  --color-base-200: #f1eee8;
  --color-base-300: #e4dfd6;
  --color-base-content: #2b2926;

  --color-primary: #4e6b57;
  --color-primary-content: #fbfaf8;
  --color-secondary: #2b2926;
  --color-secondary-content: #fbfaf8;
  --color-accent: #e7ede6;
  --color-accent-content: #2b2926;
  --color-neutral: #2b2926;
  --color-neutral-content: #fbfaf8;

  --color-info: #3b5f7a;
  --color-info-content: #fbfaf8;
  --color-success: #3f6b4a;
  --color-success-content: #fbfaf8;
  --color-warning: #8a5a12;
  --color-warning-content: #fbfaf8;
  --color-error: #b42318;
  --color-error-content: #fbfaf8;

  --radius-selector: 0.5rem;
  --radius-field: 0.625rem;
  --radius-box: 1rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 0;
  --noise: 0;
}

[data-theme="exemplar-sereno"] {
  --font-sans: "Manrope Variable", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Manrope Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

`src/styles/temas/exemplar-bento.css`:

```css
/* Exemplar loja — "Bento colorido": creme, café e uma cor por categoria. */
@plugin "daisyui/theme" {
  name: "exemplar-bento";
  default: false;
  prefersdark: false;
  color-scheme: light;

  --color-base-100: #fff7ec;
  --color-base-200: #ffefd9;
  --color-base-300: #f2dcc0;
  --color-base-content: #2a1a0e;

  --color-primary: #ff7a3d;
  --color-primary-content: #2a1a0e;
  --color-secondary: #2a1a0e;
  --color-secondary-content: #fff7ec;
  --color-accent: #ffd249;
  --color-accent-content: #2a1a0e;
  --color-neutral: #2a1a0e;
  --color-neutral-content: #fff7ec;

  --color-info: #2f5d8a;
  --color-info-content: #fff7ec;
  --color-success: #1f7a4d;
  --color-success-content: #fff7ec;
  --color-warning: #9a5b00;
  --color-warning-content: #fff7ec;
  --color-error: #b42318;
  --color-error-content: #fff7ec;

  --radius-selector: 1rem;
  --radius-field: 1rem;
  --radius-box: 1.75rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 0;
  --noise: 0;
}

[data-theme="exemplar-bento"] {
  --font-sans: "Manrope Variable", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Manrope Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

- [ ] **Step 5: Rodar o teste e ver passar**

Run: `npx vitest run src/styles/temas.test.js`
Expected: PASS (5 testes).

- [ ] **Step 6: CSS global, `index.html` e fontes da home**

Substituir `src/index.css` inteiro por:

```css
@import "tailwindcss";
@import "./styles/temas/ogis-infra.css";
@import "./styles/temas/exemplar-campanha.css";
@import "./styles/temas/exemplar-sereno.css";
@import "./styles/temas/exemplar-bento.css";
@plugin "daisyui";

/* =========================================================================
   ogis.cloud — base comum a todas as superfícies.
   Cores e fontes vêm do tema ativo (data-theme); ver src/styles/temas.js.
   ========================================================================= */

@theme static {
  --font-sans: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace;
  --ease-mola: cubic-bezier(0.32, 0.72, 0, 1);
}

:root {
  --z-conteudo: 1;
  --z-cabecalho: 40;
  --z-faixa: 50;
  --z-menu: 60;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  /* O tema troca as variáveis de fonte; quem tem data-theme precisa reaplicá-las. */
  [data-theme] {
    font-family: var(--font-sans);
    background-color: var(--color-base-200);
    color: var(--color-base-content);
  }

  h1,
  h2,
  h3,
  h4,
  .font-display {
    font-family: var(--font-display);
  }

  h1,
  h2,
  h3 {
    text-wrap: balance;
  }

  p {
    text-wrap: pretty;
  }

  :focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 3px;
  }

  /* Compensa cabeçalhos fixos ao rolar para uma âncora. */
  section[id] {
    scroll-margin-top: 96px;
  }
}

/* Link "pular para o conteúdo": invisível até receber foco. */
.pular-conteudo {
  position: fixed;
  left: 1rem;
  top: 0.75rem;
  z-index: var(--z-menu);
  transform: translateY(-200%);
  border-radius: 999px;
  padding: 0.6rem 1rem;
  background: var(--color-primary);
  color: var(--color-primary-content);
  font-size: 0.875rem;
  font-weight: 600;
  transition: transform 0.3s var(--ease-mola);
}

.pular-conteudo:focus {
  transform: translateY(0);
}

/* Entrada ao rolar — ver src/hooks/useRevelar.js e src/components/Revelar.jsx. */
.revelar {
  opacity: 0;
  transform: translateY(24px);
  filter: blur(6px);
  transition:
    opacity 0.8s var(--ease-mola),
    transform 0.8s var(--ease-mola),
    filter 0.8s var(--ease-mola);
  transition-delay: var(--atraso, 0ms);
}

.revelar.revelado {
  opacity: 1;
  transform: none;
  filter: none;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  .revelar {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
}
```

Em `index.html`: trocar `data-theme="ogis-dark"` por `data-theme="ogis-infra"`, trocar `content="#0c0a09"` do `theme-color` por `content="#0D0F0E"` e apagar as três linhas `<link rel="preconnect" …>` e o `<link href="https://fonts.googleapis.com/…" rel="stylesheet" />` (com as quebras de linha dele).

Em `src/main.jsx`, logo abaixo de `import { HelmetProvider } from "react-helmet-async";`, adicionar:

```js
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
```

- [ ] **Step 7: `<Tema>`, layouts e lazy loading**

`src/components/Tema.jsx`:

```jsx
import { useLayoutEffect } from "react";
import { temaDe } from "../styles/temas.js";

// Aplica o tema da superfície na própria div e no <html>. O <html> garante que o
// fundo de overscroll, a color-scheme e o fallback do Suspense acompanhem a
// página atual, inclusive ao voltar pelo histórico.
export default function Tema({ superficie, className = "", children }) {
  const tema = temaDe(superficie);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = tema;
  }, [tema]);

  return (
    <div data-theme={tema} className={`min-h-screen ${className}`}>
      {children}
    </div>
  );
}
```

`src/layouts/SiteLayout.jsx`:

```jsx
import { Outlet } from "react-router-dom";
import Tema from "../components/Tema.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// Chrome do site real da ogis.cloud.
export default function SiteLayout() {
  return (
    <Tema superficie="home">
      <a href="#conteudo" className="pular-conteudo">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <Outlet />
      </main>
      <Footer />
    </Tema>
  );
}
```

`src/layouts/ExemplarLayout.jsx`:

```jsx
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import FaixaExemplar from "../components/FaixaExemplar.jsx";

// Chrome mínimo dos exemplares: a faixa da OGIS e nada mais. Cada exemplar
// aplica o próprio tema com <Tema>. A faixa mede exatamente 44px (h-11):
// pt-11 aqui e top-11 nos cabeçalhos dos exemplares dependem disso.
export default function ExemplarLayout() {
  return (
    <div className="min-h-screen pt-11">
      <a href="#conteudo" className="pular-conteudo">
        Pular para o conteúdo
      </a>
      <FaixaExemplar />
      <Suspense fallback={<div className="min-h-screen" />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
```

`src/App.jsx`:

```jsx
import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import ExemplarLayout from "./layouts/ExemplarLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Termos from "./pages/Termos.jsx";
import Privacidade from "./pages/Privacidade.jsx";
import Tema from "./components/Tema.jsx";

// Exemplares em chunks próprios: GSAP e as fontes de cada um não pesam na home.
const IndiceExemplos = lazy(() => import("./exemplos/IndiceExemplos.jsx"));
const NaoEncontrado = lazy(() => import("./exemplos/NaoEncontrado.jsx"));
const LandingExemplar = lazy(() => import("./exemplos/landing/LandingExemplar.jsx"));
const SiteExemplar = lazy(() => import("./exemplos/site/SiteExemplar.jsx"));
const LojaExemplar = lazy(() => import("./exemplos/loja/LojaExemplar.jsx"));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Site real da holding */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/privacidade" element={<Privacidade />} />
        </Route>

        {/* Exemplares — cada um traz o próprio tema, cabeçalho e rodapé */}
        <Route element={<ExemplarLayout />}>
          <Route path="/exemplos" element={<IndiceExemplos />} />
          <Route path="/exemplos/landing" element={<LandingExemplar />} />
          <Route path="/exemplos/site/*" element={<SiteExemplar />} />
          <Route path="/exemplos/loja/*" element={<LojaExemplar />} />
          <Route
            path="/exemplos/*"
            element={
              <Tema superficie="indice">
                <NaoEncontrado />
              </Tema>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

Envolver cada exemplar com `<Tema>`, importar as fontes dele e dar `id="conteudo"` ao `<main>`:

- `src/exemplos/IndiceExemplos.jsx`: `import Tema from "../components/Tema.jsx";`; trocar o fragmento externo `<>…</>` por `<Tema superficie="indice">…</Tema>` e a `<section id="exemplares" …>` por `<main id="conteudo"><section id="exemplares" …>…</section></main>`.
- `src/exemplos/landing/LandingExemplar.jsx`: no topo, `import "@fontsource-variable/archivo";` e `import Tema from "../../components/Tema.jsx";`; trocar `<>`/`</>` por `<Tema superficie="landing">`/`</Tema>`; `<main>` → `<main id="conteudo">`.
- `src/exemplos/site/SiteExemplar.jsx`: `import "@fontsource-variable/manrope";` e `import Tema from "../../components/Tema.jsx";`; `<>`/`</>` → `<Tema superficie="site">`/`</Tema>`; `<main>` → `<main id="conteudo">`.
- `src/exemplos/loja/LojaExemplar.jsx`: `import "@fontsource-variable/manrope";` e `import Tema from "../../components/Tema.jsx";`; envolver `<OrcamentoProvider>…</OrcamentoProvider>` com `<Tema superficie="loja">…</Tema>`; `<main>` → `<main id="conteudo">`.

`.claude/launch.json` (criar só se não existir):

```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "ogis-dev", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "port": 5173 }
  ]
}
```

- [ ] **Step 8: Gates**

Run: `npm test && npm run lint && npm run build`
Expected: 56 testes passando (51 + 5), lint sem erros, build ok.

Run: `grep -o 'data-theme=exemplar-bento\|data-theme="exemplar-bento"' dist/assets/*.css | head -1`
Expected: uma ocorrência. Se vier vazio, o `@plugin` dentro de arquivo importado não foi processado: mover os quatro blocos `@plugin "daisyui/theme" {…}` para dentro de `src/index.css` (logo após `@plugin "daisyui";`), manter os blocos `[data-theme=…]` nos arquivos e rodar de novo.

- [ ] **Step 9: Conferir no navegador (Review Focus 1)**

Subir o dev server pelo navegador do app (`preview_start` com `name: "ogis-dev"`) e abrir `/`, `/exemplos/landing`, `/exemplos/site`, `/exemplos/loja`. Esperado: home grafite com texto claro em Geist; landing com fundo osso e texto em Archivo; site marfim em Manrope; loja creme em Manrope. O visual antigo dos componentes ainda aparece (é esperado), só com as cores novas.
Depois: abrir `/`, navegar para `/exemplos/loja`, voltar pelo histórico (`navigate` com `url: "back"`) e rodar `document.documentElement.dataset.theme` no console: precisa ser `ogis-infra`, e o fundo atrás da home não pode ficar creme.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json index.html src/main.jsx src/index.css src/styles src/components/Tema.jsx src/App.jsx src/layouts src/exemplos/IndiceExemplos.jsx src/exemplos/landing/LandingExemplar.jsx src/exemplos/site/SiteExemplar.jsx src/exemplos/loja/LojaExemplar.jsx .claude/launch.json
git commit -m "feat: temas por superficie, fontes self-hosted e exemplares sob demanda

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Primitivos compartilhados e troca de ícones nos dados

**Files:**
- Create: `src/lib/abrirExterno.js`, `src/lib/abrirExterno.test.js`, `src/lib/slug.js`, `src/lib/slug.test.js`, `src/hooks/useRevelar.js`, `src/components/Revelar.jsx`, `src/components/BotaoContato.jsx`, `src/components/Secao.jsx`
- Modify: `src/components/Wordmark.jsx`, `src/components/SeloEscopo.jsx`, `src/components/SectionHeading.jsx`, `src/components/FaixaExemplar.jsx`, `src/exemplos/NaoEncontrado.jsx`, `src/data/catalogo.js`, `src/data/exemplares.js`, `public/favicon.svg`

**Interfaces:**
- Consumes: `TEMA_POR_SUPERFICIE` (Task 1), `linkWhatsApp`, `linkEmail`, `MSG`, `ASSUNTO` de `src/config.js`.
- Produces:
  - `abrirExterno(url: string, janela = window): boolean` (true = abriu em aba nova; false = caiu para a mesma aba)
  - `slugTitulo(texto: string): string`
  - `useRevelar(): RefObject` e `<Revelar as?="div" atraso?={ms} className? …>`
  - `<Wordmark variante?: "infra" | "mono" | "simbolo" className?>` (sem a antiga prop `withText`)
  - `<BotaoContato canal?: "whatsapp" | "email" mensagem? assunto? variante?: "primario" | "secundario" className? children?>`
  - `<Secao titulo: string>` (renderiza `<section id={slugTitulo(titulo)}><h2>`)
  - `<SeloEscopo item className?>`, `<SectionHeading eyebrow title subtitle? className?>`
  - `EXEMPLARES[i].estilo: "campanha" | "sereno" | "bento"`; `CATALOGO[i].icone` e `CATEGORIAS[i].icone` passam a ser componentes Phosphor

- [ ] **Step 1: Escrever os testes que falham**

`src/lib/abrirExterno.test.js`:

```js
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
```

`src/lib/slug.test.js`:

```js
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib`
Expected: FAIL — `Failed to resolve import "./abrirExterno.js"` e `"./slug.js"`.

- [ ] **Step 3: Implementar**

`src/lib/abrirExterno.js`:

```js
// Abre um link externo (WhatsApp) em aba nova. Não usa "noopener" no open():
// com ele o navegador devolve null sempre, e não daria para distinguir um
// pop-up bloqueado. O opener é cortado à mão logo depois.
export function abrirExterno(url, janela = window) {
  const aba = janela.open(url, "_blank");
  if (aba) {
    aba.opener = null;
    return true;
  }
  janela.location.href = url;
  return false;
}
```

`src/lib/slug.js`:

```js
/** "3. Domínio e propriedade" → "3-dominio-e-propriedade" (âncoras das páginas legais). */
export function slugTitulo(texto) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/lib`
Expected: PASS (4 testes).

- [ ] **Step 5: Revelar, Wordmark, BotaoContato, Secao**

`src/hooks/useRevelar.js`:

```js
import { useEffect, useRef } from "react";

// Marca o elemento com .revelado quando ele entra na tela (uma vez só).
// O CSS de .revelar mora em src/index.css e respeita prefers-reduced-motion.
export function useRevelar() {
  const ref = useRef(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      elemento.classList.add("revelado");
      return undefined;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          elemento.classList.add("revelado");
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return ref;
}
```

`src/components/Revelar.jsx`:

```jsx
import { useRevelar } from "../hooks/useRevelar.js";

// Envolve um bloco com a entrada .revelar. `atraso` em ms escalona irmãos.
export default function Revelar({ as: Tag = "div", atraso = 0, className = "", style, children, ...resto }) {
  const ref = useRevelar();
  return (
    <Tag
      ref={ref}
      className={`revelar ${className}`}
      style={{ ...style, "--atraso": `${atraso}ms` }}
      {...resto}
    >
      {children}
    </Tag>
  );
}
```

`src/components/Wordmark.jsx`:

```jsx
// Marca ogis.cloud: símbolo (anel + ponto) + texto.
// "infra": símbolo e ponto na cor primária, texto em mono (home).
// "mono": tudo na cor do texto atual (cabeçalhos dos exemplares).
// "simbolo": só o símbolo, na cor do texto atual.
function Simbolo() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-auto shrink-0" aria-hidden="true">
      <circle cx="27" cy="34" r="13" fill="none" stroke="currentColor" strokeWidth="6" />
      <circle cx="47" cy="42" r="5" fill="currentColor" />
    </svg>
  );
}

export default function Wordmark({ variante = "infra", className = "h-7" }) {
  if (variante === "simbolo") {
    return (
      <span role="img" aria-label="ogis.cloud" className={`inline-flex ${className}`}>
        <Simbolo />
      </span>
    );
  }

  const infra = variante === "infra";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`h-full ${infra ? "text-primary" : ""}`}>
        <Simbolo />
      </span>
      <span
        className={
          infra
            ? "font-mono text-[0.95rem] font-medium tracking-tight text-base-content"
            : "font-display text-lg font-bold tracking-tight"
        }
      >
        ogis<span className={infra ? "text-primary" : ""}>.cloud</span>
      </span>
    </span>
  );
}
```

`src/components/BotaoContato.jsx`:

```jsx
import { ArrowUpRight, Envelope, WhatsappLogo } from "@phosphor-icons/react";
import { ASSUNTO, MSG, linkEmail, linkWhatsApp } from "../config.js";

const ESTILOS = {
  primario: {
    botao: "bg-primary text-primary-content",
    circulo: "bg-primary-content/10",
  },
  secundario: {
    botao:
      "bg-base-content/[0.04] text-base-content ring-1 ring-base-content/15 hover:bg-base-content/[0.08]",
    circulo: "bg-base-content/10",
  },
};

// Botão "ilha": pílula com o ícone de seta dentro de um círculo próprio.
export default function BotaoContato({
  canal = "whatsapp",
  mensagem = MSG.contato,
  assunto = ASSUNTO.contato,
  variante = "primario",
  className = "",
  children,
}) {
  const whatsapp = canal === "whatsapp";
  const Icone = whatsapp ? WhatsappLogo : Envelope;
  const estilo = ESTILOS[variante];

  return (
    <a
      href={whatsapp ? linkWhatsApp(mensagem) : linkEmail(assunto, mensagem)}
      {...(whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center justify-between gap-3 rounded-full py-2 pl-5 pr-2 text-sm font-semibold transition-all duration-500 ease-mola active:scale-[0.98] ${estilo.botao} ${className}`}
    >
      <span className="inline-flex items-center gap-2">
        <Icone className="h-4.5 w-4.5" aria-hidden="true" />
        {children ?? (whatsapp ? "Falar no WhatsApp" : "Falar por e-mail")}
      </span>
      <span
        aria-hidden="true"
        className={`grid h-8 w-8 place-items-center rounded-full transition-transform duration-500 ease-mola group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-105 ${estilo.circulo}`}
      >
        <ArrowUpRight weight="bold" className="h-4 w-4" />
      </span>
    </a>
  );
}
```

`src/components/Secao.jsx`:

```jsx
import { slugTitulo } from "../lib/slug.js";

// Seção de página legal. O LegalLayout monta o índice a partir dos títulos.
export default function Secao({ titulo, children }) {
  return (
    <section id={slugTitulo(titulo)} className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold tracking-[-0.02em] text-base-content">{titulo}</h2>
      {children}
    </section>
  );
}
```

- [ ] **Step 6: SeloEscopo, SectionHeading, FaixaExemplar, NaoEncontrado, favicon**

`src/components/SeloEscopo.jsx`:

```jsx
import { Clock } from "@phosphor-icons/react";
import { textoEscopo } from "../data/catalogo.js";

// Ocupa o lugar do preço: comunica escopo e prazo, não valor.
export default function SeloEscopo({ item, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-base-content/70 ${className}`}>
      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {textoEscopo(item)}
    </span>
  );
}
```

`src/components/SectionHeading.jsx`:

```jsx
// Título de seção da home: rótulo mono minúsculo + título alinhado à esquerda.
export default function SectionHeading({ eyebrow, title, subtitle, className = "" }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && (
        <p className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          {eyebrow.toLowerCase()}
        </p>
      )}
      <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-base-content sm:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-5 max-w-[56ch] text-lg text-base-content/70">{subtitle}</p>}
    </div>
  );
}
```

`src/components/FaixaExemplar.jsx`:

```jsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { TEMA_POR_SUPERFICIE } from "../styles/temas.js";
import Wordmark from "./Wordmark.jsx";

// Faixa fixa de 44px (h-11) no topo dos exemplares, sempre no tema da OGIS.
// ExemplarLayout usa pt-11 e os cabeçalhos dos exemplares usam top-11: se a
// altura mudar, os três mudam juntos.
export default function FaixaExemplar() {
  return (
    <div
      data-theme={TEMA_POR_SUPERFICIE.faixa}
      className="fixed inset-x-0 top-0 z-(--z-faixa) border-b border-white/[0.08] bg-base-200/95 backdrop-blur-md"
    >
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-3 px-4">
        <span className="inline-flex min-w-0 items-center gap-3 text-xs text-base-content/70">
          <Wordmark variante="simbolo" className="h-4 text-primary" />
          <span className="truncate">
            <strong className="font-medium text-base-content">Exemplar OGIS</strong>
            <span className="hidden sm:inline"> · demonstração navegável feita pela ogis.cloud</span>
          </span>
        </span>
        <Link
          to="/"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] text-primary transition-colors duration-300 ease-mola hover:bg-primary/10"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          voltar ao site
        </Link>
      </div>
    </div>
  );
}
```

`src/exemplos/NaoEncontrado.jsx`:

```jsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";

// 404 neutro: usa só tokens do tema, então herda o visual do exemplar em volta.
export default function NaoEncontrado({ voltarPara = "/exemplos", rotulo = "Ver os exemplares" }) {
  return (
    <section
      id="nao-encontrado"
      className="mx-auto flex min-h-[70dvh] max-w-2xl flex-col items-start justify-center px-5 py-28"
    >
      <p className="text-sm font-semibold text-base-content/70">Erro 404</p>
      <h1 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-base-content sm:text-5xl">
        Esta página não existe.
      </h1>
      <p className="mt-5 max-w-[50ch] text-base-content/70">
        O endereço que você abriu não existe neste exemplar. Ele pode ter mudado de nome.
      </p>
      <Link
        to={voltarPara}
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-content transition-transform duration-300 ease-mola active:scale-[0.98]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {rotulo}
      </Link>
    </section>
  );
}
```

`public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#0D0F0E"/>
  <circle cx="27" cy="34" r="13" fill="none" stroke="#B8F25B" stroke-width="6"/>
  <circle cx="47" cy="42" r="5" fill="#B8F25B"/>
</svg>
```

- [ ] **Step 7: Ícones dos dados**

Em `src/data/catalogo.js`, substituir o bloco `import {…} from "lucide-react";` por:

```js
import {
  Globe,
  Cube,
  HardDrives,
  Lifebuoy,
  CursorClick,
  Layout,
  ShoppingBag,
  MapPin,
  Cpu,
  FileText,
  FlowArrow,
  Link as LinkIcone,
  Envelope,
  Pulse,
  Wrench,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
```

e renomear os usos no arquivo: `Boxes` → `Cube`, `Server` → `HardDrives`, `LifeBuoy` → `Lifebuoy`, `MousePointerClick` → `CursorClick`, `Workflow` → `FlowArrow`, `Link2` → `LinkIcone`, `Mail` → `Envelope`, `Activity` → `Pulse`, `MoveRight` → `ArrowsLeftRight`. (`Globe`, `Layout`, `ShoppingBag`, `MapPin`, `Cpu`, `FileText` e `Wrench` mantêm o nome.)

`src/data/exemplares.js` inteiro:

```js
import { CursorClick, Layout, ShoppingBag } from "@phosphor-icons/react";

// Os três exemplares navegáveis. Consumido pelo índice (/exemplos) e pela seção
// "Veja funcionando" da home. `estilo` escolhe a miniatura (MiniaturaExemplar).
export const EXEMPLARES = [
  {
    para: "/exemplos/landing",
    icone: CursorClick,
    estilo: "campanha",
    nome: "Landing Page",
    resumo: "Página única de campanha, com um objetivo só: gerar contato.",
    detalhe: "Ideal para anúncio pago e lançamento de serviço.",
  },
  {
    para: "/exemplos/site",
    icone: Layout,
    estilo: "sereno",
    nome: "Site Institucional",
    resumo: "Site completo, com várias páginas e navegação própria.",
    detalhe: "Ideal para credibilidade e para ser encontrado no Google.",
  },
  {
    para: "/exemplos/loja",
    icone: ShoppingBag,
    estilo: "bento",
    nome: "E-commerce",
    resumo: "Vitrine com busca, filtros e pedido de orçamento.",
    detalhe: "Ideal para quem tem catálogo e vende por orçamento.",
  },
];
```

- [ ] **Step 8: Gates**

Run: `npm test && npm run lint && npm run build`
Expected: 60 testes passando, lint sem erros, build ok. Os componentes antigos ainda usam `withText` no Wordmark e o visual antigo; isso é esperado até os Tasks 3–11.

- [ ] **Step 9: Commit**

```bash
git add src/lib src/hooks src/components/Revelar.jsx src/components/BotaoContato.jsx src/components/Secao.jsx src/components/Wordmark.jsx src/components/SeloEscopo.jsx src/components/SectionHeading.jsx src/components/FaixaExemplar.jsx src/exemplos/NaoEncontrado.jsx src/data/catalogo.js src/data/exemplares.js public/favicon.svg
git commit -m "feat: primitivos compartilhados (Revelar, BotaoContato, Wordmark) e icones Phosphor nos dados

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Home — navbar ilha, hero e painel de status

**Files:**
- Create: `src/components/home/Navbar.jsx`, `src/components/home/Hero.jsx`, `src/components/home/PainelStatus.jsx`
- Modify: `src/layouts/SiteLayout.jsx`, `src/pages/LandingPage.jsx`
- Delete: `src/components/Navbar.jsx`, `src/components/Hero.jsx`

**Interfaces:**
- Consumes: `NAV`, `MSG` (config), `Wordmark`, `BotaoContato`, `Revelar` (Task 2).
- Produces: `home/Navbar` (default export, sem props), `home/Hero` (seção `#top`), `home/PainelStatus`.

- [ ] **Step 1: `home/PainelStatus.jsx`**

```jsx
// Painel ilustrativo do hero: a metáfora "está tudo sob controle".
// Não é dado real — o aria-label descreve o que ele representa.
const LINHAS = [
  { servico: "domínio", estado: "no seu nome", carimbo: "renovação automática" },
  { servico: "site", estado: "no ar", carimbo: "verificado há 2 min" },
  { servico: "e-mail", estado: "ativo", carimbo: "entregando normalmente" },
  { servico: "backup", estado: "diário", carimbo: "último às 03:00" },
];

export default function PainelStatus() {
  return (
    <figure
      aria-label="Ilustração de painel: domínio no seu nome, site no ar, e-mail ativo e backup diário."
      className="rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/10"
    >
      <div className="rounded-[calc(2rem-0.375rem)] bg-base-100 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-7">
        <div className="flex items-center justify-between gap-4 font-mono text-[11px] text-base-content/60">
          <span>sua-empresa.com.br</span>
          <span className="inline-flex items-center gap-1.5 text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            tudo operando
          </span>
        </div>
        <ul aria-hidden="true" className="mt-6 divide-y divide-white/[0.06]">
          {LINHAS.map((linha) => (
            <li key={linha.servico} className="flex items-center justify-between gap-4 py-4">
              <span className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]" />
                <span className="text-sm text-base-content">{linha.servico}</span>
              </span>
              <span className="text-right">
                <span className="block text-sm font-medium text-base-content">{linha.estado}</span>
                <span className="block font-mono text-[11px] text-base-content/60">{linha.carimbo}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
```

- [ ] **Step 2: `home/Hero.jsx`**

```jsx
import { ArrowDown } from "@phosphor-icons/react";
import BotaoContato from "../BotaoContato.jsx";
import Revelar from "../Revelar.jsx";
import PainelStatus from "./PainelStatus.jsx";

const CONFIANCA = ["sem fidelidade", "domínio sempre no seu nome", "tudo em um só lugar"];

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-base-200">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(60%_55%_at_80%_0%,#1c2b1f_0%,transparent_70%)]"
      />
      <div className="mx-auto grid min-h-[100dvh] max-w-6xl items-center gap-14 px-5 pb-24 pt-36 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <Revelar>
          <p className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.14em] text-primary">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            operação digital gerenciada · curitiba/pr
          </p>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-base-content sm:text-6xl lg:text-7xl">
            Sua presença digital e seus sistemas funcionando,{" "}
            <span className="text-base-content/45">com um único responsável.</span>
          </h1>

          <p className="mt-7 max-w-[52ch] text-lg leading-relaxed text-base-content/70">
            Do domínio ao sistema de gestão, uma mensalidade cuida de tudo. Você fala com uma pessoa
            só — e a tecnologia trabalha por trás, invisível.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BotaoContato />
            <a
              href="#exemplos"
              className="group inline-flex items-center gap-2 px-2 text-sm font-medium text-base-content/75 transition-colors duration-300 ease-mola hover:text-base-content"
            >
              Ver exemplos funcionando
              <ArrowDown
                className="h-4 w-4 transition-transform duration-500 ease-mola group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>

          <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-base-content/60">
            {CONFIANCA.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        </Revelar>

        <Revelar atraso={150}>
          <PainelStatus />
        </Revelar>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: `home/Navbar.jsx`**

```jsx
import { useEffect, useRef, useState } from "react";
import { NAV } from "../../config.js";
import Wordmark from "../Wordmark.jsx";
import BotaoContato from "../BotaoContato.jsx";

// Navbar "ilha": pílula de vidro solta do topo. No mobile, o hambúrguer vira X e
// abre uma camada de tela cheia com os links entrando em cascata.
export default function Navbar() {
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef(null);

  useEffect(() => {
    if (!aberto) return undefined;

    function aoTeclar(evento) {
      if (evento.key === "Escape") {
        setAberto(false);
        botaoRef.current?.focus();
      }
    }

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  return (
    <header className="fixed inset-x-0 top-0 z-(--z-cabecalho) px-4 pt-4">
      {/* Camada do menu mobile — vem antes da nav no DOM para ficar por baixo dela. */}
      <div
        id="menu-movel"
        inert={!aberto}
        className={`fixed inset-0 bg-base-200/95 px-6 pt-28 backdrop-blur-2xl transition-opacity duration-500 ease-mola md:hidden ${
          aberto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-2">
          {NAV.map((item, i) => (
            <li
              key={item.href}
              style={{ transitionDelay: aberto ? `${100 + i * 50}ms` : "0ms" }}
              className={`transition-all duration-700 ease-mola ${
                aberto ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <a
                href={`/${item.href}`}
                onClick={() => setAberto(false)}
                className="block py-3 text-3xl font-semibold tracking-[-0.03em] text-base-content"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <BotaoContato className="mt-10 w-full">Fale com a gente</BotaoContato>
      </div>

      <nav
        aria-label="Principal"
        className="relative mx-auto flex w-full max-w-5xl items-center justify-between gap-6 rounded-full bg-base-100/70 py-2 pl-5 pr-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/10 backdrop-blur-xl"
      >
        <a href="/#top" aria-label="ogis.cloud — início">
          <Wordmark className="h-6" />
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={`/${item.href}`}
                className="text-sm text-base-content/65 transition-colors duration-300 ease-mola hover:text-base-content"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <BotaoContato className="hidden sm:inline-flex">Fale com a gente</BotaoContato>
          <button
            ref={botaoRef}
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
            aria-controls="menu-movel"
            className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-full ring-1 ring-white/10 md:hidden"
          >
            <span
              aria-hidden="true"
              className={`absolute h-px w-4 bg-base-content transition-transform duration-500 ease-mola ${
                aberto ? "rotate-45" : "-translate-y-1"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-px w-4 bg-base-content transition-transform duration-500 ease-mola ${
                aberto ? "-rotate-45" : "translate-y-1"
              }`}
            />
          </button>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Ligar na home e apagar os antigos**

Em `src/layouts/SiteLayout.jsx`: `import Navbar from "../components/Navbar.jsx";` → `import Navbar from "../components/home/Navbar.jsx";`.
Em `src/pages/LandingPage.jsx`: `import Hero from "../components/Hero.jsx";` → `import Hero from "../components/home/Hero.jsx";`.

```bash
git rm src/components/Navbar.jsx src/components/Hero.jsx
```

- [ ] **Step 5: Gates**

Run: `npm test && npm run lint && npm run build`
Expected: tudo verde.

- [ ] **Step 6: Conferir no navegador (1440px e 375px)**

Em `/`: navbar em pílula flutuante; hero alinhado à esquerda com o painel à direita (abaixo no mobile); ponto verde pulsando; nenhum dourado. No mobile, o hambúrguer vira X e os links entram em cascata.

- [ ] **Step 7: Teclado (Review Focus 5)**

Em 375px: Tab até o hambúrguer, Enter abre, Esc fecha, e `document.activeElement` precisa ser o botão (`aria-label="Abrir menu"`). Com o menu fechado, Tab não pode cair nos links da camada (`inert`).

- [ ] **Step 8: Commit**

```bash
git add src/components/home src/layouts/SiteLayout.jsx src/pages/LandingPage.jsx
git commit -m "feat: home com navbar ilha, hero assimetrico e painel de status

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Home — soluções em bento, como funciona, exemplos e índice

**Files:**
- Create: `src/components/home/Solucoes.jsx`, `src/components/home/ComoFunciona.jsx`, `src/components/home/VejaFuncionando.jsx`, `src/components/home/CartaoExemplar.jsx`, `src/components/home/MiniaturaExemplar.jsx`
- Modify: `src/pages/LandingPage.jsx`, `src/exemplos/IndiceExemplos.jsx`
- Delete: `src/components/Solucoes.jsx`, `src/components/ComoFunciona.jsx`, `src/components/VejaFuncionando.jsx`

**Interfaces:**
- Consumes: `SOLUCOES`, `EXEMPLARES` (com `estilo`), `SectionHeading`, `SeloEscopo`, `Revelar`, `Tema`.
- Produces: `<CartaoExemplar exemplar mostrarDetalhe?: boolean>` e `<MiniaturaExemplar estilo: "campanha" | "sereno" | "bento">`.

- [ ] **Step 1: `home/Solucoes.jsx`**

```jsx
import { Check } from "@phosphor-icons/react";
import { SOLUCOES } from "../../data/solucoes.js";
import SectionHeading from "../SectionHeading.jsx";
import SeloEscopo from "../SeloEscopo.jsx";
import Revelar from "../Revelar.jsx";

// Bento assimétrico: um destaque grande, dois empilhados e um largo embaixo.
const POSICAO = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-12",
];

export default function Solucoes() {
  return (
    <section id="solucoes" className="bg-base-200 py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Soluções"
          title="Tudo o que o seu negócio precisa online, em um lugar só"
          subtitle="Você escolhe o resultado. A parte técnica é problema nosso."
        />

        <div className="mt-16 grid gap-4 md:grid-cols-12">
          {SOLUCOES.map((sol, i) => {
            const Icone = sol.icone;
            const grande = i === 0;
            return (
              <Revelar
                as="article"
                key={sol.slug}
                atraso={i * 80}
                className={`group rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/10 ${POSICAO[i]}`}
              >
                <div className="flex h-full flex-col rounded-[calc(2rem-0.375rem)] bg-base-100 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors duration-500 ease-mola group-hover:bg-[#181c1a] sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <Icone weight="light" className="h-8 w-8 text-primary" aria-hidden="true" />
                    <span className="font-mono text-[11px] text-base-content/60">0{i + 1}</span>
                  </div>
                  <h3
                    className={`mt-8 font-semibold tracking-[-0.03em] text-base-content ${
                      grande ? "text-3xl sm:text-4xl" : "text-xl"
                    }`}
                  >
                    {sol.nome}
                  </h3>
                  <p className="mt-3 max-w-[48ch] text-base-content/70">{sol.resumo}</p>
                  {grande && (
                    <ul className="mt-8 flex flex-col gap-3">
                      {sol.entregaveis.slice(0, 3).map((e) => (
                        <li key={e} className="flex items-start gap-3 text-sm text-base-content/80">
                          <Check weight="bold" className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  )}
                  <SeloEscopo item={sol} className="mt-auto pt-8" />
                </div>
              </Revelar>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `home/ComoFunciona.jsx`**

```jsx
import SectionHeading from "../SectionHeading.jsx";
import Revelar from "../Revelar.jsx";

const PILARES = [
  {
    titulo: "Um único responsável",
    texto:
      "Nada de coordenar cinco fornecedores. Uma pessoa cuida do domínio, do site, do e-mail e do sistema — e resolve com você.",
  },
  {
    titulo: "Uma mensalidade cuida de tudo",
    texto:
      "Previsível e sem surpresa: hospedagem, manutenção, atualizações e suporte entram no mesmo valor todo mês.",
  },
  {
    titulo: "Cresce com o seu negócio",
    texto:
      "Começa simples e escala quando você precisar — do site à gestão completa — sem trocar de fornecedor no meio do caminho.",
  },
  {
    titulo: "Tecnologia invisível",
    texto:
      "Você compra resultado, não jargão. A parte complexa roda nos bastidores para o seu negócio simplesmente funcionar.",
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-base-100 py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Como funciona"
          title="Menos fornecedor, menos dor de cabeça"
          subtitle="O jeito ogis.cloud de tirar a tecnologia da sua lista de preocupações."
        />

        <ol className="relative mt-20 grid gap-x-20 gap-y-14 md:grid-cols-2 md:before:absolute md:before:inset-y-0 md:before:left-1/2 md:before:w-px md:before:bg-white/10">
          {PILARES.map((pilar, i) => (
            <Revelar as="li" key={pilar.titulo} atraso={i * 80} className={i % 2 === 1 ? "md:mt-20" : ""}>
              <span className="font-mono text-sm text-primary">0{i + 1}</span>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-base-content">{pilar.titulo}</h3>
              <p className="mt-3 max-w-[44ch] text-base-content/70">{pilar.texto}</p>
            </Revelar>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: `home/MiniaturaExemplar.jsx` e `home/CartaoExemplar.jsx`**

`MiniaturaExemplar.jsx` (as cores são de propósito literais: é uma "foto" de outro tema, e a home não carrega as fontes dos exemplares):

```jsx
// Prévia em CSS do visual real de cada exemplar. Decorativa (aria-hidden).
export default function MiniaturaExemplar({ estilo }) {
  if (estilo === "campanha") {
    return (
      <div aria-hidden="true" className="flex aspect-[4/3] flex-col justify-between overflow-hidden bg-[#2734e8] p-5 text-[#f2f1ec]">
        <div className="flex items-center justify-between text-[9px] font-semibold">
          <span>ogis.cloud</span>
          <span className="rounded-full bg-[#f2f1ec] px-2 py-0.5 text-[#2734e8]">Diagnóstico grátis</span>
        </div>
        <p className="text-[1.65rem] font-black uppercase leading-[0.86] tracking-[-0.05em]">
          Um responsável. <span className="text-transparent [-webkit-text-stroke:1px_#f2f1ec]">Zero</span> dor de cabeça.
        </p>
        <div className="-mx-5 -mb-5 whitespace-nowrap bg-[#f2f1ec] py-1 text-[9px] font-black text-[#2734e8]">
          SITE ✦ E-MAIL ✦ DOMÍNIO ✦ SISTEMAS ✦ SUPORTE ✦ SITE ✦ E-MAIL
        </div>
      </div>
    );
  }

  if (estilo === "sereno") {
    return (
      <div aria-hidden="true" className="flex aspect-[4/3] flex-col overflow-hidden bg-[#fbfaf8] text-[#2b2926]">
        <div className="flex items-center justify-between border-b border-[#2b2926]/10 px-4 py-2.5 text-[9px]">
          <b className="font-extrabold">ogis.cloud</b>
          <span className="flex gap-2 opacity-60">
            <span className="font-bold opacity-100">Início</span>
            <span>Sobre</span>
            <span>Soluções</span>
          </span>
        </div>
        <div className="grid flex-1 grid-cols-[1.1fr_1fr] gap-3 p-4">
          <p className="text-[0.95rem] font-bold leading-[1.1] tracking-[-0.03em]">
            Tecnologia que funciona, sem você precisar entender dela.
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[8px] font-bold">
            <span className="col-span-2 rounded-md bg-[#e7ede6] p-2">Presença digital</span>
            <span className="rounded-md bg-[#f1eee8] p-2">Sistemas</span>
            <span className="rounded-md bg-[#f1eee8] p-2">Suporte</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="flex aspect-[4/3] flex-col gap-2 overflow-hidden bg-[#fff7ec] p-4 text-[#2a1a0e]">
      <div className="flex items-center justify-between text-[9px] font-extrabold">
        <span>catálogo ogis</span>
        <span className="rounded-md bg-[#2a1a0e] px-2 py-0.5 text-[#fff7ec]">Orçamento (2)</span>
      </div>
      <div className="grid flex-1 grid-cols-[1.4fr_1fr_1fr] grid-rows-2 gap-1.5 text-[9px] font-extrabold">
        <span className="row-span-2 rounded-xl bg-[#ff7a3d] p-2">Presença digital</span>
        <span className="rounded-xl bg-[#ffd249] p-2">Sistemas</span>
        <span className="rounded-xl bg-[#9ed8b5] p-2">E-mail</span>
        <span className="col-span-2 rounded-xl bg-[#2a1a0e] p-2 text-[#fff7ec]">Suporte</span>
      </div>
    </div>
  );
}
```

`CartaoExemplar.jsx`:

```jsx
import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import MiniaturaExemplar from "./MiniaturaExemplar.jsx";

export default function CartaoExemplar({ exemplar, mostrarDetalhe = false }) {
  return (
    <Link
      to={exemplar.para}
      className="group block h-full rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/10 transition-transform duration-500 ease-mola hover:-translate-y-1"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[calc(2rem-0.375rem)] bg-base-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="overflow-hidden">
          <div className="transition-transform duration-700 ease-mola group-hover:scale-[1.03]">
            <MiniaturaExemplar estilo={exemplar.estilo} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-base-content">{exemplar.nome}</h3>
          <p className="mt-2 text-sm text-base-content/70">{exemplar.resumo}</p>
          {mostrarDetalhe && <p className="mt-3 text-sm text-base-content/60">{exemplar.detalhe}</p>}
          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
            Abrir exemplar
            <ArrowUpRight
              weight="bold"
              className="h-4 w-4 transition-transform duration-500 ease-mola group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: `home/VejaFuncionando.jsx` e `IndiceExemplos.jsx`**

`home/VejaFuncionando.jsx`:

```jsx
import { EXEMPLARES } from "../../data/exemplares.js";
import SectionHeading from "../SectionHeading.jsx";
import Revelar from "../Revelar.jsx";
import CartaoExemplar from "./CartaoExemplar.jsx";

export default function VejaFuncionando() {
  return (
    <section id="exemplos" className="bg-base-200 py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Exemplos"
          title="Veja funcionando antes de decidir"
          subtitle="Três exemplares navegáveis, construídos por nós — cada um com uma linguagem visual diferente. Clique, navegue e veja o que cada formato entrega."
        />
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {EXEMPLARES.map((exemplar, i) => (
            <Revelar key={exemplar.para} atraso={i * 90}>
              <CartaoExemplar exemplar={exemplar} />
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
```

`src/exemplos/IndiceExemplos.jsx` inteiro:

```jsx
import { EXEMPLARES } from "../data/exemplares.js";
import SEO from "../components/SEO.jsx";
import Tema from "../components/Tema.jsx";
import Wordmark from "../components/Wordmark.jsx";
import Revelar from "../components/Revelar.jsx";
import CartaoExemplar from "../components/home/CartaoExemplar.jsx";

export default function IndiceExemplos() {
  return (
    <Tema superficie="indice">
      <SEO
        title="Exemplares"
        description="Três exemplares navegáveis feitos pela ogis.cloud: landing page, site institucional e e-commerce."
        path="/exemplos"
        noindex
      />

      <main id="conteudo">
        <section id="exemplares" className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <div className="max-w-2xl">
            <Wordmark className="h-7" />
            <h1 className="mt-10 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-base-content sm:text-6xl">
              Veja funcionando antes de decidir
            </h1>
            <p className="mt-6 max-w-[56ch] text-lg text-base-content/70">
              Três exemplares navegáveis, construídos por nós, com o conteúdo real da ogis.cloud.
              Clique, navegue e veja o que cada formato entrega.
            </p>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {EXEMPLARES.map((exemplar, i) => (
              <Revelar key={exemplar.para} atraso={i * 90}>
                <CartaoExemplar exemplar={exemplar} mostrarDetalhe />
              </Revelar>
            ))}
          </div>

          <p className="mt-16 max-w-xl font-mono text-xs text-base-content/60">
            nenhum dos exemplares mostra preço: cada orçamento é feito sob medida, depois de entender o
            seu negócio.
          </p>
        </section>
      </main>
    </Tema>
  );
}
```

- [ ] **Step 5: Ligar na home e apagar os antigos**

Em `src/pages/LandingPage.jsx`, trocar os imports de `Solucoes`, `ComoFunciona` e `VejaFuncionando` para `../components/home/…` e reordenar o JSX para:

```jsx
      <SEO />
      <Hero />
      <Solucoes />
      <ComoFunciona />
      <VejaFuncionando />
      <Planos />
      <ParaQuem />
      <Confianca />
      <CTAFinal />
      <Contato />
```

```bash
git rm src/components/Solucoes.jsx src/components/ComoFunciona.jsx src/components/VejaFuncionando.jsx
```

- [ ] **Step 6: Gates e navegador**

Run: `npm test && npm run lint && npm run build`
Expected: verde.
No navegador, em `/` (1440px): bento 7/5/5/12 sem buracos; lista numerada em zigue-zague com régua central; três miniaturas visivelmente diferentes. Em 375px tudo em uma coluna. Em `/exemplos` aparecem os mesmos cartões, agora com o detalhe.

- [ ] **Step 7: Commit**

```bash
git add src/components/home src/pages/LandingPage.jsx src/exemplos/IndiceExemplos.jsx
git commit -m "feat: home com solucoes em bento, como funciona numerado e miniaturas dos exemplares

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Home — planos, para quem + confiança, contato, rodapé e páginas legais

**Files:**
- Create: `src/components/home/Planos.jsx`, `src/components/home/ParaQuemConfianca.jsx`, `src/components/home/Contato.jsx`, `src/components/home/Footer.jsx`
- Modify: `src/pages/LandingPage.jsx`, `src/layouts/SiteLayout.jsx`, `src/components/LegalLayout.jsx`, `src/pages/Termos.jsx`, `src/pages/Privacidade.jsx`
- Delete: `src/components/Planos.jsx`, `src/components/ParaQuem.jsx`, `src/components/Confianca.jsx`, `src/components/CTAFinal.jsx`, `src/components/Contato.jsx`, `src/components/Footer.jsx`

**Interfaces:**
- Consumes: `PLANOS`, `GARANTIAS`, `BRAND`, `MSG`, `ASSUNTO`, `linkEmail`, `BotaoContato`, `Revelar`, `SectionHeading`, `Wordmark`, `Secao`, `slugTitulo`.
- Produces: `LegalLayout` monta o índice a partir de filhos `<Secao>`.

- [ ] **Step 1: `home/Planos.jsx`**

```jsx
import { Check } from "@phosphor-icons/react";
import { PLANOS, GARANTIAS } from "../../data/planos.js";
import { ASSUNTO, MSG } from "../../config.js";
import SectionHeading from "../SectionHeading.jsx";
import BotaoContato from "../BotaoContato.jsx";
import Revelar from "../Revelar.jsx";

export default function Planos() {
  return (
    <section id="planos" className="bg-base-100 py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Planos"
          title="Escolha por onde começar"
          subtitle="Cada orçamento é feito sob medida, depois de entender o seu negócio."
        />

        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {PLANOS.map((plano, i) => (
            <Revelar
              key={plano.nome}
              atraso={i * 80}
              className={`rounded-[2rem] p-1.5 ring-1 ${
                plano.destaque ? "bg-primary/[0.06] ring-primary/40" : "bg-white/[0.03] ring-white/10"
              }`}
            >
              <div
                className={`flex h-full flex-col rounded-[calc(2rem-0.375rem)] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${
                  plano.destaque ? "bg-[#171c19]" : "bg-base-200"
                }`}
              >
                <div className="flex min-h-7 items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-base-content">{plano.nome}</h3>
                  {plano.selo && <span className="font-mono text-[11px] text-primary">{plano.selo.toLowerCase()}</span>}
                </div>
                <p className="mt-3 min-h-[3lh] text-sm text-base-content/70">{plano.resumo}</p>
                <p className="mt-6 font-mono text-xs text-base-content/60">
                  sob consulta · orçamento depois de entender o seu negócio
                </p>
                <ul className="mt-6 flex flex-col gap-3 border-t border-white/[0.08] pt-6">
                  {plano.beneficios.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-base-content/80">
                      <Check weight="bold" className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <BotaoContato
                    mensagem={MSG.plano(plano.nome)}
                    assunto={ASSUNTO.plano(plano.nome)}
                    variante={plano.destaque ? "primario" : "secundario"}
                    className="w-full"
                  >
                    {plano.cta}
                  </BotaoContato>
                </div>
              </div>
            </Revelar>
          ))}
        </div>

        <p className="mt-10 text-center font-mono text-xs text-base-content/60">
          {GARANTIAS.map((g) => g.toLowerCase()).join(" · ")}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `home/ParaQuemConfianca.jsx`**

```jsx
import SectionHeading from "../SectionHeading.jsx";
import Revelar from "../Revelar.jsx";

const SEGMENTOS = [
  "Oficinas mecânicas",
  "Preparadoras",
  "Lojas de peças",
  "Eventos automotivos",
  "Clínicas",
  "Pet shops",
  "Academias",
  "Comércio local",
];

const SINAIS = [
  {
    titulo: "Domínio no seu nome",
    texto: "O endereço do seu negócio é sempre registrado no seu CPF/CNPJ. Você é o dono, não nós.",
  },
  {
    titulo: "Escopo definido por escrito",
    texto:
      "Você aprova por escrito o que será entregue, com prazo e preço combinados. Sem surpresa no meio do caminho.",
  },
  {
    titulo: "Sem fidelidade",
    texto: "Você fica porque quer. Sem multa, sem letras miúdas prendendo o seu negócio.",
  },
];

export default function ParaQuemConfianca() {
  return (
    <section id="para-quem" className="bg-base-200 py-28 sm:py-40">
      <div className="mx-auto grid max-w-6xl gap-16 px-5 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <Revelar>
          <SectionHeading
            eyebrow="Para quem é"
            title="Feito para o comércio e o serviço local de Curitiba"
            subtitle="Nascemos no universo automotivo e hoje atendemos negócios que querem ser encontrados e organizados — sem virar especialistas em tecnologia."
          />
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-base-content/75">
            {SEGMENTOS.map((s) => (
              <li key={s} className="flex items-center gap-2.5">
                <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
        </Revelar>

        <Revelar atraso={120} className="rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/10">
          <div className="rounded-[calc(2rem-0.375rem)] bg-base-100 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-8">
            <p className="font-mono text-xs text-base-content/60">garantias por escrito</p>
            <ul className="mt-2 divide-y divide-white/[0.06]">
              {SINAIS.map((s) => (
                <li key={s.titulo} className="py-5">
                  <p className="font-mono text-sm text-primary">✓ {s.titulo.toLowerCase()}</p>
                  <p className="mt-2 text-sm text-base-content/70">{s.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: `home/Contato.jsx` e `home/Footer.jsx`**

`home/Contato.jsx`:

```jsx
import { BRAND } from "../../config.js";
import BotaoContato from "../BotaoContato.jsx";
import Revelar from "../Revelar.jsx";

const GANHOS = [
  "Um único responsável pelo seu digital",
  "Proposta clara, com preço e prazo combinados",
  "Site, e-mail e sistema sob o mesmo teto",
];

export default function Contato() {
  return (
    <section id="contato" className="bg-base-100 py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5">
        <Revelar className="rounded-[2.5rem] bg-white/[0.03] p-2 ring-1 ring-white/10">
          <div className="relative overflow-hidden rounded-[calc(2.5rem-0.5rem)] bg-base-200 px-7 py-14 sm:px-14 sm:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 bg-[radial-gradient(circle,#1c2b1f_0%,transparent_70%)]"
            />
            <div className="relative grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  contato
                </p>
                <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-base-content sm:text-5xl">
                  Vamos conversar sobre o seu negócio.
                </h2>
                <p className="mt-6 max-w-[50ch] text-lg text-base-content/70">
                  Fale com a gente e receba uma proposta sob medida — sem compromisso e em linguagem
                  que você entende. Sem robô, sem call center.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <BotaoContato />
                  <BotaoContato canal="email" variante="secundario" />
                </div>
              </div>

              <div>
                <p className="font-mono text-xs text-base-content/60">o que você ganha</p>
                <ul className="mt-3 divide-y divide-white/[0.08]">
                  {GANHOS.map((g) => (
                    <li key={g} className="py-4 text-base-content/85">
                      {g}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 font-mono text-xs text-base-content/60">
                  {BRAND.email} · atendimento em {BRAND.cidade} e região
                </p>
              </div>
            </div>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
```

`home/Footer.jsx`:

```jsx
import { Link } from "react-router-dom";
import { ASSUNTO, BRAND, MSG, linkEmail } from "../../config.js";
import Wordmark from "../Wordmark.jsx";

const LINK = "transition-colors duration-300 ease-mola hover:text-base-content";

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-base-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 md:flex-row md:items-end md:justify-between">
        <div>
          <Wordmark className="h-6" />
          <p className="mt-4 max-w-xs text-sm text-base-content/65">{BRAND.tagline}</p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-base-content/65">
            <li><Link to="/exemplos" className={LINK}>Exemplos</Link></li>
            <li><Link to="/termos" className={LINK}>Termos de uso</Link></li>
            <li><Link to="/privacidade" className={LINK}>Privacidade</Link></li>
            <li><a href={linkEmail(ASSUNTO.contato, MSG.contato)} className={LINK}>{BRAND.email}</a></li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-10">
        <p className="font-mono text-[11px] text-base-content/60">
          © {ano} {BRAND.name} · {BRAND.cnpj} · {BRAND.cidade}
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: LegalLayout, Termos e Privacidade**

`src/components/LegalLayout.jsx`:

```jsx
import { Children } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import SEO from "./SEO.jsx";
import Secao from "./Secao.jsx";
import { slugTitulo } from "../lib/slug.js";

// Páginas legais: coluna de leitura de ~68ch e índice lateral fixo (≥ lg),
// montado a partir dos filhos <Secao titulo="…">.
export default function LegalLayout({ title, description, path, atualizadoEm, children }) {
  const indice = Children.toArray(children)
    .filter((filho) => filho.type === Secao)
    .map((filho) => ({ id: slugTitulo(filho.props.titulo), titulo: filho.props.titulo }));

  return (
    <div className="bg-base-200">
      <SEO title={title} description={description} path={path} />
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-36 lg:grid lg:grid-cols-[14rem_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <nav aria-label="Nesta página" className="sticky top-32">
            <p className="font-mono text-[11px] text-base-content/60">nesta página</p>
            <ol className="mt-4 flex flex-col gap-2.5 border-l border-white/10">
              {indice.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px block border-l border-transparent pl-4 text-sm text-base-content/65 transition-colors duration-300 ease-mola hover:border-primary hover:text-base-content"
                  >
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="max-w-[68ch]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-base-content/65 transition-colors duration-300 ease-mola hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            voltar ao início
          </Link>
          <h1 className="mt-8 text-4xl font-semibold tracking-[-0.04em] text-base-content sm:text-5xl">{title}</h1>
          {atualizadoEm && (
            <p className="mt-3 font-mono text-xs text-base-content/60">
              última atualização · {atualizadoEm.toLowerCase()}
            </p>
          )}
          <div className="mt-10 flex flex-col gap-8 leading-relaxed text-base-content/75">{children}</div>
        </article>
      </div>
    </div>
  );
}
```

`src/pages/Termos.jsx` inteiro:

```jsx
import LegalLayout from "../components/LegalLayout.jsx";
import Secao from "../components/Secao.jsx";
import { BRAND } from "../config.js";

export default function Termos() {
  return (
    <LegalLayout
      title="Termos de uso"
      description="Termos de uso dos serviços da ogis.cloud."
      path="/termos"
      atualizadoEm="Julho/2026"
    >
      <p>
        Estes termos regem a contratação dos serviços digitais gerenciados oferecidos pela {BRAND.name}
        {" "}({BRAND.cnpj}), com atendimento em {BRAND.cidade}. Ao contratar, o cliente concorda com as
        condições abaixo.
      </p>

      <Secao titulo="1. Serviços">
        <p>
          A ogis.cloud fornece presença digital (sites, domínios, e-mail profissional), sistemas sob
          medida e sustentação, conforme o plano ou proposta contratada. O escopo de cada projeto é
          definido por escrito; alterações de escopo são tratadas como aditivo.
        </p>
      </Secao>

      <Secao titulo="2. Mensalidade e sustentação">
        <p>
          Todo projeto entregue possui um plano de sustentação mensal, que inclui hospedagem,
          monitoramento, atualizações de segurança e um volume de ajustes acordado. A
          mensalidade é cobrada de forma recorrente. Não há fidelidade obrigatória.
        </p>
      </Secao>

      <Secao titulo="3. Domínio e propriedade">
        <p>
          O domínio é sempre registrado em nome do cliente. Os dados e o conteúdo do negócio pertencem
          ao cliente, que pode solicitar a migração a qualquer momento, com o nosso apoio.
        </p>
      </Secao>

      <Secao titulo="4. Disponibilidade">
        <p>
          Trabalhamos com melhor esforço para manter os serviços no ar, com monitoramento contínuo. A
          responsabilidade por indisponibilidades é limitada nos termos da proposta assinada.
        </p>
      </Secao>

      <Secao titulo="5. Pagamento e suspensão">
        <p>
          O não pagamento da mensalidade pode acarretar suspensão do serviço após aviso. Os dados são
          preservados por um período de carência antes de qualquer remoção definitiva.
        </p>
      </Secao>

      <Secao titulo="6. Contato">
        <p>Dúvidas sobre estes termos podem ser enviadas para {BRAND.email}.</p>
      </Secao>
    </LegalLayout>
  );
}
```

`src/pages/Privacidade.jsx` inteiro:

```jsx
import LegalLayout from "../components/LegalLayout.jsx";
import Secao from "../components/Secao.jsx";
import { BRAND } from "../config.js";

export default function Privacidade() {
  return (
    <LegalLayout
      title="Política de privacidade"
      description="Como a ogis.cloud trata dados pessoais, em conformidade com a LGPD."
      path="/privacidade"
      atualizadoEm="Julho/2026"
    >
      <p>
        A {BRAND.name} respeita a sua privacidade e trata dados pessoais em conformidade com a Lei
        Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018). Esta política explica quais dados
        coletamos e como os utilizamos.
      </p>

      <Secao titulo="1. Dados que coletamos">
        <p>
          Coletamos apenas os dados que você nos fornece ao solicitar um orçamento ou entrar em contato —
          como nome, empresa, WhatsApp, e-mail e informações sobre o seu negócio — e dados técnicos
          básicos de navegação para melhorar o site.
        </p>
      </Secao>

      <Secao titulo="2. Como usamos">
        <p>
          Usamos seus dados para responder ao seu contato, elaborar propostas, prestar os serviços
          contratados e manter você informado sobre o andamento. Não vendemos seus dados a terceiros.
        </p>
      </Secao>

      <Secao titulo="3. Compartilhamento">
        <p>
          Podemos usar fornecedores de infraestrutura (hospedagem, e-mail, cobrança) estritamente para
          operar os serviços contratados, sempre com o cuidado de proteger suas informações.
        </p>
      </Secao>

      <Secao titulo="4. Seus direitos">
        <p>
          Você pode solicitar acesso, correção ou exclusão dos seus dados, além de revogar
          consentimentos, a qualquer momento, escrevendo para {BRAND.email}.
        </p>
      </Secao>

      <Secao titulo="5. Segurança">
        <p>
          Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo acesso
          restrito às informações e ao ambiente onde o seu negócio está hospedado.
        </p>
      </Secao>
    </LegalLayout>
  );
}
```

- [ ] **Step 5: Compor a home e apagar os antigos**

`src/pages/LandingPage.jsx` inteiro:

```jsx
import SEO from "../components/SEO.jsx";
import Hero from "../components/home/Hero.jsx";
import Solucoes from "../components/home/Solucoes.jsx";
import ComoFunciona from "../components/home/ComoFunciona.jsx";
import VejaFuncionando from "../components/home/VejaFuncionando.jsx";
import Planos from "../components/home/Planos.jsx";
import ParaQuemConfianca from "../components/home/ParaQuemConfianca.jsx";
import Contato from "../components/home/Contato.jsx";

export default function LandingPage() {
  return (
    <>
      <SEO />
      <Hero />
      <Solucoes />
      <ComoFunciona />
      <VejaFuncionando />
      <Planos />
      <ParaQuemConfianca />
      <Contato />
    </>
  );
}
```

Em `src/layouts/SiteLayout.jsx`: `import Footer from "../components/Footer.jsx";` → `import Footer from "../components/home/Footer.jsx";`.

```bash
git rm src/components/Planos.jsx src/components/ParaQuem.jsx src/components/Confianca.jsx src/components/CTAFinal.jsx src/components/Contato.jsx src/components/Footer.jsx
```

- [ ] **Step 6: Gates e navegador**

Run: `npm test && npm run lint && npm run build`
Expected: verde.
Run: `grep -rn "glow-gold\|text-gradient-gold\|animate-rise" src/components src/pages src/layouts`
Expected: nenhuma ocorrência.
No navegador: em `/`, os três planos têm títulos, listas e botões na mesma linha de base, e o "Profissional" se destaca pela cor, não pela altura. Em `/termos` (1440px) o índice lateral leva às seções; em 375px o índice some e o texto ocupa a largura.

- [ ] **Step 7: Commit**

```bash
git add src/components src/pages src/layouts
git commit -m "feat: home com planos alinhados, garantias, contato unico e paginas legais com indice

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Landing L2 — estrutura e visual estático

**Files:**
- Create: `src/exemplos/landing/landing.css`, `src/exemplos/landing/secoes/BotaoDiagnostico.jsx`, `…/Cabecalho.jsx`, `…/Hero.jsx`, `…/Problema.jsx`, `…/Solucao.jsx`, `…/Passos.jsx`, `…/Provas.jsx`, `…/Faq.jsx`, `…/CtaFinal.jsx`, `…/Rodape.jsx`
- Modify: `src/exemplos/landing/LandingExemplar.jsx`
- Delete: `src/exemplos/landing/secoes.jsx`

**Interfaces:**
- Consumes: `DORES`, `PASSOS`, `PROVAS`, `FAQ` (`conteudo.js`), `CATEGORIAS`, `CATALOGO`, `linkWhatsApp`, `MSG`, `Wordmark`, `Tema`.
- Produces: ganchos de classe que o Task 7 anima — `.cabecalho-landing`, `.palavra`, `.hero-resto`, `.palco`/`.pilha`/`.carta`, `.frase`/`.preenchida`, `.trilha-palco`/`.trilha-janela`/`.trilha`/`.passo`, `.provas-grade`/`.prova-numero`. Cada seção que anima expõe um `ref` na `<section>` raiz.

- [ ] **Step 1: `landing.css`**

```css
/* Exemplar landing — estilos que o Tailwind não expressa bem.
   Regra de ouro: o DOM sem animação já é o estado final. As classes .ativa
   só entram por JS (useGsap) em telas ≥ 768px sem prefers-reduced-motion. */

.texto-contorno {
  color: transparent;
  -webkit-text-stroke: 0.03em var(--contorno, var(--color-base-content));
}

/* Letreiro infinito — CSS puro, conteúdo duplicado. */
@keyframes letreiro {
  to {
    transform: translateX(-50%);
  }
}

.letreiro-trilha {
  display: flex;
  width: max-content;
  animation: letreiro 45s linear infinite;
}

/* Cabeçalho depois de rolar: régua e fundo sólido, sem mudar de altura. */
.cabecalho-landing.rolado {
  box-shadow: 0 1px 0 color-mix(in oklab, var(--color-primary-content) 25%, transparent);
}

/* Problema: cartas empilhadas com pin. */
.palco.ativa {
  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.palco.ativa .pilha {
  position: relative;
  display: block;
  height: min(26rem, 52dvh);
}

.palco.ativa .carta {
  position: absolute;
  inset: 0;
}

/* Passos: trilha horizontal com pin. */
.trilha-palco.ativa {
  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.trilha-palco.ativa .trilha {
  display: flex;
  width: max-content;
  gap: 1.5rem;
}

.trilha-palco.ativa .passo {
  width: min(30rem, 70vw);
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .letreiro-trilha {
    animation: none;
  }
}
```

- [ ] **Step 2: `BotaoDiagnostico.jsx`, `Cabecalho.jsx`, `Rodape.jsx`**

`secoes/BotaoDiagnostico.jsx`:

```jsx
import { ArrowUpRight } from "@phosphor-icons/react";
import { linkWhatsApp, MSG } from "../../../config.js";

// A ação única da página: todo CTA leva ao diagnóstico no WhatsApp.
export default function BotaoDiagnostico({ children = "Agendar diagnóstico gratuito", sobreCobalto = false, grande = false }) {
  const cores = sobreCobalto ? "bg-base-100 text-primary" : "bg-primary text-primary-content";
  const circulo = sobreCobalto ? "bg-primary text-primary-content" : "bg-base-100 text-primary";

  return (
    <a
      href={linkWhatsApp(MSG.diagnostico)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-4 rounded-full font-extrabold uppercase tracking-tight transition-transform duration-500 ease-mola active:scale-[0.98] ${
        grande ? "py-2.5 pl-7 pr-2.5 text-base" : "py-1.5 pl-4 pr-1.5 text-xs"
      } ${cores}`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`grid place-items-center rounded-full transition-transform duration-500 ease-mola group-hover:-translate-y-0.5 group-hover:translate-x-1 ${
          grande ? "h-11 w-11" : "h-7 w-7"
        } ${circulo}`}
      >
        <ArrowUpRight weight="bold" className={grande ? "h-5 w-5" : "h-3.5 w-3.5"} />
      </span>
    </a>
  );
}
```

`secoes/Cabecalho.jsx`:

```jsx
import { useRef } from "react";
import Wordmark from "../../../components/Wordmark.jsx";
import BotaoDiagnostico from "./BotaoDiagnostico.jsx";

export default function Cabecalho() {
  const ref = useRef(null);

  return (
    <header ref={ref} className="cabecalho-landing sticky top-11 z-(--z-cabecalho) bg-primary text-primary-content">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Wordmark variante="mono" className="h-6" />
        <BotaoDiagnostico sobreCobalto>Diagnóstico grátis</BotaoDiagnostico>
      </div>
    </header>
  );
}
```

`secoes/Rodape.jsx`:

```jsx
import { Link } from "react-router-dom";

export default function Rodape() {
  return (
    <footer className="bg-base-content text-base-100">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-6 text-sm sm:flex-row sm:items-center">
        <p>Exemplar de landing page feito pela ogis.cloud · Curitiba/PR</p>
        <Link to="/" className="font-bold underline-offset-4 hover:underline">
          Voltar ao site da ogis.cloud
        </Link>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: `Hero.jsx`**

```jsx
import { Fragment, useRef } from "react";
import { CATALOGO } from "../../../data/catalogo.js";
import BotaoDiagnostico from "./BotaoDiagnostico.jsx";

const PALAVRAS = [
  { texto: "Um" },
  { texto: "responsável." },
  { texto: "Zero", contorno: true },
  { texto: "dor" },
  { texto: "de" },
  { texto: "cabeça." },
];

const LETREIRO = CATALOGO.map((item) => item.nome.toUpperCase());

export default function Hero() {
  const ref = useRef(null);

  return (
    <section
      ref={ref}
      id="topo"
      className="relative flex min-h-[calc(100dvh-2.75rem)] flex-col overflow-hidden bg-primary text-primary-content"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pb-28 pt-16">
        <h1 className="text-[clamp(3.25rem,11vw,9.5rem)] font-black uppercase leading-[0.86] tracking-[-0.05em] [--contorno:var(--color-primary-content)]">
          {/* O espaço fica FORA da máscara: é ele que permite quebrar a linha entre palavras. */}
          {PALAVRAS.map(({ texto, contorno }) => (
            <Fragment key={texto}>
              <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                <span className={`palavra inline-block ${contorno ? "texto-contorno" : ""}`}>{texto}</span>
              </span>{" "}
            </Fragment>
          ))}
        </h1>

        <div className="hero-resto mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[46ch] text-lg font-medium leading-relaxed text-primary-content/90">
            Sua empresa inteira funcionando online, sob a responsabilidade de uma pessoa só. Site,
            e-mail profissional, sistema de gestão e suporte — em vez de quatro fornecedores que se
            culpam entre si, um número de telefone que resolve.
          </p>
          <div className="flex flex-col items-start gap-3">
            <BotaoDiagnostico sobreCobalto grande />
            <p className="text-sm text-primary-content/80">Diagnóstico sem custo e sem compromisso · sem fidelidade</p>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="overflow-hidden bg-base-100 py-3 text-primary">
        <div className="letreiro-trilha">
          {[0, 1].map((copia) => (
            <span key={copia} className="flex shrink-0 items-center text-lg font-black uppercase tracking-tight">
              {LETREIRO.map((nome) => (
                <span key={nome} className="px-5">
                  {nome} <span className="pl-5">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: `Problema.jsx` e `Solucao.jsx`**

`secoes/Problema.jsx`:

```jsx
import { useRef } from "react";
import { DORES } from "../conteudo.js";

export default function Problema() {
  const ref = useRef(null);

  return (
    <section ref={ref} id="problema" className="bg-base-100">
      <div className="palco mx-auto max-w-6xl px-5 py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">O problema</p>
          <h2 className="mt-4 text-[clamp(2.25rem,6vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
            Ninguém contrata quatro fornecedores por vontade própria
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg text-base-content/80">
            Acontece aos poucos, cada um resolvendo uma urgência. Até o dia em que dá problema e não há
            ninguém responsável pelo conjunto.
          </p>
        </div>

        <div className="pilha mt-12 grid gap-4 sm:grid-cols-2">
          {DORES.map((dor, i) => (
            <article
              key={dor.titulo}
              className={`carta flex flex-col justify-between gap-10 p-8 sm:p-10 ${
                i % 2 === 0 ? "bg-primary text-primary-content" : "bg-base-200 text-base-content ring-2 ring-inset ring-base-content"
              }`}
            >
              <span className="text-sm font-extrabold tracking-[0.2em]">
                {String(i + 1).padStart(2, "0")}/{String(DORES.length).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[clamp(1.75rem,4vw,3rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
                  {dor.titulo}
                </h3>
                <p className="mt-4 max-w-[48ch] text-base leading-relaxed opacity-90">{dor.texto}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

`secoes/Solucao.jsx`:

```jsx
import { useRef } from "react";
import { Check } from "@phosphor-icons/react";
import { CATEGORIAS } from "../../../data/catalogo.js";

const FRASE = ["UM", "CONTRATO.", "UMA", "PESSOA.", "TUDO", "NO", "AR."];

const GARANTIAS = [
  "O domínio é registrado no CNPJ da sua empresa, sempre",
  "As contas de e-mail são suas, com as credenciais na sua mão",
  "Sem contrato de permanência e sem multa de cancelamento",
  "Se quiser sair, ajudamos na transferência para quem assumir",
];

export default function Solucao() {
  const ref = useRef(null);

  return (
    <section ref={ref} id="pilares" className="bg-primary py-28 text-primary-content sm:py-40">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em]">A solução · quatro frentes, um responsável</p>
        <p className="frase mt-6 text-[clamp(2.75rem,9vw,7.5rem)] font-black leading-[0.88] tracking-[-0.05em] [--contorno:var(--color-primary-content)]">
          {FRASE.map((palavra, i) => (
            <span key={`${palavra}-${i}`} className="relative inline-block pr-[0.25em]">
              <span className="texto-contorno">{palavra}</span>
              <span aria-hidden="true" className="preenchida absolute left-0 top-0">
                {palavra}
              </span>
            </span>
          ))}
        </p>
        <p className="mt-8 max-w-[56ch] text-lg text-primary-content/90">
          Não é um serviço avulso: é a sua operação digital inteira, cuidada por quem responde pelo
          conjunto.
        </p>

        <ul className="mt-16 border-t-2 border-primary-content">
          {CATEGORIAS.map((cat) => (
            <li
              key={cat.slug}
              className="grid gap-3 border-b-2 border-primary-content py-7 md:grid-cols-[1fr_1fr] md:items-baseline md:gap-12"
            >
              <h3 className="text-[clamp(1.75rem,4.5vw,3.25rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
                {cat.nome}
              </h3>
              <p className="text-lg text-primary-content/90">{cat.promessa}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-primary-content/80">
          Você não precisa de tudo no primeiro dia. Começamos pelo que dói mais.
        </p>

        <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em]">A objeção honesta</p>
            <h3 className="mt-4 text-[clamp(2rem,4.5vw,3.25rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
              “Não é arriscado depender de um fornecedor só?”
            </h3>
            <p className="mt-6 text-primary-content/90">
              Seria, se depender significasse ficar sem acesso ao que é seu. É exatamente isso que
              acontece quando o domínio está no nome do fornecedor e ninguém sabe a senha do e-mail.
            </p>
            <p className="mt-4 text-primary-content/90">
              Trabalhamos ao contrário: tudo o que é da sua empresa fica no nome da sua empresa. Você
              fica com um responsável — não com uma corda no pescoço.
            </p>
          </div>
          <ul className="flex flex-col gap-5 bg-base-100 p-8 text-base-content sm:p-10">
            {GARANTIAS.map((g) => (
              <li key={g} className="flex items-start gap-3 font-medium">
                <Check weight="bold" className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: `Passos.jsx`, `Provas.jsx`, `Faq.jsx`, `CtaFinal.jsx`**

`secoes/Passos.jsx`:

```jsx
import { useRef } from "react";
import { PASSOS } from "../conteudo.js";

export default function Passos() {
  const ref = useRef(null);

  return (
    <section ref={ref} id="como-funciona" className="bg-base-100">
      <div className="trilha-palco mx-auto max-w-6xl px-5 py-24">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">Como funciona</p>
        <h2 className="mt-4 max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
          Do primeiro contato à sustentação
        </h2>
        <div className="trilha-janela mt-12">
          <ol className="trilha grid gap-4 md:grid-cols-2">
            {PASSOS.map((passo) => (
              <li key={passo.numero} className="passo flex flex-col gap-8 bg-base-200 p-8 ring-2 ring-inset ring-base-content sm:p-10">
                <span className="text-[clamp(3.5rem,8vw,6rem)] font-black leading-none tracking-[-0.05em] text-primary">
                  {passo.numero}
                </span>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-[-0.03em]">{passo.titulo}</h3>
                  <p className="mt-3 max-w-[44ch] text-base-content/80">{passo.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
```

`secoes/Provas.jsx`:

```jsx
import { useRef } from "react";
import { PROVAS } from "../conteudo.js";

export default function Provas() {
  const ref = useRef(null);

  return (
    <section ref={ref} id="provas" className="bg-primary py-24 text-primary-content sm:py-32">
      <div className="provas-grade mx-auto grid max-w-6xl gap-14 px-5 md:grid-cols-3">
        {PROVAS.map((prova) => (
          <div key={prova.rotulo}>
            <span className="block overflow-hidden">
              <span className="prova-numero block text-[clamp(5rem,14vw,10rem)] font-black leading-[0.85] tracking-[-0.06em]">
                {prova.numero}
              </span>
            </span>
            <h3 className="mt-6 text-sm font-extrabold uppercase tracking-[0.2em]">{prova.rotulo}</h3>
            <p className="mt-2 max-w-[32ch] text-primary-content/90">{prova.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

`secoes/Faq.jsx`:

```jsx
import { FAQ } from "../conteudo.js";

// Lista de duas colunas, respostas sempre visíveis (sem acordeão).
export default function Faq() {
  return (
    <section id="faq" className="bg-base-200 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
          Perguntas que sempre aparecem
        </h2>
        <dl className="mt-14 border-b-2 border-base-content">
          {FAQ.map((item) => (
            <div key={item.pergunta} className="grid gap-4 border-t-2 border-base-content py-8 md:grid-cols-[1fr_1.2fr] md:gap-12">
              <dt className="text-2xl font-black uppercase leading-[0.95] tracking-[-0.03em]">{item.pergunta}</dt>
              <dd className="text-base leading-relaxed text-base-content/85">{item.resposta}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
```

`secoes/CtaFinal.jsx`:

```jsx
import BotaoDiagnostico from "./BotaoDiagnostico.jsx";

export default function CtaFinal() {
  return (
    <section id="contato" className="flex min-h-[80dvh] items-center bg-base-100 py-24">
      <div className="mx-auto w-full max-w-6xl px-5">
        <h2 className="text-[clamp(3.25rem,11vw,9rem)] font-black uppercase leading-[0.86] tracking-[-0.05em]">
          Agende o diagnóstico.
        </h2>
        <p className="mt-8 max-w-[56ch] text-lg text-base-content/85">
          Uma conversa de trinta minutos sobre como a sua empresa funciona hoje. Ao final você sabe o
          que vale mexer, o que vale manter e em que ordem — mesmo que não contrate nada.
        </p>
        <div className="mt-10 flex flex-col items-start gap-4">
          <BotaoDiagnostico grande />
          <p className="text-sm text-base-content/75">Resposta no mesmo dia útil</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Compor e apagar o antigo**

`src/exemplos/landing/LandingExemplar.jsx` inteiro:

```jsx
import "@fontsource-variable/archivo";
import "./landing.css";
import SEO from "../../components/SEO.jsx";
import Tema from "../../components/Tema.jsx";
import Cabecalho from "./secoes/Cabecalho.jsx";
import Hero from "./secoes/Hero.jsx";
import Problema from "./secoes/Problema.jsx";
import Solucao from "./secoes/Solucao.jsx";
import Passos from "./secoes/Passos.jsx";
import Provas from "./secoes/Provas.jsx";
import Faq from "./secoes/Faq.jsx";
import CtaFinal from "./secoes/CtaFinal.jsx";
import Rodape from "./secoes/Rodape.jsx";

export default function LandingExemplar() {
  return (
    <Tema superficie="landing">
      <SEO
        title="Exemplar — Landing Page"
        description="Exemplar de landing page construído pela ogis.cloud: uma página, uma promessa, uma ação."
        path="/exemplos/landing"
        noindex
      />
      <Cabecalho />
      <main id="conteudo">
        <Hero />
        <Problema />
        <Solucao />
        <Passos />
        <Provas />
        <Faq />
        <CtaFinal />
      </main>
      <Rodape />
    </Tema>
  );
}
```

```bash
git rm src/exemplos/landing/secoes.jsx
```

- [ ] **Step 7: Gates e navegador**

Run: `npm test && npm run lint && npm run build`
Expected: verde. (Os `useRef` ainda sem uso de leitura não geram erro; o Task 7 os consome.)
No navegador, em `/exemplos/landing` (1440px e 375px): blocos inteiros alternando cobalto e osso, títulos em caixa-alta Archivo 900, "ZERO" vazado, letreiro correndo, cartas em grade, passos em grade, FAQ em duas colunas. Nada de cards com sombra ou ícones decorativos. Nenhum CTA aponta para outro lugar além do WhatsApp com `MSG.diagnostico` (conferir com `document.querySelectorAll('main a[href*="wa.me"]').length` ≥ 3 e nenhum outro `<a>` externo no `<main>`).

- [ ] **Step 8: Commit**

```bash
git add src/exemplos/landing
git commit -m "feat: landing exemplar na direcao campanha cinetica (estrutura e visual)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Landing L2 — movimento com GSAP

**Files:**
- Create: `src/exemplos/landing/useGsap.js`, `src/exemplos/landing/animacoes.js`
- Modify: `src/exemplos/landing/secoes/{Cabecalho,Hero,Problema,Solucao,Passos,Provas}.jsx`, `src/exemplos/landing/LandingExemplar.jsx`

**Interfaces:**
- Consumes: ganchos de classe e `ref`s do Task 6.
- Produces: `useGsap(escopo: RefObject, configurar: (mm, raiz) => void)`; constantes `MOVIMENTO_COMPLETO`, `MOVIMENTO_SIMPLES`; `animarCabecalho`, `animarHero`, `animarProblema`, `animarFrase`, `animarPassos`, `animarProvas` (todas `(mm, raiz) => void`).

- [ ] **Step 1: `useGsap.js`**

```js
import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Pins e scrubs só em tela larga e sem pedido de movimento reduzido.
export const MOVIMENTO_COMPLETO = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
// Entradas simples (máscaras, fades) valem em qualquer largura.
export const MOVIMENTO_SIMPLES = "(prefers-reduced-motion: no-preference)";

/**
 * Roda `configurar(mm, raiz)` num gsap.matchMedia escopado no elemento do ref.
 * Tudo é desfeito ao desmontar (seguro no StrictMode). `configurar` precisa ser
 * estável: defina-a fora do componente (ver animacoes.js).
 */
export function useGsap(escopo, configurar) {
  useLayoutEffect(() => {
    const raiz = escopo.current;
    const mm = gsap.matchMedia(raiz);
    configurar(mm, raiz);
    return () => mm.revert();
  }, [escopo, configurar]);
}

export { gsap, ScrollTrigger };
```

- [ ] **Step 2: `animacoes.js`**

```js
import { gsap, ScrollTrigger, MOVIMENTO_COMPLETO, MOVIMENTO_SIMPLES } from "./useGsap.js";

// Cada função recebe o gsap.matchMedia (mm) e o elemento raiz da seção.
// Seletores em string ficam escopados na raiz. Animamos só transform e opacity.

export function animarCabecalho(mm, raiz) {
  mm.add("all", () => {
    ScrollTrigger.create({
      start: 80,
      end: "max",
      toggleClass: { targets: raiz, className: "rolado" },
    });
  });
}

export function animarHero(mm) {
  mm.add(MOVIMENTO_SIMPLES, () => {
    gsap.from(".palavra", { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.07, delay: 0.1 });
    gsap.from(".hero-resto", { opacity: 0, y: 24, duration: 0.9, ease: "power3.out", delay: 0.55 });
  });
}

export function animarProblema(mm, raiz) {
  mm.add(MOVIMENTO_COMPLETO, (contexto) => {
    const palco = raiz.querySelector(".palco");
    const cartas = contexto.selector(".carta");
    palco.classList.add("ativa");
    gsap.set(cartas.slice(1), { yPercent: 115 });

    const linha = gsap.timeline({
      scrollTrigger: {
        trigger: palco,
        start: "top top",
        end: () => `+=${window.innerHeight * (cartas.length - 1)}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    cartas.slice(1).forEach((carta, i) => {
      linha
        .to(carta, { yPercent: 0, ease: "none" })
        .to(cartas[i], { scale: 0.92, opacity: 0.5, ease: "none" }, "<");
    });

    return () => palco.classList.remove("ativa");
  });
}

export function animarFrase(mm) {
  mm.add(MOVIMENTO_SIMPLES, () => {
    gsap.fromTo(
      ".preenchida",
      { opacity: 0 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: { trigger: ".frase", start: "top 80%", end: "bottom 35%", scrub: true },
      },
    );
  });
}

export function animarPassos(mm, raiz) {
  mm.add(MOVIMENTO_COMPLETO, () => {
    const palco = raiz.querySelector(".trilha-palco");
    const janela = raiz.querySelector(".trilha-janela");
    const trilha = raiz.querySelector(".trilha");
    palco.classList.add("ativa");
    const distancia = () => Math.max(0, trilha.scrollWidth - janela.clientWidth);

    gsap.to(trilha, {
      x: () => -distancia(),
      ease: "none",
      scrollTrigger: {
        trigger: palco,
        start: "top top",
        end: () => `+=${distancia()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    return () => palco.classList.remove("ativa");
  });
}

export function animarProvas(mm) {
  mm.add(MOVIMENTO_SIMPLES, () => {
    gsap.from(".prova-numero", {
      yPercent: 105,
      duration: 1,
      ease: "power4.out",
      stagger: 0.12,
      scrollTrigger: { trigger: ".provas-grade", start: "top 80%" },
    });
  });
}
```

- [ ] **Step 3: Ligar nas seções**

Em cada seção, importar `useGsap` e a animação, e chamar logo após o `useRef`:

- `Cabecalho.jsx`: `import { useGsap } from "../useGsap.js";` + `import { animarCabecalho } from "../animacoes.js";` + `useGsap(ref, animarCabecalho);`
- `Hero.jsx`: `useGsap` + `animarHero` → `useGsap(ref, animarHero);`
- `Problema.jsx`: `useGsap` + `animarProblema` → `useGsap(ref, animarProblema);`
- `Solucao.jsx`: `useGsap` + `animarFrase` → `useGsap(ref, animarFrase);`
- `Passos.jsx`: `useGsap` + `animarPassos` → `useGsap(ref, animarPassos);`
- `Provas.jsx`: `useGsap` + `animarProvas` → `useGsap(ref, animarProvas);`

Em `LandingExemplar.jsx`, recalcular os pins quando as fontes terminarem de carregar (Archivo muda a altura dos títulos):

```jsx
import { useEffect } from "react";
import { ScrollTrigger } from "./useGsap.js";
```

e, no início do componente:

```jsx
  useEffect(() => {
    let ativo = true;
    document.fonts?.ready.then(() => {
      if (ativo) ScrollTrigger.refresh();
    });
    return () => {
      ativo = false;
    };
  }, []);
```

- [ ] **Step 4: Gates**

Run: `npm test && npm run lint && npm run build`
Expected: verde.
Run: `grep -rln "from \"gsap" src | grep -v "src/exemplos/landing/"`
Expected: nenhuma saída.

- [ ] **Step 5: Conferir no navegador (1440px)**

Em `/exemplos/landing`: as palavras do H1 sobem mascaradas no carregamento; a seção Problema fixa e as cartas entram uma sobre a outra; a frase "UM CONTRATO…" se preenche palavra por palavra ao rolar; os passos deslizam na horizontal enquanto a página rola; os números das provas sobem mascarados. Sem erros no console (`read_console_messages` com `onlyErrors`).

- [ ] **Step 6: Redimensionar e reduzir movimento (Review Focus 2)**

Com a página rolada até o meio da seção Problema, `resize_window` para 375×812, recarregar e rolar a página inteira: cartas e passos em pilha vertical, nenhuma carta sobreposta, nenhum `.ativa` no DOM (`document.querySelectorAll(".ativa").length === 0`). Voltar para `preset: "desktop"`: os pins voltam a funcionar.
Emular movimento reduzido: navegar com o DevTools do navegador do app não é possível, então verificar pelo código e pelo CSS: com `matchMedia("(prefers-reduced-motion: reduce)")` verdadeiro, nenhuma função de `animacoes.js` adiciona `.ativa` (todas usam `MOVIMENTO_*`, que exigem `no-preference`), e o letreiro para por `landing.css`. Registrar isso no relatório da tarefa.

- [ ] **Step 7: Commit**

```bash
git add src/exemplos/landing
git commit -m "feat: movimento da landing com GSAP (pins, scrub e mascaras) respeitando movimento reduzido

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Site S1 — chrome e páginas Início, Sobre, Soluções e Solução

**Files:**
- Create: `src/exemplos/site/site.css`, `src/exemplos/site/ListaSolucoes.jsx`
- Modify: `src/exemplos/site/ChromeSite.jsx`, `src/exemplos/site/SiteHome.jsx`, `src/exemplos/site/SiteSobre.jsx`, `src/exemplos/site/SiteSolucoes.jsx`, `src/exemplos/site/SiteSolucao.jsx`, `src/exemplos/site/SiteExemplar.jsx`

**Interfaces:**
- Consumes: `CATEGORIAS`, `CATALOGO`, `itensPorCategoria`, `buscarItem`, `buscarCategoria`, `relacionados`, `BRAND`, `MSG`, `ASSUNTO`, `linkWhatsApp`, `linkEmail`, `Wordmark` (variante `mono`), `SeloEscopo`, `NaoEncontrado`.
- Produces: `<ListaSolucoes itens colunas?: 1 | 2>`; `CabecalhoSite`, `RodapeSite` (mesmos nomes de export de hoje); classe `.link-sereno`.

- [ ] **Step 1: `site.css`**

```css
/* Exemplar site — sublinhado que cresce e painel lateral (<dialog>). */
.link-sereno {
  position: relative;
}

.link-sereno::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.link-sereno:hover::after,
.link-sereno:focus-visible::after,
.link-sereno[aria-current="page"]::after {
  transform: scaleX(1);
}

@keyframes painel-entrar {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.painel-site[open] {
  animation: painel-entrar 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.painel-site::backdrop {
  background: rgb(43 41 38 / 0.35);
}

@media (prefers-reduced-motion: reduce) {
  .link-sereno::after,
  .painel-site[open] {
    transition: none;
    animation: none;
  }
}
```

Em `SiteExemplar.jsx`, logo abaixo de `import "@fontsource-variable/manrope";`, adicionar `import "./site.css";`.

- [ ] **Step 2: `ListaSolucoes.jsx`**

```jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import SeloEscopo from "../../components/SeloEscopo.jsx";

// Lista editorial de soluções: substitui os cards no site sereno.
export default function ListaSolucoes({ itens, colunas = 1 }) {
  return (
    <ul className={`border-t border-base-300 ${colunas === 2 ? "md:grid md:grid-cols-2 md:gap-x-12" : ""}`}>
      {itens.map((item) => (
        <li key={item.slug} className="border-b border-base-300">
          <Link
            to={`/exemplos/site/solucoes/${item.slug}`}
            className="group flex items-start justify-between gap-6 py-6"
          >
            <span className="min-w-0">
              <span className="block text-lg font-bold tracking-[-0.02em] text-base-content">{item.nome}</span>
              <span className="mt-1 block text-base-content/70">{item.resumo}</span>
              <SeloEscopo item={item} className="mt-3" />
            </span>
            <ArrowRight
              className="mt-1.5 h-5 w-5 shrink-0 text-base-content/40 transition-all duration-500 ease-mola group-hover:translate-x-1 group-hover:text-primary"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: `ChromeSite.jsx`**

```jsx
import { useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { ArrowRight, List, X } from "@phosphor-icons/react";
import { BRAND, ASSUNTO, MSG, linkEmail, linkWhatsApp } from "../../config.js";
import Wordmark from "../../components/Wordmark.jsx";

const PAGINAS = [
  { para: "/exemplos/site", rotulo: "Início", exata: true },
  { para: "/exemplos/site/sobre", rotulo: "Sobre" },
  { para: "/exemplos/site/solucoes", rotulo: "Soluções" },
  { para: "/exemplos/site/contato", rotulo: "Contato" },
];

function classesLink({ isActive }) {
  return `link-sereno text-sm transition-colors duration-300 ease-mola ${
    isActive ? "font-bold text-base-content" : "text-base-content/70 hover:text-base-content"
  }`;
}

export function CabecalhoSite() {
  const painelRef = useRef(null);
  const abrir = () => painelRef.current?.showModal();
  const fechar = () => painelRef.current?.close();

  return (
    <header className="sticky top-11 z-(--z-cabecalho) border-b border-base-300 bg-base-100/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4" aria-label="Principal">
        <Link to="/exemplos/site" aria-label="Início">
          <Wordmark variante="mono" className="h-6 text-base-content" />
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {PAGINAS.map((p) => (
            <li key={p.para}>
              <NavLink to={p.para} end={p.exata} className={classesLink}>
                {p.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>

        <a
          href={linkWhatsApp(MSG.contato)}
          target="_blank"
          rel="noopener noreferrer"
          className="link-sereno hidden items-center gap-1.5 text-sm font-bold text-primary md:inline-flex"
        >
          Fale com a gente <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={abrir}
          aria-haspopup="dialog"
          aria-label="Abrir menu"
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-base-content md:hidden"
        >
          <List className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>

      {/* <dialog> modal: prende o foco, fecha com Esc e devolve o foco ao botão. */}
      <dialog
        ref={painelRef}
        aria-label="Menu"
        className="painel-site m-0 ml-auto h-dvh max-h-dvh w-[min(22rem,85vw)] max-w-none bg-base-100 p-6 text-base-content"
      >
        <div className="flex items-center justify-between">
          <Wordmark variante="mono" className="h-6" />
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar menu"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <ul className="mt-10 flex flex-col">
          {PAGINAS.map((p) => (
            <li key={p.para} className="border-b border-base-300">
              <NavLink
                to={p.para}
                end={p.exata}
                onClick={fechar}
                className={({ isActive }) =>
                  `block py-4 text-2xl tracking-[-0.02em] ${isActive ? "font-bold" : "font-medium text-base-content/75"}`
                }
              >
                {p.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>
      </dialog>
    </header>
  );
}

export function RodapeSite() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2">
        <div>
          <Wordmark variante="mono" className="h-6" />
          <p className="mt-4 max-w-xs text-sm text-base-content/70">{BRAND.tagline}</p>
          <p className="mt-6 text-sm text-base-content/70">
            {BRAND.cidade} · atendimento remoto para todo o Brasil
            <br />
            <a href={linkEmail(ASSUNTO.contato, MSG.contato)} className="link-sereno">
              {BRAND.email}
            </a>
          </p>
        </div>
        <nav aria-label="Mapa do site">
          <ul className="grid grid-cols-2 gap-3 text-sm">
            {PAGINAS.map((p) => (
              <li key={p.para}>
                <Link to={p.para} className="link-sereno text-base-content/75 hover:text-base-content">
                  {p.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl border-t border-base-300 px-5 py-6 text-xs text-base-content/70">
        © {ano} {BRAND.name} · Exemplar de site institucional construído pela ogis.cloud
      </p>
    </footer>
  );
}
```

- [ ] **Step 4: `SiteHome.jsx`**

```jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { CATEGORIAS, CATALOGO } from "../../data/catalogo.js";
import { linkWhatsApp, MSG } from "../../config.js";
import SEO from "../../components/SEO.jsx";
import ListaSolucoes from "./ListaSolucoes.jsx";

const DIFERENCIAIS = [
  "Um único responsável, do domínio ao suporte",
  "Domínio e contas sempre no nome da sua empresa",
  "Monitoramento 24/7 com alerta automático",
  "Sem fidelidade e sem multa de cancelamento",
];

// Bento plano: tamanhos diferentes, sem sombra e sem borda — só tom de fundo.
const BENTO = ["col-span-2 bg-accent min-h-40", "bg-base-200 min-h-36", "bg-base-200 min-h-36", "col-span-2 bg-base-200 min-h-28"];

export default function SiteHome() {
  const destaques = CATALOGO.filter((item) => item.destaque);

  return (
    <>
      <SEO
        title="Exemplar — Site Institucional"
        description="Exemplar de site institucional construído pela ogis.cloud."
        path="/exemplos/site"
        noindex
      />

      <section id="topo" className="bg-base-100">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-20 sm:py-28 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-base-content sm:text-6xl">
              Tecnologia que funciona, sem você precisar entender dela.
            </h1>
            <p className="mt-7 max-w-[54ch] text-lg leading-relaxed text-base-content/75">
              Somos a empresa que cuida da parte digital do seu negócio: site, e-mail profissional,
              sistemas sob medida e a sustentação de tudo isso. Você fala com uma pessoa só.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link to="/exemplos/site/solucoes" className="link-sereno inline-flex items-center gap-1.5 font-bold text-base-content">
                Conhecer as soluções <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={linkWhatsApp(MSG.contato)}
                target="_blank"
                rel="noopener noreferrer"
                className="link-sereno font-bold text-primary"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {CATEGORIAS.map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/exemplos/site/solucoes#cat-${cat.slug}`}
                className={`group flex flex-col justify-between rounded-2xl p-5 transition-colors duration-500 ease-mola hover:bg-base-300 ${BENTO[i]}`}
              >
                <span className="text-lg font-bold tracking-[-0.02em] text-base-content">{cat.nome}</span>
                <span className="mt-6 text-sm text-base-content/70">{cat.promessa}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="diferenciais" className="bg-base-200 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="max-w-2xl text-3xl font-bold tracking-[-0.035em] text-base-content sm:text-4xl">
            Por que trabalhar com a gente
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg text-base-content/75">
            A maior parte dos problemas que encontramos não é falta de tecnologia — é falta de alguém
            responsável. Nosso trabalho é ser esse alguém.
          </p>
          <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {DIFERENCIAIS.map((d, i) => (
              <li key={d}>
                <span className="text-sm font-bold tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 font-medium text-base-content">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="destaques" className="bg-base-100 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-3xl font-bold tracking-[-0.035em] text-base-content sm:text-4xl">
              O que mais nos procuram
            </h2>
            <Link to="/exemplos/site/solucoes" className="link-sereno inline-flex items-center gap-1.5 font-bold text-primary">
              Ver todas as soluções <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-10">
            <ListaSolucoes itens={destaques} colunas={2} />
          </div>
        </div>
      </section>

      <section id="chamada" className="bg-base-200 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="max-w-3xl text-2xl font-bold leading-snug tracking-[-0.03em] text-base-content sm:text-3xl">
            Conte o que está acontecendo hoje no seu negócio.{" "}
            <Link to="/exemplos/site/contato" className="link-sereno text-primary">
              Respondemos no mesmo dia útil.
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 5: `SiteSobre.jsx` e `SiteSolucoes.jsx`**

`SiteSobre.jsx` (o array `PRINCIPIOS` existente permanece igual, só o JSX muda):

```jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { BRAND } from "../../config.js";
import SEO from "../../components/SEO.jsx";

const PRINCIPIOS = [
  {
    titulo: "Um responsável, não um fornecedor a mais",
    texto:
      "Você não deveria precisar saber de quem é a culpa quando o e-mail para de funcionar. Assumimos o conjunto: se está no ar, é problema nosso.",
  },
  {
    titulo: "O que é seu fica no seu nome",
    texto:
      "Domínio registrado no CNPJ da sua empresa, contas com as credenciais na sua mão. Você fica conosco por vontade, não por dependência.",
  },
  {
    titulo: "A tecnologia é invisível",
    texto:
      "Você não precisa entender de servidor, fila ou banco de dados. Precisa que funcione. A complexidade é problema nosso, não seu.",
  },
  {
    titulo: "Falar com quem desenvolve",
    texto:
      "Sem central de atendimento e sem protocolo. Quando você chama, fala com quem escreveu o código e pode resolver.",
  },
];

export default function SiteSobre() {
  return (
    <>
      <SEO
        title="Exemplar — Sobre"
        description="Página Sobre do exemplar de site institucional da ogis.cloud."
        path="/exemplos/site/sobre"
        noindex
      />

      <section id="sobre" className="bg-base-100 py-20 sm:py-28">
        <div className="mx-auto max-w-[62ch] px-5">
          <p className="text-sm font-bold text-primary">Quem somos</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-base-content sm:text-5xl">
            {BRAND.tagline}
          </h1>
          <div className="mt-10 flex flex-col gap-6 text-lg leading-relaxed text-base-content/80">
            <p>
              A ogis.cloud nasceu de uma constatação simples: pequenas e médias empresas não têm
              problema de tecnologia — têm problema de responsabilidade. Sobra fornecedor e falta
              alguém que responda pelo conjunto.
            </p>
            <p>
              Trabalhamos com empresas de {BRAND.cidade} e de todo o Brasil que já passaram por aquele
              ciclo: um site feito por alguém que sumiu, um e-mail configurado às pressas, um sistema
              que ninguém mais mantém. Nosso trabalho começa arrumando o que existe e continua
              garantindo que continue funcionando.
            </p>
          </div>
          <blockquote className="my-14 border-l-2 border-primary pl-6 text-2xl font-bold leading-snug tracking-[-0.02em] text-base-content">
            Não vendemos horas nem pacote fechado de prateleira.
          </blockquote>
          <p className="text-lg leading-relaxed text-base-content/80">
            Entendemos o processo, propomos o escopo por escrito e ficamos responsáveis pela
            sustentação depois que entra no ar.
          </p>
        </div>
      </section>

      <section id="principios" className="bg-base-200 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold tracking-[-0.035em] text-base-content sm:text-4xl">Como trabalhamos</h2>
          <ol className="mt-12 border-t border-base-300">
            {PRINCIPIOS.map((p, i) => (
              <li key={p.titulo} className="grid gap-3 border-b border-base-300 py-8 md:grid-cols-[4rem_1fr_1.4fr] md:gap-10">
                <span className="text-sm font-bold tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-bold tracking-[-0.02em] text-base-content">{p.titulo}</h3>
                <p className="text-base-content/75">{p.texto}</p>
              </li>
            ))}
          </ol>
          <Link to="/exemplos/site/contato" className="link-sereno mt-12 inline-flex items-center gap-1.5 text-lg font-bold text-primary">
            Conversar com a gente <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
```

`SiteSolucoes.jsx`:

```jsx
import { CATEGORIAS, itensPorCategoria } from "../../data/catalogo.js";
import SEO from "../../components/SEO.jsx";
import ListaSolucoes from "./ListaSolucoes.jsx";

export default function SiteSolucoes() {
  return (
    <>
      <SEO
        title="Exemplar — Soluções"
        description="Todas as soluções da ogis.cloud, agrupadas por frente de atuação."
        path="/exemplos/site/solucoes"
        noindex
      />

      <section id="solucoes" className="bg-base-100 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-[-0.035em] text-base-content sm:text-5xl">Soluções</h1>
            <p className="mt-6 text-lg text-base-content/75">
              Tudo o que fazemos, agrupado pelas quatro frentes que sustentam a operação digital de um
              negócio. Cada orçamento é feito sob medida.
            </p>
          </div>

          {CATEGORIAS.map((cat) => (
            <section key={cat.slug} id={`cat-${cat.slug}`} className="mt-20">
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-base-content">{cat.nome}</h2>
              <p className="mt-2 max-w-[56ch] text-lg text-base-content/70">{cat.promessa}</p>
              <div className="mt-8">
                <ListaSolucoes itens={itensPorCategoria(cat.slug)} colunas={2} />
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 6: `SiteSolucao.jsx`**

```jsx
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { buscarItem, buscarCategoria, relacionados } from "../../data/catalogo.js";
import { linkWhatsApp } from "../../config.js";
import SeloEscopo from "../../components/SeloEscopo.jsx";
import SEO from "../../components/SEO.jsx";
import NaoEncontrado from "../NaoEncontrado.jsx";
import ListaSolucoes from "./ListaSolucoes.jsx";

export default function SiteSolucao() {
  const { slug } = useParams();
  const item = buscarItem(slug);

  if (!item) {
    return <NaoEncontrado voltarPara="/exemplos/site/solucoes" rotulo="Ver todas as soluções" />;
  }

  const categoria = buscarCategoria(item.categoria);
  const outros = relacionados(item.slug);
  const mensagem = `Olá! Vim pelo site da ogis.cloud e quero saber mais sobre "${item.nome}".`;

  return (
    <>
      <SEO
        title={`Exemplar — ${item.nome}`}
        description={item.resumo}
        path={`/exemplos/site/solucoes/${item.slug}`}
        noindex
      />

      <article className="bg-base-100 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5">
          <Link to="/exemplos/site/solucoes" className="link-sereno inline-flex items-center gap-2 text-sm text-base-content/70">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Todas as soluções
          </Link>

          <p className="mt-10 text-sm font-bold text-primary">{categoria.nome}</p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-base-content sm:text-5xl">{item.nome}</h1>
          <p className="mt-6 text-xl text-base-content/80">{item.resumo}</p>
          <SeloEscopo item={item} className="mt-5" />
          <p className="mt-10 text-lg leading-relaxed text-base-content/75">{item.descricao}</p>

          <h2 className="mt-14 text-xl font-bold tracking-[-0.02em] text-base-content">O que está incluso</h2>
          <ol className="mt-5 border-t border-base-300">
            {item.entregaveis.map((e, i) => (
              <li key={e} className="flex gap-5 border-b border-base-300 py-4 text-base-content/85">
                <span className="w-6 shrink-0 text-sm font-bold tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
                {e}
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-2xl bg-accent p-7 text-accent-content">
            <h2 className="font-bold">Ideal para</h2>
            <p className="mt-2">{item.idealPara}</p>
          </div>

          <div className="mt-14 flex flex-col items-start gap-5 border-t border-base-300 pt-10">
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-base-content">
              Quer saber se faz sentido para o seu negócio?
            </h2>
            <p className="text-base-content/75">O orçamento é feito sob medida, depois de entender o seu caso.</p>
            <a
              href={linkWhatsApp(mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-neutral px-6 py-3 text-sm font-bold text-neutral-content transition-transform duration-300 ease-mola active:scale-[0.98]"
            >
              Solicitar orçamento
            </a>
          </div>
        </div>

        {outros.length > 0 && (
          <div className="mx-auto mt-24 max-w-6xl px-5">
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-base-content">Também em {categoria.nome}</h2>
            <div className="mt-8">
              <ListaSolucoes itens={outros} colunas={2} />
            </div>
          </div>
        )}
      </article>
    </>
  );
}
```

- [ ] **Step 7: Gates, navegador e teclado (Review Focus 5)**

Run: `npm test && npm run lint && npm run build`
Expected: verde. (`SiteContato.jsx` ainda tem o visual antigo; ele muda no Task 9.)
No navegador, em `/exemplos/site`, `/sobre`, `/solucoes`, `/solucoes/site-institucional` e `/solucoes/nao-existe` (1440px e 375px): marfim, Manrope, nenhuma sombra nem borda de card, o link ativo em negrito com traço, e o 404 no visual do site. Em `/exemplos/site/solucoes#cat-sistemas` a âncora rola até a categoria.
Teclado em 375px: Tab até "Abrir menu", Enter abre o painel com o foco dentro, Tab não sai do painel, Esc fecha e `document.activeElement` volta a ser o botão "Abrir menu".

- [ ] **Step 8: Commit**

```bash
git add src/exemplos/site
git commit -m "feat: site exemplar na direcao corporativo sereno (chrome e paginas)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Site S1 — validação e página de contato

**Files:**
- Create: `src/exemplos/site/validacaoContato.js`, `src/exemplos/site/validacaoContato.test.js`
- Modify: `src/exemplos/site/SiteContato.jsx`

**Interfaces:**
- Consumes: `abrirExterno` (Task 2), `linkWhatsApp`, `linkEmail`, `MSG`, `ASSUNTO`, `BRAND`.
- Produces: `validarContato({ nome, empresa?, mensagem }): { nome?: string, mensagem?: string }` (objeto vazio = válido) e `textoContato({ nome, empresa, mensagem }): string`.

- [ ] **Step 1: Escrever o teste que falha**

`src/exemplos/site/validacaoContato.test.js`:

```js
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/exemplos/site`
Expected: FAIL — `Failed to resolve import "./validacaoContato.js"`.

- [ ] **Step 3: Implementar**

`src/exemplos/site/validacaoContato.js`:

```js
// Regras puras do formulário de contato do site exemplar.

export function validarContato({ nome = "", mensagem = "" } = {}) {
  const erros = {};
  if (!nome.trim()) erros.nome = "Diga como podemos te chamar.";
  if (mensagem.trim().length < 10) {
    erros.mensagem = "Conte em poucas palavras o que você precisa (mínimo de 10 caracteres).";
  }
  return erros;
}

export function textoContato({ nome = "", empresa = "", mensagem = "" } = {}) {
  return [
    "Olá! Vim pelo site da ogis.cloud.",
    nome.trim() && `Nome: ${nome.trim()}`,
    empresa.trim() && `Empresa: ${empresa.trim()}`,
    mensagem.trim() && `Mensagem: ${mensagem.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/exemplos/site`
Expected: PASS (5 testes).

- [ ] **Step 5: `SiteContato.jsx`**

```jsx
import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { BRAND, ASSUNTO, MSG, linkEmail, linkWhatsApp } from "../../config.js";
import SEO from "../../components/SEO.jsx";
import { abrirExterno } from "../../lib/abrirExterno.js";
import { validarContato, textoContato } from "./validacaoContato.js";

const CAMPOS = ["nome", "empresa", "mensagem"];

const CLASSE_CAMPO =
  "w-full rounded-xl bg-base-200 px-4 py-3 text-base text-base-content outline-none ring-1 ring-transparent transition-shadow duration-300 ease-mola placeholder:text-base-content/50 focus:ring-primary aria-[invalid=true]:ring-error";

export default function SiteContato() {
  const [form, setForm] = useState({ nome: "", empresa: "", mensagem: "" });
  const [erros, setErros] = useState({});

  function alterar(campo) {
    return (evento) => {
      setForm((atual) => ({ ...atual, [campo]: evento.target.value }));
      if (erros[campo]) {
        setErros((atual) => {
          const proximo = { ...atual };
          delete proximo[campo];
          return proximo;
        });
      }
    };
  }

  function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarContato(form);
    setErros(encontrados);
    const primeiro = CAMPOS.find((campo) => encontrados[campo]);
    if (primeiro) {
      document.getElementById(`contato-${primeiro}`)?.focus();
      return;
    }
    abrirExterno(linkWhatsApp(textoContato(form)));
  }

  function propsCampo(campo) {
    return {
      id: `contato-${campo}`,
      value: form[campo],
      onChange: alterar(campo),
      "aria-invalid": Boolean(erros[campo]),
      "aria-describedby": erros[campo] ? `contato-${campo}-erro` : undefined,
      className: CLASSE_CAMPO,
    };
  }

  return (
    <>
      <SEO
        title="Exemplar — Contato"
        description="Página de contato do exemplar de site institucional da ogis.cloud."
        path="/exemplos/site/contato"
        noindex
      />

      <section id="contato" className="bg-base-100 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-16 px-5 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h1 className="text-4xl font-bold tracking-[-0.035em] text-base-content sm:text-5xl">Fale com a gente</h1>
            <p className="mt-6 max-w-[48ch] text-lg text-base-content/75">
              Conte o que está acontecendo hoje no seu negócio. Respondemos no mesmo dia útil.
            </p>

            <dl className="mt-12 border-t border-base-300">
              <div className="border-b border-base-300 py-5">
                <dt className="text-sm font-bold text-base-content">WhatsApp</dt>
                <dd className="mt-1">
                  <a href={linkWhatsApp(MSG.contato)} target="_blank" rel="noopener noreferrer" className="link-sereno text-primary">
                    O canal mais rápido para falar conosco
                  </a>
                </dd>
              </div>
              <div className="border-b border-base-300 py-5">
                <dt className="text-sm font-bold text-base-content">E-mail</dt>
                <dd className="mt-1">
                  <a href={linkEmail(ASSUNTO.contato, MSG.contato)} className="link-sereno text-primary">
                    {BRAND.email}
                  </a>
                </dd>
              </div>
              <div className="border-b border-base-300 py-5">
                <dt className="text-sm font-bold text-base-content">Onde estamos</dt>
                <dd className="mt-1 text-base-content/75">{BRAND.cidade} · atendimento remoto para todo o Brasil</dd>
              </div>
            </dl>
          </div>

          <form noValidate onSubmit={enviar} className="flex flex-col gap-6 rounded-2xl bg-base-200/60 p-7 sm:p-9">
            <div>
              <h2 className="text-xl font-bold tracking-[-0.02em] text-base-content">Prefere escrever?</h2>
              <p className="mt-1 text-sm text-base-content/70">
                Preencha e continue a conversa no WhatsApp, com tudo já escrito.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contato-nome" className="text-sm font-bold text-base-content">Seu nome</label>
              <input type="text" autoComplete="name" placeholder="Como podemos te chamar" {...propsCampo("nome")} />
              {erros.nome && <p id="contato-nome-erro" className="text-sm font-medium text-error">{erros.nome}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contato-empresa" className="text-sm font-bold text-base-content">
                Empresa <span className="font-normal text-base-content/60">(opcional)</span>
              </label>
              <input type="text" autoComplete="organization" placeholder="Nome do seu negócio" {...propsCampo("empresa")} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contato-mensagem" className="text-sm font-bold text-base-content">Mensagem</label>
              <textarea rows={5} placeholder="O que está acontecendo hoje?" {...propsCampo("mensagem")} />
              {erros.mensagem && (
                <p id="contato-mensagem-erro" className="text-sm font-medium text-error">{erros.mensagem}</p>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-neutral px-6 py-3.5 text-sm font-bold text-neutral-content transition-transform duration-300 ease-mola active:scale-[0.98]"
            >
              Continuar no WhatsApp <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 6: Gates e navegador**

Run: `npm test && npm run lint && npm run build`
Expected: verde.
No navegador, em `/exemplos/site/contato`: enviar vazio mostra os dois erros sob os campos e o foco vai para "Seu nome", sem `alert`. Corrigir o nome apaga só o erro dele. Com tudo válido, abre uma aba do WhatsApp com o texto montado (conferir a URL pelo `read_network_requests` ou pela nova aba via `tabs_context`).

- [ ] **Step 7: Commit**

```bash
git add src/exemplos/site
git commit -m "feat: contato do site exemplar com validacao inline

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Loja J2 — cores por categoria, chrome e vitrine

**Files:**
- Create: `src/exemplos/loja/corCategoria.js`, `src/exemplos/loja/corCategoria.test.js`, `src/exemplos/loja/CartaoProduto.jsx`, `src/exemplos/loja/loja.css`
- Modify: `src/exemplos/loja/ChromeLoja.jsx`, `src/exemplos/loja/LojaVitrine.jsx`, `src/exemplos/loja/BotaoAdicionar.jsx`, `src/exemplos/loja/LojaExemplar.jsx`

**Interfaces:**
- Consumes: `CATEGORIAS`, `CATALOGO`, `filtrarCatalogo`, `itensPorCategoria`, `useOrcamento()` → `{ itens, total, temItem(slug), adicionar(slug, quantidade, observacao), remover, alterarQuantidade, alterarObservacao, limpar }`, `SeloEscopo`, `Wordmark`.
- Produces: `COR_CATEGORIA: Record<slug, { fundo: string, texto: string }>`, `corDaCategoria(slug)` (lança `Error` para slug sem cor); `<CartaoProduto item className?>`; `<BotaoAdicionar slug quantidade? observacao? largo?>` (mesma assinatura de hoje).

- [ ] **Step 1: Escrever o teste que falha**

`src/exemplos/loja/corCategoria.test.js`:

```js
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/exemplos/loja/corCategoria.test.js`
Expected: FAIL — `Failed to resolve import "./corCategoria.js"`.

- [ ] **Step 3: Implementar**

`src/exemplos/loja/corCategoria.js`:

```js
// Cor de cada categoria na loja exemplar. Classes completas e literais para o
// Tailwind encontrar. Categoria nova no catálogo precisa de cor aqui (há teste).
export const COR_CATEGORIA = {
  "presenca-digital": { fundo: "bg-[#ff7a3d]", texto: "text-[#2a1a0e]" },
  sistemas: { fundo: "bg-[#ffd249]", texto: "text-[#2a1a0e]" },
  infraestrutura: { fundo: "bg-[#9ed8b5]", texto: "text-[#2a1a0e]" },
  continuos: { fundo: "bg-[#2a1a0e]", texto: "text-[#fff7ec]" },
};

export function corDaCategoria(slug) {
  const cor = COR_CATEGORIA[slug];
  if (!cor) throw new Error(`Categoria sem cor: ${slug}`);
  return cor;
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/exemplos/loja/corCategoria.test.js`
Expected: PASS (3 testes).

- [ ] **Step 5: `loja.css`, `BotaoAdicionar.jsx`, `CartaoProduto.jsx`**

`src/exemplos/loja/loja.css`:

```css
/* Exemplar loja — pulo do contador do orçamento. */
@keyframes pulo {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.35);
  }
  100% {
    transform: scale(1);
  }
}

.contador-pulo {
  animation: pulo 0.45s cubic-bezier(0.32, 0.72, 0, 1);
}

@media (prefers-reduced-motion: reduce) {
  .contador-pulo {
    animation: none;
  }
}
```

Em `LojaExemplar.jsx`, abaixo de `import "@fontsource-variable/manrope";`, adicionar `import "./loja.css";`.

`BotaoAdicionar.jsx`:

```jsx
import { useState, useEffect, useRef } from "react";
import { Check, Plus } from "@phosphor-icons/react";
import { useOrcamento } from "./useOrcamento.js";

export default function BotaoAdicionar({ slug, quantidade = 1, observacao = "", largo = false }) {
  const { adicionar, temItem } = useOrcamento();
  const [adicionado, setAdicionado] = useState(false);
  const timer = useRef(null);

  // Limpa o timer se o componente sair da tela antes dos 2s.
  useEffect(() => () => clearTimeout(timer.current), []);

  function aoClicar() {
    adicionar(slug, quantidade, observacao);
    setAdicionado(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdicionado(false), 2000);
  }

  const rotulo = adicionado ? "Adicionado" : temItem(slug) ? "Adicionar mais" : "Adicionar";

  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-live="polite"
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full font-bold transition-all duration-300 ease-mola active:scale-[0.97] ${
        largo ? "w-full px-6 py-4 text-base" : "px-4 py-2 text-sm"
      } ${adicionado ? "bg-success text-success-content" : "bg-secondary text-secondary-content"}`}
    >
      {adicionado ? (
        <Check weight="bold" className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Plus weight="bold" className="h-4 w-4" aria-hidden="true" />
      )}
      {rotulo}
    </button>
  );
}
```

`CartaoProduto.jsx`:

```jsx
import { Link } from "react-router-dom";
import SeloEscopo from "../../components/SeloEscopo.jsx";
import BotaoAdicionar from "./BotaoAdicionar.jsx";
import { corDaCategoria } from "./corCategoria.js";

// A "capa" na cor da categoria, com o ícone grande, ocupa o lugar da foto.
export default function CartaoProduto({ item, className = "" }) {
  const cor = corDaCategoria(item.categoria);
  const Icone = item.icone;

  return (
    <article
      className={`group flex flex-col rounded-[1.75rem] bg-base-100 p-2 ring-1 ring-base-content/10 transition-transform duration-500 ease-mola hover:-translate-y-0.5 ${className}`}
    >
      <Link to={`/exemplos/loja/p/${item.slug}`} className="block rounded-[1.4rem]">
        <div className={`grid aspect-[4/3] place-items-center overflow-hidden rounded-[1.4rem] ${cor.fundo} ${cor.texto}`}>
          <Icone
            weight="duotone"
            aria-hidden="true"
            className="h-20 w-20 transition-transform duration-700 ease-mola group-hover:-rotate-6 group-hover:scale-110"
          />
        </div>
        <div className="px-3 pt-4">
          <h3 className="break-words text-lg font-extrabold tracking-[-0.02em] text-base-content">{item.nome}</h3>
          <p className="mt-1 text-sm text-base-content/75">{item.resumo}</p>
        </div>
      </Link>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 px-3 pb-2 pt-5">
        <SeloEscopo item={item} />
        <BotaoAdicionar slug={item.slug} />
      </div>
    </article>
  );
}
```

- [ ] **Step 6: `ChromeLoja.jsx`**

```jsx
import { Link, NavLink } from "react-router-dom";
import { FileText } from "@phosphor-icons/react";
import { BRAND } from "../../config.js";
import Wordmark from "../../components/Wordmark.jsx";
import { useOrcamento } from "./useOrcamento.js";

export function CabecalhoLoja() {
  const { total } = useOrcamento();

  return (
    <header className="sticky top-11 z-(--z-cabecalho) border-b border-base-300 bg-base-100/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link to="/exemplos/loja" className="flex items-center gap-2.5" aria-label="Vitrine">
          <Wordmark variante="simbolo" className="h-6 text-primary" />
          <span className="text-lg font-extrabold tracking-[-0.03em] text-base-content">catálogo ogis</span>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Loja">
          <NavLink
            to="/exemplos/loja"
            end
            className={({ isActive }) =>
              `hidden rounded-full px-4 py-2 text-sm font-bold transition-colors duration-300 ease-mola sm:inline-block ${
                isActive ? "bg-base-200 text-base-content" : "text-base-content/70 hover:text-base-content"
              }`
            }
          >
            Vitrine
          </NavLink>
          <NavLink
            to="/exemplos/loja/orcamento"
            className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2.5 text-sm font-bold text-secondary-content transition-transform duration-300 ease-mola active:scale-[0.97]"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Orçamento
            <span
              key={total}
              className="contador-pulo grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs text-primary-content"
              aria-label={`${total} ${total === 1 ? "item" : "itens"} na lista`}
            >
              {total}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export function RodapeLoja() {
  return (
    <footer className="bg-secondary text-secondary-content">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-lg font-extrabold tracking-[-0.03em]">catálogo ogis</span>
        <p className="max-w-md text-sm opacity-85">
          Nenhum preço é publicado: cada orçamento é feito sob medida, depois de entender o seu negócio.
        </p>
      </div>
      <p className="mx-auto max-w-6xl px-5 pb-8 text-xs opacity-75">
        Exemplar de e-commerce construído pela ogis.cloud · {BRAND.cidade}
      </p>
    </footer>
  );
}
```

- [ ] **Step 7: `LojaVitrine.jsx`**

```jsx
import { useSearchParams } from "react-router-dom";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { CATEGORIAS, filtrarCatalogo, itensPorCategoria } from "../../data/catalogo.js";
import SEO from "../../components/SEO.jsx";
import CartaoProduto from "./CartaoProduto.jsx";
import { corDaCategoria } from "./corCategoria.js";

const ORDENS = [
  { valor: "categoria", rotulo: "Por categoria" },
  { valor: "nome", rotulo: "Nome (A–Z)" },
];

// Bento das categorias: 1 grande, 2 menores e 1 largo.
const POSICAO = ["md:row-span-2 md:min-h-full", "", "", "md:col-span-2"];

export default function LojaVitrine() {
  const [params, setParams] = useSearchParams();

  const termo = params.get("q") ?? "";
  const categoria = params.get("categoria") ?? "";
  const ordem = params.get("ordem") ?? "categoria";

  // Mantém os filtros na URL: o link filtrado pode ser copiado e enviado.
  function definir(chave, valor) {
    const proximos = new URLSearchParams(params);
    if (valor) proximos.set(chave, valor);
    else proximos.delete(chave);
    setParams(proximos, { replace: true });
  }

  const itens = filtrarCatalogo({ termo, categoria, ordem });
  const temFiltro = Boolean(termo || categoria);
  const categoriaAtiva = CATEGORIAS.find((c) => c.slug === categoria);

  return (
    <>
      <SEO
        title="Catálogo de Soluções"
        description="Todos os produtos e soluções da ogis.cloud: presença digital, sistemas, infraestrutura e serviços contínuos. Monte sua lista e peça um orçamento."
        path="/exemplos/loja"
      />

      <section id="vitrine" className="mx-auto max-w-6xl px-5 py-14">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-base-content sm:text-5xl">
            Tudo o que a ogis.cloud faz
          </h1>
          <p className="mt-4 text-lg text-base-content/75">
            Monte a sua lista, conte o que precisa e devolvemos um orçamento sob medida. Você não paga
            nada para pedir.
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3 md:grid-rows-2">
          {CATEGORIAS.map((cat, i) => {
            const cor = corDaCategoria(cat.slug);
            const ativa = categoria === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                aria-pressed={ativa}
                onClick={() => definir("categoria", ativa ? "" : cat.slug)}
                className={`flex min-h-36 cursor-pointer flex-col justify-between rounded-[1.75rem] p-6 text-left transition-transform duration-500 ease-mola hover:-translate-y-1 active:scale-[0.98] ${cor.fundo} ${cor.texto} ${POSICAO[i]} ${
                  ativa ? "ring-4 ring-base-content ring-offset-4 ring-offset-base-100" : ""
                }`}
              >
                <span className={`font-extrabold tracking-[-0.03em] ${i === 0 ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
                  {cat.nome}
                </span>
                <span className="mt-6 flex items-end justify-between gap-4 text-sm">
                  <span className="max-w-[34ch] opacity-90">{cat.promessa}</span>
                  <span className="shrink-0 font-bold">{itensPorCategoria(cat.slug).length} itens</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <MagnifyingGlass
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/50"
              aria-hidden="true"
            />
            <input
              type="search"
              value={termo}
              onChange={(e) => definir("q", e.target.value)}
              placeholder="Buscar por nome ou pelo problema que você quer resolver"
              aria-label="Buscar no catálogo"
              className="w-full rounded-full bg-base-100 py-4 pl-13 pr-5 text-base text-base-content outline-none ring-1 ring-base-content/15 transition-shadow duration-300 ease-mola placeholder:text-base-content/50 focus:ring-2 focus:ring-base-content"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-bold text-base-content/80">
            Ordenar
            <select
              value={ordem}
              onChange={(e) => definir("ordem", e.target.value)}
              className="cursor-pointer rounded-full bg-base-100 px-4 py-3 text-sm text-base-content outline-none ring-1 ring-base-content/15 focus:ring-2 focus:ring-base-content"
            >
              {ORDENS.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <p className="text-base-content/70">
            {itens.length} {itens.length === 1 ? "solução encontrada" : "soluções encontradas"}
          </p>
          {categoriaAtiva && (
            <button
              type="button"
              onClick={() => definir("categoria", "")}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-base-200 px-3 py-1.5 font-bold text-base-content"
            >
              {categoriaAtiva.nome}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">remover filtro</span>
            </button>
          )}
        </div>

        {itens.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {itens.map((item) => (
              <CartaoProduto key={item.slug} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-start gap-4 rounded-[1.75rem] bg-base-200 p-10">
            <MagnifyingGlass weight="duotone" className="h-12 w-12 text-primary" aria-hidden="true" />
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-base-content">Nada encontrado com esses filtros</h2>
            <p className="max-w-[52ch] text-base-content/75">
              Tente outro termo — ou fale com a gente: o que você precisa pode não estar no catálogo.
            </p>
            {temFiltro && (
              <button
                type="button"
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-bold text-secondary-content transition-transform duration-300 ease-mola active:scale-[0.97]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </section>
    </>
  );
}
```

- [ ] **Step 8: Gates e navegador**

Run: `npm test && npm run lint && npm run build`
Expected: verde. (`LojaProduto` e `LojaOrcamento` ainda usam `CardCatalogo`/visual antigo até o Task 11.)
No navegador, em `/exemplos/loja` (1440px e 375px): bento colorido 1 grande + 2 + 1 largo; clicar em "Sistemas" filtra (URL com `?categoria=sistemas`) e recebe anel; clicar de novo limpa; buscar "xyz" mostra o estado vazio com "Limpar filtros"; adicionar um item faz o contador pular e o botão virar "Adicionado" → "Adicionar mais".

- [ ] **Step 9: Commit**

```bash
git add src/exemplos/loja
git commit -m "feat: loja exemplar na direcao bento colorido (cores por categoria, chrome e vitrine)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Loja J2 — produto, orçamento e validação

**Files:**
- Create: `src/exemplos/loja/validacaoOrcamento.js`, `src/exemplos/loja/validacaoOrcamento.test.js`
- Modify: `src/exemplos/loja/LojaProduto.jsx`, `src/exemplos/loja/LojaOrcamento.jsx`
- Delete: `src/components/CardCatalogo.jsx`

**Interfaces:**
- Consumes: `CartaoProduto`, `BotaoAdicionar`, `corDaCategoria` (Task 10), `abrirExterno` (Task 2), `montarMensagem`, `useOrcamento()`, `buscarItem`, `buscarCategoria`, `relacionados`, `textoEscopo`.
- Produces: `contatoValido(texto: string): boolean`, `validarOrcamento({ nome, contato }): { nome?: string, contato?: string }`.

- [ ] **Step 1: Escrever o teste que falha**

`src/exemplos/loja/validacaoOrcamento.test.js`:

```js
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/exemplos/loja/validacaoOrcamento.test.js`
Expected: FAIL — `Failed to resolve import "./validacaoOrcamento.js"`.

- [ ] **Step 3: Implementar**

`src/exemplos/loja/validacaoOrcamento.js`:

```js
// Regras puras do formulário de envio do orçamento.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SO_TELEFONE = /^[\d\s()+.-]+$/;

/** E-mail, ou telefone com DDD (10 a 13 dígitos, só com pontuação de telefone). */
export function contatoValido(texto) {
  const valor = texto.trim();
  if (EMAIL.test(valor)) return true;
  const digitos = valor.replace(/\D/g, "");
  return SO_TELEFONE.test(valor) && digitos.length >= 10 && digitos.length <= 13;
}

export function validarOrcamento({ nome = "", contato = "" } = {}) {
  const erros = {};
  if (!nome.trim()) erros.nome = "Diga como podemos te chamar.";
  if (contato.trim() && !contatoValido(contato)) {
    erros.contato = "Use um e-mail (nome@empresa.com.br) ou um telefone com DDD.";
  }
  return erros;
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/exemplos/loja/validacaoOrcamento.test.js`
Expected: PASS (12 testes).

- [ ] **Step 5: `LojaProduto.jsx`**

```jsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Minus, Plus } from "@phosphor-icons/react";
import { buscarItem, buscarCategoria, relacionados } from "../../data/catalogo.js";
import SeloEscopo from "../../components/SeloEscopo.jsx";
import SEO from "../../components/SEO.jsx";
import NaoEncontrado from "../NaoEncontrado.jsx";
import BotaoAdicionar from "./BotaoAdicionar.jsx";
import CartaoProduto from "./CartaoProduto.jsx";
import { corDaCategoria } from "./corCategoria.js";

const BOTAO_QTD =
  "grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-base-200 text-base-content transition-transform duration-300 ease-mola active:scale-[0.95]";

export default function LojaProduto() {
  const { slug } = useParams();
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");

  const item = buscarItem(slug);
  if (!item) {
    return <NaoEncontrado voltarPara="/exemplos/loja" rotulo="Voltar à vitrine" />;
  }

  const categoria = buscarCategoria(item.categoria);
  const cor = corDaCategoria(item.categoria);
  const outros = relacionados(item.slug);
  const Icone = item.icone;

  return (
    <>
      <SEO title={item.nome} description={item.resumo} path={`/exemplos/loja/p/${item.slug}`} />

      <article className="mx-auto max-w-6xl px-5 pb-36 pt-10 lg:pb-20">
        <Link to="/exemplos/loja" className="inline-flex items-center gap-2 text-sm font-bold text-base-content/70 hover:text-base-content">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar à vitrine
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className={`grid aspect-square place-items-center rounded-[2rem] lg:sticky lg:top-32 ${cor.fundo} ${cor.texto}`}>
            <Icone weight="duotone" className="h-40 w-40" aria-hidden="true" />
          </div>

          <div>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${cor.fundo} ${cor.texto}`}>
              {categoria.nome}
            </span>
            <h1 className="mt-4 break-words text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-base-content sm:text-5xl">
              {item.nome}
            </h1>
            <p className="mt-5 text-xl text-base-content/80">{item.resumo}</p>
            <SeloEscopo item={item} className="mt-4" />
            <p className="mt-8 leading-relaxed text-base-content/80">{item.descricao}</p>

            <h2 className="mt-10 text-lg font-extrabold text-base-content">O que está incluso</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {item.entregaveis.map((e) => (
                <li key={e} className="flex items-start gap-3 text-base-content/85">
                  <Check weight="bold" className="mt-1 h-4 w-4 shrink-0 text-base-content" aria-hidden="true" />
                  {e}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-[1.5rem] bg-base-200 p-6">
              <h2 className="font-extrabold text-base-content">Ideal para</h2>
              <p className="mt-1 text-base-content/80">{item.idealPara}</p>
            </div>

            <div className="mt-10 rounded-[1.75rem] bg-base-100 p-6 ring-1 ring-base-content/10">
              <p className="text-sm text-base-content/75">
                Não publicamos preço porque cada caso é diferente. Monte a sua lista e devolvemos um
                orçamento sob medida.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="text-sm font-bold text-base-content">Quantidade</span>
                <button type="button" onClick={() => setQuantidade((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade" className={BOTAO_QTD}>
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="w-8 text-center text-lg font-extrabold tabular-nums text-base-content">{quantidade}</span>
                <button type="button" onClick={() => setQuantidade((q) => q + 1)} aria-label="Aumentar quantidade" className={BOTAO_QTD}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <label className="mt-5 flex flex-col gap-2">
                <span className="text-sm font-bold text-base-content">
                  Alguma observação? <span className="font-normal text-base-content/60">(opcional)</span>
                </span>
                <textarea
                  rows={3}
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Ex.: preciso migrar de outro fornecedor"
                  className="w-full resize-y break-words rounded-2xl bg-base-200 px-4 py-3 text-base text-base-content outline-none ring-1 ring-transparent placeholder:text-base-content/50 focus:ring-2 focus:ring-base-content"
                />
              </label>
              {/* No mobile o botão fica preso ao rodapé da tela. */}
              <div className="fixed inset-x-0 bottom-0 z-(--z-cabecalho) border-t border-base-300 bg-base-100/95 p-4 backdrop-blur-md lg:static lg:mt-6 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
                <BotaoAdicionar slug={item.slug} quantidade={quantidade} observacao={observacao} largo />
              </div>
            </div>
          </div>
        </div>

        {outros.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-base-content">Também em {categoria.nome}</h2>
            <div className="-mx-5 mt-6 flex snap-x gap-4 overflow-x-auto px-5 pb-4">
              {outros.map((outro) => (
                <CartaoProduto key={outro.slug} item={outro} className="w-72 shrink-0 snap-start" />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
```

- [ ] **Step 6: `LojaOrcamento.jsx`**

```jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Envelope, FileText, Minus, Plus, Trash, WhatsappLogo } from "@phosphor-icons/react";
import { buscarItem, textoEscopo } from "../../data/catalogo.js";
import { ASSUNTO, linkEmail, linkWhatsApp } from "../../config.js";
import SEO from "../../components/SEO.jsx";
import { abrirExterno } from "../../lib/abrirExterno.js";
import { useOrcamento } from "./useOrcamento.js";
import { montarMensagem } from "./mensagemOrcamento.js";
import { corDaCategoria } from "./corCategoria.js";
import { validarOrcamento } from "./validacaoOrcamento.js";

// Mesmo campo em dois fundos: claro-escuro dentro dos tickets (base-100) e
// claro dentro do cartão do formulário (base-200).
const CAMPO_BASE =
  "w-full min-w-0 rounded-2xl px-4 py-3 text-base text-base-content outline-none ring-1 ring-transparent transition-shadow duration-300 ease-mola placeholder:text-base-content/50 focus:ring-2 focus:ring-base-content aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-error";
const CAMPO_TICKET = `${CAMPO_BASE} bg-base-200`;
const CAMPO_FORM = `${CAMPO_BASE} bg-base-100`;
const BOTAO_QTD =
  "grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-base-100/70 transition-transform duration-300 ease-mola active:scale-[0.95]";
const ORDEM_CAMPOS = ["nome", "contato"];

function ListaVazia() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-[1.75rem] bg-base-200 p-10">
      <FileText weight="duotone" className="h-12 w-12 text-primary" aria-hidden="true" />
      <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-base-content">Sua lista de orçamento está vazia</h2>
      <p className="max-w-md text-base-content/75">
        Navegue pelo catálogo e adicione o que faz sentido para o seu negócio. Você não paga nada para
        pedir um orçamento.
      </p>
      <Link
        to="/exemplos/loja"
        className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-bold text-secondary-content transition-transform duration-300 ease-mola active:scale-[0.97]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Ver o catálogo
      </Link>
    </div>
  );
}

export default function LojaOrcamento() {
  const { itens, total, remover, alterarQuantidade, alterarObservacao, limpar } = useOrcamento();
  const [form, setForm] = useState({ nome: "", empresa: "", contato: "", observacoes: "" });
  const [erros, setErros] = useState({});

  function alterar(campo) {
    return (evento) => {
      setForm((atual) => ({ ...atual, [campo]: evento.target.value }));
      if (erros[campo]) {
        setErros((atual) => {
          const proximo = { ...atual };
          delete proximo[campo];
          return proximo;
        });
      }
    };
  }

  // O estado guarda só o slug; o nome vem do catálogo na hora de montar a mensagem.
  const itensComNome = itens.map((i) => ({ ...i, nome: buscarItem(i.slug)?.nome ?? i.slug }));
  const mensagem = montarMensagem({ ...form, itens: itensComNome });

  function enviar(canal) {
    const encontrados = validarOrcamento(form);
    setErros(encontrados);
    const primeiro = ORDEM_CAMPOS.find((campo) => encontrados[campo]);
    if (primeiro) {
      document.getElementById(`orcamento-${primeiro}`)?.focus();
      return;
    }
    if (canal === "whatsapp") abrirExterno(linkWhatsApp(mensagem));
    else window.location.href = linkEmail(ASSUNTO.orcamento, mensagem);
  }

  function propsCampo(campo) {
    return {
      id: `orcamento-${campo}`,
      value: form[campo],
      onChange: alterar(campo),
      "aria-invalid": Boolean(erros[campo]),
      "aria-describedby": erros[campo] ? `orcamento-${campo}-erro` : undefined,
      className: CAMPO_FORM,
    };
  }

  return (
    <>
      <SEO
        title="Meu orçamento"
        description="Sua lista de soluções da ogis.cloud, pronta para virar um orçamento sob medida."
        path="/exemplos/loja/orcamento"
        noindex
      />

      <section id="orcamento" className="mx-auto max-w-6xl px-5 py-14">
        <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-base-content sm:text-5xl">Meu orçamento</h1>
        <p className="mt-4 max-w-2xl text-lg text-base-content/75">
          Confira os itens, conte o que precisa e envie. Respondemos com um orçamento sob medida — sem
          custo e sem compromisso.
        </p>

        {itens.length === 0 ? (
          <div className="mt-10">
            <ListaVazia />
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            <div className="min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-base-content">
                  {total} {total === 1 ? "item" : "itens"}
                </h2>
                <button
                  type="button"
                  onClick={limpar}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-base-content/70 hover:text-error"
                >
                  <Trash className="h-4 w-4" aria-hidden="true" />
                  Limpar tudo
                </button>
              </div>

              <ul className="mt-5 flex flex-col gap-4">
                {itens.map((linha) => {
                  const item = buscarItem(linha.slug);
                  if (!item) return null;
                  const cor = corDaCategoria(item.categoria);
                  const Icone = item.icone;

                  return (
                    <li key={linha.slug} className="flex overflow-hidden rounded-[1.75rem] bg-base-100 ring-1 ring-base-content/10">
                      <div className={`grid w-20 shrink-0 place-items-center sm:w-28 ${cor.fundo} ${cor.texto}`}>
                        <Icone weight="duotone" className="h-9 w-9 sm:h-11 sm:w-11" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="break-words font-extrabold tracking-[-0.02em] text-base-content">
                              <Link to={`/exemplos/loja/p/${item.slug}`} className="hover:underline">
                                {item.nome}
                              </Link>
                            </h3>
                            <p className="mt-0.5 text-xs text-base-content/70">{textoEscopo(item)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => remover(linha.slug)}
                            aria-label={`Remover ${item.nome}`}
                            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-base-content/60 hover:bg-base-200 hover:text-error"
                          >
                            <Trash className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        <div className={`mt-4 inline-flex items-center gap-2 rounded-full p-1 ${cor.fundo} ${cor.texto}`}>
                          <button
                            type="button"
                            onClick={() => alterarQuantidade(linha.slug, linha.quantidade - 1)}
                            aria-label={`Diminuir quantidade de ${item.nome}`}
                            className={BOTAO_QTD}
                          >
                            <Minus className="h-3.5 w-3.5 text-base-content" aria-hidden="true" />
                          </button>
                          <span className="w-7 text-center font-extrabold tabular-nums">{linha.quantidade}</span>
                          <button
                            type="button"
                            onClick={() => alterarQuantidade(linha.slug, linha.quantidade + 1)}
                            aria-label={`Aumentar quantidade de ${item.nome}`}
                            className={BOTAO_QTD}
                          >
                            <Plus className="h-3.5 w-3.5 text-base-content" aria-hidden="true" />
                          </button>
                        </div>

                        <label className="mt-4 block">
                          <span className="sr-only">Observação sobre {item.nome}</span>
                          <input
                            type="text"
                            value={linha.observacao}
                            onChange={(e) => alterarObservacao(linha.slug, e.target.value)}
                            placeholder="Observação sobre este item (opcional)"
                            className={CAMPO_TICKET}
                          />
                        </label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Cartão creme mais escuro: campos claros e erro em vermelho legível (AA). */}
            <aside className="min-w-0 rounded-[1.75rem] bg-base-200 p-7 text-base-content lg:sticky lg:top-32">
              <h2 className="text-xl font-extrabold tracking-[-0.02em]">Para onde respondemos?</h2>
              <p className="mt-1.5 text-sm text-base-content/75">
                Nenhum dado é enviado para servidor: os campos montam a mensagem que você envia.
              </p>

              <form noValidate onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="orcamento-nome" className="text-sm font-bold">Seu nome</label>
                  <input type="text" autoComplete="name" placeholder="Como podemos te chamar" {...propsCampo("nome")} />
                  {erros.nome && <p id="orcamento-nome-erro" className="text-sm font-bold text-error">{erros.nome}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="orcamento-empresa" className="text-sm font-bold">
                    Empresa <span className="font-normal text-base-content/70">(opcional)</span>
                  </label>
                  <input type="text" autoComplete="organization" placeholder="Nome do seu negócio" {...propsCampo("empresa")} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="orcamento-contato" className="text-sm font-bold">
                    E-mail ou telefone <span className="font-normal text-base-content/70">(opcional)</span>
                  </label>
                  <input type="text" autoComplete="email" placeholder="Como prefere ser respondido" {...propsCampo("contato")} />
                  {erros.contato && <p id="orcamento-contato-erro" className="text-sm font-bold text-error">{erros.contato}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="orcamento-observacoes" className="text-sm font-bold">Observações gerais</label>
                  <textarea rows={3} placeholder="Prazo, contexto, o que já existe hoje…" {...propsCampo("observacoes")} />
                </div>
              </form>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => enviar("whatsapp")}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-secondary px-5 py-3.5 text-sm font-bold text-secondary-content transition-transform duration-300 ease-mola active:scale-[0.97]"
                >
                  <WhatsappLogo className="h-4.5 w-4.5" aria-hidden="true" />
                  Enviar por WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => enviar("email")}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-base-100 px-5 py-3.5 text-sm font-bold text-base-content ring-1 ring-base-content/20 transition-transform duration-300 ease-mola active:scale-[0.97]"
                >
                  <Envelope className="h-4.5 w-4.5" aria-hidden="true" />
                  Enviar por e-mail
                </button>
              </div>
              <p className="mt-5 text-center text-xs text-base-content/70">
                Sem preço na lista: o orçamento é montado depois de entender o seu caso.
              </p>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
```

Nota: o formulário fica num cartão `bg-base-200` (creme mais escuro), e não em café, para que os campos claros e as mensagens de erro (`text-error`, `#b42318`) mantenham contraste AA. O café aparece no botão principal ("Enviar por WhatsApp").

- [ ] **Step 7: Apagar o `CardCatalogo` e rodar os gates**

```bash
git rm src/components/CardCatalogo.jsx
```

Run: `grep -rn "CardCatalogo" src`
Expected: nenhuma saída.
Run: `npm test && npm run lint && npm run build`
Expected: verde.

- [ ] **Step 8: Conferir no navegador (Review Focus 4 e o localStorage)**

Em `/exemplos/loja/p/site-institucional` (375px): o botão "Adicionar" fica preso no rodapé da tela e o conteúdo não fica escondido atrás dele. Os relacionados rolam na horizontal.
Adicionar 3 itens, ir para `/exemplos/loja/orcamento`, alterar quantidade e observação e recarregar: tudo persiste. Escrever 300 caracteres sem espaço no nome, na observação de um item e no contato: nenhuma faixa horizontal de rolagem na página (`document.documentElement.scrollWidth <= window.innerWidth`), e o erro do contato aparece ao clicar em "Enviar por WhatsApp", com o foco no campo. Com o contato vazio e o nome preenchido, o WhatsApp abre com a mensagem montada.
No console: `localStorage.setItem("ogis:orcamento", JSON.stringify({itens:[{slug:"nao-existe",quantidade:2,observacao:""}]}))`, recarregar: a página mostra a lista vazia, sem erro.

- [ ] **Step 9: Commit**

```bash
git add src/exemplos/loja src/components
git commit -m "feat: produto e orcamento da loja exemplar com tickets coloridos e validacao

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Gates de bundle, remoção do Lucide, assinatura e README

**Files:**
- Create: `scripts/verificar-bundle.mjs`
- Modify: `vite.config.js`, `package.json`, `email-signature/gerar-assinatura.py`, `README.md`
- Regenerate: `email-signature/logo-mark.png`, `email-signature/assinatura-ogis-cloud.html`

**Interfaces:**
- Consumes: build do Vite com manifest.
- Produces: `npm run verificar:bundle` (sai com código 1 se a home carregar GSAP ou fontes dos exemplares).

- [ ] **Step 1: Manifest e script**

`vite.config.js`:

```js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), cloudflare()],
  // O manifest permite verificar o que entra no bundle da home (scripts/verificar-bundle.mjs).
  build: { manifest: true },
});
```

`scripts/verificar-bundle.mjs`:

```js
// Gate: o que a home baixa (entrada + imports estáticos) não pode conter GSAP
// nem @font-face das fontes dos exemplares. Rode depois de `npm run build`.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const CANDIDATOS = ["dist/client", "dist"];
const raiz = CANDIDATOS.find((pasta) => existsSync(join(pasta, ".vite/manifest.json")));
if (!raiz) {
  console.error("manifest.json não encontrado — rode `npm run build` antes.");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(join(raiz, ".vite/manifest.json"), "utf8"));

function fechamentoEstatico(chave, visitados = new Set()) {
  if (visitados.has(chave)) return visitados;
  visitados.add(chave);
  for (const importado of manifest[chave]?.imports ?? []) fechamentoEstatico(importado, visitados);
  return visitados;
}

function arquivos(chaves) {
  const js = [];
  const css = [];
  for (const chave of chaves) {
    const entrada = manifest[chave];
    js.push(entrada.file);
    css.push(...(entrada.css ?? []));
  }
  return { js, css };
}

const ler = (arquivo) => readFileSync(join(raiz, arquivo), "utf8");
const GSAP = /ScrollTrigger|GreenSock/;
const FONTE_EXEMPLAR = /@font-face\s*\{[^}]*(Archivo|Manrope)/i;

const chaveEntrada = Object.keys(manifest).find((chave) => manifest[chave].isEntry);
const home = arquivos(fechamentoEstatico(chaveEntrada));
const falhas = [];

for (const arquivo of home.js) if (GSAP.test(ler(arquivo))) falhas.push(`GSAP no bundle da home: ${arquivo}`);
for (const arquivo of home.css) if (FONTE_EXEMPLAR.test(ler(arquivo))) falhas.push(`Fonte de exemplar no CSS da home: ${arquivo}`);

// Sanidade: o chunk da landing precisa conter o GSAP, senão o teste acima não prova nada.
const chaveLanding = Object.keys(manifest).find((chave) => chave.endsWith("exemplos/landing/LandingExemplar.jsx"));
const landing = arquivos(fechamentoEstatico(chaveLanding));
if (!landing.js.some((arquivo) => GSAP.test(ler(arquivo)))) falhas.push("GSAP não encontrado no chunk da landing (verificação inválida)");

if (falhas.length) {
  console.error(falhas.join("\n"));
  process.exit(1);
}
console.log(`ok — home: ${home.js.length} JS, ${home.css.length} CSS, sem GSAP e sem fontes dos exemplares.`);
```

Em `package.json`, dentro de `"scripts"`, adicionar `"verificar:bundle": "node scripts/verificar-bundle.mjs"`.

- [ ] **Step 2: Rodar o gate**

Run: `npm run build && npm run verificar:bundle`
Expected: `ok — home: …`. Se falhar com "GSAP no bundle da home", procurar o import estático de `gsap` que vazou para fora de `src/exemplos/landing/` e removê-lo.

- [ ] **Step 3: Remover o Lucide**

Run: `grep -rn "lucide-react" src`
Expected: nenhuma saída. (Se aparecer, trocar pelo equivalente Phosphor da tabela do Task 2, Step 7: `Mail`→`Envelope`, `MessageCircle`→`WhatsappLogo`, `Search`→`MagnifyingGlass`, `Trash2`→`Trash`, `Menu`→`List`.)

```bash
npm uninstall lucide-react
```

Run: `npm test && npm run lint && npm run build && npm run verificar:bundle`
Expected: tudo verde.

- [ ] **Step 4: Assinatura de e-mail na paleta B**

Em `email-signature/gerar-assinatura.py`:
- Trocar o bloco de cores por:

```python
# --- Cores da identidade "Infraestrutura noturna" da ogis.cloud ---
TILE = (13, 15, 14, 255)      # #0d0f0e  (tile do badge)
SINAL = (184, 242, 91, 255)   # #b8f25b  (anel e ponto)
```

- Em `gerar_logo`: `outline=GOLD` → `outline=SINAL` e `fill=GOLD_LIGHT` → `fill=SINAL`.
- No `HTML`, substituir: o comentário `Identidade: fundo asfalto (#0c0a09) + ouro (#ca8a04/#eab308)` → `Identidade: grafite (#0d0f0e) + verde-sinal (#b8f25b)`; `#0c0a09` → `#0d0f0e`; `#292524` → `#222725`; todas as ocorrências de `#eab308` → `#b8f25b`; `#fafaf9` → `#e8ece9`; `#e7e5e4` → `#e8ece9`; `#d6d3d1` → `#c9d0cc`; `font-family: 'Poppins', Arial, Helvetica, sans-serif;` → `font-family: 'Geist Mono', 'Courier New', monospace;`.

Run (na pasta `email-signature`): `python gerar-assinatura.py`
Expected: `Logo gerado: …logo-mark.png` e `Assinatura: …assinatura-ogis-cloud.html`. Se faltar o Pillow: `pip install Pillow` e rodar de novo.
Run: `grep -c "eab308\|ca8a04\|0c0a09" email-signature/assinatura-ogis-cloud.html`
Expected: `0`.

- [ ] **Step 5: README**

Em `README.md`:
- Na seção **Stack**, trocar a linha de ícones/SEO para: `` `react-router-dom` (rotas `/`, `/termos`, `/privacidade`, `/exemplos/*`) · `react-helmet-async` (SEO) · `@phosphor-icons/react` (ícones) · `gsap` (só na landing exemplar) · fontes self-hosted via `@fontsource-variable` ``.
- Substituir a seção **Identidade visual** inteira por:

```markdown
## Identidade visual

Marca da holding: **"Infraestrutura noturna"** — grafite `#0D0F0E` + verde-sinal `#B8F25B`,
fontes **Geist / Geist Mono**. Cada exemplar tem uma direção de arte própria, como se fosse feito
por uma agência diferente:

| Superfície | Tema daisyUI | Direção |
|---|---|---|
| Home, termos, privacidade, `/exemplos`, faixa de exemplar | `ogis-infra` | grafite + verde-sinal, Geist |
| `/exemplos/landing` | `exemplar-campanha` | cobalto + osso, Archivo 900, movimento com GSAP |
| `/exemplos/site` | `exemplar-sereno` | marfim + sálvia, Manrope, sem sombras |
| `/exemplos/loja` | `exemplar-bento` | creme + uma cor por categoria, Manrope 800 |

Os temas ficam em `src/styles/temas/*.css`; qual superfície usa qual tema está em
`src/styles/temas.js`. O componente `<Tema superficie="…">` aplica o tema na página e no `<html>`.
```

- Na seção **Comandos**, acrescentar `npm run verificar:bundle  # depois do build: a home não pode carregar GSAP nem fontes dos exemplares`.
- Na árvore de **Estrutura**, acrescentar `styles/temas/` (temas daisyUI), `lib/` (helpers puros), `hooks/` e `components/home/` (seções da home).

- [ ] **Step 6: Commit**

```bash
git add vite.config.js package.json package-lock.json scripts email-signature README.md
git commit -m "chore: gate de bundle da home, remove lucide, assinatura e README na nova marca

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Verificação no navegador (responsividade, UX e acessibilidade)

**Files:**
- Modify: apenas o necessário para corrigir o que a verificação encontrar (cada correção com seu próprio commit `fix: …`).

**Interfaces:**
- Consumes: tudo o que foi entregue nos Tasks 1–12.
- Produces: relatório de verificação no PR.

- [ ] **Step 1: Responsividade**

Invocar a skill `responsiveness-check` com o dev server (`ogis-dev`) nas URLs `/`, `/termos`, `/exemplos`, `/exemplos/landing`, `/exemplos/site`, `/exemplos/site/solucoes/site-institucional`, `/exemplos/site/contato`, `/exemplos/loja`, `/exemplos/loja/p/e-commerce`, `/exemplos/loja/orcamento`, nas larguras 375, 768, 1024 e 1440.
Expected: nenhum scroll horizontal, nenhum conteúdo escondido sob a faixa de exemplar (44px), nenhum cabeçalho sobreposto.

- [ ] **Step 2: Auditoria de UX**

Invocar a skill `ux-audit` percorrendo: navegação do site exemplar inteiro; filtro e busca da vitrine; adicionar 3 itens; editar quantidade e observação; recarregar; enviar o orçamento com e sem erros; contato do site com e sem erros; menu mobile da home; painel mobile do site.
Expected: 0 erros e 0 warnings no console; 0 respostas 5xx; 0 violações axe Critical/Serious em cada superfície; contraste AA em todos os temas (atenção ao verde-sinal sobre grafite, ao texto osso sobre cobalto e ao texto creme sobre café).

- [ ] **Step 3: Movimento reduzido e teclado**

Revisar com teclado, em cada superfície: o link "Pular para o conteúdo" aparece no primeiro Tab e leva ao `<main>`; o foco é visível nos quatro temas; os menus fecham com Esc e devolvem o foco.
Movimento reduzido: confirmar pelo código (`.revelar` no `index.css`, `MOVIMENTO_*` em `useGsap.js`, `landing.css`, `site.css`, `loja.css`) que nenhum movimento roda com `prefers-reduced-motion: reduce`.

- [ ] **Step 4: Gates finais**

Run: `npm test && npm run lint && npm run build && npm run verificar:bundle`
Expected: tudo verde.
Run: `grep -rniE "R\\$ ?[0-9]" src`
Expected: nenhuma saída (nenhum preço).

- [ ] **Step 5: Commit das correções e PR**

Cada correção encontrada nos Steps 1–3 vira um commit `fix: …` próprio. Depois, abrir o PR de `redesign/ogis-infra` para `master` com: resumo das quatro direções, o relatório dos Steps 1–4 (larguras testadas, resultado do axe, console) e a lista dos ajustes técnicos em relação à spec (seção "Global Constraints" deste plano). Sem deploy.
