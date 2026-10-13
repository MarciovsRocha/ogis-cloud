import { useState, useEffect, useRef } from "react";
import { Check, Plus } from "@phosphor-icons/react";
import { useOrcamento } from "./useOrcamento.js";

export default function BotaoAdicionar({ slug, quantidade = 1, observacao = "", largo = false }) {
  const { adicionar, temItem } = useOrcamento();
  const [adicionado, setAdicionado] = useState(false);
  const timer = useRef(null);

  // Limpa o timer se o componente sair da tela antes dos 2s.
  useEffect(() => () => clearTimeout(timer.current), []);

  function aoClicar() {
    adicionar(slug, quantidade, observacao);
    setAdicionado(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdicionado(false), 2000);
  }

  const rotulo = adicionado ? "Adicionado" : temItem(slug) ? "Adicionar mais" : "Adicionar";

  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-live="polite"
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full font-bold transition-all duration-300 ease-mola active:scale-[0.97] ${
        largo ? "w-full px-6 py-4 text-base" : "px-4 py-2 text-sm"
      } ${adicionado ? "bg-success text-success-content" : "bg-secondary text-secondary-content"}`}
    >
      {adicionado ? (
        <Check weight="bold" className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Plus weight="bold" className="h-4 w-4" aria-hidden="true" />
      )}
      {rotulo}
    </button>
  );
}
