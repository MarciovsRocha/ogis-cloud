import { KeyRound, DatabaseBackup, Unlink, MoveRight } from "lucide-react";

const SINAIS = [
  {
    icon: KeyRound,
    titulo: "Domínio no seu nome",
    texto: "O endereço do seu negócio é sempre registrado no seu CPF/CNPJ. Você é o dono, não nós.",
  },
  {
    icon: DatabaseBackup,
    titulo: "Backup 3-2-1 testado",
    texto: "Cópias em locais diferentes, com teste de recuperação todo mês. Seus dados não somem.",
  },
  {
    icon: Unlink,
    titulo: "Sem fidelidade",
    texto: "Você fica porque quer. Sem multa, sem letras miúdas prendendo o seu negócio.",
  },
  {
    icon: MoveRight,
    titulo: "Migração em 30 dias",
    texto: "Quer sair? Entregamos tudo organizado para migrar em até 30 dias, sem reféns.",
  },
];

export default function Confianca() {
  return (
    <section className="bg-base-200 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SINAIS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.titulo} className="rounded-2xl border border-base-300 bg-base-100 p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-base-content">{s.titulo}</h3>
                <p className="mt-2 text-sm text-base-content/70">{s.texto}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
