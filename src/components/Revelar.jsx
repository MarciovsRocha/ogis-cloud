import { useRevelar } from "../hooks/useRevelar.js";

// Envolve um bloco com a entrada .revelar. `atraso` em ms escalona irmãos.
export default function Revelar({ as = "div", atraso = 0, className = "", style, children, ...resto }) {
  const Tag = as;
  const ref = useRevelar();
  return (
    <Tag
      ref={ref}
      className={`revelar ${className}`}
      style={{ ...style, "--atraso": `${atraso}ms` }}
      {...resto}
    >
      {children}
    </Tag>
  );
}
