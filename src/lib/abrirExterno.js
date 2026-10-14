// Abre um link externo (WhatsApp) em aba nova. Não usa "noopener" no open():
// com ele o navegador devolve null sempre, e não daria para distinguir um
// pop-up bloqueado. O opener é cortado à mão logo depois.
export function abrirExterno(url, janela = window) {
  const aba = janela.open(url, "_blank");
  if (aba) {
    aba.opener = null;
    return true;
  }
  janela.location.href = url;
  return false;
}
