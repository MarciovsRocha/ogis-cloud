export default function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  const alignment = align === "left" ? "text-left" : "text-center mx-auto";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-wider text-accent">{eyebrow}</span>
      )}
      <h2 className="mt-2 text-3xl font-bold text-base-content sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-base-content/70">{subtitle}</p>}
    </div>
  );
}
