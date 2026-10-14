// Título de seção da home: rótulo mono minúsculo + título alinhado à esquerda.
export default function SectionHeading({ eyebrow, title, subtitle, className = "" }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && (
        <p className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          {eyebrow.toLowerCase()}
        </p>
      )}
      <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-base-content sm:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-5 max-w-[56ch] text-lg text-base-content/70">{subtitle}</p>}
    </div>
  );
}
