import { useState, useEffect, useRef } from "react";
import { Plus, Check } from "lucide-react";
import { useOrcamento } from "./useOrcamento.js";

export default function BotaoAdicionar({ slug, quantidade = 1, observacao = "", largo = false }) {
  const { adicionar } = useOrcamento();
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

  return (
    <button
      type="button"
      onClick={aoClicar}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
        largo ? "w-full py-3.5 text-base" : ""
      } ${
        adicionado
          ? "bg-success text-success-content"
          : "bg-primary text-primary-content hover:-translate-y-0.5"
      }`}
      aria-live="polite"
    >
      {adicionado ? (
        <>
          <Check className="h-4 w-4" />
          Adicionado
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          Adicionar ao orçamento
        </>
      )}
    </button>
  );
}
