import BotaoDiagnostico from "./BotaoDiagnostico.jsx";

export default function CtaFinal() {
  return (
    <section id="contato" className="flex min-h-[80dvh] items-center bg-base-100 py-24">
      <div className="mx-auto w-full max-w-6xl px-5">
        <h2 className="text-[clamp(2.25rem,10.5vw,9rem)] font-black uppercase leading-[0.86] tracking-[-0.05em]">
          Agende o diagnóstico.
        </h2>
        <p className="mt-8 max-w-[56ch] text-lg text-base-content/85">
          Uma conversa de trinta minutos sobre como a sua empresa funciona hoje. Ao final você sabe o
          que vale mexer, o que vale manter e em que ordem — mesmo que não contrate nada.
        </p>
        <div className="mt-10 flex flex-col items-start gap-4">
          <BotaoDiagnostico grande />
          <p className="text-sm text-base-content/75">Resposta no mesmo dia útil</p>
        </div>
      </div>
    </section>
  );
}
