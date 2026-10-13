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
