// Planos com preço-âncora "a partir de" (decisão do Q&A). Valores vindos do
// §2.1/§5.1 do relatório. O setup fica "sob escopo" — negociado na proposta.
export const PLANOS = [
  {
    nome: "Presença",
    precoPrefixo: "a partir de",
    preco: "R$ 180",
    periodo: "/mês",
    resumo: "Para começar a ser encontrado e passar profissionalismo.",
    beneficios: [
      "Landing page profissional",
      "Domínio gerenciado no seu nome",
      "2 caixas de e-mail profissional",
      "Manutenção e monitoramento básicos",
    ],
    cta: "Quero começar",
    destaque: false,
  },
  {
    nome: "Profissional",
    precoPrefixo: "a partir de",
    preco: "R$ 380",
    periodo: "/mês",
    resumo: "O combo completo para quem quer presença séria e sem dor de cabeça.",
    beneficios: [
      "Site institucional completo",
      "5 caixas de e-mail profissional",
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
    precoPrefixo: "",
    preco: "Sob consulta",
    periodo: "",
    resumo: "Sistema de gestão sob medida com sustentação total.",
    beneficios: [
      "Software sob medida para o seu processo",
      "Site + e-mail incluídos",
      "Sustentação completa e suporte dedicado",
      "Backups diários testados",
      "Um único responsável por tudo",
    ],
    cta: "Solicitar orçamento",
    destaque: false,
  },
];

// Redutores de risco exibidos abaixo dos planos (§5.1).
export const GARANTIAS = [
  "Primeiro mês de mensalidade grátis",
  "Sem fidelidade",
  "Migração garantida em até 30 dias",
];
