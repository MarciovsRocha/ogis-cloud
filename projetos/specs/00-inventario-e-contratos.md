# Spec 00 — Inventário do Ecossistema e Congelamento de Contratos

**Projeto:** manutencaoCarro-backend (NestJS) — spec transversal
**Posição na sequência:** 0 de 10 — **pré-requisito de tudo**. Nenhuma outra spec inicia antes do gate.
**Severidade:** Alta (sem isto, a reescrita em .NET parte de premissas falsas).
**Documento mestre:** `INTEGRACAO-OGIS-AUTOLOG.md` (raiz deste repo).

## 1. Objetivo
Produzir a fonte da verdade sobre (a) o schema real do Postgres do AutoLog, (b) o contrato HTTP v1 que a
API .NET terá de reproduzir, e (c) a população de usuários a unificar no OgisIdentity.

O risco central: `app.module.ts` usa `TypeOrmModule.forRoot({ synchronize: true })`. Isso significa que o
banco de produção pode ter divergido das entidades (colunas órfãs, tipos alterados, índices ausentes).
**As entidades TypeScript não são especificação — o banco é.**

## 2. Escopo
1. **Dump do schema real**: `pg_dump --schema-only` do banco de produção + `\d+` de cada tabela
   (`users`, `licenses`, `vehicles`, `maintenance_records`, `attachments`). Registrar tipos, defaults,
   nullability, FKs, `onDelete`, índices e constraints únicas.
2. **Diff schema real × entidades** (`src/**/entities/*.entity.ts`). Toda divergência documentada com decisão:
   preservar, corrigir ou descartar na migração.
3. **Contrato HTTP v1**: para cada rota de `src/**/*.controller.ts` — `auth`, `users`, `trials`, `licenses`,
   `vehicles`, `maintenances`, `attachments`, `ai/nf-parser` — registrar método, path, guards aplicados
   (`JwtAuthGuard` global, `@Public()`, `@Admin()`), DTO de entrada (`dto/*.ts`), shape de saída
   (os `mappers/*.ts` são a especificação de resposta) e envelope de erro produzido por
   `src/common/filters/all-exceptions.filter.ts`.
4. **Inventário de identidades**: contagem de usuários no Firebase (projeto `ogis-garage`) e em `users`
   do Postgres; lista de e-mails presentes nos dois lados (colisões a unificar na Spec 03).
5. **Inventário de segredos e integrações**: variáveis de ambiente em uso (`DB_*`, `ADMIN_EMAILS`,
   `CORS_ORIGIN`, credenciais de mail, provedor de IA), caminhos de storage em disco e volume de arquivos.
6. **Congelamento**: a partir do merge desta spec, nenhuma feature nova entra no backend Nest — só correções
   críticas, e cada uma exige atualização do contrato v1.

## 3. Arquivos-chave
- Leitura: `src/app.module.ts`, `src/main.ts`, `src/**/entities/*.entity.ts`, `src/**/*.controller.ts`,
  `src/**/mappers/*.ts`, `src/common/filters/all-exceptions.filter.ts`, `src/storage/file-validation.ts`.
- Entrega: `docs/contrato-autolog-v1.md`, `docs/schema-real-autolog.sql`, `docs/diff-schema-entidades.md`,
  `docs/inventario-ecossistema.md`, `docs/inventario-identidades.md`.

## 4. Critérios de aceite
- `docs/contrato-autolog-v1.md` cobre **100%** das rotas existentes, com exemplo de request e response reais.
- Todo item do diff schema×entidades tem decisão registrada.
- Números de usuários (Firebase, Postgres, interseção por e-mail) documentados com a data da extração.
- Nenhuma rota do Nest sem guard documentado (público vs autenticado vs admin).

## 5. Verificação
- Para cada rota do contrato, executar uma chamada real contra o Nest em staging e conferir que a resposta
  bate com o exemplo documentado (esses exemplos viram os *golden files* dos testes de contrato da Spec 07).
- `pg_dump` reaplicado num banco vazio sobe sem erro.

## 6. Gate de conclusão
Specs 01+ só iniciam após: contrato v1 completo e revisado, diff de schema decidido, inventário de
identidades fechado, e o congelamento comunicado — tudo commitado na branch de trabalho.
