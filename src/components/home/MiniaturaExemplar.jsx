// Prévia em CSS do visual real de cada exemplar. Decorativa (aria-hidden).
// As cores são literais de propósito: é uma "foto" de outro tema, e a home não
// carrega as fontes dos exemplares.
export default function MiniaturaExemplar({ estilo }) {
  if (estilo === "campanha") {
    return (
      <div aria-hidden="true" className="flex aspect-[4/3] flex-col justify-between overflow-hidden bg-[#2734e8] p-5 text-[#f2f1ec]">
        <div className="flex items-center justify-between text-[9px] font-semibold">
          <span>ogis.cloud</span>
          <span className="rounded-full bg-[#f2f1ec] px-2 py-0.5 text-[#2734e8]">Diagnóstico grátis</span>
        </div>
        <p className="text-[1.65rem] font-black uppercase leading-[0.86] tracking-[-0.05em]">
          Um responsável. <span className="text-transparent [-webkit-text-stroke:1px_#f2f1ec]">Zero</span> dor de cabeça.
        </p>
        <div className="-mx-5 -mb-5 whitespace-nowrap bg-[#f2f1ec] py-1 text-[9px] font-black text-[#2734e8]">
          SITE ✦ E-MAIL ✦ DOMÍNIO ✦ SISTEMAS ✦ SUPORTE ✦ SITE ✦ E-MAIL
        </div>
      </div>
    );
  }

  if (estilo === "sereno") {
    return (
      <div aria-hidden="true" className="flex aspect-[4/3] flex-col overflow-hidden bg-[#fbfaf8] text-[#2b2926]">
        <div className="flex items-center justify-between border-b border-[#2b2926]/10 px-4 py-2.5 text-[9px]">
          <b className="font-extrabold">ogis.cloud</b>
          <span className="flex gap-2 opacity-75">
            <span className="font-bold opacity-100">Início</span>
            <span>Sobre</span>
            <span>Soluções</span>
          </span>
        </div>
        <div className="grid flex-1 grid-cols-[1.1fr_1fr] gap-3 p-4">
          <p className="text-[0.95rem] font-bold leading-[1.1] tracking-[-0.03em]">
            Tecnologia que funciona, sem você precisar entender dela.
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[8px] font-bold">
            <span className="col-span-2 rounded-md bg-[#e7ede6] p-2">Presença digital</span>
            <span className="rounded-md bg-[#f1eee8] p-2">Sistemas</span>
            <span className="rounded-md bg-[#f1eee8] p-2">Suporte</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="flex aspect-[4/3] flex-col gap-2 overflow-hidden bg-[#fff7ec] p-4 text-[#2a1a0e]">
      <div className="flex items-center justify-between text-[9px] font-extrabold">
        <span>catálogo ogis</span>
        <span className="rounded-md bg-[#2a1a0e] px-2 py-0.5 text-[#fff7ec]">Orçamento (2)</span>
      </div>
      <div className="grid flex-1 grid-cols-[1.4fr_1fr_1fr] grid-rows-2 gap-1.5 text-[9px] font-extrabold">
        <span className="row-span-2 rounded-xl bg-[#ff7a3d] p-2">Presença digital</span>
        <span className="rounded-xl bg-[#ffd249] p-2">Sistemas</span>
        <span className="rounded-xl bg-[#9ed8b5] p-2">E-mail</span>
        <span className="col-span-2 rounded-xl bg-[#2a1a0e] p-2 text-[#fff7ec]">Suporte</span>
      </div>
    </div>
  );
}
