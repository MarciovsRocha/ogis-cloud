// Regras puras do formulário de contato do site exemplar.

export function validarContato({ nome = "", mensagem = "" } = {}) {
  const erros = {};
  if (!nome.trim()) erros.nome = "Diga como podemos te chamar.";
  if (mensagem.trim().length < 10) {
    erros.mensagem = "Conte em poucas palavras o que você precisa (mínimo de 10 caracteres).";
  }
  return erros;
}

export function textoContato({ nome = "", empresa = "", mensagem = "" } = {}) {
  return [
    "Olá! Vim pelo site da ogis.cloud.",
    nome.trim() && `Nome: ${nome.trim()}`,
    empresa.trim() && `Empresa: ${empresa.trim()}`,
    mensagem.trim() && `Mensagem: ${mensagem.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");
}
