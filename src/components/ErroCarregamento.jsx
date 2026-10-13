import { Component } from "react";

export const CHAVE_RECARGA = "ogis:recarregou-exemplar";

// Um chunk lazy pode falhar ao carregar — o caso típico é uma aba aberta antes
// de um deploy pedindo um arquivo que não existe mais. Sem isto o React desmonta
// tudo e a tela fica branca. Primeira falha: recarrega uma vez para buscar os
// arquivos atuais. Se falhar de novo, mostra uma saída em vez da tela vazia.
export default class ErroCarregamento extends Component {
  state = { falhou: false };

  static getDerivedStateFromError() {
    return { falhou: true };
  }

  componentDidCatch() {
    try {
      if (!window.sessionStorage.getItem(CHAVE_RECARGA)) {
        window.sessionStorage.setItem(CHAVE_RECARGA, "1");
        window.location.reload();
      }
    } catch {
      // Sem sessionStorage (modo privado restrito): fica na mensagem abaixo.
    }
  }

  render() {
    if (!this.state.falhou) return this.props.children;

    return (
      <section
        id="conteudo"
        className="mx-auto flex min-h-[70dvh] max-w-2xl flex-col items-start justify-center px-5 py-28"
      >
        <p className="text-sm font-semibold text-base-content/70">Falha ao carregar</p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-base-content sm:text-5xl">
          Não conseguimos abrir esta página.
        </h1>
        <p className="mt-5 max-w-[50ch] text-base-content/70">
          O site pode ter sido atualizado enquanto esta aba estava aberta. Recarregar costuma resolver.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="cursor-pointer rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-content transition-transform duration-300 ease-mola active:scale-[0.98]"
          >
            Recarregar
          </button>
          <a href="/" className="rounded-full px-6 py-3 text-sm font-semibold text-base-content ring-1 ring-base-content/20">
            Voltar ao site
          </a>
        </div>
      </section>
    );
  }
}
