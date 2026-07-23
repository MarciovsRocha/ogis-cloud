# Integração OGIS Garage + AutoLog (manutençãoCarro) — Mapa, Auth Central e Migração para .NET

## Context

Hoje existem dois produtos independentes, com ecossistemas incompatíveis, e nenhuma identidade
compartilhada entre eles nem com os demais sistemas da ogis.cloud:

| | **ogis** (OGIS Garage) | **AutoLog** (manutençãoCarro) |
|---|---|---|
| Repo | `D:\projects\ogis` | `D:\projects\manutencaoCaarro` (FE) + `D:\projects\manutencaoCarro-backend` (BE) |
| Front | React 19, Vite 7, **JavaScript**, Tailwind v4 + DaisyUI (`ogis-dark`), react-router 7, TanStack Query, react-hot-toast | React 18, Vite 5, **TypeScript**, CSS próprio + `components/ui`, **sem router** (state `View` em `App.tsx`), recharts |
| Backend | Nenhum próprio — `src/services/api.js` fala **direto com o Firestore**; `ogis-payment` (.NET 10) para pagamentos | **NestJS 11 + TypeORM + PostgreSQL**, `synchronize: true` (sem migrations) |
| Auth | **Firebase Auth** (Google popup), flag `isAdmin` em `users/{uid}` no Firestore (`src/contexts/AuthContext.jsx`) | **JWT próprio** + bcrypt, `tokenStore` em localStorage (`services/tokenStore.ts`, `services/http.ts`), guards globais `JwtAuthGuard`/`AdminGuard`, seed por `ADMIN_EMAILS` |
| Dados | Firestore (`events`, `participants`, `users`) + Cloudinary + Firebase Storage | Postgres: `users`, `licenses`, `vehicles`, `maintenance_records`, `attachments` |
| Domínio extra | descontos, pagamentos (PSP/Pagar.me em `ogis-payment`) | trials, licenses, veículos, manutenções, anexos, `ai/nf-parser` (pdf-parse), mail, storage local |
| Deploy | Cloudflare Pages/Workers (`ogisgarage.com.br`), `wrangler` | Docker (Dockerfile em ambos os repos) |

**Decisões tomadas com o usuário:**
1. Projetos permanecem **separados porém integrados**, com link direto entre eles; ambos governados pela ogis.cloud.
2. **Serviço central de AuthN/AuthZ da ogis.cloud** — próprio, robusto, com federação de login externo (Google) e
   **níveis de acesso por aplicação**; usável por *todos* os sistemas OGIS (payment, mail, manager, cloud…).
3. Backend AutoLog: **reescrita completa (big bang)** Nest → .NET.
4. Topologia: **subdomínios**.
5. Infra: **containers em VPS IONOS** hoje; VPS+container também no destino.
6. Cache: **Redis (L2) + edge cache Cloudflare**; destino do Firestore ainda **em aberto** (decisão adiada).

---

## Arquitetura alvo

```
                    ┌──────────────── Cloudflare (DNS/CDN/WAF) ────────────────┐
  ogisgarage.com.br │  Pages: ogis (Garage)                                    │
  app.ogisgarage... │  Pages: AutoLog (React+TS)                               │
  ogis.cloud        │  Pages: institucional                                    │
                    └──────┬──────────────────────┬────────────────────────────┘
                           │ OIDC redirect        │ Bearer JWT (RS256)
                  ┌────────▼─────────┐   ┌────────▼──────────── VPS IONOS (Docker) ─────────┐
                  │ id.ogis.cloud    │   │ api.ogis.cloud (YARP gateway)                    │
                  │ **OgisIdentity** │   │  ├─ /autolog/*  → Ogis.AutoLog.Api  (.NET)       │
                  │ OpenIddict/OIDC  │   │  ├─ /payment/*  → OgisPayment.Api   (existente)  │
                  │ JWKS + refresh   │   │  ├─ /mail/*     → ogis-mail         (existente)  │
                  └───┬──────────────┘   │  └─ /garage/*   → Ogis.Garage.Api   (fase 4)     │
                      │                  └──────────────────────────────────────────────────┘
        Postgres(identity) + Redis(sessão/cache)     Postgres(autolog) + Redis + MinIO/S3
                      │
                Google OIDC (federado) · Firebase só como legado durante a transição
```

Subdomínios: `id.ogis.cloud` (IdP), `api.ogis.cloud` (gateway), `app.ogisgarage.com.br` (AutoLog),
`ogisgarage.com.br` (Garage). Link direto entre os apps via header/menu compartilhado; SSO silencioso
por cookie de sessão no IdP + `prompt=none`.

---

## Fase 0 — Inventário e contratos (pré-requisito, ~2 dias)

- Extrair o schema real do Postgres AutoLog (`\d+` de cada tabela) — `synchronize: true` significa que o
  banco de produção é a fonte da verdade, **não** as entidades.
- Exportar a superfície HTTP do Nest: todos os controllers em `manutencaoCarro-backend/src/**/*.controller.ts`
  (`auth`, `users`, `trials`, `licenses`, `vehicles`, `maintenances`, `attachments`, `ai/nf-parser`) →
  documento `docs/contrato-autolog-v1.md` com rota, DTO de entrada, shape de saída (usar os `mappers/*.ts`
  como especificação de resposta) e códigos de erro produzidos por `common/filters/all-exceptions.filter.ts`.
- Contar usuários Firebase (`ogis-garage`) e usuários Postgres AutoLog; detectar e-mails em ambos (colisões).
- Congelar features novas no Nest a partir daqui.

**Entregável:** `docs/contrato-autolog-v1.md` + `docs/inventario-ecossistema.md` (tabela acima expandida).

---

## Fase 1 — OgisIdentity: o serviço central de AuthN/AuthZ

Novo repo `D:\projects\ogis-identity`, .NET 10, mesmo padrão hexagonal de `ogis-payment`
(Domain / Application / Infrastructure / Controllers), Docker + `docker-compose.dev.yml`.

### 1.1 Protocolo — conformidade **OAuth 2.1** (não OAuth 2.0)
- **OpenIddict** como servidor OpenID Connect certificável (alternativa: Duende, licença paga acima de receita).
- **Perfil OAuth 2.1 aplicado com rigor**, o que significa remover explicitamente da configuração:
  - **fluxo implícito** (`response_type=token`) — **desabilitado**, sem exceção;
  - **Resource Owner Password Credentials** — **desabilitado** (o AutoLog hoje depende de um equivalente:
    `POST /auth/login` com e-mail e senha; isso morre na Spec 08, o front passa a redirecionar ao IdP);
  - `redirect_uri` por **comparação exata de string** (sem wildcard, sem match por prefixo);
  - refresh token **obrigatoriamente rotativo com detecção de reuso** (reuso revoga a família).
- **PKCE (S256) obrigatório para TODO cliente**, inclusive os confidenciais de serviço — não apenas para os
  públicos. `plain` recusado.
- Fluxos permitidos: **Authorization Code + PKCE** (SPAs) e **Client Credentials** (serviço↔serviço,
  payment→mail etc.). Nenhum outro.
- Tokens **RS256** com chave em rotação; `JWKS` público em `https://id.ogis.cloud/.well-known/jwks.json`;
  discovery em `/.well-known/openid-configuration` — todo serviço OGIS valida offline pelo JWKS (sem
  chamada síncrona ao IdP no caminho quente).

### 1.1.1 Tokens de curta duração e sender-constraining (**DPoP**)
- **Access token: 10 min** (dentro da faixa 5–15 pedida). `id_token` 10 min. Refresh: janela deslizante
  curta com rotação a cada uso e teto absoluto de sessão.
- Refresh token em **cookie `HttpOnly` + `Secure` + `SameSite=Lax` + `Path` restrito ao endpoint de token**,
  no domínio do IdP. Access token vive **apenas em memória** no SPA — **nada de JWT em `localStorage`**,
  o que corrige a exposição atual do AutoLog (`manutencaoCaarro/services/tokenStore.ts`).
- **DPoP (RFC 9449) nos SPAs**: cada requisição carrega prova de posse de uma chave privada
  **não-exportável** gerada via WebCrypto e guardada em IndexedDB. O access token fica atado ao `jkt` do
  cliente — **token exfiltrado não é reutilizável em outro dispositivo**. Implica:
  - IdP emite e valida `DPoP` no `/connect/token`, com `nonce` para impedir replay;
  - **`Ogis.Auth` valida o `cnf.jkt`** em todos os resource servers (autolog, payment, mail, garage) —
    portanto DPoP é requisito da Spec 02, não um extra opcional;
  - serviço↔serviço (client credentials) segue Bearer, isolado na rede interna.

### 1.2 Modelo de autorização multi-aplicação
Este é o núcleo do requisito "níveis de acesso com base em cada aplicação":

```
Tenant (ogis.cloud)
 └─ Application  (garage, autolog, payment, mail, manager…)   ← client_id + audience
     └─ Role     (owner, admin, staff, member…)  escopo = Application
         └─ Permission ("vehicles:write", "events:publish", "discounts:manage")
User ──< UserApplicationRole >── (Application, Role)   [+ escopo opcional por recurso]
```

- Claims no access token: `sub`, `aud` (app alvo), `ogis:app`, `roles[]`, `perms[]` (compactadas),
  `tenant`, `amr` (google/password), `sid`. Permissões finas resolvidas por app — o token do AutoLog
  **não** carrega permissões do Garage.
- Consumo nos serviços: policy-based authorization .NET (`RequirePermission("vehicles:write")`),
  publicado como pacote interno **`Ogis.Auth`** (handler + extensão `AddOgisAuth(audience)`), para que
  payment/mail/autolog/garage compartilhem exatamente a mesma validação.
- Admin do IdP: CRUD de aplicações, roles, permissões e atribuições (substitui o `ADMIN_EMAILS` do Nest e
  o `isAdmin` do Firestore).

### 1.2.1 ABAC / Zero Trust — autorização contínua baseada em risco
RBAC por aplicação (1.2) responde *"o que este usuário pode fazer"*. O ABAC responde *"ele pode fazer isso
**agora**, deste lugar, neste dispositivo, com este comportamento"* — e reavalia **a cada requisição**,
não só no login.

**Arquitetura PEP/PDP:**
- **PDP** (Policy Decision Point) — serviço de políticas do `ogis-identity`, com as regras versionadas
  em código e um **score de risco** por sessão publicado no **Redis** (`risk:{sid}`).
- **PEP** (Policy Enforcement Point) — dentro do **`Ogis.Auth`**, executando no gateway e em cada resource
  server. Combina, por requisição: `perms[]` do token (RBAC, offline por JWKS) **+** consulta ao Redis
  (score de risco, lista de revogação, nível de autenticação vigente). O Redis está no mesmo datacenter,
  então o custo é sub-milissegundo e **preserva a propriedade de que o IdP fora do ar não derruba as APIs**
  (política default configurável: `fail-open` para leitura, `fail-closed` para ação sensível).

**Atributos avaliados** (escolha do usuário — sem fingerprint de dispositivo, já parcialmente coberto pelo
binding de chave do DPoP):
1. **Rede e geolocalização** — IP, ASN, país, viagem impossível, proxy/Tor/bot score. Os headers do
   Cloudflare (`CF-IPCountry`, `CF-Connecting-IP`, bot score) chegam de graça no gateway.
2. **Comportamento** — horário atípico frente ao baseline do usuário, volume e velocidade de requisições,
   sequência anômala de ações, tentativa de escalada de privilégio. Baseline por usuário construído a
   partir de `audit_events`.
3. **Sensibilidade da ação** — a operação entra na conta: criar pagamento, alterar senha, gerir permissões
   e rotas admin exigem confiança maior do que uma leitura. Cada permissão recebe um **nível de garantia
   exigido** (`assurance`), declarado junto com o catálogo de permissões.

**Resposta ao risco: `step-up` de autenticação** (única reação automática definida). Quando o risco supera
o limiar da ação, o PEP responde **`401` com `WWW-Authenticate: ... error="insufficient_user_authentication",
acr_values=...`** (padrão OIDC); o SPA reenvia o usuário ao IdP com `acr_values` e `prompt=login`; após
TOTP/passkey o IdP emite token com `acr`/`amr` elevados e `auth_time` recente, e a ação prossegue.
Nada de bloqueio silencioso — o usuário sempre tem caminho de saída. Revogação total de sessão continua
existindo, mas como **ação administrativa explícita** (Spec 04), não como reação automática.

**Rollout obrigatório em duas etapas:** o motor entra primeiro em **shadow mode** (pontua e audita, não
força step-up) pelo tempo necessário para calibrar limiares com tráfego real. Ligar enforcement sem
baseline gera falsos positivos em massa e é a forma mais rápida de o time desligar o Zero Trust inteiro.

**Verificação:** matriz de casos por atributo (país novo, viagem impossível, horário atípico, rajada de
requests, ação sensível com `auth_time` velho) — cada um produzindo step-up e, após o step-up, sucesso.

### 1.3 Identidade e federação
- Login local: e-mail + senha com **Argon2id** (novos) e verificação transparente de hashes **bcrypt**
  legados (rehash no primeiro login bem-sucedido) → migra os usuários AutoLog sem forçar reset.
- **Login com Google** via OIDC federado nativo (não via Firebase). Vinculação por e-mail verificado;
  contas com mesmo e-mail em Firebase e AutoLog viram **um único usuário com duas identidades**
  (`user_identities`: provider, provider_subject).
- Migração Firebase: exportar usuários (`firebase auth:export`) → importar em `users` + `user_identities`
  (`provider='google'` ou `provider='firebase'` transitório). Firebase Auth continua ativo até o cutover
  do front do Garage e depois é desativado.
- Extras de robustez: verificação de e-mail (via `ogis-mail`), recuperação de senha, lockout progressivo,
  rate limit por IP/conta, log de auditoria imutável, revogação de sessão por dispositivo
  (`sid` + lista de revogação no Redis).
- **MFA disponível para todos os usuários, não só admin** — isto muda por causa do step-up: um usuário sem
  segundo fator cadastrado não tem como responder a uma exigência de `acr` elevado. TOTP + **passkey
  (WebAuthn)** como fatores; obrigatório para contas com permissões administrativas, opcional-mas-induzido
  para os demais, com fallback definido (código por e-mail via `ogis-mail`) para quem ainda não cadastrou.

### 1.4 Disponibilidade ("à prova de falhas")
- 2 réplicas do container atrás do proxy; Postgres com backup diário + PITR; Redis para sessões/lockout.
- Como a validação é por JWKS, **uma queda do IdP não derruba as APIs** — só impede novos logins.
- Health checks (`/health/live`, `/health/ready`), `/metrics`, cache de JWKS nos consumidores (TTL + retry).

### 1.5 Integração dos serviços existentes
- `ogis-payment`: hoje valida **Firebase JWT**. Adicionar validação dupla (Firebase **e** OgisIdentity)
  durante a transição, depois remover o Firebase. Ponto de entrada: configuração de autenticação em
  `OgisPayment.Api/Program.cs` (mesmo lugar onde `FIREBASE_CONNECTION_DATA` é exigido).

**Verificação da fase:** suíte de integração no `ogis-identity` — code+PKCE ponta a ponta, rotação de
refresh, detecção de reuso, permissão negada cruzando apps, **fluxo implícito e ROPC recusados**,
**PKCE ausente ou `plain` recusado**, **`redirect_uri` com wildcard recusado**, **access token de um
dispositivo rejeitado em outro (DPoP)**, **step-up disparado e resolvido** — mais login real do Garage e do
AutoLog em staging. Complementar com uma varredura de conformidade OAuth 2.1 sobre o discovery publicado.

---

## Fase 2 — Reescrita do backend AutoLog em .NET (big bang)

Novo repo `D:\projects\ogis-autolog-api`, .NET 10, **EF Core + Npgsql**, mesma arquitetura de `ogis-payment`.
Contrato HTTP **idêntico ao v1** (Fase 0) para o front atual continuar funcionando com trocas mínimas.

Mapeamento módulo a módulo:

| Nest | .NET | Observações |
|---|---|---|
| `auth/*` (JWT, bcrypt, first-login token) | **removido** | Substituído por OgisIdentity; front passa a usar OIDC |
| `users/*` | `Users` (perfil de aplicação) | Dados de identidade saem para o IdP; sobra o perfil AutoLog referenciando `user_id` (GUID do IdP) |
| `licenses/*`, `trials/*` | `Licensing` | `LicensePlan`/`LicenseStatus` viram enums mapeados; trial calculado em `TrialService`. Roles refletidas no IdP |
| `vehicles/*` | `Vehicles` | Isolamento multi-tenant hoje é `user_id` no `Vehicle`; passa a ser filtro global do EF por `sub` do token |
| `maintenances/*` + `attachments` | `Maintenance` | Portar `mappers/*.ts` para os DTOs de saída |
| `storage/*` (`file-validation.ts`) | `Storage` | Trocar disco local por **S3/MinIO** (ou R2); manter validação de MIME/tamanho |
| `mail/*` | delegar ao **ogis-mail** existente | Não reimplementar |
| `ai/nf-parser` | `NfParser` | `pdf-parse` → PdfPig/Docnet + provedor LLM. Reavaliar o parser durante o port |
| `common/filters/all-exceptions.filter.ts` | `ProblemDetails` middleware | Mesmo shape de erro na v1; padronizar RFC 7807 na v2 |

**Banco:** manter o Postgres existente e o schema atual como ponto de partida (dados de produção
preservados), mas passar a **gerenciar por migrations EF Core** — `synchronize: true` deve morrer.
Script de baseline gerado a partir do banco real (Fase 0). Remoção das colunas de autenticação
(`senha`, `firstLoginToken`, `firstLoginAttempts`, `isAdmin`) só **depois** do cutover do IdP.

**Cache:** `HybridCache` (L1 memória + **L2 Redis**) para FIPE, listas de veículos, licença/trial e
resolução de permissões; invalidação por tag em escrita. Nos endpoints públicos, `Cache-Control` +
`ETag` para o edge cache do Cloudflare, com purge por tag no deploy/escrita.

**Cutover:** ambiente paralelo → replay de tráfego/testes de contrato contra o Nest → janela de manutenção
→ apontar o gateway para a API .NET → Nest congelado por 30 dias como rollback.

---

## Fase 3 — Frontends

**Requisitos que valem para os DOIS frontends** (consequência de 1.1.1 e 1.2.1):
- Cliente OIDC com **code+PKCE S256** e **DPoP**: gerar par de chaves não-exportável no WebCrypto, guardar
  em IndexedDB, assinar cada requisição. Encapsular isso **uma vez** num módulo compartilhado
  (`@ogis/auth-web`) — duplicar essa lógica em dois SPAs é como ela vai divergir e quebrar.
- **Access token só em memória**; refresh vive no cookie do IdP. Recarregar a página recupera a sessão por
  refresh silencioso, não por leitura de storage.
- **Tratar `401` com `insufficient_user_authentication`** como step-up: reenviar ao IdP com `acr_values`,
  e **retomar a ação original** após o retorno (guardar a intenção antes do redirect — sem isso o usuário
  perde o formulário preenchido e a feature vira reclamação).
- Sessão de 10 min de access token exige refresh silencioso confiável: um bug aqui aparece como "o sistema
  me desloga sozinho a cada 10 minutos".

**AutoLog FE** (`manutencaoCaarro`):
- Remover `services/tokenStore.ts` e a lógica de login/registro de `contexts/AuthContext.tsx`; adotar
  `oidc-client-ts` (code+PKCE, refresh silencioso). `services/http.ts` passa a pegar o access token do
  provider OIDC — a interface `getToken()` já existe, então o *blast radius* é pequeno.
- `components/AuthPage.tsx` e `LicenseActivationPage.tsx`: login/registro vão para o IdP; sobra só o fluxo
  de licença.
- Introduzir **react-router** (hoje é `View` em state) para permitir deep-link entre os apps.
- Apontar `url.ts` → `https://api.ogis.cloud/autolog`.

**Garage FE** (`ogis`):
- `src/contexts/AuthContext.jsx`: trocar `signInWithPopup` do Firebase por OIDC; `isAdmin` deixa de vir do
  documento Firestore e passa a vir de `roles[]` no token.
- `src/services/api.js` continua no Firestore por ora (decisão adiada) — mas isolar por trás da interface
  atual para permitir trocar a origem depois sem tocar nas páginas.
- Adicionar TanStack Query onde ainda houver fetch direto + headers de cache para o edge.

**Integração entre os apps:** componente de header/menu OGIS compartilhado (pacote `@ogis/ui` ou snippet
duplicado inicialmente), com link direto `ogisgarage.com.br ⇄ app.ogisgarage.com.br` — como o SSO é por
cookie no IdP, o usuário atravessa sem novo login.

---

## Fase 4 — Dados do Garage (decisão adiada)

Não resolver agora. Preparar a decisão com um documento `docs/decisao-dados-garage.md` que separe:
- **Estruturado/transacional** (events, participants, inscrições, usuários) → candidato a Postgres +
  `Ogis.Garage.Api`.
- **Não estruturado / mídia** (fotos, galeria) → Cloudinary/R2 + CDN, sem banco relacional.
- **Integrações** (pagamentos, mail) → já são APIs .NET.
Critérios: necessidade de relatório/joins, custo de leitura no Firestore, e o cache Redis+edge (que reduz
a pressão de leitura e portanto a urgência da migração).

---

## Ordem de execução e riscos

1. Fase 0 (inventário/contratos) → 2. Fase 1 (OgisIdentity) → 3. Fase 3 parcial (front do Garage no IdP,
   valida SSO com baixo risco) → 4. Fase 2 (backend .NET) → 5. Fase 3 restante (AutoLog FE) → 6. Fase 4.

Riscos principais: (a) `synchronize: true` significa que o schema real pode divergir das entidades —
Fase 0 é obrigatória; (b) colisão de e-mails Firebase × AutoLog na unificação de contas; (c) big bang do
backend exige testes de contrato sólidos antes do cutover; (d) `ogis-payment` está com PR #1 aberto —
integrar o `Ogis.Auth` só depois do merge; (e) **DPoP e ABAC ampliam o escopo do IdP** — DPoP obriga todos
os resource servers a validar `cnf.jkt` (nada de adiar para "depois"), e o motor de risco só entra em
enforcement após shadow mode calibrado; (f) **step-up exige MFA cadastrado** — sem o fallback por e-mail,
usuários sem segundo fator ficam presos numa exigência que não conseguem satisfazer.

## Atualização das specs já escritas (nada foi executado ainda)

Estes requisitos de estado da arte **revisam specs existentes no lugar**, em vez de acrescentar novas —
todas estão com status "Pendente", então renumerar seria pior:

| Spec | Repo | O que muda |
|---|---|---|
| `01-fundacao-oidc.md` | `ogis-identity` | Título e escopo passam a **OAuth 2.1**: implícito e ROPC desabilitados, PKCE S256 obrigatório para todo cliente, `redirect_uri` exato; nova seção **DPoP**; TTL de access token fixado em 10 min; cookie de refresh com `Path` restrito; MFA (TOTP + passkey) sobe do "extra" para escopo, com fallback por e-mail |
| `02-autorizacao-multiapp.md` | `ogis-identity` | Ganha a camada **ABAC/PDP-PEP**: `Ogis.Auth` passa a validar `cnf.jkt` (DPoP) e a consultar `risk:{sid}` no Redis; catálogo de permissões ganha o campo **`assurance`** (nível de garantia exigido por permissão); critério de aceite novo: token de um dispositivo rejeitado em outro |
| `04-resiliencia-e-operacao.md` | `ogis-identity` | Redis vira **dependência de caminho quente** do PEP → política de degradação explícita (`fail-open` em leitura, `fail-closed` em ação sensível), mais métricas e alertas do motor de risco (taxa de step-up, falsos positivos); revogação de sessão permanece como ação administrativa |
| `05-garage-front-oidc.md` | `ogis` | Cliente OIDC com DPoP via `@ogis/auth-web`; tratamento de step-up com retomada da ação; sem token em storage |
| `06-integracao-ogis-identity.md` | `ogis-payment` | Validar DPoP; pagamento é ação de **alta sensibilidade** → `assurance` elevado, dispara step-up |
| `08-autolog-front-oidc-e-router.md` | `manutencaoCaarro` | Mesmos requisitos de cliente do Garage; `POST /auth/login` (equivalente a ROPC) removido em definitivo, não migrado |
| `00-PIPELINE.md` | todos | Registrar nas "Decisões fixadas": OAuth 2.1 estrito, DPoP nos SPAs, ABAC com PDP no gateway + Redis, step-up como única reação automática, shadow mode obrigatório antes do enforcement |

---

## Arquivos-chave

- Contratos/decisões: `docs/contrato-autolog-v1.md`, `docs/inventario-ecossistema.md`, `docs/decisao-dados-garage.md`
- Novo: `D:\projects\ogis-identity\` (espelhar estrutura de `D:\projects\ogis-payment\OgisPayment.Api`)
- Novo: `D:\projects\ogis-autolog-api\`
- Origem do port: `manutencaoCarro-backend/src/{users,licenses,trials,vehicles,maintenances,ai,storage}/**`
- Auth a substituir: `ogis/src/contexts/AuthContext.jsx`, `ogis/src/services/firebase.js`,
  `manutencaoCaarro/contexts/AuthContext.tsx`, `manutencaoCaarro/services/{tokenStore,http}.ts`
- Integração existente a ajustar: `OgisPayment.Api/Program.cs`, `ogis/vite.config.js` (proxy `/api`)

## Verificação

- **IdP:** testes de integração cobrindo code+PKCE, rotação e reuso de refresh, federação Google, lockout,
  e negação cruzada de permissões entre apps. Validar o discovery/JWKS com um cliente OIDC real.
- **Conformidade OAuth 2.1:** o discovery publicado **não** anuncia `token` em `response_types_supported`
  nem `password` em `grant_types_supported`; requisição sem PKCE, com `plain`, ou com `redirect_uri`
  aproximado é recusada. Testes negativos, não só positivos.
- **DPoP:** copiar um access token válido para outro contexto (outra chave) e confirmar `401` em cada
  resource server; replay do mesmo `DPoP` proof rejeitado pelo `nonce`.
- **ABAC/step-up:** matriz de casos (país novo, viagem impossível, horário atípico, rajada de requests,
  ação sensível com `auth_time` antigo) → cada um dispara step-up e, após TOTP/passkey, a ação original é
  **retomada** sem perda de contexto. Antes disso, período de **shadow mode** com relatório de quantos
  step-ups teriam sido disparados e quais seriam falsos positivos.
- **SSO end-to-end:** logar no Garage e navegar para o AutoLog sem novo login; revogar sessão no IdP e
  confirmar que o access token expira e não renova.
- **Backend .NET:** testes de contrato comparando resposta do Nest e da API .NET para cada rota da v1
  (mesmo banco, mesmo payload); xUnit por módulo, como em `OgisPayment.Tests`.
- **Cache:** medir hit ratio no Redis e confirmar `HIT` no edge do Cloudflare nos endpoints públicos.
- **Runtime:** `docker compose up` de cada serviço na VPS de staging IONOS, healthchecks verdes, e fluxo
  real: login → criar veículo → lançar manutenção → anexar PDF → parser NF → relatório.
