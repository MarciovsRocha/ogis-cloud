// Regras puras do formulário de envio do orçamento.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SO_TELEFONE = /^[\d\s()+.-]+$/;

/** E-mail, ou telefone com DDD (10 a 13 dígitos, só com pontuação de telefone). */
export function contatoValido(texto) {
  const valor = texto.trim();
  if (EMAIL.test(valor)) return true;
  const digitos = valor.replace(/\D/g, "");
  return SO_TELEFONE.test(valor) && digitos.length >= 10 && digitos.length <= 13;
}

export function validarOrcamento({ nome = "", contato = "" } = {}) {
  const erros = {};
  if (!nome.trim()) erros.nome = "Diga como podemos te chamar.";
  if (contato.trim() && !contatoValido(contato)) {
    erros.contato = "Use um e-mail (nome@empresa.com.br) ou um telefone com DDD.";
  }
  return erros;
}
