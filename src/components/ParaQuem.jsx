import { Wrench, Gauge, Package, CalendarDays, Stethoscope, PawPrint, Dumbbell, Store } from "lucide-react";
import SectionHeading from "./SectionHeading.jsx";

const SEGMENTOS = [
  { icon: Wrench, label: "Oficinas mecânicas" },
  { icon: Gauge, label: "Preparadoras" },
  { icon: Package, label: "Lojas de peças" },
  { icon: CalendarDays, label: "Eventos automotivos" },
  { icon: Stethoscope, label: "Clínicas" },
  { icon: PawPrint, label: "Pet shops" },
  { icon: Dumbbell, label: "Academias" },
  { icon: Store, label: "Comércio local" },
];

export default function ParaQuem() {
  return (
    <section className="bg-base-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Para quem é"
          title="Feito para o comércio e o serviço local de Curitiba"
          subtitle="Nascemos no universo automotivo e hoje atendemos negócios que querem ser encontrados e organizados — sem virar especialistas em tecnologia."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SEGMENTOS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="flex flex-col items-center gap-3 rounded-2xl border border-base-300 bg-base-200 p-6 text-center transition-colors duration-200 hover:border-primary/40"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-base-content/80">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
