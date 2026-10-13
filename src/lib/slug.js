/** "3. Domínio e propriedade" → "3-dominio-e-propriedade" (âncoras das páginas legais). */
export function slugTitulo(texto) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
