# Exemplares funcionais OGIS — landing page, site institucional e e-commerce

**Data:** 2026-07-22
**Status:** aprovado (design)
**Repositório:** `ogis-cloud` (branch `claude/ogis-functional-samples-dd754d`)

## 1. Problema

O consultor de vendas apontou que a OGIS não consegue demonstrar o que vende: fala-se em
"landing page", "site institucional" e "e-commerce", mas não existe nenhum exemplar navegável
para mostrar ao cliente. Além disso, os preços expostos na home (`R$ 180`, `R$ 380`) ancoram a
negociação antes do escopo ser entendido — as cotações passam a ser feitas manualmente, caso a caso.

## 2. Objetivo

Três exemplares completamente funcionais, com conteúdo real da OGIS (não conteúdo fictício),
publicados junto com o site atual:

1. **Landing page** — página única de campanha, focada em conversão, vendendo a solução
   tecnológica da OGIS como um todo (não um produto isolado).
2. **Site institucional** — site multi-página com navegação persistente.
3. **E-commerce** — vitrine com o catálogo completo de produtos e soluções da OGIS.

Nenhum preço em nenhum ponto do repositório. Toda ação comercial termina em WhatsApp ou e-mail
com mensagem pré-preenchida.

### Fora de escopo (YAGNI)

- Backend, banco de dados, autenticação, painel administrativo.
- Pagamento online, cálculo de frete, estoque.
- Subdomínios ou deploys separados.
- CMS ou edição de conteúdo pela interface.

## 3. Decisões tomadas

| Decisão | Escolha | Motivo |
|---|---|---|
| Onde os exemplares vivem | Rotas no repo atual, sob `/exemplos/*` | Um build, um deploy Cloudflare, tema e componentes compartilhados |
| Profundidade do e-commerce | Catálogo + carrinho de cotação (front-end puro) | Parece uma loja de verdade sem exigir backend |
| Relação com a home | `/` continua a landing da holding; exemplares isolados em `/exemplos/*` | Não mexe no que já está no ar |
| Preços | Removidos de todo o repositório, inclusive da home | Mensagem única no ecossistema; cotação manual |
| Catálogo | Expandido de 4 para 12 itens em 4 categorias | Um grid com 4 itens não sustenta busca, filtro e ordenação |

## 4. Arquitetura

### 4.1 Roteamento e layouts

Hoje `Navbar` e `Footer` são renderizados globalmente em `src/App.jsx`. Como cada exemplar precisa
de navegação própria (uma landing, um institucional e uma loja têm chrome diferente por natureza),
`App.jsx` passa a compor **dois layouts** via rotas aninhadas do `react-router-dom`:

- **`SiteLayout`** — `Navbar` + `Footer` atuais. Serve `/`, `/termos`, `/privacidade`.
  Comportamento visual inalterado.
- **`ExemplarLayout`** — renderiza apenas a **faixa de exemplar**: uma barra fina, fixa no topo,
  com o texto "Exemplar OGIS · demonstração" e um link "voltar ao site". Serve `/exemplos/*`.
  O cabeçalho e o rodapé de cada exemplar são responsabilidade do próprio exemplar, renderizados
  dentro dessa faixa.

```
/                            SiteLayout    landing comercial da holding (inalterada)
/termos                      SiteLayout
/privacidade                 SiteLayout

/exemplos                    ExemplarLayout  índice dos três exemplares
/exemplos/landing            ExemplarLayout  exemplar 1
/exemplos/site               ExemplarLayout  exemplar 2 — home
/exemplos/site/sobre         ExemplarLayout
/exemplos/site/solucoes      ExemplarLayout
/exemplos/site/solucoes/:slug ExemplarLayout
/exemplos/site/contato       ExemplarLayout
/exemplos/loja               ExemplarLayout  exemplar 3 — vitrine
/exemplos/loja/p/:slug       ExemplarLayout  página de produto
/exemplos/loja/orcamento     ExemplarLayout  lista de orçamento
```

Rotas não reconhecidas sob `/exemplos/*` caem em uma página 404 interna ao exemplar, com link de
volta para o índice.

### 4.2 Estrutura de arquivos

```
src/
  App.jsx                        # rotas + composição dos dois layouts
  layouts/
    SiteLayout.jsx               # Navbar + Outlet + Footer (extraído do App.jsx atual)
    ExemplarLayout.jsx           # FaixaExemplar + Outlet
  components/
    FaixaExemplar.jsx            # barra "Exemplar OGIS · demonstração"
    VejaFuncionando.jsx          # seção da home com os 3 cards
    SEO.jsx                      # + prop noindex
  data/
    catalogo.js                  # FONTE ÚNICA — 12 itens, 4 categorias
    planos.js                    # sem preços
    solucoes.js                  # passa a derivar de catalogo.js
  exemplos/
    IndiceExemplos.jsx
    landing/                     # exemplar 1 — componentes de seção + página
    site/                        # exemplar 2 — chrome + páginas
    loja/                        # exemplar 3 — chrome + páginas
      OrcamentoContext.jsx       # provider
      orcamentoReducer.js        # lógica pura (testada)
      useOrcamento.js            # hook de consumo
      mensagemOrcamento.js       # formata a mensagem de WhatsApp/e-mail
```

Cada exemplar é uma pasta autocontida. Um exemplar não importa de outro; o que for
genuinamente comum vem de `src/components/` ou `src/data/`.

### 4.3 Dados — `src/data/catalogo.js`

Fonte única de verdade consumida pelos três exemplares e pela home. Formato de cada item:

```js
{
  slug: "site-institucional",       // usado nas URLs
  nome: "Site Institucional",
  categoria: "presenca-digital",    // presenca-digital | sistemas | infraestrutura | continuos
  resumo: "…",                      // uma linha, para o card
  descricao: "…",                   // 2–3 parágrafos, para a página de detalhe
  entregaveis: ["…"],               // o que o cliente recebe
  idealPara: "…",                   // quem é o público
  prazoTipico: "2–3 semanas",       // ou null quando "sob escopo"
  modelo: "projeto",                // projeto | mensal
  icone: Layout,                    // lucide-react
  destaque: false,
  badge: null,                      // ex.: "Em breve"
}
```

O módulo também exporta `CATEGORIAS`, porque a landing consome as categorias como conteúdo de
primeira classe (os quatro pilares) e a loja as usa como filtro:

```js
{ slug: "presenca-digital", nome: "Presença Digital",
  promessa: "Ser encontrado e passar profissionalismo.", icone: Globe }
```

Categorias e itens:

| Categoria | Itens |
|---|---|
| **Presença Digital** (`presenca-digital`) | Landing Page de Conversão · Site Institucional · E-commerce / Catálogo Online · SEO Local |
| **Sistemas** (`sistemas`) | Sistema de Gestão sob medida *(destaque)* · Emissão de Nota Fiscal (NF-e) *(badge "Em breve")* · Integrações e Automações |
| **Infraestrutura** (`infraestrutura`) | Domínio Gerenciado · E-mail Profissional (Google Workspace) · Hospedagem e Monitoramento |
| **Serviços contínuos** (`continuos`) | Manutenção e Sustentação · Migração e Implantação |

O conteúdo (resumo, descrição, entregáveis) segue a orientação já adotada em `solucoes.js`: copy
de resultado de negócio, sem jargão técnico. `solucoes.js` deixa de ter conteúdo próprio e passa a
selecionar itens de `catalogo.js`, para que a home e os exemplares nunca divirjam.

### 4.4 Ausência de preços

`src/data/planos.js` perde os campos `preco`, `precoPrefixo` e `periodo`. Os três planos
(Presença, Profissional, Sistema) viram cards de escopo com "Sob consulta" e CTA de orçamento.

No lugar do preço, todo card de catálogo exibe um **selo de escopo** derivado de `modelo` e
`prazoTipico`:

- `modelo: "projeto"` com prazo → "Projeto · prazo típico 2–3 semanas"
- `modelo: "projeto"` sem prazo → "Projeto · sob escopo"
- `modelo: "mensal"` → "Mensal · sob consulta"

Critério de aceite: nenhuma ocorrência de `R$` em `src/`.

## 5. Os três exemplares

### 5.1 Landing (`/exemplos/landing`)

Vende a **solução tecnológica da OGIS como um todo** — a empresa digitalizada de ponta a ponta,
com um único responsável — e não um item isolado do catálogo. A disciplina de landing continua:
página única, uma promessa, uma ação, sem navegação interna além de âncoras, CTA repetido. O que
muda é a **altitude** da promessa: o resultado de negócio, não o entregável.

Promessa central: *"Sua empresa inteira funcionando online — site, e-mail, sistema e suporte —
sob a responsabilidade de uma pessoa só."*

Seções, em ordem:

1. **Hero** — promessa única, subtítulo com o diferencial do responsável único, CTA primário.
2. **O problema** — a realidade da PME hoje: um fornecedor para o site, outro para o e-mail, um
   sobrinho que fez o sistema e sumiu, e ninguém responde quando cai.
3. **A solução** — a OGIS como responsável único de toda a operação digital.
4. **Os quatro pilares** — Presença Digital, Sistemas, Infraestrutura e Serviços Contínuos, as
   quatro categorias de `catalogo.js`, cada uma resumida pelo que resolve. Não é uma lista de
   produtos para escolher: é a demonstração de que o escopo é completo.
5. **Como funciona em 4 passos** — diagnóstico, proposta, implantação, sustentação.
6. **Por que um responsável único** — a objeção central respondida de frente.
7. **Prova social.**
8. **FAQ** (accordion) — inclui "e se eu já tenho site?", "preciso trocar tudo de uma vez?",
   "tem fidelidade?".
9. **CTA final** com formulário curto.

Uma única ação em toda a página: **agendar um diagnóstico gratuito**. Todos os CTAs levam ao mesmo
lugar. O formulário coleta nome, negócio e contato, e abre o WhatsApp com a mensagem
pré-preenchida. Sem envio para servidor.

A landing consome as **categorias** de `catalogo.js` (não os itens individuais), o que a mantém
sincronizada com o catálogo sem virar uma segunda vitrine — esse papel é da loja.

### 5.2 Site institucional (`/exemplos/site`)

Multi-página, com cabeçalho de navegação persistente (Home · Sobre · Soluções · Contato) e rodapé
com mapa do site. É o exemplar que demonstra profundidade.

- **Home** — hero, soluções em destaque, diferenciais, chamada para contato.
- **Sobre** — quem é a OGIS, como trabalha, o princípio do responsável único.
- **Soluções** — grid de todo o catálogo agrupado por categoria; cada card leva ao detalhe.
- **Solução (`:slug`)** — descrição longa, entregáveis, ideal para, soluções relacionadas, CTA.
- **Contato** — formulário e canais diretos (WhatsApp, e-mail), com os dados de `config.js`.

### 5.3 E-commerce (`/exemplos/loja`)

Cabeçalho próprio com busca e **badge de contagem** da lista de orçamento.

- **Vitrine** — busca por texto (nome + resumo), filtro por categoria, ordenação (nome A–Z,
  categoria). Cards com selo de escopo e botão "Adicionar ao orçamento", que dá retorno visual
  imediato ao ser clicado.
- **Produto (`/p/:slug`)** — descrição, entregáveis, ideal para, selo de escopo, seletor de
  quantidade, campo de observação, "Adicionar ao orçamento", e itens relacionados da mesma categoria.
- **Lista de orçamento (`/orcamento`)** — itens escolhidos com quantidade e observação editáveis,
  remoção, limpar tudo, e um formulário final (nome, empresa, e-mail/telefone, observações gerais)
  com dois botões: "Enviar por WhatsApp" e "Enviar por e-mail".

#### Carrinho de cotação

`OrcamentoContext` expõe estado e ações; a lógica vive em `orcamentoReducer.js`, uma função pura.

Ações: `adicionar(slug, quantidade, observacao)` (soma à quantidade se o item já existe),
`remover(slug)`, `alterarQuantidade(slug, n)` (n ≤ 0 remove o item), `alterarObservacao(slug, texto)`,
`limpar()`.

Estado persistido em `localStorage` sob a chave `ogis:orcamento`, gravando apenas
`{ slug, quantidade, observacao }` — os dados do produto são sempre re-lidos de `catalogo.js`
na renderização. Consequência intencional: se um item sair do catálogo, ele simplesmente
desaparece da lista salva, sem quebrar nada.

`mensagemOrcamento.js` monta o texto enviado ao WhatsApp/e-mail:

```
Olá! Vim pelo site da ogis.cloud e gostaria de um orçamento.

Nome: {nome}
Empresa: {empresa}
Contato: {contato}

Itens:
- Site Institucional (1) — obs: preciso de blog
- E-mail Profissional (5)

Observações: {observacoes}
```

Os links são gerados pelas funções `linkWhatsApp` e `linkEmail` já existentes em `src/config.js`.
Não há backend: o envio acontece no cliente de mensagem do próprio usuário.

## 6. SEO

`SEO.jsx` ganha a prop `noindex`, que emite `<meta name="robots" content="noindex, follow">`.

- **Landing e institucional exemplares:** `noindex`. O conteúdo se parece demais com a home e
  competiria com ela nos resultados de busca.
- **Loja:** indexável. O catálogo completo da OGIS é conteúdo único e útil, e as páginas de produto
  são páginas de serviço legítimas.

`public/sitemap.xml` passa a listar as páginas da loja e não lista os outros exemplares.

## 7. Tratamento de erro

| Situação | Comportamento |
|---|---|
| `:slug` inexistente | 404 interna ao exemplar, com link para o índice/vitrine |
| Lista de orçamento vazia | Estado vazio explicativo com CTA para a vitrine |
| Busca sem resultado | Estado vazio com botão "limpar filtros" |
| `localStorage` indisponível (aba anônima) | Cai para estado em memória, sem lançar exceção; o site continua funcionando, apenas não persiste entre recargas |
| Item salvo que saiu do catálogo | Ignorado silenciosamente na leitura |

## 8. Verificação

O projeto tem apenas `eslint`, sem framework de teste.

- **Vitest** é adicionado **apenas** para `orcamentoReducer.js` — a única lógica pura do trabalho.
  Cobertura: adicionar item novo, adicionar item repetido (soma quantidade), remover, quantidade
  zero ou negativa remove, alterar observação, limpar, e a serialização de/para `localStorage`.
- `npm run lint` e `npm run build` devem passar limpos.
- Verificação manual no browser: os três exemplares em viewport mobile e desktop, o fluxo completo
  da loja (vitrine → produto → orçamento → link do WhatsApp), e a home confirmando que nada quebrou.
- `grep -r 'R\$' src/` não retorna nada.

## 9. Critérios de aceite

1. `/exemplos/landing`, `/exemplos/site` e `/exemplos/loja` navegáveis e responsivos.
2. Os três usam conteúdo real da OGIS, vindo de `catalogo.js`.
3. Nenhum preço em `src/`.
4. A loja lista os 12 itens, com busca, filtro por categoria e ordenação funcionando.
5. A lista de orçamento persiste ao recarregar a página e gera link de WhatsApp e de e-mail com
   os itens escolhidos.
6. A home ganha a seção "Veja funcionando" linkando os três exemplares.
7. `npm run lint`, `npm run build` e os testes do reducer passam.
