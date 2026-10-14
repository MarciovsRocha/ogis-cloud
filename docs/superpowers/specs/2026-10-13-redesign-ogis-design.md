# Redesign ogis.cloud — nova marca da holding e identidades distintas nos exemplares

**Data:** 2026-10-13
**Status:** aprovado (design) — aguardando revisão da spec escrita
**Repositório:** `ogis-cloud` (branch `redesign/ogis-infra`)
**Antecede:** `2026-07-22-exemplares-ogis-design.md` (exemplares funcionais — continua válido no
que diz respeito a rotas, catálogo, orçamento e ausência de preços)

## 1. Problema

O site e os três exemplares parecem um único template:

- A home e os exemplares usam o mesmo tema `ogis-dark`, o mesmo `Wordmark`, o mesmo glow dourado
  radial, a mesma pílula de eyebrow, o mesmo hero centralizado e o mesmo header com blur. O
  exemplar deveria provar versatilidade e prova o contrário.
- A execução carrega as marcas típicas de "design gerado por IA": Open Sans/Poppins, ícones
  Lucide, texto em gradiente, grids de cards iguais, bordas cinza de 1px, `animate-rise` em tudo.

## 2. Objetivo

1. **Nova marca da holding** na home (`/`), termos, privacidade e índice `/exemplos`: direção
   **"Infraestrutura noturna"** (grafite + verde-sinal, Geist + Geist Mono).
2. **Cada exemplar com direção de arte própria**, como se feito por agências diferentes, mantendo
   o **conteúdo da OGIS** (catálogo atual):
   - Landing → **L2 "Campanha cinética"** (cobalto/osso, Archivo 900, GSAP).
   - Site institucional → **S1 "Corporativo sereno"** (marfim, Manrope, bento plano).
   - Loja → **J2 "Bento colorido"** (creme, uma cor por categoria, Manrope 800).
3. Aplicar as skills de design instaladas como referência de execução: `high-end-visual-design`,
   `redesign-existing-projects`, `design-taste-frontend`, `minimalist-ui`, `gpt-taste`; e
   `responsiveness-check` + `ux-audit` na verificação.

### Fora de escopo (YAGNI)

- Conteúdo novo / clientes fictícios: o texto continua vindo de `catalogo.js`, `planos.js`,
  `conteudo.js` e dos componentes atuais. Ajustes de copy só onde o layout novo exige (ex.: juntar
  duas seções).
- Backend, CMS, pagamento, preços (continua proibido exibir valor).
- Modo claro/escuro alternável. Cada superfície tem um tema fixo.
- Imagem OG (`og-image.png` é referenciada no `index.html` mas não existe em `public/` — registrado,
  não tratado aqui).
- Deploy. A entrega termina no PR.

## 3. Decisões tomadas

| Decisão | Escolha | Motivo |
|---|---|---|
| Objetivo | Redesign premium + identidades distintas por exemplar | Pedido do responsável |
| Conteúdo dos exemplares | Continua sendo da OGIS | Sem custo de conteúdo novo; mostra versatilidade de design |
| Marca da holding | Nova direção (B), substitui "Premium Dark + Gold" | Escolhida no companion visual |
| Arquitetura de tema | Um tema daisyUI por superfície, aplicado na raiz do layout via `data-theme` | Encaixa no stack; isola cada exemplar; componentes seguem usando tokens |
| Builds | Um build só, exemplares em `lazy()` | Mantém um deploy; GSAP e fontes dos exemplares fora do bundle da home |
| Fontes | `@fontsource-variable/*` self-hosted, importadas por superfície | Privacidade (sem Google Fonts), performance, isolamento |
| Ícones | `@phosphor-icons/react` substitui `lucide-react` | Lucide é marcador de "visual de IA" nas skills; Phosphor tem pesos light/duotone |
| Movimento | `IntersectionObserver` global; GSAP + ScrollTrigger só na landing | Leve no resto, cinético onde a direção pede |
| Assinatura de e-mail | Regenerada na paleta B | Consistência da marca |

## 4. Arquitetura

### 4.1 Temas

Quatro temas daisyUI v5, um arquivo cada em `src/styles/temas/`, importados por `src/index.css`.
Cada tema define as cores daisyUI **e** dois tokens de fonte: `--font-display` e `--font-body`.
`@theme` do Tailwind mapeia `font-display` → `var(--font-display)` e `font-sans` → `var(--font-body)`,
então trocar `data-theme` troca também a tipografia.

| Tema | Superfície | base-100 / base-200 | base-content | primary | Fontes (display / body) |
|---|---|---|---|---|---|
| `ogis-infra` | `/`, `/termos`, `/privacidade`, `/exemplos`, `FaixaExemplar` | `#141716` / `#0D0F0E` | `#E8ECE9` | `#B8F25B` (content `#0D0F0E`) | Geist / Geist; mono: Geist Mono |
| `exemplar-campanha` | `/exemplos/landing` | `#F2F1EC` / `#2734E8` | `#0E1240` | `#2734E8` (content `#F2F1EC`) | Archivo / Archivo |
| `exemplar-sereno` | `/exemplos/site/*` | `#FBFAF8` / `#F1EEE8` | `#2B2926` | `#4E6B57` (content `#FBFAF8`); accent `#E7EDE6` | Manrope / Manrope |
| `exemplar-bento` | `/exemplos/loja/*` | `#FFF7EC` / `#FFEFD9` | `#2A1A0E` | `#FF7A3D` (content `#2A1A0E`) | Manrope / Manrope |

Notas:
- Valores exatos de `neutral`, `secondary`, estados (`info/success/warning/error`), raios e
  `--depth` são definidos na implementação, desde que **todo par texto/fundo usado passe AA**
  (4.5:1 texto normal, 3:1 texto ≥ 24px). O verde-sinal só é usado como fundo de botão (texto
  escuro por cima) ou em elementos não-textuais/indicadores sobre grafite.
- `ogis-infra` também expõe `--font-mono` para rótulos técnicos (`font-mono` no Tailwind).
- O tema `exemplar-campanha` usa base-200 cobalto e base-100 osso porque a landing alterna blocos
  inteiros entre as duas cores.

### 4.2 Aplicação do tema

- `index.html`: remove `data-theme="ogis-dark"` fixo e o `<link>` do Google Fonts; `theme-color`
  passa a `#0D0F0E`.
- `SiteLayout`: `<div data-theme="ogis-infra">`.
- `ExemplarLayout`: não define tema. Cada `*Exemplar.jsx` envolve o próprio conteúdo em
  `<div data-theme="exemplar-…">`. `IndiceExemplos` usa `ogis-infra`.
- `FaixaExemplar`: sempre `data-theme="ogis-infra"` — identidade da OGIS "por cima" do exemplar.
- Um mapa único `TEMA_POR_SUPERFICIE` em `src/styles/temas.js` (`home`, `landing`, `site`, `loja`,
  `indice`, `faixa`) é a fonte desses nomes; layouts e testes leem dele.

### 4.3 Carregamento

- `App.jsx`: `IndiceExemplos`, `LandingExemplar`, `SiteExemplar`, `LojaExemplar` e `NaoEncontrado`
  via `React.lazy`, com um `Suspense` de fallback mínimo (tela vazia na cor base-200 da faixa).
- Fontes: `main.jsx` importa Geist + Geist Mono. Cada `*Exemplar.jsx` importa as suas
  (`@fontsource-variable/archivo`, `@fontsource-variable/manrope`).
- `gsap` só é importado dentro de `src/exemplos/landing/`.

### 4.4 Estrutura de arquivos (o que muda)

```
src/
  styles/
    temas/ogis-infra.css · exemplar-campanha.css · exemplar-sereno.css · exemplar-bento.css
    temas.js                    # TEMA_POR_SUPERFICIE
  hooks/
    useRevelar.js               # IntersectionObserver → adiciona .revelado; respeita reduced-motion
  components/
    Wordmark.jsx                # variantes: "infra" (padrão) | "mono" | "simbolo"
    BotaoContato.jsx            # WhatsApp/e-mail com mensagem pronta; botão "ilha" com ícone em círculo
    home/                       # Navbar, Hero, PainelStatus, Solucoes, ComoFunciona, VejaFuncionando,
                                # MiniaturaExemplar, Planos, ParaQuemConfianca, Contato, Footer
    (Legal*, SEO, SeloEscopo, SectionHeading permanecem; SectionHeading redesenhado)
  exemplos/
    landing/secoes/             # um arquivo por seção (secoes.jsx de 315 linhas é dividido)
    landing/useGsap.js          # gsap.context + cleanup; matchMedia para mobile/reduced-motion
    site/validacaoContato.js    # regras puras do formulário
    loja/corCategoria.js        # COR_CATEGORIA: slug → classes/cores
    loja/validacaoOrcamento.js  # regras puras do formulário
```

Componentes removidos/fundidos na home: `CTAFinal` + `Contato` → `home/Contato`; `ParaQuem` +
`Confianca` → `home/ParaQuemConfianca`. `CardCatalogo` é substituído pelas peças específicas de
cada superfície (cada exemplar tem seus próprios cards, por definição).

### 4.5 CSS global (`src/index.css`)

- Saem: `.glow-gold`, `.text-gradient-gold`, `@keyframes riseIn`, `.animate-rise`.
- Entram:
  - `.revelar` / `.revelar.revelado`: `opacity` + `translateY(24px)` + `blur(6px)` → estado final,
    700ms, `cubic-bezier(.32,.72,0,1)`. Com `prefers-reduced-motion: reduce`, `.revelar` já nasce no
    estado final.
  - Variável `--ease-mola: cubic-bezier(.32,.72,0,1)` exposta ao Tailwind (`ease-mola`).
  - Escala de z-index: `--z-conteudo: 1`, `--z-cabecalho: 40`, `--z-faixa: 50`, `--z-menu: 60`.
  - `.pular-conteudo`: link "Pular para o conteúdo", visível só no foco, em todos os layouts.
  - `text-wrap: balance` em `h1–h3`; `text-wrap: pretty` em `p`.
  - Foco visível padrão: `outline: 2px solid var(--color-primary); outline-offset: 3px`.

### 4.6 Ícones

`lucide-react` sai de todos os arquivos (29 hoje, incluindo `catalogo.js` e `exemplares.js`) e do
`package.json`. Equivalentes Phosphor, peso `light` por padrão; `duotone` nas capas da loja.
`catalogo.js` continua exportando o componente de ícone em `icone` — só muda a origem.

## 5. Superfícies

### 5.1 Home — `ogis-infra`

Linguagem: grafite com um orbe verde-escuro sutil só no topo; rótulos em Geist Mono minúsculo com
tracking; verde-sinal só em CTA, indicadores de status e destaques pontuais; cartões em "dupla
borda" (casca `bg-white/[0.03] ring-1 ring-white/10 p-1.5 rounded-[2rem]` + núcleo com brilho
interno e raio concêntrico); seções `py-28`–`py-40`; entrada `.revelar`.

Ordem e conteúdo:

1. **Navbar ilha** — pílula de vidro flutuante (`mt-4`, largura do conteúdo, `backdrop-blur` só
   aqui). Links da `NAV`; CTA "Fale com a gente". Mobile: hambúrguer que vira X; overlay de tela
   cheia com links entrando em cascata; fecha com Esc e ao clicar num link; trava o scroll do body.
2. **Hero assimétrico** — esquerda: eyebrow mono com ponto verde pulsante ("operação digital
   gerenciada"), H1 (copy atual, segunda oração em `text-base-content/45`), parágrafo, CTA
   primário WhatsApp (botão ilha com seta em círculo) + link "Ver exemplos" (`#exemplos`), linha
   mono com os 3 itens de confiança. Direita (abaixo no mobile): **PainelStatus** — 4 linhas
   (domínio · no seu nome, site · no ar, e-mail · ativo, backup · diário), indicador verde e
   carimbo mono. Puramente ilustrativo, `aria-label` descreve o conteúdo.
3. **Soluções** — bento assimétrico com os 4 destaques de `SOLUCOES`: um card `md:col-span-7
   md:row-span-2` + três menores. Mobile: coluna única.
4. **Como funciona** — 4 pilares em lista numerada `01–04` (mono), duas colunas em zigue-zague com
   régua vertical; sem ícones em caixinha.
5. **Veja funcionando** (`#exemplos`) — os 3 itens de `EXEMPLARES` em faixa; cada um com uma
   **MiniaturaExemplar** desenhada em CSS no visual do exemplar (cobalto/Archivo, marfim/Manrope,
   bento colorido) + nome, resumo e link.
6. **Planos** (`#planos`) — 3 colunas, cabeçalhos e listas alinhados na mesma linha de base,
   CTA fixado no fim do card; "Profissional" destacado por cor (`bg-base-100`, ring primary) e
   selo em texto mono, não por altura. `GARANTIAS` em linha mono abaixo.
7. **Para quem + Confiança** — esquerda: texto e segmentos de `ParaQuem`; direita: os 3 sinais de
   `Confianca` como checklist técnico (`✓ domínio no seu nome` + explicação).
8. **Contato** (`#contato`, absorve `CTAFinal`) — H2 grande, ganhos do CTA final, dois
   `BotaoContato` (WhatsApp, e-mail), e-mail e cidade em texto.
9. **Footer** — wordmark, cidade/CNPJ, links: Exemplos, Termos, Privacidade. Uma linha legal.

**Wordmark** (variante `infra`): símbolo anel + ponto em `primary`; texto `ogis.cloud` em Geist
Mono, ponto em `primary`. `public/favicon.svg` atualizado para grafite + verde-sinal.

**Termos / Privacidade**: `LegalLayout` com coluna de leitura `max-w-[68ch]` e índice lateral
sticky (≥ `lg`) gerado a partir dos `h2` da página.

**Índice `/exemplos`**: mesma linguagem da seção 5 da home, em página própria.

### 5.2 Landing L2 — `exemplar-campanha`

Linguagem: blocos de seção inteiros alternando cobalto `#2734E8` e osso `#F2F1EC`; títulos Archivo
900 caixa-alta, `leading-[0.86]`, `tracking-[-0.05em]`; palavras em contorno
(`-webkit-text-stroke`) como ênfase; sem cartões com borda, sem sombras, sem ícones decorativos.
**Ação única:** todo CTA → `linkWhatsApp(MSG.diagnostico)`. Botão: pílula com seta em círculo que
se desloca na diagonal no hover.

Seções (copy de `conteudo.js`):

1. **Cabeçalho** — barra cobalto, `Wordmark` variante `mono` em osso, pílula "Diagnóstico grátis";
   reduz altura após rolar 80px.
2. **Hero** — `min-h-[100dvh]`; H1 em 4 linhas com reveal por palavra (máscara + translateY) no
   carregamento; parágrafo; CTA; **letreiro infinito** na base com os nomes das categorias/itens do
   catálogo, em CSS puro (`@keyframes` + conteúdo duplicado, `aria-hidden` na cópia).
3. **Problema** — `DORES` como cartões empilhados com pin (≥ 768px): a seção fixa e cada dor entra
   sobre a anterior, alternando osso/cobalto, contador "01/04" em mono.
4. **Pilares + Responsável único** (fundidos) — frase gigante "UM CONTRATO. UMA PESSOA. TUDO NO
   AR." com scrub contorno → preenchido por palavra; abaixo, `CATEGORIAS` em linhas grandes
   (nome 900 | promessa) separadas por régua.
5. **Passos** — `PASSOS` em trilha horizontal com pin e scrub (≥ 768px); mobile: pilha vertical.
6. **Provas** — `PROVAS` como números gigantes; contagem 0 → valor ao entrar na viewport (valores
   não numéricos como `24/7` aparecem sem contagem).
7. **FAQ** — `FAQ` em lista de duas colunas, pergunta 900 | resposta sempre visível (sem acordeão).
8. **CTA final** — bloco osso `min-h-[80dvh]`, "AGENDE O DIAGNÓSTICO." em escala máxima, botão
   cobalto.
9. **Rodapé** — uma linha: "feito pela ogis.cloud" + link para `/`.

Movimento:
- Dependências: `gsap` (inclui ScrollTrigger). Importadas só em `landing/`.
- `useGsap(refEscopo, fn)` usa `gsap.context()` e `ctx.revert()` no cleanup (seguro no
  StrictMode). `ScrollTrigger.matchMedia`: pins e scrubs só em `(min-width: 768px) and
  (prefers-reduced-motion: no-preference)`.
- Só `transform` e `opacity` são animados.
- Com reduced-motion ou sem JS de animação, todo o conteúdo fica legível no estado final.

### 5.3 Site S1 — `exemplar-sereno`

Linguagem: marfim, tinta `#2B2926`, superfícies areia `#F1EEE8`, acento sálvia `#E7EDE6` com
`#4E6B57` para links/foco; Manrope 400/500/700; títulos sentence case, `tracking-[-0.035em]`;
**sem sombra e sem borda em cartões** — hierarquia por tom de fundo e espaço; movimento mínimo
(fade 400ms; sublinhado que cresce no hover de links).

Rotas e conteúdo inalterados:

- **Cabeçalho** — barra de largura total com régua fina inferior; `Wordmark` variante `mono` em
  tinta; link ativo em 700 com traço sálvia; CTA "Fale com a gente" como link de texto com seta.
  Mobile: painel lateral (slide-over) com foco preso, fecha com Esc.
- **Início** — H1 à esquerda + bento plano das 4 `CATEGORIAS` (tamanhos diferentes) à direita;
  "Como trabalhamos" em 3 colunas de texto; destaques do catálogo como lista editorial (nome,
  resumo, seta no hover); CTA de texto.
- **Sobre** — coluna de leitura estreita, citação grande, valores como lista numerada.
- **Soluções** — índice por categoria: promessa em destaque + itens em lista de duas colunas.
- **Solução `/:slug`** — título, `SeloEscopo` em texto discreto, entregáveis em lista numerada,
  bloco sálvia "Ideal para", relacionados.
- **Contato** — rótulos acima dos campos, validação inline por `validacaoContato.js` (nome e
  mensagem obrigatórios; erro abaixo do campo com `aria-describedby`; sem `alert`); envio monta
  WhatsApp/e-mail como hoje.
- **Rodapé** — duas colunas (contato | páginas) + linha legal.

### 5.4 Loja J2 — `exemplar-bento`

Linguagem: creme, tinta café `#2A1A0E`; **cor por categoria** em `loja/corCategoria.js`:
`presenca-digital` laranja `#FF7A3D`, `sistemas` amarelo `#FFD249`, `infraestrutura` menta
`#9ED8B5`, `continuos` café `#2A1A0E` (texto creme). Manrope 800 nos títulos; raios
`rounded-[1.75rem]` externos e concêntricos internos; microinterações com mola (`active:scale-[.98]`,
card sobe 2px no hover).

- **Cabeçalho** — "catálogo ogis" em 800 + botão café "Orçamento (n)"; o contador faz um pulo curto
  (scale) quando `total` aumenta.
- **Vitrine**
  1. Bento das 4 categorias (1 grande + 3 menores) nas cores acima; clicar define
     `?categoria=` (mesmo parâmetro de hoje); categoria ativa recebe anel de destaque.
  2. Busca em campo grande arredondado, seletor de ordem, chips da categoria ativa com "limpar".
     Filtros continuam na URL via `filtrarCatalogo`.
  3. Grade de produtos: **capa** na cor da categoria com o ícone Phosphor `duotone` grande no lugar
     de foto; nome, resumo, `SeloEscopo`; `BotaoAdicionar` alterna para "✓ na lista".
  4. Estado vazio: ícone, texto direto ("Nada encontrado com esses filtros"), "Limpar filtros".
- **Produto `/p/:slug`** — capa grande à esquerda; à direita nome, escopo, entregáveis,
  quantidade, observação; botão adicionar fixo no rodapé da tela no mobile; relacionados em faixa
  horizontal com scroll.
- **Orçamento** — itens como "tickets" na cor da categoria (quantidade −/+, observação, remover);
  formulário ao lado (≥ `lg`) ou abaixo, validação inline por `validacaoOrcamento.js`; envio
  WhatsApp/e-mail via `mensagemOrcamento`; estado vazio com atalho à vitrine.
- **Lógica intocada:** `orcamentoReducer`, `OrcamentoProvider`, `orcamentoContexto`,
  `useOrcamento`, `mensagemOrcamento`, `filtrarCatalogo`, chave `ogis:orcamento`.

### 5.5 Compartilhado

- `NaoEncontrado` herda o tema de quem o renderiza (dentro do `data-theme` do exemplar), com o
  visual neutro baseado em tokens.
- `SEO` por página e `noindex` nos exemplares — inalterados.
- `FaixaExemplar` — redesenhada em `ogis-infra`, altura mantida (o `pt-11` do `ExemplarLayout` e os
  `top-11` dos cabeçalhos continuam válidos; se a altura mudar, os três valores mudam juntos).

## 6. Assinatura de e-mail

`email-signature/gerar-assinatura.py`: cores passam a `TILE = #0D0F0E`, anel e ponto `#B8F25B`;
texto do HTML na mesma paleta (fundo grafite, texto `#E8ECE9`, links verde-sinal). Regerar
`logo-mark.png` e `assinatura-ogis-cloud.html` e atualizar o README.

## 7. Tratamento de erro e estados

- Formulários: validação inline, mensagens diretas, foco vai para o primeiro campo inválido no
  envio.
- `localStorage` indisponível (modo privado): o orçamento continua funcionando em memória — já é o
  comportamento do provider; não pode regredir.
- Slug inexistente em `/p/:slug` e `/solucoes/:slug`: continua caindo no `NaoEncontrado` do
  exemplar.
- Falha ao carregar chunk lazy: o `Suspense` mostra o fallback; sem tratamento extra (YAGNI).

## 8. Verificação

### 8.1 Testes (Vitest)

Ponto de partida: 51 testes passando (`catalogo`, `orcamentoReducer`, `mensagemOrcamento`).
Novos, escritos antes da implementação (TDD):

- `styles/temas.test.js` — `TEMA_POR_SUPERFICIE` cobre as 6 superfícies e cada nome existe como
  `name:` em algum arquivo de `styles/temas/*.css`; `faixa` é `ogis-infra`.
- `exemplos/loja/corCategoria.test.js` — toda categoria de `CATEGORIAS` tem cor; nenhuma cor
  órfã.
- `exemplos/site/validacaoContato.test.js` e `exemplos/loja/validacaoOrcamento.test.js` —
  obrigatórios, e-mail/telefone, mensagens de erro.

Sem testes de snapshot visual.

### 8.2 Gates automáticos

1. `npm test` verde.
2. `npm run lint` sem erros.
3. `npm run build` sem avisos novos; o chunk de entrada (home) **não contém** `gsap` nem arquivos
   das fontes Archivo/Manrope (checado no `dist/.vite/manifest.json` ou por grep no chunk de
   entrada).
4. `grep -r "lucide-react" src` vazio e dependência removida.

### 8.3 Navegador

- `responsiveness-check` em 375 / 768 / 1024 / 1440px nas 4 superfícies: sem scroll horizontal,
  sem sobreposição com a faixa de exemplar.
- `ux-audit` nos fluxos reais: navegar o site; filtrar a vitrine; adicionar 3 itens; editar
  quantidade e observação; recarregar (persistência); gerar mensagem WhatsApp/e-mail; formulário
  com erros. Critérios: 0 erros de console; 0 violações axe Critical/Serious; contraste AA em
  todos os temas.
- `prefers-reduced-motion` emulado: landing sem pin/scrub, conteúdo completo.
- Teclado: foco visível nos 4 temas, link "pular para o conteúdo", menus fecham com Esc.

## 9. Critérios de aceite

- [ ] Home, termos, privacidade e índice na direção B (`ogis-infra`).
- [ ] Landing L2, Site S1 e Loja J2 implementados e visivelmente distintos entre si e da home.
- [ ] Nenhum preço exibido; conteúdo vindo do catálogo e arquivos de copy atuais.
- [ ] Rotas, filtros na URL, persistência do orçamento, mensagens pré-preenchidas, SEO/noindex
      funcionando como antes.
- [ ] Gates 8.2 verdes e verificação 8.3 concluída sem pendências.
- [ ] Assinatura de e-mail regenerada na paleta B; favicon atualizado; README atualizado
      (identidade, temas, dependências, estrutura).
- [ ] Entrega em PR a partir de `redesign/ogis-infra`, commits pequenos por etapa, sem deploy.
