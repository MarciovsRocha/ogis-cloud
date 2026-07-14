import { UserCheck, Wallet, TrendingUp, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading.jsx";

const PILARES = [
  {
    icon: UserCheck,
    titulo: "Um único responsável",
    texto:
      "Nada de coordenar cinco fornecedores. Uma pessoa cuida do domínio, do site, do e-mail e do sistema — e resolve com você.",
  },
  {
    icon: Wallet,
    titulo: "Uma mensalidade cuida de tudo",
    texto:
      "Previsível e sem surpresa: hospedagem, manutenção, atualizações e suporte entram no mesmo valor todo mês.",
  },
  {
    icon: TrendingUp,
    titulo: "Cresce com o seu negócio",
    texto:
      "Começa simples e escala quando você precisar — do site à gestão completa — sem trocar de fornecedor no meio do caminho.",
  },
  {
    icon: Sparkles,
    titulo: "Tecnologia invisível",
    texto:
      "Você compra resultado, não jargão. A parte complexa roda nos bastidores para o seu negócio simplesmente funcionar.",
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-base-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Como funciona"
          title="Menos fornecedor, menos dor de cabeça"
          subtitle="O jeito ogis.cloud de tirar a tecnologia da sua lista de preocupações."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {PILARES.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.titulo}
                className="flex gap-4 rounded-2xl border border-base-300 bg-base-200 p-6 transition-colors duration-200 hover:border-primary/40"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-base-content">{p.titulo}</h3>
                  <p className="mt-2 text-sm text-base-content/70">{p.texto}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
