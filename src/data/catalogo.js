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
