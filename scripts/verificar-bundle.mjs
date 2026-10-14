// Gate: o que a home baixa (entrada + imports estáticos) não pode conter GSAP
// nem @font-face das fontes dos exemplares. Rode depois de `npm run build`.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const CANDIDATOS = ["dist/client", "dist"];
const raiz = CANDIDATOS.find((pasta) => existsSync(join(pasta, ".vite/manifest.json")));
if (!raiz) {
  console.error("manifest.json não encontrado — rode `npm run build` antes.");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(join(raiz, ".vite/manifest.json"), "utf8"));

function fechamentoEstatico(chave, visitados = new Set()) {
  if (visitados.has(chave)) return visitados;
  visitados.add(chave);
  for (const importado of manifest[chave]?.imports ?? []) fechamentoEstatico(importado, visitados);
  return visitados;
}

function arquivos(chaves) {
  const js = [];
  const css = [];
  for (const chave of chaves) {
    const entrada = manifest[chave];
    js.push(entrada.file);
    css.push(...(entrada.css ?? []));
  }
  return { js, css };
}

const ler = (arquivo) => readFileSync(join(raiz, arquivo), "utf8");
const GSAP = /ScrollTrigger|GreenSock/;
const FONTE_EXEMPLAR = /@font-face\s*\{[^}]*(Archivo|Manrope)/i;

const chaveEntrada = Object.keys(manifest).find((chave) => manifest[chave].isEntry);
const home = arquivos(fechamentoEstatico(chaveEntrada));
const falhas = [];

for (const arquivo of home.js) if (GSAP.test(ler(arquivo))) falhas.push(`GSAP no bundle da home: ${arquivo}`);
for (const arquivo of home.css) if (FONTE_EXEMPLAR.test(ler(arquivo))) falhas.push(`Fonte de exemplar no CSS da home: ${arquivo}`);

// Sanidade: o chunk da landing precisa conter o GSAP, senão o teste acima não prova nada.
const chaveLanding = Object.keys(manifest).find((chave) => chave.endsWith("exemplos/landing/LandingExemplar.jsx"));
const landing = arquivos(fechamentoEstatico(chaveLanding));
if (!landing.js.some((arquivo) => GSAP.test(ler(arquivo)))) falhas.push("GSAP não encontrado no chunk da landing (verificação inválida)");

if (falhas.length) {
  console.error(falhas.join("\n"));
  process.exit(1);
}
console.log(`ok — home: ${home.js.length} JS, ${home.css.length} CSS, sem GSAP e sem fontes dos exemplares.`);
