import { MousePointerClick, Layout, ShoppingBag } from "lucide-react";

// Os três exemplares navegáveis. Consumido pelo índice (/exemplos) e pela
// seção "Veja funcionando" da home — cada um com a própria marcação.
export const EXEMPLARES = [
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
