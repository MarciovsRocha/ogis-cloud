import { Globe, Layout, Boxes, FileText } from "lucide-react";

// Produtos na VISÃO DO CLIENTE (§2.1 do relatório). Copy orientada a resultado
// de negócio — nada de jargão técnico (banco, filas, containers ficam invisíveis).
export const SOLUCOES = [
  {
    icon: Globe,
    nome: "Presença Digital",
    resumo: "Seu negócio encontrável no Google e com cara profissional.",
    itens: [
      "Landing page que converte visita em contato",
      "Domínio próprio gerenciado (sempre no seu nome)",
      "E-mail profissional @suaempresa no Google Workspace",
    ],
  },
  {
    icon: Layout,
    nome: "Site Profissional",
    resumo: "Site institucional completo, sempre no ar e atualizado.",
    itens: [
      "Site completo com as páginas do seu negócio",
      "E-mail profissional no Google Workspace",
      "Manutenção mensal e pequenas alterações inclusas",
    ],
  },
  {
    icon: Boxes,
    nome: "Sistema de Gestão",
    resumo: "Um sistema sob medida para o jeito que a sua empresa trabalha.",
    itens: [
      "Software feito para o seu processo (não o contrário)",
      "Site + e-mail + sustentação completa juntos",
      "Um único responsável do começo ao suporte",
    ],
    destaque: true,
  },
  {
    icon: FileText,
    nome: "Emissão de Nota Fiscal",
    resumo: "Emita NF-e sem travar o caixa, direto do seu sistema.",
    itens: [
      "Notas emitidas em segundo plano, sem fila",
      "Integrado ao seu sistema de gestão",
      "Um valor por CNPJ, previsível",
    ],
    badge: "Em breve",
  },
];
