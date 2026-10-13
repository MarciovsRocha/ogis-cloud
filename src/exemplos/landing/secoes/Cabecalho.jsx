import { useRef } from "react";
import Wordmark from "../../../components/Wordmark.jsx";
import BotaoDiagnostico from "./BotaoDiagnostico.jsx";

export default function Cabecalho() {
  const ref = useRef(null);

  return (
    <header ref={ref} className="cabecalho-landing sticky top-11 z-(--z-cabecalho) bg-primary text-primary-content">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Wordmark variante="mono" className="h-6" />
        <BotaoDiagnostico sobreCobalto>Diagnóstico grátis</BotaoDiagnostico>
      </div>
    </header>
  );
}
