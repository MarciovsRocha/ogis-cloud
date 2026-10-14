// Marca ogis.cloud: símbolo (anel + ponto) + texto.
// "infra": símbolo e ponto na cor primária, texto em mono (home).
// "mono": tudo na cor do texto atual (cabeçalhos dos exemplares).
// "simbolo": só o símbolo, na cor do texto atual.
function Simbolo() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-auto shrink-0" aria-hidden="true">
      <circle cx="27" cy="34" r="13" fill="none" stroke="currentColor" strokeWidth="6" />
      <circle cx="47" cy="42" r="5" fill="currentColor" />
    </svg>
  );
}

export default function Wordmark({ variante = "infra", className = "h-7" }) {
  if (variante === "simbolo") {
    return (
      <span role="img" aria-label="ogis.cloud" className={`inline-flex ${className}`}>
        <Simbolo />
      </span>
    );
  }

  const infra = variante === "infra";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`h-full ${infra ? "text-primary" : ""}`}>
        <Simbolo />
      </span>
      <span
        className={
          infra
            ? "font-mono text-[0.95rem] font-medium tracking-tight text-base-content"
            : "font-display text-lg font-bold tracking-tight"
        }
      >
        ogis<span className={infra ? "text-primary" : ""}>.cloud</span>
      </span>
    </span>
  );
}
