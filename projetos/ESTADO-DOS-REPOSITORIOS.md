# Estado dos repositórios — integração OGIS Garage + AutoLog

> Fotografia tirada em **2026-07-23**. Antes de confiar em branch/commit, rode
> `git -C <repo> log --oneline -1` e `git status` para conferir se algo mudou desde então.

## 1. Onde tudo está

Diretório de trabalho da estação atual: `D:\projects\`.
Em outra máquina, clonar os quatro primeiros; os dois últimos ainda **não têm remoto**.

| Repo | Remoto | Branch da documentação | Commit |
|---|---|---|---|
| `ogis` | `https://github.com/MarciovsRocha/ogis.git` | `docs/integracao-ogis-autolog` | `1b30c47` |
| `manutencaoCaarro` | `https://github.com/fabiogarbato/manutencaoCaarro.git` | `docs/integracao-ogis-autolog` | `28c9a6b` |
| `manutencaoCarro-backend` | `https://github.com/fabiogarbato/manutencaoCarro-backend.git` | `docs/integracao-ogis-autolog` | `8e4bcd6` |
| `ogis-payment` | `git@github.com:MarciovsRocha/ogis-payment.git` (SSH) | `docs/integracao-ogis-autolog` | `8d4e86f` |
| `ogis-identity` | **nenhum** — repo local, criado com `git init` | `main` | `79981ae` |
| `ogis-autolog-api` | **nenhum** — repo local, criado com `git init` | `main` | `8a662a6` |
| `ogis-mail` | `git@github.com:MarciovsRocha/ogis-mail.git` (SSH) | — (não tocado) | — |
| `ogis-cloud` | `https://github.com/MarciovsRocha/ogis-cloud.git` | `master` | (este repo) |

**⚠️ As branches `docs/integracao-ogis-autolog` ainda NÃO foram enviadas ao remoto.** Em outra estação,
elas não existirão até que alguém rode `git push -u origin docs/integracao-ogis-autolog`.
Os repos `ogis-identity` e `ogis-autolog-api` **existem apenas nesta máquina** — precisam de remoto criado
antes de qualquer trabalho em outra estação. Enquanto isso não acontece, esta pasta (`ogis-cloud/projetos/`)
é a única cópia versionada e compartilhável de todas as specs.

## 2. Branches de código em aberto (não confundir com as de documentação)

| Repo | Branch | Situação |
|---|---|---|
| `ogis` | `feat/discount-codes-ui` | **PR #6 aberto** contra `master` — frontend dos códigos de desconto |
| `ogis-payment` | `feat/gateway-psp-pagarme` | **PR #1 aberto** contra `master` — gateway PSP + Pagar.me + descontos |

As branches de documentação foram criadas a partir de `master`/`main`, **não** a partir dessas, justamente
para não poluir os PRs em revisão. A **Spec 06 só pode ser iniciada após o merge do PR #1**.

## 3. Como rodar cada repositório

### `ogis` — frontend OGIS Garage
```bash
npm install
npm run dev        # Vite
npm run build
npm run preview    # build + wrangler dev
```
- **Segredos:** `.env.local` (gitignored) com `VITE_FIREBASE_*` (projeto Firebase `ogis-garage`) e
  `VITE_CLOUDINARY_*`. Sem eles o build quebra em runtime.
- **Armadilha conhecida:** o Vite injeta essas variáveis em **build-time**. No preview de PR do Cloudflare
  o `.env.local` não existe → erro `Missing App configuration value: "projectId"`. Corrigir cadastrando as
  variáveis no dashboard do Cloudflare no escopo **Preview** (não só Production) e adicionando o domínio de
  preview em Firebase Auth → Authorized domains. Detalhes em `ogis/ESTADO-ATUAL.md`.
- O proxy `/api` em `vite.config.js` aponta para **produção** (`https://payment.ogis.cloud`); para testar
  contra backend local é preciso editar o target manualmente (proposta de env var foi rejeitada).

### `manutencaoCaarro` — frontend AutoLog
```bash
npm install
npm run dev        # 0.0.0.0:5173
npm run typecheck
npm run build
```
- **Segredos:** `.env.local` com `GEMINI_API_KEY` (ver README do repo). `url.ts` define a base da API.

### `manutencaoCarro-backend` — backend AutoLog (NestJS)
```bash
npm install
npm run start:dev
npm test
```
- **Segredos/env:** `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `CORS_ORIGIN`,
  `ADMIN_EMAILS` (csv — promove a admin no boot), `PORT`, credenciais de e-mail e do provedor de IA.
- **⚠️ `synchronize: true`** em `src/app.module.ts`: o TypeORM altera o schema sozinho no boot. **O banco de
  produção, não as entidades, é a fonte da verdade** — é exatamente o que a Spec 00 vai inventariar.
  Não aponte uma instância de desenvolvimento para o banco de produção.

### `ogis-payment` — microserviço de pagamentos (.NET 10)
```bash
docker compose -f docker-compose.dev.yml up -d --build
# API em localhost:5001, Postgres em localhost:5433
```
- **Só roda via Docker**: `Program.cs` lança exceção fora do container e exige `FIREBASE_CONNECTION_DATA`.
- Precisa de `google-key.json` na raiz (projeto Firebase `ogis-garage`).
- **Schema por SQL bruto, não EF migrations.** `init.sql` roda apenas em volume novo; em bancos existentes,
  aplicar manualmente `migrate_psp_taxas.sql` e `migrate_discount_codes.sql`.
- Segredos por env: `PagarMe__SecretKey`, `FIREBASE_CONNECTION_DATA`, `FIREBASE_PROJECT_ID`.
- **Armadilha de NuGet:** o feed privado `git.mps.com.br` retorna **401** e aborta o restore dos testes. Use:
  ```bash
  dotnet restore ./OgisPayment.Tests/OgisPayment.Tests.csproj --source https://api.nuget.org/v3/index.json
  dotnet test    ./OgisPayment.Tests/OgisPayment.Tests.csproj --no-restore
  ```
  Isso vira uma restrição de arquitetura: o pacote `Ogis.Auth` **não pode** ser publicado nesse feed, ou a
  armadilha passa a bloquear o build de todos os serviços.

### `ogis-identity` e `ogis-autolog-api` — a criar
Contêm **apenas documentação**. O scaffold .NET ainda não existe; ambos devem espelhar a estrutura
hexagonal de `ogis-payment/OgisPayment.Api` (`Domain / Application / Infrastructure / Controllers`),
com Docker desde o primeiro dia. Diferença deliberada: **usam EF Core + migrations**, não SQL bruto.

## 4. Infraestrutura

- **Hoje e no destino:** containers em **VPS da IONOS**.
- **Frontends:** Cloudflare Pages/Workers (`wrangler`).
- **Subdomínios planejados:** `ogisgarage.com.br` (Garage), `app.ogisgarage.com.br` (AutoLog),
  `id.ogis.cloud` (IdP), `api.ogis.cloud` (gateway).
- **Cache:** Redis (L2, compartilhado) + edge cache do Cloudflare.

## 5. Segredos necessários antes de começar (checklist para uma estação nova)

- [ ] `.env.local` do `ogis` (Firebase `ogis-garage` + Cloudinary)
- [ ] `.env.local` do `manutencaoCaarro` (`GEMINI_API_KEY`)
- [ ] Variáveis de banco do `manutencaoCarro-backend` + acesso a um dump do Postgres (**não** à produção)
- [ ] `google-key.json` e `PagarMe__SecretKey` do `ogis-payment`
- [ ] Acesso ao console do Firebase (projeto `ogis-garage`) — necessário para o export de usuários da Spec 03
- [ ] Acesso ao dashboard do Cloudflare (vars de Preview e Production, purge de cache)
- [ ] Acesso SSH à VPS IONOS
- [ ] Chave SSH cadastrada no GitHub (os repos `ogis-payment` e `ogis-mail` usam remoto SSH)

Nenhum desses segredos está neste repositório, e nenhum deve ser commitado aqui.
