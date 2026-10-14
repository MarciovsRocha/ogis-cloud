// Qual tema daisyUI cada superfície do site usa. Fonte única: layouts,
// <Tema> e a faixa de exemplar leem daqui. Os temas moram em ./temas/*.css.
export const TEMA_POR_SUPERFICIE = {
  home: "ogis-infra",
  indice: "ogis-infra",
  faixa: "ogis-infra",
  landing: "exemplar-campanha",
  site: "exemplar-sereno",
  loja: "exemplar-bento",
};

export function temaDe(superficie) {
  const tema = TEMA_POR_SUPERFICIE[superficie];
  if (!tema) throw new Error(`Superfície desconhecida: ${superficie}`);
  return tema;
}
