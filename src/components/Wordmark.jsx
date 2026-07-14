// Wordmark da marca: mark (anel dourado + ponto) + texto "ogis.cloud".
// A altura é controlada pela classe passada (ex.: h-7). O mark acompanha.
export default function Wordmark({ className = "h-7", withText = true }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-full w-auto" aria-hidden="true">
        <circle cx="27" cy="34" r="13" fill="none" stroke="currentColor" strokeWidth="6" className="text-primary" />
        <circle cx="47" cy="42" r="5" className="fill-accent" />
      </svg>
      {withText && (
        <span className="font-display text-lg font-semibold tracking-tight text-base-content">
          ogis<span className="text-primary">.cloud</span>
        </span>
      )}
    </span>
  );
}
