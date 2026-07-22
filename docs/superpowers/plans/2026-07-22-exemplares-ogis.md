# Exemplares Funcionais OGIS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar três exemplares navegáveis (landing page, site institucional e e-commerce) sob `/exemplos/*` no site atual da ogis.cloud, alimentados por um catálogo único de 12 itens, e remover todos os preços do repositório.

**Architecture:** O `App.jsx` passa a compor dois layouts via rotas aninhadas do react-router-dom — `SiteLayout` (Navbar/Footer atuais) para o site real e `ExemplarLayout` (faixa de demonstração) para os exemplares, cada um com chrome próprio. Um módulo `src/data/catalogo.js` vira a fonte única de verdade consumida pelos três exemplares e pela home. A lista de orçamento da loja é estado de front-end puro (reducer + Context + `localStorage`), sem backend, que termina gerando um link de WhatsApp ou e-mail.

**Tech Stack:** React 19 · Vite 7 · react-router-dom 7 · Tailwind v4 + daisyUI v5 (tema `ogis-dark`) · react-helmet-async 3 · lucide-react · Vitest (novo, só para lógica pura) · Cloudflare Workers (Wrangler)

**Spec:** `docs/superpowers/specs/2026-07-22-exemplares-ogis-design.md`

## Global Constraints

Estes valem para **todas** as tarefas:

- **Idioma:** todo texto visível ao usuário em **português do Brasil**. Nomes de variáveis, funções e arquivos também em português, seguindo o padrão do repo (`solucoes.js`, `PLANOS`, `linkWhatsApp`).
- **Nenhum preço:** proibido qualquer valor monetário em `src/`. O critério objetivo é `grep -rn 'R\$' src/` não retornar nada.
- **Tema:** usar exclusivamente tokens daisyUI do tema `ogis-dark` (`base-100`, `base-200`, `base-300`, `base-content`, `primary`, `accent`, `neutral`, `success`). **Nunca** cores literais do Tailwind (`bg-stone-900`, `text-yellow-500`) nem hex inline.
- **Não existe modo claro.** `data-theme="ogis-dark"` é fixo no `index.html`. Não adicionar toggle de tema.
- **Contato:** toda ação comercial usa `linkWhatsApp()` / `linkEmail()` de `src/config.js`. Nenhum `fetch`, nenhum endpoint, nenhum backend.
- **Ícones:** somente `lucide-react`.
- **Links internos:** `<Link to="...">` do react-router-dom para navegação entre rotas; `<a href="#...">` apenas para âncoras na mesma página.
- **Links externos:** sempre com `target="_blank" rel="noopener noreferrer"`.
- **Acessibilidade:** todo `<section>` de conteúdo tem `id`; botões de ícone puro têm `aria-label`; imagens decorativas têm `aria-hidden="true"`.
- **Lint:** `npm run lint` deve terminar com zero erros **e zero warnings**. Atenção à regra `react-refresh/only-export-components` — um arquivo `.jsx` que exporta um componente não deve exportar mais nada além de constantes.
- **Testes:** importar `describe`/`it`/`expect` explicitamente de `"vitest"` em todo arquivo de teste. Não usar globais.
- **Commits:** um commit por tarefa concluída, mensagem em português, prefixo `feat:` / `refactor:` / `docs:` / `test:`. Sem acentos na primeira linha da mensagem (o repo já segue isso).

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| **Dados** | |
| `src/data/catalogo.js` | **Criar.** Fonte única: `CATEGORIAS` (4) + `CATALOGO` (12 itens) + helpers puros |
| `src/data/catalogo.test.js` | **Criar.** Testes dos helpers de busca/filtro/selo |
| `src/data/solucoes.js` | **Modificar.** Deixa de ter conteúdo próprio; passa a selecionar de `catalogo.js` |
| `src/data/planos.js` | **Modificar.** Remove `preco`, `precoPrefixo`, `periodo` |
| **Infra de rota** | |
| `src/App.jsx` | **Modificar.** Rotas aninhadas com dois layouts |
| `src/layouts/SiteLayout.jsx` | **Criar.** Navbar + `<Outlet/>` + Footer |
| `src/layouts/ExemplarLayout.jsx` | **Criar.** FaixaExemplar + `<Outlet/>` |
| `src/components/FaixaExemplar.jsx` | **Criar.** Barra fixa "Exemplar OGIS · demonstração" |
| `src/components/SEO.jsx` | **Modificar.** Ganha prop `noindex` |
| **Primitivas compartilhadas** | |
| `src/components/SeloEscopo.jsx` | **Criar.** Renderiza "Projeto · prazo típico X" / "Mensal · sob consulta" |
| `src/components/CardCatalogo.jsx` | **Criar.** Card de item do catálogo, com slot de ação |
| `src/components/Planos.jsx` | **Modificar.** Troca o bloco de preço por "Sob consulta" |
| `src/components/VejaFuncionando.jsx` | **Criar.** Seção da home linkando os três exemplares |
| **Exemplar 0 — índice** | |
| `src/exemplos/IndiceExemplos.jsx` | **Criar.** `/exemplos` |
| `src/exemplos/NaoEncontrado.jsx` | **Criar.** 404 interna aos exemplares |
| **Exemplar 1 — landing** | |
| `src/exemplos/landing/LandingExemplar.jsx` | **Criar.** Página única, compõe as seções |
| `src/exemplos/landing/secoes.jsx` | **Criar.** Seções da landing (hero, problema, pilares, passos, FAQ, CTA) |
| `src/exemplos/landing/conteudo.js` | **Criar.** Copy da landing (passos, FAQ, provas) |
| **Exemplar 2 — institucional** | |
| `src/exemplos/site/ChromeSite.jsx` | **Criar.** Cabeçalho + rodapé do institucional |
| `src/exemplos/site/SiteHome.jsx` | **Criar.** |
| `src/exemplos/site/SiteSobre.jsx` | **Criar.** |
| `src/exemplos/site/SiteSolucoes.jsx` | **Criar.** Grid por categoria |
| `src/exemplos/site/SiteSolucao.jsx` | **Criar.** Detalhe por `:slug` |
| `src/exemplos/site/SiteContato.jsx` | **Criar.** |
| **Exemplar 3 — loja** | |
| `src/exemplos/loja/orcamentoReducer.js` | **Criar.** Lógica pura: reducer + hidratar/serializar |
| `src/exemplos/loja/orcamentoReducer.test.js` | **Criar.** Testes do reducer |
| `src/exemplos/loja/mensagemOrcamento.js` | **Criar.** Monta o texto do WhatsApp/e-mail (puro) |
| `src/exemplos/loja/mensagemOrcamento.test.js` | **Criar.** Testes da mensagem |
| `src/exemplos/loja/orcamentoContexto.js` | **Criar.** `createContext` isolado (evita warning do react-refresh) |
| `src/exemplos/loja/OrcamentoProvider.jsx` | **Criar.** Provider + persistência em `localStorage` |
| `src/exemplos/loja/useOrcamento.js` | **Criar.** Hook de consumo |
| `src/exemplos/loja/ChromeLoja.jsx` | **Criar.** Cabeçalho com badge + rodapé |
| `src/exemplos/loja/LojaVitrine.jsx` | **Criar.** Busca + filtro + ordenação |
| `src/exemplos/loja/LojaProduto.jsx` | **Criar.** Detalhe por `:slug` |
| `src/exemplos/loja/LojaOrcamento.jsx` | **Criar.** Lista + formulário final |
| `src/exemplos/loja/BotaoAdicionar.jsx` | **Criar.** Botão com retorno visual de "adicionado" |
| **Config** | |
| `vitest.config.js` | **Criar.** Config isolada (não carrega o plugin do Cloudflare) |
| `package.json` | **Modificar.** Dependência `vitest` + script `test` |
| `src/config.js` | **Modificar.** Item "Exemplos" no `NAV` + mensagens de orçamento |
| `public/sitemap.xml` | **Modificar.** Adiciona as páginas da loja |
| `README.md` | **Modificar.** Documenta os exemplares |

**Por que o estado do orçamento vira 4 arquivos** (o spec previa 2): a regra de lint `react-refresh/only-export-components` reclama quando um `.jsx` exporta um componente **e** outra coisa. Separar contexto (`.js`), provider (`.jsx`) e hook (`.js`) mantém o lint limpo sem `eslint-disable`.

---

## Task 1: Catálogo — fonte única de dados

**Files:**
- Create: `src/data/catalogo.js`
- Create: `src/data/catalogo.test.js`
- Create: `vitest.config.js`
- Modify: `package.json` (devDependency `vitest` + script `test`)

**Interfaces:**
- Consumes: nada (primeira tarefa)
- Produces:
  - `CATEGORIAS: Array<{ slug, nome, promessa, icone }>` — 4 itens
  - `CATALOGO: Array<Item>` onde `Item = { slug, nome, categoria, resumo, descricao, entregaveis: string[], idealPara, prazoTipico: string|null, modelo: "projeto"|"mensal", icone, destaque: boolean, badge: string|null }` — 12 itens
  - `buscarItem(slug): Item | undefined`
  - `buscarCategoria(slug): Categoria | undefined`
  - `itensPorCategoria(categoriaSlug): Item[]`
  - `filtrarCatalogo({ termo, categoria, ordem }): Item[]` — `ordem` é `"nome"` ou `"categoria"`
  - `relacionados(slug, limite = 3): Item[]`
  - `textoEscopo(item): string`

- [ ] **Step 1: Instalar o Vitest**

```bash
npm install -D vitest
```

Esperado: instala sem erro. Confirme que `vitest` aparece em `devDependencies` no `package.json`.

- [ ] **Step 2: Criar a config isolada do Vitest**

O `vite.config.js` carrega o plugin `@cloudflare/vite-plugin`, que sobe um ambiente de Worker e atrapalha a execução de testes em Node. O Vitest dá precedência a `vitest.config.js` quando ele existe, então essa config **substitui** a do Vite durante os testes.

Crie `vitest.config.js` na raiz do projeto:

```js
import { defineConfig } from "vitest/config";

// Config própria, sem o plugin do Cloudflare: os testes cobrem apenas lógica
// pura, então rodam em Node — sem DOM, sem bundler, sem Worker.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.js"],
  },
});
```

- [ ] **Step 3: Adicionar o script de teste**

Em `package.json`, dentro de `"scripts"`, acrescente a linha `test` logo depois de `lint`:

```json
    "lint": "eslint .",
    "test": "vitest run",
```

- [ ] **Step 4: Escrever o teste que falha**

Crie `src/data/catalogo.test.js`:

```js
import { describe, it, expect } from "vitest";
import {
  CATEGORIAS,
  CATALOGO,
  buscarItem,
  itensPorCategoria,
  filtrarCatalogo,
  relacionados,
  textoEscopo,
} from "./catalogo.js";

describe("estrutura do catalogo", () => {
  it("tem 4 categorias e 12 itens", () => {
    expect(CATEGORIAS).toHaveLength(4);
    expect(CATALOGO).toHaveLength(12);
  });

  it("todo item aponta para uma categoria existente", () => {
    const slugs = CATEGORIAS.map((c) => c.slug);
    for (const item of CATALOGO) {
      expect(slugs).toContain(item.categoria);
    }
  });

  it("nao tem slug repetido", () => {
    const slugs = CATALOGO.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("nao menciona preco em nenhum campo de texto", () => {
    expect(JSON.stringify(CATALOGO)).not.toMatch(/R\$/);
  });
});

describe("buscarItem", () => {
  it("encontra pelo slug", () => {
    expect(buscarItem("site-institucional").nome).toBe("Site Institucional");
  });

  it("devolve undefined para slug inexistente", () => {
    expect(buscarItem("nao-existe")).toBeUndefined();
  });
});

describe("itensPorCategoria", () => {
  it("devolve so os itens da categoria pedida", () => {
    const itens = itensPorCategoria("infraestrutura");
    expect(itens.length).toBeGreaterThan(0);
    expect(itens.every((i) => i.categoria === "infraestrutura")).toBe(true);
  });
});

describe("filtrarCatalogo", () => {
  it("sem filtro devolve tudo", () => {
    expect(filtrarCatalogo({})).toHaveLength(12);
  });

  it("filtra por termo no nome, ignorando caixa", () => {
    expect(filtrarCatalogo({ termo: "E-COMMERCE" }).map((i) => i.slug)).toContain("e-commerce");
  });

  it("filtra por termo presente no resumo", () => {
    expect(filtrarCatalogo({ termo: "nota" }).map((i) => i.slug)).toContain("nota-fiscal");
  });

  it("ignora acento no termo digitado", () => {
    expect(filtrarCatalogo({ termo: "manutencao" }).map((i) => i.slug)).toContain("manutencao");
  });

  it("filtra por categoria", () => {
    const itens = filtrarCatalogo({ categoria: "sistemas" });
    expect(itens.length).toBeGreaterThan(0);
    expect(itens.every((i) => i.categoria === "sistemas")).toBe(true);
  });

  it("combina termo e categoria", () => {
    expect(filtrarCatalogo({ termo: "zzzzzz", categoria: "sistemas" })).toEqual([]);
  });

  it("ordena por nome quando pedido", () => {
    const nomes = filtrarCatalogo({ ordem: "nome" }).map((i) => i.nome);
    expect(nomes).toEqual([...nomes].sort((a, b) => a.localeCompare(b, "pt-BR")));
  });

  it("devolve lista vazia quando nada casa", () => {
    expect(filtrarCatalogo({ termo: "zzzzzz" })).toEqual([]);
  });
});

describe("relacionados", () => {
  it("traz itens da mesma categoria, sem incluir o proprio", () => {
    const itens = relacionados("site-institucional");
    expect(itens.every((i) => i.categoria === "presenca-digital")).toBe(true);
    expect(itens.map((i) => i.slug)).not.toContain("site-institucional");
  });

  it("respeita o limite", () => {
    expect(relacionados("site-institucional", 2)).toHaveLength(2);
  });

  it("devolve lista vazia para slug inexistente", () => {
    expect(relacionados("nao-existe")).toEqual([]);
  });
});

describe("textoEscopo", () => {
  it("projeto com prazo", () => {
    expect(textoEscopo(buscarItem("site-institucional"))).toBe(
      "Projeto · prazo típico 2 a 3 semanas",
    );
  });

  it("projeto sem prazo", () => {
    expect(textoEscopo(buscarItem("sistema-gestao"))).toBe("Projeto · sob escopo");
  });

  it("mensal", () => {
    expect(textoEscopo(buscarItem("dominio"))).toBe("Mensal · sob consulta");
  });
});
```

- [ ] **Step 5: Rodar o teste para confirmar que falha**

```bash
npm test
```

Esperado: FALHA com `Failed to resolve import "./catalogo.js"` — o arquivo ainda não existe.

- [ ] **Step 6: Criar o catálogo (parte 1 — categorias e Presença Digital)**

Crie `src/data/catalogo.js` com o conteúdo abaixo. Este é o arquivo mais importante do trabalho: os três exemplares e a home leem dele. O Step 7 continua o mesmo arquivo.

```js
import {
  Globe,
  Boxes,
  Server,
  LifeBuoy,
  MousePointerClick,
  Layout,
  ShoppingBag,
  MapPin,
  Cpu,
  FileText,
  Workflow,
  Link2,
  Mail,
  Activity,
  Wrench,
  MoveRight,
} from "lucide-react";

// =============================================================================
// Catálogo OGIS — FONTE ÚNICA de produtos e soluções.
// Consumido pela home, pelo site institucional exemplar e pela loja exemplar.
// Não há preço aqui por decisão comercial: toda cotação é manual.
// Copy orientada a resultado de negócio — sem jargão técnico.
// =============================================================================

export const CATEGORIAS = [
  {
    slug: "presenca-digital",
    nome: "Presença Digital",
    promessa: "Ser encontrado e passar profissionalismo desde o primeiro clique.",
    icone: Globe,
  },
  {
    slug: "sistemas",
    nome: "Sistemas",
    promessa: "Software que acompanha o jeito que a sua empresa já trabalha.",
    icone: Boxes,
  },
  {
    slug: "infraestrutura",
    nome: "Infraestrutura",
    promessa: "Domínio, e-mail e hospedagem no seu nome, sempre no ar.",
    icone: Server,
  },
  {
    slug: "continuos",
    nome: "Serviços Contínuos",
    promessa: "Alguém responsável depois que tudo entra no ar.",
    icone: LifeBuoy,
  },
];

export const CATALOGO = [
  // --------------------------- Presença Digital ----------------------------
  {
    slug: "landing-page",
    nome: "Landing Page de Conversão",
    categoria: "presenca-digital",
    resumo: "Uma página feita para transformar visita em contato.",
    descricao:
      "Uma landing page tem um objetivo só: fazer quem chegou entrar em contato. Nada de menu que distrai, nada de texto que não ajuda a decidir. Escrevemos a página em cima do que o seu cliente precisa ouvir para dar o próximo passo, e medimos o resultado depois que ela entra no ar.",
    entregaveis: [
      "Página única, rápida e adaptada ao celular",
      "Texto escrito para converter, não só para informar",
      "Botão de WhatsApp e formulário de contato integrados",
      "Publicação com domínio próprio e HTTPS",
      "Medição de acessos e de contatos gerados",
    ],
    idealPara: "Campanhas pagas, lançamento de um serviço novo, ou quem ainda não tem nada online.",
    prazoTipico: "1 a 2 semanas",
    modelo: "projeto",
    icone: MousePointerClick,
    destaque: false,
    badge: null,
  },
  {
    slug: "site-institucional",
    nome: "Site Institucional",
    categoria: "presenca-digital",
    resumo: "O site completo do seu negócio, sempre no ar e atualizado.",
    descricao:
      "É o endereço definitivo da sua empresa na internet: quem você é, o que faz, para quem faz e como falar com você. Construído para carregar rápido, aparecer bem no celular e ser encontrado no Google — com a manutenção já inclusa, para não virar aquele site parado há três anos.",
    entregaveis: [
      "Estrutura completa: início, sobre, serviços e contato",
      "Layout adaptado a celular, tablet e computador",
      "Otimização para busca (SEO) desde a publicação",
      "Domínio próprio e certificado HTTPS configurados",
      "Primeiro mês de manutenção incluso",
    ],
    idealPara: "Empresas estabelecidas que precisam de credibilidade e de ser encontradas.",
    prazoTipico: "2 a 3 semanas",
    modelo: "projeto",
    icone: Layout,
    destaque: true,
    badge: null,
  },
  {
    slug: "e-commerce",
    nome: "E-commerce e Catálogo Online",
    categoria: "presenca-digital",
    resumo: "Sua vitrine online — com venda direta ou pedido de orçamento.",
    descricao:
      "Do catálogo simples que gera orçamento no WhatsApp até a loja com pagamento e frete: montamos o modelo que faz sentido para o que você vende. Produtos organizados por categoria, busca que funciona, e páginas que explicam o produto de verdade.",
    entregaveis: [
      "Catálogo com categorias, busca e filtros",
      "Página de produto com fotos e descrição",
      "Carrinho — de compra ou de orçamento, conforme o seu modelo",
      "Painel para você mesmo cadastrar e alterar produtos",
      "Integração de pagamento e frete conforme o escopo",
    ],
    idealPara: "Comércio, distribuidoras e prestadores com catálogo extenso.",
    prazoTipico: "3 a 5 semanas",
    modelo: "projeto",
    icone: ShoppingBag,
    destaque: false,
    badge: null,
  },
  {
    slug: "seo-local",
    nome: "SEO Local",
    categoria: "presenca-digital",
    resumo: "Ser encontrado por quem procura o seu serviço perto de você.",
    descricao:
      "A maior parte das buscas por serviço tem intenção local: alguém em Curitiba procurando quem resolve agora. Cuidamos do seu perfil no Google, da estrutura das páginas por bairro e serviço, e acompanhamos mês a mês onde você aparece.",
    entregaveis: [
      "Perfil da Empresa no Google criado e otimizado",
      "Dados estruturados no site para o Google entender o negócio",
      "Páginas específicas por serviço e por região atendida",
      "Acompanhamento de posições nas buscas",
      "Relatório mensal do que mudou",
    ],
    idealPara: "Negócios que atendem por região — clínicas, oficinas, prestadores de serviço.",
    prazoTipico: null,
    modelo: "mensal",
    icone: MapPin,
    destaque: false,
    badge: null,
  },
```

- [ ] **Step 7: Criar o catálogo (parte 2 — demais categorias e helpers)**

Continue o **mesmo** `src/data/catalogo.js`, emendando logo abaixo do item `seo-local`:

```js
  // ------------------------------- Sistemas --------------------------------
  {
    slug: "sistema-gestao",
    nome: "Sistema de Gestão sob Medida",
    categoria: "sistemas",
    resumo: "Um sistema feito para o jeito que a sua empresa trabalha.",
    descricao:
      "Sistema pronto obriga a empresa a mudar o processo para caber no software. Aqui é o contrário: primeiro entendemos como você já trabalha, depois construímos o sistema em volta disso. Você continua com o seu processo — só que sem planilha solta, sem retrabalho e com a informação em um lugar só.",
    entregaveis: [
      "Levantamento do seu processo antes de escrever qualquer código",
      "Sistema web, acessível de qualquer lugar e do celular",
      "Controle de acesso por usuário e por permissão",
      "Relatórios do que importa para a sua decisão",
      "Treinamento da equipe e sustentação inclusa",
    ],
    idealPara: "Empresas que já bateram no limite da planilha e do sistema genérico.",
    prazoTipico: null,
    modelo: "projeto",
    icone: Cpu,
    destaque: true,
    badge: null,
  },
  {
    slug: "nota-fiscal",
    nome: "Emissão de Nota Fiscal (NF-e)",
    categoria: "sistemas",
    resumo: "Emita nota sem travar o caixa, direto do seu sistema.",
    descricao:
      "A emissão acontece em segundo plano: o atendimento não fica esperando a Sefaz responder para liberar o próximo cliente. As notas saem, o XML e o DANFE ficam guardados, e você acompanha o que foi emitido sem sair do sistema.",
    entregaveis: [
      "Emissão em segundo plano, sem fila no atendimento",
      "Integrado ao seu sistema de gestão",
      "XML e DANFE armazenados e organizados",
      "Acompanhamento das notas emitidas e das rejeitadas",
      "Um valor por CNPJ, previsível",
    ],
    idealPara: "Quem já usa um sistema de gestão e emite nota no dia a dia.",
    prazoTipico: null,
    modelo: "mensal",
    icone: FileText,
    destaque: false,
    badge: "Em breve",
  },
  {
    slug: "integracoes",
    nome: "Integrações e Automações",
    categoria: "sistemas",
    resumo: "Seus sistemas conversando entre si, sem digitação dupla.",
    descricao:
      "Quando a mesma informação é digitada em dois lugares, uma hora os dois discordam. Conectamos o que você já usa — ERP, planilhas, marketplace, sistema do contador — e criamos as rotinas que rodam sozinhas, no horário certo, avisando quando algo falha.",
    entregaveis: [
      "Conexão entre os sistemas que você já usa",
      "Rotinas automáticas em horário programado",
      "Avisos por e-mail ou WhatsApp quando algo precisa de atenção",
      "Monitoramento de falhas com nova tentativa automática",
      "Registro do que rodou, para auditoria",
    ],
    idealPara: "Empresas com dois ou mais sistemas que não se falam.",
    prazoTipico: "2 a 4 semanas",
    modelo: "projeto",
    icone: Workflow,
    destaque: false,
    badge: null,
  },

  // ---------------------------- Infraestrutura -----------------------------
  {
    slug: "dominio",
    nome: "Domínio Gerenciado",
    categoria: "infraestrutura",
    resumo: "Seu endereço na internet — sempre registrado no seu nome.",
    descricao:
      "O domínio é o ativo mais importante da sua presença digital, e é onde mais se vê empresa refém de fornecedor. Aqui ele fica registrado no CNPJ da sua empresa, sempre. Nós cuidamos da parte técnica e da renovação; a titularidade é sua, e você pode levar embora quando quiser.",
    entregaveis: [
      "Registro ou transferência do domínio para o seu nome",
      "Configuração e gestão de DNS",
      "Renovação acompanhada, sem risco de perder por esquecimento",
      "Certificado HTTPS ativo e renovado automaticamente",
      "Titularidade sempre da sua empresa",
    ],
    idealPara: "Qualquer negócio com presença online — é a base de tudo.",
    prazoTipico: null,
    modelo: "mensal",
    icone: Link2,
    destaque: false,
    badge: null,
  },
  {
    slug: "email-profissional",
    nome: "E-mail Profissional",
    categoria: "infraestrutura",
    resumo: "contato@suaempresa.com.br no lugar do e-mail pessoal.",
    descricao:
      "E-mail com o domínio da empresa muda como o cliente enxerga o seu negócio — e reduz a chance de a sua mensagem cair em spam. Configuramos as caixas no Google Workspace, migramos o histórico sem perder nada e deixamos a autenticação de envio correta.",
    entregaveis: [
      "Caixas no Google Workspace configuradas por pessoa",
      "Migração dos e-mails antigos, sem perda",
      "Autenticação de envio (SPF, DKIM e DMARC) configurada",
      "Assinatura de e-mail padronizada para a equipe",
      "Suporte às contas no dia a dia",
    ],
    idealPara: "Toda empresa que ainda usa e-mail pessoal para falar com cliente.",
    prazoTipico: null,
    modelo: "mensal",
    icone: Mail,
    destaque: false,
    badge: null,
  },
  {
    slug: "hospedagem",
    nome: "Hospedagem e Monitoramento",
    categoria: "infraestrutura",
    resumo: "Seu site no ar, com alguém olhando 24 horas por dia.",
    descricao:
      "Não adianta ter site bom se ele cai numa sexta à noite e ninguém percebe até segunda. Hospedamos, monitoramos de fora a cada poucos minutos e somos avisados antes do seu cliente. Backup diário, para o pior caso nunca ser o pior caso.",
    entregaveis: [
      "Hospedagem gerenciada, sem você precisar entender de servidor",
      "Certificado HTTPS sempre válido",
      "Backup diário com restauração testada",
      "Monitoramento 24/7 com alerta automático",
      "Relatório de disponibilidade",
    ],
    idealPara: "Quem depende do site ou do sistema para vender ou operar.",
    prazoTipico: null,
    modelo: "mensal",
    icone: Activity,
    destaque: false,
    badge: null,
  },

  // -------------------------- Serviços Contínuos ---------------------------
  {
    slug: "manutencao",
    nome: "Manutenção e Sustentação",
    categoria: "continuos",
    resumo: "Alguém responsável pelo que já está no ar.",
    descricao:
      "A maior parte dos problemas que vemos não é de quem nunca fez site — é de quem fez e ficou sem ninguém depois. Correções, atualizações de segurança e as pequenas alterações do dia a dia entram aqui, com acesso direto a quem desenvolve. Sem fidelidade: ficamos porque você quer.",
    entregaveis: [
      "Correções e ajustes sem custo por chamado",
      "Atualizações de segurança aplicadas",
      "Pequenas alterações de texto e imagem inclusas",
      "Canal direto com quem desenvolve, não com central de atendimento",
      "Sem fidelidade",
    ],
    idealPara: "Qualquer site ou sistema que precisa continuar funcionando amanhã.",
    prazoTipico: null,
    modelo: "mensal",
    icone: Wrench,
    destaque: false,
    badge: null,
  },
  {
    slug: "migracao",
    nome: "Migração e Implantação",
    categoria: "continuos",
    resumo: "Saia do fornecedor atual sem sair do ar e sem perder e-mail.",
    descricao:
      "Trocar de fornecedor assusta pelo risco de perder e-mail antigo, cair do Google ou ficar fora do ar no meio da mudança. Fazemos a migração com plano de corte, validação item a item e os redirecionamentos certos para o seu site não perder o que já conquistou nas buscas.",
    entregaveis: [
      "Migração de site, e-mail e domínio de outro fornecedor",
      "Histórico de e-mails preservado",
      "Corte planejado, sem período fora do ar",
      "Redirecionamentos configurados para preservar o SEO",
      "Checklist de validação conferido ao final",
    ],
    idealPara: "Quem está insatisfeito com o fornecedor atual mas tem receio da troca.",
    prazoTipico: "1 a 2 semanas",
    modelo: "projeto",
    icone: MoveRight,
    destaque: false,
    badge: null,
  },
];

// ---------------------------------------------------------------------------
// Helpers puros (cobertos por catalogo.test.js)
// ---------------------------------------------------------------------------

/** Tira acento e caixa para a busca tolerar o que o usuário realmente digita. */
function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/** Item pelo slug, ou undefined. */
export function buscarItem(slug) {
  return CATALOGO.find((item) => item.slug === slug);
}

/** Categoria pelo slug, ou undefined. */
export function buscarCategoria(slug) {
  return CATEGORIAS.find((cat) => cat.slug === slug);
}

/** Todos os itens de uma categoria, na ordem do catálogo. */
export function itensPorCategoria(categoriaSlug) {
  return CATALOGO.filter((item) => item.categoria === categoriaSlug);
}

/**
 * Busca da vitrine: termo (nome + resumo + descrição), categoria e ordenação.
 * Todos os parâmetros são opcionais; sem nenhum, devolve o catálogo inteiro.
 */
export function filtrarCatalogo({ termo = "", categoria = "", ordem = "" } = {}) {
  const alvo = normalizar(termo);

  let itens = CATALOGO.filter((item) => {
    if (categoria && item.categoria !== categoria) return false;
    if (!alvo) return true;
    return normalizar(`${item.nome} ${item.resumo} ${item.descricao}`).includes(alvo);
  });

  if (ordem === "nome") {
    itens = [...itens].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  } else if (ordem === "categoria") {
    const peso = (item) => CATEGORIAS.findIndex((c) => c.slug === item.categoria);
    itens = [...itens].sort((a, b) => peso(a) - peso(b) || a.nome.localeCompare(b.nome, "pt-BR"));
  }

  return itens;
}

/** Outros itens da mesma categoria, para a página de produto. */
export function relacionados(slug, limite = 3) {
  const item = buscarItem(slug);
  if (!item) return [];
  return CATALOGO.filter((i) => i.categoria === item.categoria && i.slug !== slug).slice(0, limite);
}

/**
 * Texto que ocupa o lugar do preço. Não é preço: é escopo.
 * "Projeto · prazo típico 2 a 3 semanas" | "Projeto · sob escopo" | "Mensal · sob consulta"
 */
export function textoEscopo(item) {
  if (item.modelo === "mensal") return "Mensal · sob consulta";
  return item.prazoTipico ? `Projeto · prazo típico ${item.prazoTipico}` : "Projeto · sob escopo";
}
```

- [ ] **Step 8: Rodar os testes para confirmar que passam**

```bash
npm test
```

Esperado: PASS — 21 testes verdes em `src/data/catalogo.test.js`.

- [ ] **Step 9: Rodar o lint**

```bash
npm run lint
```

Esperado: sem nenhuma saída (zero erros, zero warnings).

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json vitest.config.js src/data/catalogo.js src/data/catalogo.test.js
git commit -m "feat: catalogo unico com 12 itens e helpers testados"
```

---

## Task 2: Remover todos os preços e unificar as soluções

Depois desta tarefa, `grep -rn 'R\$' src/` não retorna nada e a home continua funcionando igual, só que sem valores.

**Files:**
- Modify: `src/data/planos.js` (remove `preco`, `precoPrefixo`, `periodo`)
- Modify: `src/data/solucoes.js` (passa a derivar de `catalogo.js`)
- Modify: `src/components/Planos.jsx` (bloco de preço vira "Sob consulta")
- Modify: `src/components/Solucoes.jsx` (adapta ao novo formato de `SOLUCOES`)
- Create: `src/components/SeloEscopo.jsx`

**Interfaces:**
- Consumes: `CATALOGO`, `buscarItem`, `textoEscopo` da Task 1
- Produces:
  - `SeloEscopo({ item, className })` — componente de badge
  - `SOLUCOES: Item[]` — agora são itens do catálogo, com os campos `nome`, `resumo`, `entregaveis`, `icone`, `destaque`, `badge`
  - `PLANOS: Array<{ nome, resumo, beneficios, cta, destaque, selo }>` — sem nenhum campo de preço

- [ ] **Step 1: Criar o componente de selo de escopo**

Ele ocupa o lugar visual que o preço ocupava. Crie `src/components/SeloEscopo.jsx`:

```jsx
import { Clock } from "lucide-react";
import { textoEscopo } from "../data/catalogo.js";

// Ocupa o lugar do preço nos cards. Comunica escopo e prazo, não valor —
// a cotação é sempre manual.
export default function SeloEscopo({ item, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-200 px-3 py-1 text-xs font-medium text-base-content/70 ${className}`}
    >
      <Clock className="h-3.5 w-3.5 text-accent" />
      {textoEscopo(item)}
    </span>
  );
}
```

- [ ] **Step 2: Reescrever `src/data/solucoes.js` para derivar do catálogo**

O arquivo deixa de ter conteúdo próprio. Assim a home e os exemplares nunca divergem. Substitua **todo** o conteúdo por:

```js
import { buscarItem } from "./catalogo.js";

// As 4 soluções em destaque na home. O conteúdo mora em catalogo.js —
// aqui só escolhemos quais aparecem e em que ordem.
const DESTAQUES = ["site-institucional", "landing-page", "sistema-gestao", "nota-fiscal"];

export const SOLUCOES = DESTAQUES.map(buscarItem);
```

- [ ] **Step 3: Adaptar `src/components/Solucoes.jsx` ao novo formato**

Os campos mudaram: `sol.itens` virou `sol.entregaveis` e `sol.icon` virou `sol.icone`. O catálogo traz 5 entregáveis por item e o card da home comporta 3, então corte com `slice(0, 3)`.

Faça exatamente três alterações no arquivo:

1. Na linha `const Icon = sol.icon;` — troque para:

```jsx
            const Icon = sol.icone;
```

2. Adicione o selo de escopo logo depois do `<p>` do resumo. Importe o componente no topo do arquivo:

```jsx
import SeloEscopo from "./SeloEscopo.jsx";
```

e insira, imediatamente após a linha `<p className="mt-2 text-sm text-base-content/70">{sol.resumo}</p>`:

```jsx
                <SeloEscopo item={sol} className="mt-4 self-start" />
```

3. Na lista de entregáveis, troque `sol.itens.map((item) => (` por:

```jsx
                  {sol.entregaveis.slice(0, 3).map((item) => (
```

- [ ] **Step 4: Remover os preços de `src/data/planos.js`**

Substitua **todo** o conteúdo do arquivo por:

```js
// Planos de entrada, sem preço: toda cotação é feita manualmente, caso a caso,
// depois de entender o escopo do cliente. Os cards comunicam o que está incluso.
export const PLANOS = [
  {
    nome: "Presença",
    resumo: "Para começar a ser encontrado e passar profissionalismo.",
    beneficios: [
      "Landing page profissional",
      "Domínio gerenciado no seu nome",
      "E-mail profissional (Google Workspace)",
      "Manutenção e monitoramento básicos",
    ],
    cta: "Quero começar",
    destaque: false,
    selo: null,
  },
  {
    nome: "Profissional",
    resumo: "O combo completo para quem quer presença séria e sem dor de cabeça.",
    beneficios: [
      "Site institucional completo",
      "E-mail profissional (Google Workspace)",
      "Domínio gerenciado no seu nome",
      "Manutenção mensal completa",
      "Ajustes e melhorias inclusos",
    ],
    cta: "Falar sobre o Profissional",
    destaque: true,
    selo: "Mais escolhido",
  },
  {
    nome: "Sistema",
    resumo: "Sistema de gestão sob medida com sustentação total.",
    beneficios: [
      "Software sob medida para o seu processo",
      "Site + e-mail incluídos",
      "Sustentação completa e suporte dedicado",
      "Monitoramento 24/7 com alertas",
      "Um único responsável por tudo",
    ],
    cta: "Solicitar orçamento",
    destaque: false,
    selo: null,
  },
];

// Redutores de risco exibidos abaixo dos planos.
export const GARANTIAS = [
  "Sem fidelidade",
  "Sustentação inclusa em todo projeto",
  "Suporte direto com quem desenvolve",
];
```

- [ ] **Step 5: Trocar o bloco de preço em `src/components/Planos.jsx`**

Substitua o bloco inteiro que renderiza o preço — as linhas que vão de `<div className="mt-5 flex items-end gap-1.5">` até o `</div>` que a fecha — por:

```jsx
                <div className="mt-5 flex flex-col gap-1">
                  <span className="font-display text-2xl font-bold text-base-content">
                    Sob consulta
                  </span>
                  <span className="text-xs text-base-content/60">
                    Orçamento feito sob medida, depois de entender o seu negócio
                  </span>
                </div>
```

E troque o `subtitle` do `SectionHeading`, que hoje fala de valores:

```jsx
          subtitle="Cada orçamento é feito sob medida, depois de entender o seu negócio."
```

- [ ] **Step 6: Verificar que nenhum preço sobrou**

```bash
grep -rn 'R\$' src/ ; echo "saida-acima-deve-estar-vazia"
```

Esperado: apenas a linha `saida-acima-deve-estar-vazia`. Se aparecer qualquer arquivo, remova o valor antes de seguir.

- [ ] **Step 7: Rodar lint, testes e build**

```bash
npm run lint && npm test && npm run build
```

Esperado: lint sem saída, 20 testes passando, build gerando `dist/` sem erro.

- [ ] **Step 8: Conferir a home no navegador**

```bash
npm run dev
```

Abra `http://localhost:5173` e confirme: a seção Soluções mostra 4 cards com selo de escopo e 3 entregáveis cada; a seção Planos mostra "Sob consulta" nos três cards; nenhum valor em reais aparece na página. Encerre com `Ctrl+C`.

- [ ] **Step 9: Commit**

```bash
git add src/data/planos.js src/data/solucoes.js src/components/Planos.jsx src/components/Solucoes.jsx src/components/SeloEscopo.jsx
git commit -m "refactor: remove precos e deriva solucoes do catalogo"
```

---

## Task 3: Layouts, rotas e o índice dos exemplares

Ao final desta tarefa `/exemplos` funciona e mostra três cards; as rotas dos exemplares existem com páginas mínimas, preenchidas nas tarefas seguintes.

**Files:**
- Create: `src/layouts/SiteLayout.jsx`
- Create: `src/layouts/ExemplarLayout.jsx`
- Create: `src/components/FaixaExemplar.jsx`
- Create: `src/components/CardCatalogo.jsx`
- Create: `src/exemplos/IndiceExemplos.jsx`
- Create: `src/exemplos/NaoEncontrado.jsx`
- Modify: `src/App.jsx` (rotas aninhadas)
- Modify: `src/components/SEO.jsx` (prop `noindex`)

**Interfaces:**
- Consumes: `CATALOGO`, `buscarItem`, `textoEscopo` (Task 1); `SeloEscopo` (Task 2)
- Produces:
  - `SEO({ title, description, path, noindex })` — `noindex` default `false`
  - `CardCatalogo({ item, para, children })` — `para` é a rota do link; `children` é o slot de ação (botão)
  - `NaoEncontrado({ voltarPara, rotulo })`
  - Rotas: `/exemplos`, `/exemplos/landing`, `/exemplos/site/*`, `/exemplos/loja/*`

- [ ] **Step 1: Adicionar a prop `noindex` ao SEO**

Em `src/components/SEO.jsx`, altere a assinatura e acrescente a meta tag. Troque a linha da função por:

```jsx
export default function SEO({ title, description, path = "/", noindex = false }) {
```

E acrescente, dentro do `<Helmet>`, logo depois da linha do `<meta name="description" ... />`:

```jsx
      {noindex && <meta name="robots" content="noindex, follow" />}
```

O `follow` é intencional: não queremos a página indexada, mas queremos que os links dela para o site real tenham valor.

- [ ] **Step 2: Extrair o `SiteLayout`**

Crie `src/layouts/SiteLayout.jsx` com o chrome que hoje está solto no `App.jsx`:

```jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// Chrome do site real da ogis.cloud.
export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Criar a faixa de exemplar**

Ela deixa claro para o cliente que aquilo é uma demonstração, sem competir com o conteúdo. Crie `src/components/FaixaExemplar.jsx`:

```jsx
import { Link } from "react-router-dom";
import { ArrowLeft, FlaskConical } from "lucide-react";

// Barra fixa no topo dos exemplares. Fica acima de todo o chrome de cada
// demonstração, por isso os cabeçalhos dos exemplares começam abaixo dela.
export default function FaixaExemplar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-primary/30 bg-primary/10 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-base-content/80">
          <FlaskConical className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span>
            <strong className="font-semibold text-base-content">Exemplar OGIS</strong>
            <span className="hidden sm:inline"> · demonstração navegável, feita pela ogis.cloud</span>
          </span>
        </span>
        <Link
          to="/"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-primary transition-colors duration-200 hover:bg-primary/15"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar ao site
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Criar o `ExemplarLayout`**

Crie `src/layouts/ExemplarLayout.jsx`. Ele só entrega a faixa — o cabeçalho e o rodapé são de cada exemplar:

```jsx
import { Outlet } from "react-router-dom";
import FaixaExemplar from "../components/FaixaExemplar.jsx";

// Chrome mínimo dos exemplares: a faixa de demonstração e nada mais.
// O pt-9 compensa a altura da faixa fixa.
export default function ExemplarLayout() {
  return (
    <div className="min-h-screen bg-base-200 pt-9 text-base-content">
      <FaixaExemplar />
      <Outlet />
    </div>
  );
}
```

- [ ] **Step 5: Criar a página 404 dos exemplares**

Crie `src/exemplos/NaoEncontrado.jsx`:

```jsx
import { Link } from "react-router-dom";
import { SearchX, ArrowLeft } from "lucide-react";

export default function NaoEncontrado({ voltarPara = "/exemplos", rotulo = "Ver os exemplares" }) {
  return (
    <section id="nao-encontrado" className="mx-auto max-w-2xl px-5 py-28 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-base-300 text-base-content/50">
        <SearchX className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-base-content">Página não encontrada</h1>
      <p className="mt-4 text-base-content/70">
        O endereço que você abriu não existe neste exemplar. Ele pode ter mudado de nome.
      </p>
      <Link
        to={voltarPara}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
      >
        <ArrowLeft className="h-4 w-4" />
        {rotulo}
      </Link>
    </section>
  );
}
```

- [ ] **Step 6: Criar o card de catálogo reutilizável**

Usado pelo institucional e pela loja. O `children` é o slot de ação: no institucional fica vazio, na loja recebe o botão de adicionar. Crie `src/components/CardCatalogo.jsx`:

```jsx
import { Link } from "react-router-dom";
import SeloEscopo from "./SeloEscopo.jsx";

export default function CardCatalogo({ item, para, children }) {
  const Icone = item.icone;

  return (
    <article
      className={`group relative flex flex-col rounded-2xl border bg-base-100 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        item.destaque ? "border-primary/40 shadow-lg" : "border-base-300"
      }`}
    >
      {item.badge && (
        <span className="absolute right-4 top-4 rounded-full bg-base-300 px-2.5 py-1 text-xs font-medium text-base-content/70">
          {item.badge}
        </span>
      )}

      <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icone className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-base-content">
        <Link to={para} className="transition-colors duration-200 hover:text-primary">
          <span className="absolute inset-0" aria-hidden="true" />
          {item.nome}
        </Link>
      </h3>

      <p className="mt-2 flex-1 text-sm text-base-content/70">{item.resumo}</p>
      <SeloEscopo item={item} className="mt-4 self-start" />

      {children && <div className="relative z-10 mt-5">{children}</div>}
    </article>
  );
}
```

O `<span className="absolute inset-0">` faz o card inteiro ser clicável; o `relative z-10` no slot de ação impede que ele cubra o botão.

- [ ] **Step 7: Criar o índice dos exemplares**

Crie `src/exemplos/IndiceExemplos.jsx`:

```jsx
import { Link } from "react-router-dom";
import { MousePointerClick, Layout, ShoppingBag, ArrowRight } from "lucide-react";
import SEO from "../components/SEO.jsx";
import Wordmark from "../components/Wordmark.jsx";

const EXEMPLARES = [
  {
    para: "/exemplos/landing",
    icone: MousePointerClick,
    nome: "Landing Page",
    resumo: "Página única de campanha, com um objetivo só: gerar contato.",
    detalhe: "Ideal para anúncio pago e lançamento de serviço.",
  },
  {
    para: "/exemplos/site",
    icone: Layout,
    nome: "Site Institucional",
    resumo: "Site completo, com várias páginas e navegação própria.",
    detalhe: "Ideal para credibilidade e para ser encontrado no Google.",
  },
  {
    para: "/exemplos/loja",
    icone: ShoppingBag,
    nome: "E-commerce",
    resumo: "Vitrine com busca, filtros e pedido de orçamento.",
    detalhe: "Ideal para quem tem catálogo e vende por orçamento.",
  },
];

export default function IndiceExemplos() {
  return (
    <>
      <SEO
        title="Exemplares"
        description="Três exemplares navegáveis feitos pela ogis.cloud: landing page, site institucional e e-commerce."
        path="/exemplos"
        noindex
      />

      <section id="exemplares" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Wordmark className="mx-auto h-8" />
          <h1 className="mt-8 text-3xl font-bold text-base-content sm:text-4xl">
            Veja funcionando antes de decidir
          </h1>
          <p className="mt-4 text-lg text-base-content/70">
            Três exemplares navegáveis, construídos por nós, com o conteúdo real da ogis.cloud.
            Clique, navegue e veja o que cada formato entrega.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {EXEMPLARES.map((ex) => {
            const Icone = ex.icone;
            return (
              <Link
                key={ex.para}
                to={ex.para}
                className="group flex flex-col rounded-2xl border border-base-300 bg-base-100 p-7 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icone className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-base-content">{ex.nome}</h2>
                <p className="mt-2 text-sm text-base-content/70">{ex.resumo}</p>
                <p className="mt-4 flex-1 text-sm text-base-content/50">{ex.detalhe}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Abrir exemplar
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mx-auto mt-14 max-w-xl text-center text-sm text-base-content/50">
          Nenhum dos exemplares mostra preço: cada orçamento é feito sob medida, depois de
          entender o seu negócio.
        </p>
      </section>
    </>
  );
}
```

- [ ] **Step 8: Reescrever o `App.jsx` com rotas aninhadas**

Substitua **todo** o conteúdo de `src/App.jsx`. As rotas dos exemplares apontam para componentes que só existirão nas Tasks 4, 5, 7 e 8 — por isso este passo é feito junto com o Step 9, que cria stubs temporários.

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import ExemplarLayout from "./layouts/ExemplarLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Termos from "./pages/Termos.jsx";
import Privacidade from "./pages/Privacidade.jsx";
import IndiceExemplos from "./exemplos/IndiceExemplos.jsx";
import NaoEncontrado from "./exemplos/NaoEncontrado.jsx";
import LandingExemplar from "./exemplos/landing/LandingExemplar.jsx";
import SiteExemplar from "./exemplos/site/SiteExemplar.jsx";
import LojaExemplar from "./exemplos/loja/LojaExemplar.jsx";

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

        {/* Exemplares — cada um traz o próprio cabeçalho e rodapé */}
        <Route element={<ExemplarLayout />}>
          <Route path="/exemplos" element={<IndiceExemplos />} />
          <Route path="/exemplos/landing" element={<LandingExemplar />} />
          <Route path="/exemplos/site/*" element={<SiteExemplar />} />
          <Route path="/exemplos/loja/*" element={<LojaExemplar />} />
          <Route path="/exemplos/*" element={<NaoEncontrado />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

`SiteExemplar` e `LojaExemplar` recebem `/*` porque têm rotas internas próprias, declaradas dentro deles.

- [ ] **Step 9: Criar stubs temporários dos três exemplares**

Para o build passar agora. Cada um será substituído na sua tarefa.

`src/exemplos/landing/LandingExemplar.jsx`:

```jsx
export default function LandingExemplar() {
  return <div className="p-20 text-center text-base-content/50">Landing exemplar — Task 4</div>;
}
```

`src/exemplos/site/SiteExemplar.jsx`:

```jsx
export default function SiteExemplar() {
  return <div className="p-20 text-center text-base-content/50">Site exemplar — Task 5</div>;
}
```

`src/exemplos/loja/LojaExemplar.jsx`:

```jsx
export default function LojaExemplar() {
  return <div className="p-20 text-center text-base-content/50">Loja exemplar — Tasks 6 a 8</div>;
}
```

- [ ] **Step 10: Rodar lint, testes e build**

```bash
npm run lint && npm test && npm run build
```

Esperado: tudo limpo.

- [ ] **Step 11: Conferir a navegação no navegador**

```bash
npm run dev
```

Confirme, em `http://localhost:5173`:
- `/` continua idêntica, com Navbar e Footer
- `/exemplos` mostra a faixa dourada no topo e três cards
- `/exemplos/landing`, `/exemplos/site` e `/exemplos/loja` mostram os stubs, com a faixa
- `/exemplos/qualquer-coisa` mostra a página "Página não encontrada"
- `/termos` continua funcionando

Encerre com `Ctrl+C`.

- [ ] **Step 12: Commit**

```bash
git add src/App.jsx src/layouts src/exemplos src/components/FaixaExemplar.jsx src/components/CardCatalogo.jsx src/components/SEO.jsx
git commit -m "feat: layouts separados e rotas dos exemplares"
```

---

## Task 4: Exemplar 1 — Landing page

Vende a **solução tecnológica da OGIS como um todo** — a operação digital inteira sob um único responsável — e não um item isolado do catálogo. Uma promessa, uma ação: agendar um diagnóstico. Todos os CTAs vão para o mesmo lugar.

**Files:**
- Create: `src/exemplos/landing/conteudo.js`
- Create: `src/exemplos/landing/secoes.jsx`
- Modify: `src/exemplos/landing/LandingExemplar.jsx` (substitui o stub)
- Modify: `src/config.js` (mensagem do diagnóstico)

**Interfaces:**
- Consumes: `CATEGORIAS` (Task 1); `SEO` (Task 3); `linkWhatsApp`, `MSG` (`src/config.js`)
- Produces: `MSG.diagnostico`, `ASSUNTO.diagnostico`; seções `HeroLanding`, `Problema`, `Pilares`, `Passos`, `ResponsavelUnico`, `Provas`, `Faq`, `CtaFinal`

- [ ] **Step 1: Adicionar a mensagem de diagnóstico ao config**

Em `src/config.js`, dentro do objeto `MSG`, acrescente:

```js
  diagnostico:
    "Olá! Vim pelo exemplar da ogis.cloud e quero agendar o diagnóstico gratuito da minha operação digital.",
```

E dentro de `ASSUNTO`:

```js
  diagnostico: "Diagnóstico gratuito — ogis.cloud",
```

- [ ] **Step 2: Criar o conteúdo da landing**

Separar copy de marcação deixa o texto fácil de ajustar sem mexer em JSX. Crie `src/exemplos/landing/conteudo.js`:

```js
// Copy da landing exemplar. A promessa é da OPERAÇÃO DIGITAL INTEIRA sob um
// único responsável — não de um produto isolado. Quem quer escolher item a
// item vai para a loja exemplar.

export const DORES = [
  {
    titulo: "Um fornecedor para cada coisa",
    texto:
      "O site foi um. O e-mail, outro. O sistema, um conhecido que sumiu. Quando dá problema, cada um culpa o outro e você fica no meio.",
  },
  {
    titulo: "Ninguém atende quando cai",
    texto:
      "O site sai do ar numa sexta à noite. Você descobre na segunda, pelo cliente que não conseguiu comprar.",
  },
  {
    titulo: "Você é refém de senhas que não tem",
    texto:
      "O domínio está no nome de terceiro, o e-mail em uma conta que ninguém acessa. Trocar de fornecedor virou risco.",
  },
  {
    titulo: "Nada conversa com nada",
    texto:
      "A mesma informação é digitada em três lugares. Uma hora os três discordam, e aí ninguém sabe qual está certo.",
  },
];

export const PASSOS = [
  {
    numero: "01",
    titulo: "Diagnóstico",
    texto:
      "Conversamos sobre como o seu negócio funciona hoje e o que já existe no ar. Sem compromisso e sem custo.",
  },
  {
    numero: "02",
    titulo: "Proposta",
    texto:
      "Você recebe o escopo por escrito, com prazo e o que está incluso. Nada de valor genérico de tabela.",
  },
  {
    numero: "03",
    titulo: "Implantação",
    texto:
      "Construímos e colocamos no ar, com plano de corte para não haver período fora do ar. Você acompanha.",
  },
  {
    numero: "04",
    titulo: "Sustentação",
    texto:
      "Depois que entra no ar, continuamos responsáveis: monitoramento, correções e as alterações do dia a dia.",
  },
];

export const PROVAS = [
  {
    numero: "1",
    rotulo: "Responsável",
    texto: "Uma pessoa responde por tudo — do domínio ao sistema.",
  },
  {
    numero: "24/7",
    rotulo: "Monitoramento",
    texto: "Somos avisados quando algo cai, antes do seu cliente.",
  },
  {
    numero: "0",
    rotulo: "Fidelidade",
    texto: "Sem contrato de permanência. Ficamos porque você quer.",
  },
];

export const FAQ = [
  {
    pergunta: "E se eu já tenho site e e-mail?",
    resposta:
      "Melhor ainda: partimos do que existe. Fazemos um diagnóstico do que já está no ar, apontamos o que vale manter e migramos o resto sem perder e-mail antigo e sem sair do ar.",
  },
  {
    pergunta: "Preciso contratar tudo de uma vez?",
    resposta:
      "Não. A maioria começa pelo que dói mais — normalmente presença digital ou e-mail profissional — e vai somando conforme o negócio pede. O escopo é seu.",
  },
  {
    pergunta: "Colocar tudo na mão de um fornecedor só não é arriscado?",
    resposta:
      "Seria, se você ficasse sem acesso ao que é seu. Por isso o domínio é sempre registrado no CNPJ da sua empresa, as contas de e-mail são suas e você tem as credenciais. Se um dia quiser sair, leva tudo.",
  },
  {
    pergunta: "Tem fidelidade ou multa de cancelamento?",
    resposta:
      "Não. Não existe contrato de permanência. Se você quiser encerrar, encerra — e ajudamos na transferência para quem for assumir.",
  },
  {
    pergunta: "Quanto custa?",
    resposta:
      "Depende do escopo, e por isso não publicamos tabela. Cada orçamento é montado depois do diagnóstico, em cima do que o seu negócio realmente precisa. O diagnóstico é gratuito.",
  },
  {
    pergunta: "Vocês atendem fora de Curitiba?",
    resposta:
      "Sim. A operação é remota e atendemos o Brasil inteiro. Curitiba é onde estamos e onde também atendemos presencialmente quando faz diferença.",
  },
];
```

- [ ] **Step 3: Criar as seções da landing**

Crie `src/exemplos/landing/secoes.jsx`. Todas as seções ficam neste arquivo porque são coesas — pertencem a uma página só e mudam juntas.

```jsx
import { ArrowRight, Check, AlertTriangle, ShieldCheck, MessageCircle } from "lucide-react";
import { CATEGORIAS } from "../../data/catalogo.js";
import { linkWhatsApp, MSG } from "../../config.js";
import Wordmark from "../../components/Wordmark.jsx";
import { DORES, PASSOS, PROVAS, FAQ } from "./conteudo.js";

// Ação única de toda a página. Todo CTA aponta para cá.
export function BotaoDiagnostico({ children = "Agendar diagnóstico gratuito", grande = false }) {
  return (
    <a
      href={linkWhatsApp(MSG.diagnostico)}
      target="_blank"
      rel="noopener noreferrer"
      className={`glow-gold inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5 ${
        grande ? "px-7 py-4 text-base" : "px-5 py-3 text-sm"
      }`}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

export function CabecalhoLanding() {
  return (
    <header className="sticky top-9 z-40 border-b border-base-300 bg-base-100/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Wordmark className="h-7" />
        <BotaoDiagnostico>Falar agora</BotaoDiagnostico>
      </div>
    </header>
  );
}

export function HeroLanding() {
  return (
    <section id="topo" className="relative overflow-hidden bg-neutral text-neutral-content">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 65%)" }}
      />
      <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-20 text-center sm:pb-28 sm:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-neutral-content/15 bg-neutral-content/5 px-4 py-1.5 text-xs font-medium text-neutral-content/80">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Operação digital completa · um único responsável
        </span>

        <h1 className="mt-6 text-4xl font-bold leading-[1.1] sm:text-5xl md:text-6xl">
          Sua empresa inteira funcionando online, sob a responsabilidade de{" "}
          <span className="text-gradient-gold">uma pessoa só.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-content/70">
          Site, e-mail profissional, sistema de gestão e suporte. Em vez de quatro fornecedores que
          se culpam entre si, um número de telefone que resolve.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <BotaoDiagnostico grande />
          <a
            href="#pilares"
            className="cursor-pointer rounded-xl border border-neutral-content/20 px-6 py-4 text-base font-semibold text-neutral-content/80 transition-colors duration-200 hover:border-primary/50 hover:text-neutral-content"
          >
            Ver o que está incluso
          </a>
        </div>

        <p className="mt-6 text-sm text-neutral-content/50">
          Diagnóstico sem custo e sem compromisso · sem fidelidade
        </p>
      </div>
    </section>
  );
}

export function Problema() {
  return (
    <section id="problema" className="bg-base-200 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            O problema
          </span>
          <h2 className="mt-2 text-3xl font-bold text-base-content sm:text-4xl">
            Ninguém contrata quatro fornecedores por vontade própria
          </h2>
          <p className="mt-4 text-lg text-base-content/70">
            Acontece aos poucos, cada um resolvendo uma urgência. Até o dia em que dá problema e
            não há ninguém responsável pelo conjunto.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {DORES.map((dor) => (
            <div
              key={dor.titulo}
              className="flex gap-4 rounded-2xl border border-base-300 bg-base-100 p-6"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
              <div>
                <h3 className="font-semibold text-base-content">{dor.titulo}</h3>
                <p className="mt-2 text-sm text-base-content/70">{dor.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pilares() {
  return (
    <section id="pilares" className="bg-base-100 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            A solução
          </span>
          <h2 className="mt-2 text-3xl font-bold text-base-content sm:text-4xl">
            Quatro frentes, um responsável
          </h2>
          <p className="mt-4 text-lg text-base-content/70">
            Não é um serviço avulso: é a sua operação digital inteira, cuidada por quem responde
            pelo conjunto.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {CATEGORIAS.map((cat) => {
            const Icone = cat.icone;
            return (
              <div
                key={cat.slug}
                className="flex gap-5 rounded-2xl border border-base-300 bg-base-200 p-7"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-base-content">{cat.nome}</h3>
                  <p className="mt-2 text-sm text-base-content/70">{cat.promessa}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-base-content/60">
          Você não precisa de tudo no primeiro dia. Começamos pelo que dói mais.
        </p>
      </div>
    </section>
  );
}

export function Passos() {
  return (
    <section id="como-funciona" className="bg-base-200 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Como funciona
          </span>
          <h2 className="mt-2 text-3xl font-bold text-base-content sm:text-4xl">
            Do primeiro contato à sustentação
          </h2>
        </div>

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map((passo) => (
            <li
              key={passo.numero}
              className="rounded-2xl border border-base-300 bg-base-100 p-6"
            >
              <span className="font-display text-3xl font-bold text-primary/40">{passo.numero}</span>
              <h3 className="mt-3 font-semibold text-base-content">{passo.titulo}</h3>
              <p className="mt-2 text-sm text-base-content/70">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ResponsavelUnico() {
  const GARANTIAS = [
    "O domínio é registrado no CNPJ da sua empresa, sempre",
    "As contas de e-mail são suas, com as credenciais na sua mão",
    "Sem contrato de permanência e sem multa de cancelamento",
    "Se quiser sair, ajudamos na transferência para quem assumir",
  ];

  return (
    <section id="responsavel-unico" className="bg-base-100 py-20 sm:py-24">
      <div className="mx-auto grid max-w-5xl gap-12 px-5 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            A objeção honesta
          </span>
          <h2 className="mt-2 text-3xl font-bold text-base-content sm:text-4xl">
            &ldquo;Não é arriscado depender de um fornecedor só?&rdquo;
          </h2>
          <p className="mt-5 text-base-content/70">
            Seria, se depender significasse ficar sem acesso ao que é seu. É exatamente isso que
            acontece quando o domínio está no nome do fornecedor e ninguém sabe a senha do e-mail.
          </p>
          <p className="mt-4 text-base-content/70">
            Trabalhamos ao contrário: tudo o que é da sua empresa fica no nome da sua empresa.
            Você fica com um responsável — não com uma corda no pescoço.
          </p>
        </div>

        <ul className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-base-200 p-7">
          {GARANTIAS.map((g) => (
            <li key={g} className="flex items-start gap-3 text-sm text-base-content/80">
              <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-success" />
              {g}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Provas() {
  return (
    <section id="provas" className="bg-neutral py-16 text-neutral-content">
      <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:grid-cols-3">
        {PROVAS.map((prova) => (
          <div key={prova.rotulo} className="text-center">
            <span className="font-display text-4xl font-bold text-primary">{prova.numero}</span>
            <h3 className="mt-2 text-sm font-semibold uppercase tracking-wider text-neutral-content/80">
              {prova.rotulo}
            </h3>
            <p className="mt-2 text-sm text-neutral-content/60">{prova.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="bg-base-200 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="text-center text-3xl font-bold text-base-content sm:text-4xl">
          Perguntas que sempre aparecem
        </h2>

        <div className="mt-12 flex flex-col gap-3">
          {FAQ.map((item) => (
            <details
              key={item.pergunta}
              className="group rounded-2xl border border-base-300 bg-base-100 p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-base-content">
                {item.pergunta}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl leading-none text-primary transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-base-content/70">{item.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaFinal() {
  return (
    <section id="contato" className="bg-base-100 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <h2 className="text-3xl font-bold text-base-content sm:text-4xl">
          Comece pelo diagnóstico. É gratuito.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-base-content/70">
          Uma conversa de trinta minutos sobre como a sua empresa funciona hoje. Ao final você sabe
          o que vale mexer, o que vale manter e em que ordem — mesmo que não contrate nada.
        </p>

        <div className="mt-9 flex justify-center">
          <BotaoDiagnostico grande />
        </div>

        <p className="mt-6 inline-flex items-center gap-2 text-sm text-base-content/50">
          <MessageCircle className="h-4 w-4" />
          Resposta no mesmo dia útil
        </p>
      </div>
    </section>
  );
}

export function RodapeLanding() {
  return (
    <footer className="border-t border-base-300 bg-base-200 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 text-center">
        <Wordmark className="h-7" />
        <p className="text-xs text-base-content/50">
          Exemplar de landing page construído pela ogis.cloud · Curitiba/PR
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Compor a página**

Substitua o stub `src/exemplos/landing/LandingExemplar.jsx` por:

```jsx
import SEO from "../../components/SEO.jsx";
import {
  CabecalhoLanding,
  HeroLanding,
  Problema,
  Pilares,
  Passos,
  ResponsavelUnico,
  Provas,
  Faq,
  CtaFinal,
  RodapeLanding,
} from "./secoes.jsx";

export default function LandingExemplar() {
  return (
    <>
      <SEO
        title="Exemplar — Landing Page"
        description="Exemplar de landing page construído pela ogis.cloud: uma página, uma promessa, uma ação."
        path="/exemplos/landing"
        noindex
      />
      <CabecalhoLanding />
      <main>
        <HeroLanding />
        <Problema />
        <Pilares />
        <Passos />
        <ResponsavelUnico />
        <Provas />
        <Faq />
        <CtaFinal />
      </main>
      <RodapeLanding />
    </>
  );
}
```

- [ ] **Step 5: Rodar lint, testes e build**

```bash
npm run lint && npm test && npm run build
```

Esperado: tudo limpo. `secoes.jsx` exporta **só componentes** (todos nomeados), que é o que a regra `react-refresh/only-export-components` exige — ela dispara quando um arquivo mistura componente com valor que não é componente. Se houver aviso mesmo assim, mova o valor não-componente para um `.js` separado; não use `eslint-disable`.

- [ ] **Step 6: Conferir no navegador**

```bash
npm run dev
```

Em `http://localhost:5173/exemplos/landing`, confirme:
- a faixa de exemplar aparece no topo e o cabeçalho da landing gruda logo abaixo dela ao rolar
- todos os botões de CTA abrem o WhatsApp com a mensagem de diagnóstico
- o FAQ abre e fecha ao clicar, e o sinal de `+` gira
- em viewport de 375px nada estoura a largura da tela

Encerre com `Ctrl+C`.

- [ ] **Step 7: Commit**

```bash
git add src/exemplos/landing src/config.js
git commit -m "feat: exemplar de landing page da solucao completa"
```

---

## Task 5: Exemplar 2 — Site institucional

Multi-página, com navegação persistente. É o exemplar que demonstra profundidade.

**Files:**
- Create: `src/exemplos/site/ChromeSite.jsx`
- Create: `src/exemplos/site/SiteHome.jsx`
- Create: `src/exemplos/site/SiteSobre.jsx`
- Create: `src/exemplos/site/SiteSolucoes.jsx`
- Create: `src/exemplos/site/SiteSolucao.jsx`
- Create: `src/exemplos/site/SiteContato.jsx`
- Modify: `src/exemplos/site/SiteExemplar.jsx` (substitui o stub, declara as rotas internas)

**Interfaces:**
- Consumes: `CATEGORIAS`, `CATALOGO`, `buscarItem`, `itensPorCategoria`, `relacionados` (Task 1); `SeloEscopo` (Task 2); `CardCatalogo`, `NaoEncontrado`, `SEO` (Task 3)
- Produces: rotas internas `/exemplos/site`, `/sobre`, `/solucoes`, `/solucoes/:slug`, `/contato`

- [ ] **Step 1: Criar o chrome do institucional**

Cabeçalho com navegação persistente e estado ativo, mais o rodapé com mapa do site. Crie `src/exemplos/site/ChromeSite.jsx`:

```jsx
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Mail, MessageCircle, MapPin } from "lucide-react";
import { BRAND, linkWhatsApp, linkEmail, MSG, ASSUNTO } from "../../config.js";
import Wordmark from "../../components/Wordmark.jsx";

const PAGINAS = [
  { para: "/exemplos/site", rotulo: "Início", exata: true },
  { para: "/exemplos/site/sobre", rotulo: "Sobre" },
  { para: "/exemplos/site/solucoes", rotulo: "Soluções" },
  { para: "/exemplos/site/contato", rotulo: "Contato" },
];

function classesLink({ isActive }) {
  return `text-sm font-medium transition-colors duration-200 ${
    isActive ? "text-primary" : "text-base-content/70 hover:text-base-content"
  }`;
}

export function CabecalhoSite() {
  const [aberto, setAberto] = useState(false);

  return (
    <header className="sticky top-9 z-40 border-b border-base-300 bg-base-100/85 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5"
        aria-label="Principal"
      >
        <Link to="/exemplos/site" aria-label="Início">
          <Wordmark className="h-7" />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {PAGINAS.map((p) => (
            <li key={p.para}>
              <NavLink to={p.para} end={p.exata} className={classesLink}>
                {p.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <a
            href={linkWhatsApp(MSG.contato)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden cursor-pointer rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5 sm:inline-block"
          >
            Fale com a gente
          </a>
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl text-base-content/70 transition-colors duration-200 hover:bg-base-200 md:hidden"
          >
            {aberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {aberto && (
        <ul className="flex flex-col border-t border-base-300 px-3 py-2 md:hidden">
          {PAGINAS.map((p) => (
            <li key={p.para}>
              <NavLink
                to={p.para}
                end={p.exata}
                onClick={() => setAberto(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-base-content/80 transition-colors duration-200 hover:bg-base-200"
              >
                {p.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

export function RodapeSite() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark className="h-8" />
            <p className="mt-4 max-w-xs text-sm text-base-content/70">{BRAND.tagline}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-base-content/60">
              <MapPin className="h-4 w-4" />
              {BRAND.cidade}
            </p>
          </div>

          <nav aria-label="Mapa do site">
            <h2 className="text-sm font-semibold text-base-content">Mapa do site</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {PAGINAS.map((p) => (
                <li key={p.para}>
                  <Link
                    to={p.para}
                    className="text-sm text-base-content/70 transition-colors duration-200 hover:text-primary"
                  >
                    {p.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-base-content">Fale com a gente</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a
                  href={linkWhatsApp(MSG.contato)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-base-content/70 transition-colors duration-200 hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={linkEmail(ASSUNTO.contato, MSG.contato)}
                  className="inline-flex items-center gap-2 text-sm text-base-content/70 transition-colors duration-200 hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                  {BRAND.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-base-300 pt-6 text-xs text-base-content/50">
          © {ano} {BRAND.name} · Exemplar de site institucional construído pela ogis.cloud
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Criar a home do institucional**

Crie `src/exemplos/site/SiteHome.jsx`:

```jsx
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { CATEGORIAS, CATALOGO } from "../../data/catalogo.js";
import { linkWhatsApp, MSG } from "../../config.js";
import CardCatalogo from "../../components/CardCatalogo.jsx";
import SEO from "../../components/SEO.jsx";

const DIFERENCIAIS = [
  "Um único responsável, do domínio ao suporte",
  "Domínio e contas sempre no nome da sua empresa",
  "Monitoramento 24/7 com alerta automático",
  "Sem fidelidade e sem multa de cancelamento",
];

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

      <section id="topo" className="relative overflow-hidden bg-neutral text-neutral-content">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-0 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 65%)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold leading-[1.15] sm:text-5xl">
              Tecnologia que funciona,{" "}
              <span className="text-gradient-gold">sem você precisar entender dela.</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-content/70">
              Somos a empresa que cuida da parte digital do seu negócio: site, e-mail profissional,
              sistemas sob medida e a sustentação de tudo isso. Você fala com uma pessoa só.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={linkWhatsApp(MSG.contato)}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-gold inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
              >
                Falar no WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/exemplos/site/solucoes"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-content/20 px-6 py-3.5 text-base font-semibold text-neutral-content/80 transition-colors duration-200 hover:border-primary/50 hover:text-neutral-content"
              >
                Conhecer as soluções
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="frentes" className="bg-base-200 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-3xl font-bold text-base-content sm:text-4xl">
            Quatro frentes, um responsável
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIAS.map((cat) => {
              const Icone = cat.icone;
              return (
                <Link
                  key={cat.slug}
                  to="/exemplos/site/solucoes"
                  className="group rounded-2xl border border-base-300 bg-base-100 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icone className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-semibold text-base-content">{cat.nome}</h3>
                  <p className="mt-2 text-sm text-base-content/70">{cat.promessa}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="destaques" className="bg-base-100 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-3xl font-bold text-base-content sm:text-4xl">
            O que mais nos procuram
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {destaques.map((item) => (
              <CardCatalogo
                key={item.slug}
                item={item}
                para={`/exemplos/site/solucoes/${item.slug}`}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/exemplos/site/solucoes"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-200 hover:text-accent"
            >
              Ver todas as soluções
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="diferenciais" className="bg-base-200 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-base-content sm:text-4xl">
              Por que trabalhar com a gente
            </h2>
            <p className="mt-5 text-base-content/70">
              A maior parte dos problemas que encontramos não é falta de tecnologia — é falta de
              alguém responsável. Nosso trabalho é ser esse alguém.
            </p>
          </div>
          <ul className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-7">
            {DIFERENCIAIS.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm text-base-content/80">
                <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-success" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Criar a página Sobre**

Crie `src/exemplos/site/SiteSobre.jsx`:

```jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
        <div className="mx-auto max-w-3xl px-5">
          <h1 className="text-4xl font-bold text-base-content sm:text-5xl">Quem somos</h1>
          <p className="mt-6 text-lg text-base-content/70">{BRAND.tagline}</p>
          <div className="mt-8 flex flex-col gap-5 text-base-content/70">
            <p>
              A ogis.cloud nasceu de uma constatação simples: pequenas e médias empresas não têm
              problema de tecnologia — têm problema de responsabilidade. Sobra fornecedor e falta
              alguém que responda pelo conjunto.
            </p>
            <p>
              Trabalhamos com empresas de {BRAND.cidade} e de todo o Brasil que já passaram por
              aquele ciclo: um site feito por alguém que sumiu, um e-mail configurado às pressas, um
              sistema que ninguém mais mantém. Nosso trabalho começa arrumando o que existe e
              continua garantindo que continue funcionando.
            </p>
            <p>
              Não vendemos horas nem pacote fechado de prateleira. Entendemos o processo, propomos o
              escopo por escrito e ficamos responsáveis pela sustentação depois que entra no ar.
            </p>
          </div>
        </div>
      </section>

      <section id="principios" className="bg-base-200 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-3xl font-bold text-base-content sm:text-4xl">Como trabalhamos</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {PRINCIPIOS.map((p) => (
              <div key={p.titulo} className="rounded-2xl border border-base-300 bg-base-100 p-7">
                <h3 className="text-lg font-semibold text-base-content">{p.titulo}</h3>
                <p className="mt-3 text-sm text-base-content/70">{p.texto}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/exemplos/site/contato"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
            >
              Conversar com a gente
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Criar a listagem de soluções**

Crie `src/exemplos/site/SiteSolucoes.jsx`:

```jsx
import { CATEGORIAS, itensPorCategoria } from "../../data/catalogo.js";
import CardCatalogo from "../../components/CardCatalogo.jsx";
import SEO from "../../components/SEO.jsx";

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
            <h1 className="text-4xl font-bold text-base-content sm:text-5xl">Soluções</h1>
            <p className="mt-6 text-lg text-base-content/70">
              Tudo o que fazemos, agrupado pelas quatro frentes que sustentam a operação digital de
              um negócio. Cada orçamento é feito sob medida.
            </p>
          </div>

          {CATEGORIAS.map((cat) => {
            const Icone = cat.icone;
            const itens = itensPorCategoria(cat.slug);
            return (
              <div key={cat.slug} className="mt-16">
                <div className="flex items-center gap-4 border-b border-base-300 pb-5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icone className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-base-content">{cat.nome}</h2>
                    <p className="text-sm text-base-content/60">{cat.promessa}</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {itens.map((item) => (
                    <CardCatalogo
                      key={item.slug}
                      item={item}
                      para={`/exemplos/site/solucoes/${item.slug}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 5: Criar a página de detalhe da solução**

Crie `src/exemplos/site/SiteSolucao.jsx`:

```jsx
import { useParams, Link } from "react-router-dom";
import { Check, ArrowLeft, ArrowRight, Target } from "lucide-react";
import { buscarItem, buscarCategoria, relacionados } from "../../data/catalogo.js";
import { linkWhatsApp } from "../../config.js";
import SeloEscopo from "../../components/SeloEscopo.jsx";
import CardCatalogo from "../../components/CardCatalogo.jsx";
import NaoEncontrado from "../NaoEncontrado.jsx";
import SEO from "../../components/SEO.jsx";

export default function SiteSolucao() {
  const { slug } = useParams();
  const item = buscarItem(slug);

  if (!item) {
    return (
      <NaoEncontrado voltarPara="/exemplos/site/solucoes" rotulo="Ver todas as soluções" />
    );
  }

  const categoria = buscarCategoria(item.categoria);
  const outros = relacionados(item.slug);
  const Icone = item.icone;
  const mensagem = `Olá! Vim pelo site da ogis.cloud e quero saber mais sobre "${item.nome}".`;

  return (
    <>
      <SEO
        title={`Exemplar — ${item.nome}`}
        description={item.resumo}
        path={`/exemplos/site/solucoes/${item.slug}`}
        noindex
      />

      <article className="bg-base-100 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5">
          <Link
            to="/exemplos/site/solucoes"
            className="inline-flex items-center gap-2 text-sm text-base-content/60 transition-colors duration-200 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Todas as soluções
          </Link>

          <div className="mt-8 flex items-start gap-5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Icone className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                {categoria.nome}
              </p>
              <h1 className="mt-1 text-3xl font-bold text-base-content sm:text-4xl">{item.nome}</h1>
            </div>
          </div>

          <p className="mt-6 text-lg text-base-content/80">{item.resumo}</p>
          <SeloEscopo item={item} className="mt-5" />

          <p className="mt-8 leading-relaxed text-base-content/70">{item.descricao}</p>

          <h2 className="mt-12 text-xl font-semibold text-base-content">O que está incluso</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {item.entregaveis.map((e) => (
              <li key={e} className="flex items-start gap-3 text-base-content/80">
                <Check className="mt-1 h-4.5 w-4.5 shrink-0 text-success" />
                {e}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-base-300 bg-base-200 p-6">
            <Target className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <h2 className="font-semibold text-base-content">Ideal para</h2>
              <p className="mt-1 text-sm text-base-content/70">{item.idealPara}</p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-primary/30 bg-base-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-base-content">
              Quer saber se faz sentido para o seu negócio?
            </h2>
            <p className="mt-3 text-sm text-base-content/70">
              O orçamento é feito sob medida, depois de entender o seu caso.
            </p>
            <a
              href={linkWhatsApp(mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
            >
              Solicitar orçamento
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {outros.length > 0 && (
          <div className="mx-auto mt-20 max-w-6xl px-5">
            <h2 className="text-2xl font-bold text-base-content">Também em {categoria.nome}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {outros.map((outro) => (
                <CardCatalogo
                  key={outro.slug}
                  item={outro}
                  para={`/exemplos/site/solucoes/${outro.slug}`}
                />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
```

- [ ] **Step 6: Criar a página de contato**

Crie `src/exemplos/site/SiteContato.jsx`. O formulário não envia para servidor: ele monta a mensagem e abre o WhatsApp.

```jsx
import { useState } from "react";
import { MessageCircle, Mail, MapPin, ArrowRight } from "lucide-react";
import { BRAND, linkWhatsApp, linkEmail, MSG, ASSUNTO } from "../../config.js";
import SEO from "../../components/SEO.jsx";

export default function SiteContato() {
  const [form, setForm] = useState({ nome: "", empresa: "", mensagem: "" });

  const alterar = (campo) => (evento) =>
    setForm((atual) => ({ ...atual, [campo]: evento.target.value }));

  const texto = [
    "Olá! Vim pelo site da ogis.cloud.",
    form.nome && `Nome: ${form.nome}`,
    form.empresa && `Empresa: ${form.empresa}`,
    form.mensagem && `Mensagem: ${form.mensagem}`,
  ]
    .filter(Boolean)
    .join("\n");

  const campo =
    "w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-sm text-base-content outline-none transition-colors duration-200 placeholder:text-base-content/40 focus:border-primary";

  return (
    <>
      <SEO
        title="Exemplar — Contato"
        description="Página de contato do exemplar de site institucional da ogis.cloud."
        path="/exemplos/site/contato"
        noindex
      />

      <section id="contato" className="bg-base-100 py-20 sm:py-28">
        <div className="mx-auto grid max-w-5xl gap-14 px-5 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold text-base-content sm:text-5xl">Fale com a gente</h1>
            <p className="mt-6 text-lg text-base-content/70">
              Conte o que está acontecendo hoje no seu negócio. Respondemos no mesmo dia útil.
            </p>

            <ul className="mt-10 flex flex-col gap-5">
              <li>
                <a
                  href={linkWhatsApp(MSG.contato)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-200 p-5 transition-colors duration-200 hover:border-primary/40"
                >
                  <MessageCircle className="h-5 w-5 shrink-0 text-primary" />
                  <span>
                    <span className="block font-semibold text-base-content">WhatsApp</span>
                    <span className="block text-sm text-base-content/60">
                      O canal mais rápido para falar conosco
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={linkEmail(ASSUNTO.contato, MSG.contato)}
                  className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-200 p-5 transition-colors duration-200 hover:border-primary/40"
                >
                  <Mail className="h-5 w-5 shrink-0 text-primary" />
                  <span>
                    <span className="block font-semibold text-base-content">E-mail</span>
                    <span className="block text-sm text-base-content/60">{BRAND.email}</span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-4 rounded-2xl border border-base-300 p-5">
                <MapPin className="h-5 w-5 shrink-0 text-accent" />
                <span>
                  <span className="block font-semibold text-base-content">Onde estamos</span>
                  <span className="block text-sm text-base-content/60">
                    {BRAND.cidade} · atendimento remoto para todo o Brasil
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-200 p-7"
          >
            <h2 className="text-lg font-semibold text-base-content">Prefere escrever?</h2>
            <p className="-mt-2 text-sm text-base-content/60">
              Preencha e continue a conversa no WhatsApp, com tudo já escrito.
            </p>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-base-content/80">Seu nome</span>
              <input
                type="text"
                value={form.nome}
                onChange={alterar("nome")}
                placeholder="Como podemos te chamar"
                className={campo}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-base-content/80">Empresa</span>
              <input
                type="text"
                value={form.empresa}
                onChange={alterar("empresa")}
                placeholder="Nome do seu negócio"
                className={campo}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-base-content/80">Mensagem</span>
              <textarea
                rows={4}
                value={form.mensagem}
                onChange={alterar("mensagem")}
                placeholder="O que está acontecendo hoje?"
                className={`${campo} resize-y`}
              />
            </label>

            <a
              href={linkWhatsApp(texto)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
            >
              Continuar no WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          </form>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 7: Declarar as rotas internas do institucional**

Substitua o stub `src/exemplos/site/SiteExemplar.jsx` por:

```jsx
import { Routes, Route } from "react-router-dom";
import { CabecalhoSite, RodapeSite } from "./ChromeSite.jsx";
import SiteHome from "./SiteHome.jsx";
import SiteSobre from "./SiteSobre.jsx";
import SiteSolucoes from "./SiteSolucoes.jsx";
import SiteSolucao from "./SiteSolucao.jsx";
import SiteContato from "./SiteContato.jsx";
import NaoEncontrado from "../NaoEncontrado.jsx";

export default function SiteExemplar() {
  return (
    <>
      <CabecalhoSite />
      <main>
        <Routes>
          <Route index element={<SiteHome />} />
          <Route path="sobre" element={<SiteSobre />} />
          <Route path="solucoes" element={<SiteSolucoes />} />
          <Route path="solucoes/:slug" element={<SiteSolucao />} />
          <Route path="contato" element={<SiteContato />} />
          <Route
            path="*"
            element={<NaoEncontrado voltarPara="/exemplos/site" rotulo="Voltar ao início" />}
          />
        </Routes>
      </main>
      <RodapeSite />
    </>
  );
}
```

- [ ] **Step 8: Rodar lint, testes e build**

```bash
npm run lint && npm test && npm run build
```

Esperado: tudo limpo.

- [ ] **Step 9: Conferir no navegador**

```bash
npm run dev
```

Em `http://localhost:5173/exemplos/site`, confirme:
- as quatro páginas navegam e o item ativo do menu fica dourado
- `/exemplos/site/solucoes` lista os 12 itens em 4 grupos
- clicar em um card abre o detalhe, com entregáveis e relacionados
- `/exemplos/site/solucoes/nao-existe` mostra a página "não encontrada"
- o formulário de contato monta a mensagem e abre o WhatsApp
- o menu sanduíche funciona em 375px

Encerre com `Ctrl+C`.

- [ ] **Step 10: Commit**

```bash
git add src/exemplos/site
git commit -m "feat: exemplar de site institucional multi-pagina"
```

---

## Task 6: Estado da lista de orçamento

A única lógica de verdade do trabalho, e por isso a única coberta por testes. Mantida **pura**: o reducer não sabe o que é `localStorage` nem o que é React.

**Files:**
- Create: `src/exemplos/loja/orcamentoReducer.js`
- Create: `src/exemplos/loja/orcamentoReducer.test.js`
- Create: `src/exemplos/loja/mensagemOrcamento.js`
- Create: `src/exemplos/loja/mensagemOrcamento.test.js`
- Create: `src/exemplos/loja/orcamentoContexto.js`
- Create: `src/exemplos/loja/OrcamentoProvider.jsx`
- Create: `src/exemplos/loja/useOrcamento.js`

**Interfaces:**
- Consumes: `buscarItem` (Task 1)
- Produces:
  - `ESTADO_INICIAL = { itens: [] }`, item = `{ slug, quantidade, observacao }`
  - `orcamentoReducer(estado, acao)` — ações: `{tipo:"adicionar", slug, quantidade?, observacao?}`, `{tipo:"remover", slug}`, `{tipo:"quantidade", slug, quantidade}`, `{tipo:"observacao", slug, observacao}`, `{tipo:"limpar"}`, `{tipo:"hidratar", itens}`
  - `hidratar(bruto): { itens }`, `serializar(estado): Array`
  - `montarMensagem({ nome, empresa, contato, observacoes, itens }): string` — `itens` são `{ nome, quantidade, observacao }`
  - `useOrcamento(): { itens, total, adicionar, remover, alterarQuantidade, alterarObservacao, limpar, temItem }`
  - `OrcamentoProvider({ children })`

- [ ] **Step 1: Escrever os testes do reducer**

Crie `src/exemplos/loja/orcamentoReducer.test.js`:

```js
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
```

- [ ] **Step 2: Rodar os testes para confirmar que falham**

```bash
npm test
```

Esperado: FALHA com `Failed to resolve import "./orcamentoReducer.js"`.

- [ ] **Step 3: Escrever o reducer**

Crie `src/exemplos/loja/orcamentoReducer.js`:

```js
import { buscarItem } from "../../data/catalogo.js";

// =============================================================================
// Lógica da lista de orçamento. Função pura: não conhece React nem
// localStorage. Guarda apenas { slug, quantidade, observacao } — os dados do
// produto vêm sempre do catálogo na hora de renderizar.
// =============================================================================

export const ESTADO_INICIAL = { itens: [] };

function normalizarQuantidade(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) && numero > 0 ? Math.floor(numero) : 1;
}

export function orcamentoReducer(estado, acao) {
  switch (acao.tipo) {
    case "adicionar": {
      const quantidade = normalizarQuantidade(acao.quantidade ?? 1);
      const observacao = acao.observacao ?? "";
      const existente = estado.itens.find((i) => i.slug === acao.slug);

      if (!existente) {
        return { itens: [...estado.itens, { slug: acao.slug, quantidade, observacao }] };
      }

      return {
        itens: estado.itens.map((i) =>
          i.slug === acao.slug
            ? {
                ...i,
                quantidade: i.quantidade + quantidade,
                // Observação nova sobrescreve; vazia preserva a que já existia.
                observacao: observacao || i.observacao,
              }
            : i,
        ),
      };
    }

    case "remover":
      return { itens: estado.itens.filter((i) => i.slug !== acao.slug) };

    case "quantidade": {
      const quantidade = Number(acao.quantidade);
      if (!Number.isFinite(quantidade) || quantidade <= 0) {
        return { itens: estado.itens.filter((i) => i.slug !== acao.slug) };
      }
      return {
        itens: estado.itens.map((i) =>
          i.slug === acao.slug ? { ...i, quantidade: Math.floor(quantidade) } : i,
        ),
      };
    }

    case "observacao":
      return {
        itens: estado.itens.map((i) =>
          i.slug === acao.slug ? { ...i, observacao: acao.observacao } : i,
        ),
      };

    case "limpar":
      return ESTADO_INICIAL;

    case "hidratar":
      return hidratar(acao.itens);

    default:
      return estado;
  }
}

/**
 * Transforma o que veio do localStorage em estado confiável.
 * Descarta o que não tem slug e o que saiu do catálogo — assim um item
 * removido do catálogo simplesmente some da lista salva, sem quebrar a tela.
 */
export function hidratar(bruto) {
  if (!Array.isArray(bruto)) return ESTADO_INICIAL;

  const itens = bruto
    .filter((i) => i && typeof i.slug === "string" && buscarItem(i.slug))
    .map((i) => ({
      slug: i.slug,
      quantidade: normalizarQuantidade(i.quantidade),
      observacao: typeof i.observacao === "string" ? i.observacao : "",
    }));

  return { itens };
}

/** Só o que precisa ser gravado — os dados do produto vêm do catálogo. */
export function serializar(estado) {
  return estado.itens;
}
```

- [ ] **Step 4: Rodar os testes do reducer**

```bash
npm test
```

Esperado: PASS — os 21 testes do catálogo mais os 22 do reducer.

- [ ] **Step 5: Escrever os testes da mensagem**

Crie `src/exemplos/loja/mensagemOrcamento.test.js`:

```js
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
```

- [ ] **Step 6: Rodar para confirmar que falha**

```bash
npm test
```

Esperado: FALHA com `Failed to resolve import "./mensagemOrcamento.js"`.

- [ ] **Step 7: Escrever o montador da mensagem**

Crie `src/exemplos/loja/mensagemOrcamento.js`:

```js
// Monta o texto que vai para o WhatsApp ou para o corpo do e-mail.
// Função pura: recebe os itens já enriquecidos com o nome do produto.

export function montarMensagem({ nome = "", empresa = "", contato = "", observacoes = "", itens = [] } = {}) {
  const linhas = ["Olá! Vim pelo site da ogis.cloud e gostaria de um orçamento."];

  const contatos = [
    nome && `Nome: ${nome}`,
    empresa && `Empresa: ${empresa}`,
    contato && `Contato: ${contato}`,
  ].filter(Boolean);

  if (contatos.length > 0) linhas.push("", ...contatos);

  if (itens.length > 0) {
    linhas.push("", "Itens:");
    for (const item of itens) {
      const observacao = item.observacao ? ` — obs: ${item.observacao}` : "";
      linhas.push(`- ${item.nome} (${item.quantidade})${observacao}`);
    }
  }

  if (observacoes) linhas.push("", `Observações: ${observacoes}`);

  return linhas.join("\n");
}
```

- [ ] **Step 8: Rodar os testes**

```bash
npm test
```

Esperado: PASS — 51 testes no total (21 catálogo + 22 reducer + 8 mensagem).

- [ ] **Step 9: Criar o contexto isolado**

Arquivo só com o `createContext`, sem componente, para não disparar `react-refresh/only-export-components`. Crie `src/exemplos/loja/orcamentoContexto.js`:

```js
import { createContext } from "react";

// Fica em arquivo próprio (sem componente) para o Fast Refresh não reclamar.
export const OrcamentoContexto = createContext(null);
```

- [ ] **Step 10: Criar o provider com persistência**

Crie `src/exemplos/loja/OrcamentoProvider.jsx`:

```jsx
import { useReducer, useEffect, useMemo, useCallback } from "react";
import { OrcamentoContexto } from "./orcamentoContexto.js";
import { ESTADO_INICIAL, orcamentoReducer, hidratar, serializar } from "./orcamentoReducer.js";

const CHAVE = "ogis:orcamento";

/** Lê o que foi salvo. Em aba anônima o localStorage pode lançar — cai para vazio. */
function lerSalvo() {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    return bruto ? hidratar(JSON.parse(bruto)) : ESTADO_INICIAL;
  } catch {
    return ESTADO_INICIAL;
  }
}

export default function OrcamentoProvider({ children }) {
  const [estado, despachar] = useReducer(orcamentoReducer, ESTADO_INICIAL, lerSalvo);

  // Persiste a cada mudança. Se o navegador bloquear, seguimos só em memória.
  useEffect(() => {
    try {
      window.localStorage.setItem(CHAVE, JSON.stringify(serializar(estado)));
    } catch {
      // Sem persistência: a lista continua funcionando até recarregar a página.
    }
  }, [estado]);

  const adicionar = useCallback(
    (slug, quantidade = 1, observacao = "") =>
      despachar({ tipo: "adicionar", slug, quantidade, observacao }),
    [],
  );
  const remover = useCallback((slug) => despachar({ tipo: "remover", slug }), []);
  const alterarQuantidade = useCallback(
    (slug, quantidade) => despachar({ tipo: "quantidade", slug, quantidade }),
    [],
  );
  const alterarObservacao = useCallback(
    (slug, observacao) => despachar({ tipo: "observacao", slug, observacao }),
    [],
  );
  const limpar = useCallback(() => despachar({ tipo: "limpar" }), []);

  const valor = useMemo(
    () => ({
      itens: estado.itens,
      total: estado.itens.reduce((soma, i) => soma + i.quantidade, 0),
      temItem: (slug) => estado.itens.some((i) => i.slug === slug),
      adicionar,
      remover,
      alterarQuantidade,
      alterarObservacao,
      limpar,
    }),
    [estado.itens, adicionar, remover, alterarQuantidade, alterarObservacao, limpar],
  );

  return <OrcamentoContexto.Provider value={valor}>{children}</OrcamentoContexto.Provider>;
}
```

- [ ] **Step 11: Criar o hook de consumo**

Crie `src/exemplos/loja/useOrcamento.js`:

```js
import { useContext } from "react";
import { OrcamentoContexto } from "./orcamentoContexto.js";

export function useOrcamento() {
  const contexto = useContext(OrcamentoContexto);
  if (!contexto) {
    throw new Error("useOrcamento precisa estar dentro de <OrcamentoProvider>");
  }
  return contexto;
}
```

- [ ] **Step 12: Rodar lint, testes e build**

```bash
npm run lint && npm test && npm run build
```

Esperado: tudo limpo, 51 testes passando.

- [ ] **Step 13: Commit**

```bash
git add src/exemplos/loja
git commit -m "feat: estado da lista de orcamento com reducer testado"
```

---

## Task 7: Exemplar 3 — Loja: chrome, vitrine e produto

**Files:**
- Create: `src/exemplos/loja/BotaoAdicionar.jsx`
- Create: `src/exemplos/loja/ChromeLoja.jsx`
- Create: `src/exemplos/loja/LojaVitrine.jsx`
- Create: `src/exemplos/loja/LojaProduto.jsx`
- Modify: `src/exemplos/loja/LojaExemplar.jsx` (substitui o stub)

**Interfaces:**
- Consumes: `CATEGORIAS`, `filtrarCatalogo`, `buscarItem`, `buscarCategoria`, `relacionados` (Task 1); `SeloEscopo` (Task 2); `NaoEncontrado`, `SEO` (Task 3); `useOrcamento`, `OrcamentoProvider` (Task 6)
- Produces: `BotaoAdicionar({ slug, quantidade, observacao, largo })`; `CabecalhoLoja`, `RodapeLoja`; rotas `/exemplos/loja`, `/p/:slug`, `/orcamento`

- [ ] **Step 1: Criar o botão de adicionar com retorno visual**

O usuário precisa ver que a ação funcionou. O botão troca de rótulo por dois segundos. Crie `src/exemplos/loja/BotaoAdicionar.jsx`:

```jsx
import { useState, useEffect, useRef } from "react";
import { Plus, Check } from "lucide-react";
import { useOrcamento } from "./useOrcamento.js";

export default function BotaoAdicionar({ slug, quantidade = 1, observacao = "", largo = false }) {
  const { adicionar } = useOrcamento();
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

  return (
    <button
      type="button"
      onClick={aoClicar}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
        largo ? "w-full py-3.5 text-base" : ""
      } ${
        adicionado
          ? "bg-success text-success-content"
          : "bg-primary text-primary-content hover:-translate-y-0.5"
      }`}
      aria-live="polite"
    >
      {adicionado ? (
        <>
          <Check className="h-4 w-4" />
          Adicionado
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          Adicionar ao orçamento
        </>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Criar o chrome da loja**

Cabeçalho com o badge de contagem — a peça que faz parecer uma loja de verdade. Crie `src/exemplos/loja/ChromeLoja.jsx`:

```jsx
import { Link, NavLink } from "react-router-dom";
import { FileText, Store } from "lucide-react";
import { BRAND } from "../../config.js";
import Wordmark from "../../components/Wordmark.jsx";
import { useOrcamento } from "./useOrcamento.js";

export function CabecalhoLoja() {
  const { total } = useOrcamento();

  return (
    <header className="sticky top-9 z-40 border-b border-base-300 bg-base-100/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link to="/exemplos/loja" className="flex items-center gap-3" aria-label="Vitrine">
          <Wordmark className="h-7" withText={false} />
          <span className="hidden font-display text-base font-semibold text-base-content sm:inline">
            Catálogo de Soluções
          </span>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Loja">
          <NavLink
            to="/exemplos/loja"
            end
            className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-base-content/70 transition-colors duration-200 hover:text-base-content sm:inline-flex"
          >
            <Store className="h-4 w-4" />
            Vitrine
          </NavLink>

          <NavLink
            to="/exemplos/loja/orcamento"
            className="relative inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Meu orçamento</span>
            <span className="sm:hidden">Orçamento</span>
            {total > 0 && (
              <span
                className="grid h-5 min-w-5 place-items-center rounded-full bg-base-100 px-1.5 text-xs font-bold text-primary"
                aria-label={`${total} itens na lista`}
              >
                {total}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export function RodapeLoja() {
  return (
    <footer className="border-t border-base-300 bg-base-100 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-center">
        <Wordmark className="h-7" />
        <p className="text-sm text-base-content/60">
          Nenhum preço é publicado: cada orçamento é feito sob medida, depois de entender o seu
          negócio.
        </p>
        <p className="text-xs text-base-content/40">
          Exemplar de e-commerce construído pela ogis.cloud · {BRAND.cidade}
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Criar a vitrine**

Busca, filtro por categoria e ordenação. O estado dos filtros vive na URL (`useSearchParams`), para o cliente poder copiar e mandar o link já filtrado. Crie `src/exemplos/loja/LojaVitrine.jsx`:

```jsx
import { useSearchParams } from "react-router-dom";
import { Search, X, SearchX } from "lucide-react";
import { CATEGORIAS, filtrarCatalogo } from "../../data/catalogo.js";
import CardCatalogo from "../../components/CardCatalogo.jsx";
import SEO from "../../components/SEO.jsx";
import BotaoAdicionar from "./BotaoAdicionar.jsx";

const ORDENS = [
  { valor: "categoria", rotulo: "Por categoria" },
  { valor: "nome", rotulo: "Nome (A–Z)" },
];

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

  const chipBase =
    "cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200";

  return (
    <>
      <SEO
        title="Catálogo de Soluções"
        description="Todos os produtos e soluções da ogis.cloud: presença digital, sistemas, infraestrutura e serviços contínuos. Monte sua lista e peça um orçamento."
        path="/exemplos/loja"
      />

      <section id="vitrine" className="mx-auto max-w-6xl px-5 py-14">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-base-content sm:text-4xl">
            Tudo o que a ogis.cloud faz
          </h1>
          <p className="mt-4 text-base-content/70">
            Monte a sua lista, conte o que precisa e devolvemos um orçamento sob medida. Você não
            paga nada para pedir.
          </p>
        </div>

        {/* Busca */}
        <div className="relative mt-10">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-base-content/40" />
          <input
            type="search"
            value={termo}
            onChange={(e) => definir("q", e.target.value)}
            placeholder="Buscar por nome ou por problema que você quer resolver"
            aria-label="Buscar no catálogo"
            className="w-full rounded-xl border border-base-300 bg-base-100 py-3.5 pl-12 pr-4 text-sm text-base-content outline-none transition-colors duration-200 placeholder:text-base-content/40 focus:border-primary"
          />
        </div>

        {/* Filtro e ordenação */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => definir("categoria", "")}
            className={`${chipBase} ${
              !categoria
                ? "border-primary bg-primary/15 text-primary"
                : "border-base-300 text-base-content/70 hover:border-primary/40"
            }`}
          >
            Todas
          </button>

          {CATEGORIAS.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => definir("categoria", cat.slug)}
              className={`${chipBase} ${
                categoria === cat.slug
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-base-300 text-base-content/70 hover:border-primary/40"
              }`}
            >
              {cat.nome}
            </button>
          ))}

          <label className="ml-auto flex items-center gap-2 text-sm text-base-content/60">
            Ordenar
            <select
              value={ordem}
              onChange={(e) => definir("ordem", e.target.value)}
              className="cursor-pointer rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-content outline-none focus:border-primary"
            >
              {ORDENS.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-6 text-sm text-base-content/50">
          {itens.length} {itens.length === 1 ? "solução encontrada" : "soluções encontradas"}
        </p>

        {itens.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {itens.map((item) => (
              <CardCatalogo key={item.slug} item={item} para={`/exemplos/loja/p/${item.slug}`}>
                <BotaoAdicionar slug={item.slug} />
              </CardCatalogo>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-base-300 bg-base-100 py-20 text-center">
            <SearchX className="mx-auto h-10 w-10 text-base-content/30" />
            <h2 className="mt-5 text-lg font-semibold text-base-content">
              Nada encontrado com esses filtros
            </h2>
            <p className="mt-2 text-sm text-base-content/60">
              Tente outro termo — ou fale com a gente: o que você precisa pode não estar no catálogo.
            </p>
            {temFiltro && (
              <button
                type="button"
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-base-300 px-5 py-2.5 text-sm font-semibold text-base-content transition-colors duration-200 hover:border-primary/50"
              >
                <X className="h-4 w-4" />
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

- [ ] **Step 4: Criar a página de produto**

Crie `src/exemplos/loja/LojaProduto.jsx`:

```jsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Check, ArrowLeft, Target, Minus, Plus } from "lucide-react";
import { buscarItem, buscarCategoria, relacionados } from "../../data/catalogo.js";
import SeloEscopo from "../../components/SeloEscopo.jsx";
import CardCatalogo from "../../components/CardCatalogo.jsx";
import SEO from "../../components/SEO.jsx";
import NaoEncontrado from "../NaoEncontrado.jsx";
import BotaoAdicionar from "./BotaoAdicionar.jsx";

export default function LojaProduto() {
  const { slug } = useParams();
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");

  const item = buscarItem(slug);
  if (!item) {
    return <NaoEncontrado voltarPara="/exemplos/loja" rotulo="Voltar à vitrine" />;
  }

  const categoria = buscarCategoria(item.categoria);
  const outros = relacionados(item.slug);
  const Icone = item.icone;

  return (
    <>
      <SEO
        title={item.nome}
        description={item.resumo}
        path={`/exemplos/loja/p/${item.slug}`}
      />

      <article className="mx-auto max-w-6xl px-5 py-14">
        <Link
          to="/exemplos/loja"
          className="inline-flex items-center gap-2 text-sm text-base-content/60 transition-colors duration-200 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar à vitrine
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* Conteúdo */}
          <div>
            <div className="flex items-start gap-5">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Icone className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                  {categoria.nome}
                </p>
                <h1 className="mt-1 text-3xl font-bold text-base-content">{item.nome}</h1>
              </div>
            </div>

            {item.badge && (
              <span className="mt-5 inline-block rounded-full bg-base-300 px-3 py-1 text-xs font-medium text-base-content/70">
                {item.badge}
              </span>
            )}

            <p className="mt-6 text-lg text-base-content/80">{item.resumo}</p>
            <p className="mt-6 leading-relaxed text-base-content/70">{item.descricao}</p>

            <h2 className="mt-10 text-xl font-semibold text-base-content">O que está incluso</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {item.entregaveis.map((e) => (
                <li key={e} className="flex items-start gap-3 text-base-content/80">
                  <Check className="mt-1 h-4.5 w-4.5 shrink-0 text-success" />
                  {e}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-base-300 bg-base-100 p-6">
              <Target className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <h2 className="font-semibold text-base-content">Ideal para</h2>
                <p className="mt-1 text-sm text-base-content/70">{item.idealPara}</p>
              </div>
            </div>
          </div>

          {/* Caixa de ação */}
          <aside className="rounded-2xl border border-base-300 bg-base-100 p-7 lg:sticky lg:top-32">
            <SeloEscopo item={item} />

            <p className="mt-5 text-sm text-base-content/60">
              Não publicamos preço porque cada caso é diferente. Monte a sua lista e devolvemos um
              orçamento sob medida.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <span className="text-sm font-medium text-base-content/80">Quantidade</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                  aria-label="Diminuir quantidade"
                  className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-base-300 text-base-content transition-colors duration-200 hover:border-primary/50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-display text-lg font-semibold text-base-content">
                  {quantidade}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantidade((q) => q + 1)}
                  aria-label="Aumentar quantidade"
                  className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-base-300 text-base-content transition-colors duration-200 hover:border-primary/50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <label className="mt-5 flex flex-col gap-2">
              <span className="text-sm font-medium text-base-content/80">
                Alguma observação? <span className="text-base-content/40">(opcional)</span>
              </span>
              <textarea
                rows={3}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex.: preciso migrar de outro fornecedor"
                className="w-full resize-y rounded-xl border border-base-300 bg-base-200 px-4 py-3 text-sm text-base-content outline-none transition-colors duration-200 placeholder:text-base-content/40 focus:border-primary"
              />
            </label>

            <div className="mt-6">
              <BotaoAdicionar
                slug={item.slug}
                quantidade={quantidade}
                observacao={observacao}
                largo
              />
            </div>
          </aside>
        </div>

        {outros.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-base-content">Também em {categoria.nome}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {outros.map((outro) => (
                <CardCatalogo key={outro.slug} item={outro} para={`/exemplos/loja/p/${outro.slug}`}>
                  <BotaoAdicionar slug={outro.slug} />
                </CardCatalogo>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
```

- [ ] **Step 5: Declarar as rotas da loja**

Substitua o stub `src/exemplos/loja/LojaExemplar.jsx`. A rota `/orcamento` aponta para um stub temporário, substituído na Task 8.

```jsx
import { Routes, Route } from "react-router-dom";
import OrcamentoProvider from "./OrcamentoProvider.jsx";
import { CabecalhoLoja, RodapeLoja } from "./ChromeLoja.jsx";
import LojaVitrine from "./LojaVitrine.jsx";
import LojaProduto from "./LojaProduto.jsx";
import NaoEncontrado from "../NaoEncontrado.jsx";

export default function LojaExemplar() {
  return (
    <OrcamentoProvider>
      <CabecalhoLoja />
      <main>
        <Routes>
          <Route index element={<LojaVitrine />} />
          <Route path="p/:slug" element={<LojaProduto />} />
          <Route
            path="orcamento"
            element={
              <div className="p-20 text-center text-base-content/50">
                Lista de orçamento — Task 8
              </div>
            }
          />
          <Route
            path="*"
            element={<NaoEncontrado voltarPara="/exemplos/loja" rotulo="Voltar à vitrine" />}
          />
        </Routes>
      </main>
      <RodapeLoja />
    </OrcamentoProvider>
  );
}
```

- [ ] **Step 6: Rodar lint, testes e build**

```bash
npm run lint && npm test && npm run build
```

Esperado: tudo limpo.

- [ ] **Step 7: Conferir no navegador**

```bash
npm run dev
```

Em `http://localhost:5173/exemplos/loja`, confirme:
- a vitrine mostra 12 itens e o contador diz "12 soluções encontradas"
- digitar "e-mail" na busca filtra e o texto `?q=` aparece na URL
- clicar em uma categoria filtra; "Todas" volta ao completo
- a ordenação "Nome (A–Z)" reordena os cards
- buscar "zzz" mostra o estado vazio com o botão "Limpar filtros"
- "Adicionar ao orçamento" vira "Adicionado" em verde por 2 segundos e o badge do cabeçalho incrementa
- recarregar a página mantém o badge (persistência)
- `/exemplos/loja/p/dominio` abre o produto, com quantidade e observação funcionando
- `/exemplos/loja/p/nao-existe` mostra a página "não encontrada"

Encerre com `Ctrl+C`.

- [ ] **Step 8: Commit**

```bash
git add src/exemplos/loja
git commit -m "feat: vitrine e pagina de produto da loja exemplar"
```

---

## Task 8: Exemplar 3 — Lista de orçamento

O fecho da loja: onde a lista vira uma mensagem de WhatsApp ou de e-mail. É aqui que fica evidente que o e-commerce funciona sem preço.

**Files:**
- Create: `src/exemplos/loja/LojaOrcamento.jsx`
- Modify: `src/exemplos/loja/LojaExemplar.jsx` (troca o stub pela página real)
- Modify: `src/config.js` (assunto do e-mail de orçamento)

**Interfaces:**
- Consumes: `buscarItem`, `textoEscopo` (Task 1); `useOrcamento` (Task 6); `montarMensagem` (Task 6); `linkWhatsApp`, `linkEmail` (`src/config.js`)
- Produces: rota `/exemplos/loja/orcamento` funcional

- [ ] **Step 1: Adicionar o assunto do e-mail de orçamento**

Em `src/config.js`, dentro de `ASSUNTO`, acrescente:

```js
  orcamento: "Pedido de orçamento — ogis.cloud",
```

- [ ] **Step 2: Criar a página de orçamento**

Crie `src/exemplos/loja/LojaOrcamento.jsx`:

```jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, MessageCircle, Mail, FileText, ArrowLeft } from "lucide-react";
import { buscarItem, textoEscopo } from "../../data/catalogo.js";
import { linkWhatsApp, linkEmail, ASSUNTO } from "../../config.js";
import SEO from "../../components/SEO.jsx";
import { useOrcamento } from "./useOrcamento.js";
import { montarMensagem } from "./mensagemOrcamento.js";

const CAMPO =
  "w-full rounded-xl border border-base-300 bg-base-200 px-4 py-3 text-sm text-base-content outline-none transition-colors duration-200 placeholder:text-base-content/40 focus:border-primary";

function ListaVazia() {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 py-20 text-center">
      <FileText className="mx-auto h-10 w-10 text-base-content/30" />
      <h2 className="mt-5 text-lg font-semibold text-base-content">
        Sua lista de orçamento está vazia
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
        Navegue pelo catálogo e adicione o que faz sentido para o seu negócio. Você não paga nada
        para pedir um orçamento.
      </p>
      <Link
        to="/exemplos/loja"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
      >
        <ArrowLeft className="h-4 w-4" />
        Ver o catálogo
      </Link>
    </div>
  );
}

export default function LojaOrcamento() {
  const { itens, total, remover, alterarQuantidade, alterarObservacao, limpar } = useOrcamento();
  const [form, setForm] = useState({ nome: "", empresa: "", contato: "", observacoes: "" });

  const alterar = (campo) => (evento) =>
    setForm((atual) => ({ ...atual, [campo]: evento.target.value }));

  // Enriquece com o nome do produto na hora de montar a mensagem: o estado
  // guarda só o slug, e o catálogo é a fonte de verdade.
  const itensComNome = itens.map((i) => ({
    ...i,
    nome: buscarItem(i.slug)?.nome ?? i.slug,
  }));

  const mensagem = montarMensagem({ ...form, itens: itensComNome });

  return (
    <>
      <SEO
        title="Meu orçamento"
        description="Sua lista de soluções da ogis.cloud, pronta para virar um orçamento sob medida."
        path="/exemplos/loja/orcamento"
        noindex
      />

      <section id="orcamento" className="mx-auto max-w-6xl px-5 py-14">
        <h1 className="text-3xl font-bold text-base-content sm:text-4xl">Meu orçamento</h1>
        <p className="mt-4 max-w-2xl text-base-content/70">
          Confira os itens, conte o que precisa e envie. Respondemos com um orçamento sob medida —
          sem custo e sem compromisso.
        </p>

        {itens.length === 0 ? (
          <div className="mt-10">
            <ListaVazia />
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            {/* Itens */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
                  {total} {total === 1 ? "item" : "itens"}
                </h2>
                <button
                  type="button"
                  onClick={limpar}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-base-content/50 transition-colors duration-200 hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar tudo
                </button>
              </div>

              <ul className="mt-5 flex flex-col gap-4">
                {itens.map((linha) => {
                  const item = buscarItem(linha.slug);
                  if (!item) return null;
                  const Icone = item.icone;

                  return (
                    <li
                      key={linha.slug}
                      className="rounded-2xl border border-base-300 bg-base-100 p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                          <Icone className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-base-content">
                            <Link
                              to={`/exemplos/loja/p/${item.slug}`}
                              className="transition-colors duration-200 hover:text-primary"
                            >
                              {item.nome}
                            </Link>
                          </h3>
                          <p className="mt-0.5 text-xs text-base-content/50">{textoEscopo(item)}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => remover(linha.slug)}
                          aria-label={`Remover ${item.nome}`}
                          className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-base-content/40 transition-colors duration-200 hover:bg-base-200 hover:text-error"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => alterarQuantidade(linha.slug, linha.quantidade - 1)}
                          aria-label={`Diminuir quantidade de ${item.nome}`}
                          className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-base-300 transition-colors duration-200 hover:border-primary/50"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center font-semibold text-base-content">
                          {linha.quantidade}
                        </span>
                        <button
                          type="button"
                          onClick={() => alterarQuantidade(linha.slug, linha.quantidade + 1)}
                          aria-label={`Aumentar quantidade de ${item.nome}`}
                          className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-base-300 transition-colors duration-200 hover:border-primary/50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <label className="mt-4 block">
                        <span className="sr-only">Observação sobre {item.nome}</span>
                        <input
                          type="text"
                          value={linha.observacao}
                          onChange={(e) => alterarObservacao(linha.slug, e.target.value)}
                          placeholder="Observação sobre este item (opcional)"
                          className={CAMPO}
                        />
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Formulário de envio */}
            <aside className="rounded-2xl border border-primary/30 bg-base-100 p-7 lg:sticky lg:top-32">
              <h2 className="text-lg font-semibold text-base-content">Para onde respondemos?</h2>
              <p className="mt-1.5 text-sm text-base-content/60">
                Nenhum dado é enviado para servidor: os campos montam a mensagem que você envia.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-base-content/80">Seu nome</span>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={alterar("nome")}
                    placeholder="Como podemos te chamar"
                    className={CAMPO}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-base-content/80">Empresa</span>
                  <input
                    type="text"
                    value={form.empresa}
                    onChange={alterar("empresa")}
                    placeholder="Nome do seu negócio"
                    className={CAMPO}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-base-content/80">
                    E-mail ou telefone
                  </span>
                  <input
                    type="text"
                    value={form.contato}
                    onChange={alterar("contato")}
                    placeholder="Como preferir ser respondido"
                    className={CAMPO}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-base-content/80">
                    Observações gerais
                  </span>
                  <textarea
                    rows={3}
                    value={form.observacoes}
                    onChange={alterar("observacoes")}
                    placeholder="Prazo, contexto, o que já existe hoje..."
                    className={`${CAMPO} resize-y`}
                  />
                </label>
              </form>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={linkWhatsApp(mensagem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enviar por WhatsApp
                </a>
                <a
                  href={linkEmail(ASSUNTO.orcamento, mensagem)}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-base-300 px-5 py-3.5 text-sm font-semibold text-base-content transition-colors duration-200 hover:border-primary/50"
                >
                  <Mail className="h-4 w-4" />
                  Enviar por e-mail
                </a>
              </div>

              <p className="mt-5 text-center text-xs text-base-content/40">
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

- [ ] **Step 3: Ligar a rota**

Em `src/exemplos/loja/LojaExemplar.jsx`, importe a página no topo:

```jsx
import LojaOrcamento from "./LojaOrcamento.jsx";
```

E troque a rota com o stub por:

```jsx
          <Route path="orcamento" element={<LojaOrcamento />} />
```

- [ ] **Step 4: Rodar lint, testes e build**

```bash
npm run lint && npm test && npm run build
```

Esperado: tudo limpo.

- [ ] **Step 5: Percorrer o fluxo completo no navegador**

```bash
npm run dev
```

Faça o caminho inteiro, como um cliente faria:

1. Abra `/exemplos/loja/orcamento` com a lista vazia → deve mostrar o estado vazio com CTA.
2. Volte à vitrine, adicione **Domínio Gerenciado**.
3. Abra **E-mail Profissional**, coloque quantidade 5 e a observação "uma caixa por vendedor", adicione.
4. Vá para o orçamento: os dois itens aparecem, com quantidades 1 e 5.
5. Aumente e diminua a quantidade nos botões; leve um item a zero e confirme que ele **some da lista**.
6. Edite a observação de um item.
7. Preencha nome, empresa e contato.
8. Clique em "Enviar por WhatsApp" → a mensagem deve trazer os itens com quantidade e observação, e **nenhum valor em reais**.
9. Clique em "Enviar por e-mail" → o cliente de e-mail abre com o assunto e o mesmo corpo.
10. Recarregue a página → a lista continua lá.
11. Clique em "Limpar tudo" → volta ao estado vazio.
12. Repita os passos 2 a 4 em viewport de 375px.

Encerre com `Ctrl+C`.

- [ ] **Step 6: Commit**

```bash
git add src/exemplos/loja src/config.js
git commit -m "feat: lista de orcamento com envio por whatsapp e email"
```

---

## Task 9: Integração com a home, SEO e verificação final

Sem esta tarefa, ninguém descobre os exemplares navegando pelo site.

**Files:**
- Create: `src/components/VejaFuncionando.jsx`
- Modify: `src/config.js` (item "Exemplos" no `NAV`)
- Modify: `src/pages/LandingPage.jsx` (encaixa a seção)
- Modify: `public/sitemap.xml`
- Modify: `README.md`

**Interfaces:**
- Consumes: tudo o que as tarefas anteriores produziram
- Produces: seção `VejaFuncionando` na home; `/exemplos` alcançável pelo menu

- [ ] **Step 1: Adicionar "Exemplos" à navegação**

Em `src/config.js`, no array `NAV`, insira o item **entre** "Como funciona" e "Planos":

```js
  { href: "#exemplos", label: "Exemplos" },
```

O `NAV` completo fica:

```js
export const NAV = [
  { href: "#solucoes", label: "Soluções" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#exemplos", label: "Exemplos" },
  { href: "#planos", label: "Planos" },
  { href: "#contato", label: "Contato" },
];
```

- [ ] **Step 2: Criar a seção "Veja funcionando"**

Crie `src/components/VejaFuncionando.jsx`:

```jsx
import { Link } from "react-router-dom";
import { MousePointerClick, Layout, ShoppingBag, ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading.jsx";

const EXEMPLARES = [
  {
    para: "/exemplos/landing",
    icone: MousePointerClick,
    nome: "Landing Page",
    resumo: "Uma página, um objetivo: transformar visita em contato.",
  },
  {
    para: "/exemplos/site",
    icone: Layout,
    nome: "Site Institucional",
    resumo: "Site completo, com várias páginas e navegação própria.",
  },
  {
    para: "/exemplos/loja",
    icone: ShoppingBag,
    nome: "E-commerce",
    resumo: "Vitrine com busca, filtros e pedido de orçamento.",
  },
];

export default function VejaFuncionando() {
  return (
    <section id="exemplos" className="bg-base-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Exemplos"
          title="Veja funcionando antes de decidir"
          subtitle="Três exemplares navegáveis, construídos por nós. Clique, navegue e veja o que cada formato entrega."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {EXEMPLARES.map((ex) => {
            const Icone = ex.icone;
            return (
              <Link
                key={ex.para}
                to={ex.para}
                className="group flex flex-col rounded-2xl border border-base-300 bg-base-200 p-7 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icone className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-base-content">{ex.nome}</h3>
                <p className="mt-2 flex-1 text-sm text-base-content/70">{ex.resumo}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Abrir exemplar
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Encaixar a seção na home**

Em `src/pages/LandingPage.jsx`, importe o componente:

```jsx
import VejaFuncionando from "../components/VejaFuncionando.jsx";
```

E insira `<VejaFuncionando />` **entre** `<Confianca />` e `<CTAFinal />` — depois da prova social e logo antes do fecho, que é onde a demonstração ajuda a decidir. O corpo do componente fica:

```jsx
      <SEO />
      <Hero />
      <Solucoes />
      <ComoFunciona />
      <Planos />
      <ParaQuem />
      <Confianca />
      <VejaFuncionando />
      <CTAFinal />
      <Contato />
```

- [ ] **Step 4: Atualizar o sitemap**

A loja é indexável (catálogo é conteúdo único e útil); a landing e o institucional exemplares não entram, porque saem com `noindex`. Substitua **todo** o conteúdo de `public/sitemap.xml` por:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ogis.cloud/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/exemplos/loja</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/exemplos/loja/p/landing-page</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/exemplos/loja/p/site-institucional</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/exemplos/loja/p/e-commerce</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/exemplos/loja/p/seo-local</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/exemplos/loja/p/sistema-gestao</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/exemplos/loja/p/nota-fiscal</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/exemplos/loja/p/integracoes</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/exemplos/loja/p/dominio</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/exemplos/loja/p/email-profissional</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/exemplos/loja/p/hospedagem</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/exemplos/loja/p/manutencao</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/exemplos/loja/p/migracao</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/termos</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://ogis.cloud/privacidade</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

`public/robots.txt` **não muda**: continua `Allow: /`. O que precisa ficar fora do índice já sai com `noindex` na própria página, que é mais confiável do que `Disallow` (o `Disallow` impede a leitura, e então o robô nunca vê o `noindex`).

- [ ] **Step 5: Documentar no README**

Em `README.md`, na seção **Estrutura**, substitua o bloco de código da árvore `src/` por:

```
src/
  config.js              # contato/CTAs + navegação (edite os placeholders aqui)
  index.css              # Tailwind v4 + daisyUI + tema ogis-dark
  App.jsx                # rotas: SiteLayout (site real) + ExemplarLayout (exemplares)
  layouts/               # SiteLayout, ExemplarLayout
  data/                  # catalogo.js (FONTE ÚNICA), solucoes.js, planos.js
  components/            # Navbar, Hero, Solucoes, Planos, CardCatalogo, SeloEscopo...
  pages/                 # LandingPage, Termos, Privacidade
  exemplos/              # os três exemplares funcionais
    landing/             # /exemplos/landing  — página única de campanha
    site/                # /exemplos/site     — institucional multi-página
    loja/                # /exemplos/loja     — vitrine + lista de orçamento
email-signature/         # assinatura de e-mail (ver seção abaixo)
```

E acrescente uma seção nova, logo **depois** de **Estrutura**:

````markdown
## Exemplares funcionais

Três demonstrações navegáveis, com o conteúdo real da OGIS, para mostrar ao cliente o que cada
formato entrega. Todas ficam sob `/exemplos` e usam o mesmo build e o mesmo deploy do site.

| Rota | O que demonstra |
|---|---|
| `/exemplos` | Índice dos três exemplares |
| `/exemplos/landing` | Landing page: uma promessa, uma ação (vende a solução tecnológica completa) |
| `/exemplos/site` | Site institucional multi-página (Início, Sobre, Soluções, Contato) |
| `/exemplos/loja` | E-commerce: vitrine com busca e filtros + lista de orçamento |

**Sem preços.** Nenhuma página do projeto exibe valor: as cotações são feitas manualmente, caso a
caso. No lugar do preço, os cards mostram um selo de escopo ("Projeto · prazo típico 2 a 3
semanas", "Mensal · sob consulta"), gerado por `textoEscopo()` em `src/data/catalogo.js`.

**Conteúdo.** Os três exemplares e a home leem de `src/data/catalogo.js` — 12 itens em 4
categorias. Para alterar textos de produto, edite **só esse arquivo**.

**Lista de orçamento.** O carrinho da loja é front-end puro: estado em `localStorage`
(chave `ogis:orcamento`, guardando apenas `{slug, quantidade, observacao}`) e envio via WhatsApp ou
e-mail com a mensagem já montada. Não há backend, banco nem pagamento.

```bash
npm test          # testa a lógica pura: catálogo, reducer do orçamento e a mensagem
```
````

- [ ] **Step 6: Verificação final — comandos**

```bash
npm run lint && npm test && npm run build
```

Esperado: lint sem saída, 51 testes passando, build gerando `dist/`.

```bash
grep -rn 'R\$' src/ ; echo "---fim---"
```

Esperado: apenas `---fim---`.

```bash
grep -rn 'TODO\|FIXME\|lorem' src/exemplos/ ; echo "---fim---"
```

Esperado: apenas `---fim---`.

- [ ] **Step 7: Verificação final — navegador**

```bash
npm run dev
```

Percorra a lista inteira, marcando cada item:

**Home (`/`)**
- Nenhum valor em reais na página
- Planos mostram "Sob consulta"
- O menu tem "Exemplos" e o link rola até a seção
- A seção "Veja funcionando" aparece entre a prova social e o CTA final, com três cards que levam aos exemplares

**Landing (`/exemplos/landing`)**
- Faixa de exemplar no topo; "Voltar ao site" leva para `/`
- Todos os CTAs abrem o WhatsApp com a mensagem de diagnóstico
- FAQ abre e fecha

**Institucional (`/exemplos/site`)**
- As quatro páginas navegam; o item ativo do menu fica dourado
- Soluções lista 12 itens em 4 grupos; o detalhe abre com entregáveis e relacionados
- Formulário de contato monta a mensagem

**Loja (`/exemplos/loja`)**
- 12 itens; busca, filtro e ordenação funcionam; filtros aparecem na URL
- Adicionar item incrementa o badge; recarregar mantém a lista
- Orçamento gera WhatsApp e e-mail com os itens; quantidade zero remove; "Limpar tudo" esvazia

**Responsivo (375px)** — nenhuma página rola na horizontal; os menus sanduíche funcionam.

**404** — `/exemplos/nada`, `/exemplos/site/solucoes/nada` e `/exemplos/loja/p/nada` mostram a página de erro com link de volta.

Encerre com `Ctrl+C`.

- [ ] **Step 8: Commit**

```bash
git add src/components/VejaFuncionando.jsx src/config.js src/pages/LandingPage.jsx public/sitemap.xml README.md
git commit -m "feat: secao veja funcionando na home, sitemap e docs"
```

- [ ] **Step 9: Conferir o deploy localmente**

O `wrangler dev` serve o build igual à produção — é onde se pega problema de rota de SPA (link direto para `/exemplos/loja/p/dominio` precisa devolver o `index.html`).

```bash
npm run preview
```

Abra a URL que o Wrangler imprimir e teste **link direto** (digitando na barra de endereço, não navegando) para:
- `/exemplos/loja/p/dominio`
- `/exemplos/site/solucoes/sistema-gestao`
- `/exemplos/landing`

Todas devem carregar. Se alguma devolver 404, o `not_found_handling: "single-page-application"` no `wrangler.jsonc` não está sendo aplicado — investigue antes de publicar.

Encerre com `Ctrl+C`.

---

## Notas de execução

**Ordem das tarefas.** As Tasks 1 → 3 são pré-requisito de tudo. Depois disso, as Tasks 4 (landing) e 5 (institucional) são independentes entre si e podem ser feitas em qualquer ordem. A Task 6 é pré-requisito das Tasks 7 e 8, que são sequenciais. A Task 9 vem por último.

**O que NÃO fazer.**
- Não introduzir backend, banco, pagamento ou autenticação — a decisão de front-end puro é do spec.
- Não recolocar preço em lugar nenhum, nem como "a partir de".
- Não criar subdomínio ou segundo deploy.
- Não mexer em `src/components/Hero.jsx`, `ComoFunciona.jsx`, `ParaQuem.jsx`, `Confianca.jsx`, `CTAFinal.jsx`, `Contato.jsx`, `Termos.jsx` nem `Privacidade.jsx` — estão fora do escopo.
- Não trocar a paleta nem adicionar modo claro.

**Se o `npm run lint` reclamar de `react-refresh/only-export-components`:** a regra dispara quando um arquivo exporta um componente **e** algo que não é componente. `secoes.jsx` e `ChromeSite.jsx` exportam apenas componentes (nomeados), o que é aceito. Se ainda assim houver aviso, mova o valor não-componente para um arquivo `.js` separado — foi exatamente por isso que `orcamentoContexto.js` existe. Nunca resolva com `eslint-disable`.

