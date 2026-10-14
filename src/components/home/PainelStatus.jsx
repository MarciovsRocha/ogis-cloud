// Painel ilustrativo do hero: a metáfora "está tudo sob controle".
// Não é dado real — o aria-label descreve o que ele representa.
const LINHAS = [
  { servico: "domínio", estado: "no seu nome", carimbo: "renovação automática" },
  { servico: "site", estado: "no ar", carimbo: "verificado há 2 min" },
  { servico: "e-mail", estado: "ativo", carimbo: "entregando normalmente" },
  { servico: "backup", estado: "diário", carimbo: "último às 03:00" },
];

export default function PainelStatus() {
  return (
    <figure
      aria-label="Ilustração de painel: domínio no seu nome, site no ar, e-mail ativo e backup diário."
      className="rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/10"
    >
      <div className="rounded-[calc(2rem-0.375rem)] bg-base-100 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-7">
        <div className="flex items-center justify-between gap-4 font-mono text-xs text-base-content/60">
          <span>sua-empresa.com.br</span>
          <span className="inline-flex items-center gap-1.5 text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            tudo operando
          </span>
        </div>
        <ul aria-hidden="true" className="mt-6 divide-y divide-white/[0.06]">
          {LINHAS.map((linha) => (
            <li key={linha.servico} className="flex items-center justify-between gap-4 py-4">
              <span className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]" />
                <span className="text-sm text-base-content">{linha.servico}</span>
              </span>
              <span className="text-right">
                <span className="block text-sm font-medium text-base-content">{linha.estado}</span>
                <span className="block font-mono text-xs text-base-content/60">{linha.carimbo}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
