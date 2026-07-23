# Pipeline de Integração OGIS Garage + AutoLog

Sequência **global** de specs, distribuída pelos repositórios envolvidos.
Regra do pipeline: **cada spec só inicia após o gate de conclusão da anterior**.
Documento mestre da análise: `INTEGRACAO-OGIS-AUTOLOG.md` (presente na raiz de todos os repos abaixo).

| # | Spec | Repositório | Arquivo | Status |
|---|---|---|---|---|
| 00 | Inventário do ecossistema e congelamento de contratos | `manutencaoCarro-backend` | `.specs/00-inventario-e-contratos.md` | Pendente |
| 01 | OgisIdentity — fundação **OAuth 2.1/OIDC** com PKCE e DPoP | `ogis-identity` | `.specs/01-fundacao-oidc.md` | Pendente |
| 02 | OgisIdentity — RBAC multi-app + **ABAC/Zero Trust** + `Ogis.Auth` | `ogis-identity` | `.specs/02-autorizacao-multiapp.md` | Pendente |
| 03 | OgisIdentity — federação Google e unificação de identidades | `ogis-identity` | `.specs/03-federacao-e-migracao-de-identidades.md` | Pendente |
| 04 | OgisIdentity — resiliência, observabilidade e operação | `ogis-identity` | `.specs/04-resiliencia-e-operacao.md` | Pendente |
| 05 | Garage (front) — Firebase Auth → OIDC + DPoP + `@ogis/auth-web` | `ogis` | `.specs/05-garage-front-oidc.md` | Pendente |
| 06 | ogis-payment — adoção do OgisIdentity (DPoP + step-up) | `ogis-payment` | `.specs/06-integracao-ogis-identity.md` | Pendente (após merge do PR #1) |
| 07 | AutoLog API — reescrita NestJS → .NET (big bang) | `ogis-autolog-api` | `.specs/07-reescrita-backend-dotnet.md` | Pendente |
| 08 | AutoLog (front) — OIDC/DPoP, router e nova API | `manutencaoCaarro` | `.specs/08-autolog-front-oidc-e-router.md` | Pendente |
| 09 | Cache — Redis (L2) + edge Cloudflare | `ogis-autolog-api` (transversal) | `.specs/09-cache-redis-e-edge.md` | Pendente |
| 10 | Decisão sobre os dados do Garage (Firestore vs Postgres) | `ogis` | `.specs/10-decisao-dados-garage.md` | Pendente |

## Repositórios

| Repo | Papel | Situação |
|---|---|---|
| `D:\projects\ogis` | Frontend OGIS Garage (React 19/Vite/Cloudflare) | Existente |
| `D:\projects\manutencaoCaarro` | Frontend AutoLog (React 18/TS/Vite) | Existente |
| `D:\projects\manutencaoCarro-backend` | Backend AutoLog (NestJS) | Existente — a ser substituído |
| `D:\projects\ogis-payment` | Microserviço de pagamentos (.NET 10) | Existente |
| `D:\projects\ogis-mail` | Microserviço de e-mail (.NET) | Existente — reutilizado |
| `D:\projects\ogis-identity` | **Novo** — IdP central da ogis.cloud | A criar (Specs 01–04) |
| `D:\projects\ogis-autolog-api` | **Novo** — backend AutoLog em .NET | A criar (Spec 07) |

## Artefatos compartilhados (escritos uma vez, usados por todos)

| Artefato | Origem | Consumidores |
|---|---|---|
| **`Ogis.Auth`** (.NET) | Spec 02 | autolog, payment, mail, garage, gateway |
| **`@ogis/auth-web`** (TS) | Spec 05 | Garage (05), AutoLog (08), futuros SPAs OGIS |

## Decisões fixadas

**Produto e infra**
- Projetos **separados porém integrados**, com link direto; governança ogis.cloud.
- **Subdomínios**: `ogisgarage.com.br` (Garage), `app.ogisgarage.com.br` (AutoLog),
  `id.ogis.cloud` (IdP), `api.ogis.cloud` (gateway).
- Backend AutoLog: **reescrita completa (big bang)**, com o Nest congelado 30 dias como rollback.
- Infra: **containers em VPS IONOS** (hoje e no destino).
- Cache: **Redis + edge cache Cloudflare**.
- Destino dos dados do Firestore: **decisão adiada** para a Spec 10.

**Segurança — estado da arte (define as Specs 01, 02, 04, 05, 06, 08)**
- **OAuth 2.1 estrito**: fluxo implícito e ROPC **desabilitados** e verificados por teste negativo;
  `redirect_uri` por comparação exata (sem wildcard — cada preview do Cloudflare é registrado).
- **PKCE S256 obrigatório para TODO cliente**, inclusive confidenciais. `plain` recusado.
- **Access token de 10 min**, em memória; **refresh rotativo com detecção de reuso**, em cookie
  `HttpOnly + Secure + SameSite=Lax + Path` restrito. **Zero JWT em `localStorage`.**
- **DPoP (RFC 9449) nos SPAs** — chave não-exportável no WebCrypto/IndexedDB; `cnf.jkt` validado por
  **todos** os resource servers via `Ogis.Auth`.
- **ABAC/Zero Trust** com **PDP no IdP + PEP no `Ogis.Auth`**, consultando `risk:{sid}` no Redis a cada
  requisição. Sinais: **rede/geo, comportamento e sensibilidade da ação** (campo `assurance` por permissão).
- **Step-up MFA é a única reação automática** ao risco (`401 insufficient_user_authentication`);
  revogação de sessão permanece **ação administrativa explícita**.
- **Shadow mode obrigatório** antes de ligar o enforcement do motor de risco.
- **MFA (TOTP + passkey) para todos os usuários**, não só admin — com fallback por e-mail, porque sem
  segundo fator cadastrado não há como responder a um step-up.
- Degradação definida: Redis fora do ar → **`fail-open` em leitura, `fail-closed` em ação sensível**;
  IdP fora do ar → APIs seguem validando por JWKS em cache.
