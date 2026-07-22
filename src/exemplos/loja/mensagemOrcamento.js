// Monta o texto que vai para o WhatsApp ou para o corpo do e-mail.
// Função pura: recebe os itens já enriquecidos com o nome do produto.

export function montarMensagem({ nome = "", empresa = "", contato = "", observacoes = "", itens = [] } = {}) {
  const linhas = ["Olá! Vim pelo site da ogis.cloud e gostaria de um orçamento."];

  const contatos = [
    nome && `Nome: ${nome}`,
    empresa && `Empresa: ${empresa}`,
    contato && `Contato: ${contato}`,
  ].filter(Boolean);

  if (contatos.length > 0) linhas.push("", ...contatos);

  if (itens.length > 0) {
    linhas.push("", "Itens:");
    for (const item of itens) {
      const observacao = item.observacao ? ` — obs: ${item.observacao}` : "";
      linhas.push(`- ${item.nome} (${item.quantidade})${observacao}`);
    }
  }

  if (observacoes) linhas.push("", `Observações: ${observacoes}`);

  return linhas.join("\n");
}
