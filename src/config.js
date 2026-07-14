// =============================================================================
// Configuração central da ogis.cloud — ajuste aqui os dados de contato/CTA.
// TODO(marcio): trocar os PLACEHOLDERS abaixo pelos dados reais antes do deploy.
//
// Todas as ações do site vão para WhatsApp ou e-mail, com uma mensagem
// pré-preenchida ("pretexto") conforme a opção que o usuário escolheu.
// =============================================================================

export const BRAND = {
  name: "ogis.cloud",
  tagline: "Presença digital e sistemas gerenciados, com um único responsável.",
  cidade: "Curitiba/PR",
  cnpj: "CNPJ em constituição",
  email: "contato@ogis.cloud",
};

// WhatsApp: número no formato internacional, só dígitos (55 + DDD + número).
// PLACEHOLDER — substituir pelo número real.
export const WHATSAPP_NUMERO = "5541999999999";

// ---------------------------------------------------------------------------
// Geradores de link com pretexto (mensagem pré-preenchida)
// ---------------------------------------------------------------------------

/** Link de WhatsApp (wa.me) com mensagem opcional já preenchida. */
export function linkWhatsApp(mensagem) {
  const base = `https://wa.me/${WHATSAPP_NUMERO}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

/** Link mailto com assunto/corpo opcionais já preenchidos. */
export function linkEmail(assunto, corpo) {
  const parts = [];
  if (assunto) parts.push(`subject=${encodeURIComponent(assunto)}`);
  if (corpo) parts.push(`body=${encodeURIComponent(corpo)}`);
  return `mailto:${BRAND.email}${parts.length ? `?${parts.join("&")}` : ""}`;
}

// ---------------------------------------------------------------------------
// Pretextos por ação (a "opção escolhida pelo usuário")
// ---------------------------------------------------------------------------

export const MSG = {
  contato: "Olá! Vim pelo site da ogis.cloud e quero conversar sobre o meu negócio.",
  plano: (nome) =>
    `Olá! Vim pelo site da ogis.cloud e tenho interesse no plano "${nome}". Podemos conversar?`,
};

export const ASSUNTO = {
  contato: "Contato — ogis.cloud",
  plano: (nome) => `Interesse no plano ${nome} — ogis.cloud`,
};

// Âncoras de navegação (uma única página).
export const NAV = [
  { href: "#solucoes", label: "Soluções" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#planos", label: "Planos" },
  { href: "#contato", label: "Contato" },
];
