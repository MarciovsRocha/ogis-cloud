import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { CATEGORIAS, CATALOGO } from "../../data/catalogo.js";
import { linkWhatsApp, MSG } from "../../config.js";
import CardCatalogo from "../../components/CardCatalogo.jsx";
import SEO from "../../components/SEO.jsx";

const DIFERENCIAIS = [
  "Um único responsável, do domínio ao suporte",
  "Domínio e contas sempre no nome da sua empresa",
  "Monitoramento 24/7 com alerta automático",
  "Sem fidelidade e sem multa de cancelamento",
];

export default function SiteHome() {
  const destaques = CATALOGO.filter((item) => item.destaque);

  return (
    <>
      <SEO
        title="Exemplar — Site Institucional"
        description="Exemplar de site institucional construído pela ogis.cloud."
        path="/exemplos/site"
        noindex
      />

      <section id="topo" className="relative overflow-hidden bg-neutral text-neutral-content">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-0 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 65%)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold leading-[1.15] sm:text-5xl">
              Tecnologia que funciona,{" "}
              <span className="text-gradient-gold">sem você precisar entender dela.</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-content/70">
              Somos a empresa que cuida da parte digital do seu negócio: site, e-mail profissional,
              sistemas sob medida e a sustentação de tudo isso. Você fala com uma pessoa só.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={linkWhatsApp(MSG.contato)}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-gold inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
              >
                Falar no WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/exemplos/site/solucoes"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-content/20 px-6 py-3.5 text-base font-semibold text-neutral-content/80 transition-colors duration-200 hover:border-primary/50 hover:text-neutral-content"
              >
                Conhecer as soluções
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="frentes" className="bg-base-200 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-3xl font-bold text-base-content sm:text-4xl">
            Quatro frentes, um responsável
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIAS.map((cat) => {
              const Icone = cat.icone;
              return (
                <Link
                  key={cat.slug}
                  to="/exemplos/site/solucoes"
                  className="group rounded-2xl border border-base-300 bg-base-100 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icone className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-semibold text-base-content">{cat.nome}</h3>
                  <p className="mt-2 text-sm text-base-content/70">{cat.promessa}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="destaques" className="bg-base-100 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-3xl font-bold text-base-content sm:text-4xl">
            O que mais nos procuram
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {destaques.map((item) => (
              <CardCatalogo
                key={item.slug}
                item={item}
                para={`/exemplos/site/solucoes/${item.slug}`}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/exemplos/site/solucoes"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-200 hover:text-accent"
            >
              Ver todas as soluções
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="diferenciais" className="bg-base-200 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-base-content sm:text-4xl">
              Por que trabalhar com a gente
            </h2>
            <p className="mt-5 text-base-content/70">
              A maior parte dos problemas que encontramos não é falta de tecnologia — é falta de
              alguém responsável. Nosso trabalho é ser esse alguém.
            </p>
          </div>
          <ul className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-7">
            {DIFERENCIAIS.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm text-base-content/80">
                <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-success" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
