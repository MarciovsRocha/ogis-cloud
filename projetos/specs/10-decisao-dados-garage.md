# Spec 10 — Decisão sobre os dados do Garage (Firestore vs PostgreSQL)

**Projeto:** ogis (Garage)
**Posição na sequência:** 10 de 10 — **depende do gate da Spec 09**.
**Severidade:** Média (decisão estrutural; adiada deliberadamente pelo usuário).
**Natureza:** esta spec produz uma **decisão documentada**, não código. A implementação vira a Spec 11+.

## 1. Objetivo
Decidir, com dados em mãos, o destino de cada categoria de informação do OGIS Garage — hoje toda no
Firestore, acessada diretamente pelo front em `src/services/api.js` (coleções `events`, `participants`,
`users`), com mídia em Cloudinary/Firebase Storage.

O usuário apontou corretamente que há **dados estruturados e não estruturados**, além de integrações — e
que a decisão só faz sentido depois que o cache (Spec 09) mostrar o custo real de leitura.

## 2. Categorias a classificar
1. **Transacional/estruturado** — eventos, inscrições, participantes, vínculo com pagamentos e descontos.
   Precisa de joins, relatórios, consistência e integridade referencial com `ogis-payment`.
   → candidato natural a **Postgres + `Ogis.Garage.Api`** (.NET, mesmo padrão do `ogis-autolog-api`).
2. **Não estruturado / mídia** — fotos de evento, galeria, documentos. Não pertence a banco relacional.
   → **Cloudinary / R2 / S3 + CDN**, com apenas os metadados no banco escolhido.
3. **Conteúdo público de leitura pesada** — home, eventos passados, páginas institucionais.
   → decisão dominada pelo **edge cache** (Spec 09): se o custo de leitura já caiu, a urgência de migrar cai junto.
4. **Integrações** — pagamentos (`ogis-payment`), e-mail (`ogis-mail`), mídia. Já são APIs .NET; não mudam.

## 3. Critérios de decisão (preencher com números reais)
- Custo mensal de leitura/escrita no Firestore **pós-cache** (Spec 09).
- Consultas hoje impossíveis ou caras no Firestore (relatórios, joins evento×pagamento×participante).
- Acoplamento das regras de segurança do Firestore a `request.auth` — após a Spec 05, o Firebase Auth deixa
  de emitir a identidade, então **regras dependentes de `request.auth` precisam de solução de qualquer forma**.
  *Este é provavelmente o fator decisivo.*
- Esforço de reescrita de `src/services/api.js` e das páginas que o consomem
  (`Eventos.jsx`, `EventoDetalhe.jsx`, `GalleryPage.jsx`, `Admin.jsx`, `MyDownloads.jsx`).
- Necessidade de consistência transacional entre inscrição e pagamento.

## 4. Preparação técnica (esta pode ser feita já)
Isolar o Firestore atrás da interface `api` existente em `src/services/api.js`, garantindo que **nenhuma
página importe `firebase/firestore` diretamente**. Com essa fronteira intacta, trocar a origem dos dados
depois é substituir uma implementação — não refatorar o app inteiro.

## 5. Entregável
`docs/decisao-dados-garage.md` com: classificação de cada coleção nas 4 categorias, números de custo e
volume, a decisão por categoria, e o desenho da migração escolhida (incluindo estratégia de dupla escrita
ou janela de migração, se for para Postgres).

## 6. Critérios de aceite
- Toda coleção do Firestore classificada e com destino decidido.
- Nenhuma página do Garage importa `firebase/firestore` diretamente (fronteira verificada por grep).
- Números de custo e de volume citados com data de coleta.
- Impacto das regras de segurança do Firestore pós-OIDC endereçado explicitamente.

## 7. Gate de conclusão
A pipeline de integração encerra aqui. A implementação da migração de dados (se decidida) entra como
Spec 11, com seu próprio plano.
