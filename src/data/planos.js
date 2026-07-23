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
