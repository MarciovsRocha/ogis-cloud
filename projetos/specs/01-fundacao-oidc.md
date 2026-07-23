# Spec 01 — OgisIdentity: Fundação **OAuth 2.1 / OIDC** com PKCE e DPoP

**Projeto:** ogis-identity (novo, .NET 10)
**Posição na sequência:** 1 de 10 — **depende do gate da Spec 00**.
**Severidade:** Alta (é a fundação de todo o ecossistema ogis.cloud).
**Documento mestre:** `INTEGRACAO-OGIS-AUTOLOG.md` (raiz deste repo), seções 1.1 e 1.1.1.

## 1. Objetivo
Levantar o serviço central de autenticação da ogis.cloud como um servidor **OAuth 2.1 + OpenID Connect**
em `https://id.ogis.cloud`, que todos os sistemas OGIS (garage, autolog, payment, mail, manager) passam a
usar. Esta spec entrega protocolo, credenciais e MFA. Autorização multi-app e ABAC são a Spec 02.

**OAuth 2.1, não 2.0.** A diferença é operacional, não semântica: fluxos vulneráveis não ficam
"desencorajados", ficam **desabilitados na configuração e verificados por teste negativo**.

## 2. Decisões de arquitetura
- **OpenIddict** como stack OIDC (certificável, MIT, sem custo por usuário). Avaliadas e descartadas:
  Duende (licença comercial), Keycloak (infra extra, acoplamento fraco ao domínio de licenças).
- Arquitetura **hexagonal**, espelhando `D:\projects\ogis-payment\OgisPayment.Api`
  (`Domain / Application / Infrastructure / Controllers`), **Docker-first**, Postgres + Redis.
- **EF Core + migrations** (diferente do ogis-payment, que usa SQL bruto): identidade é schema crítico e
  precisa de histórico versionado.

## 3. Escopo

### 3.1 Perfil OAuth 2.1 (conformidade estrita)
Configuração que **remove** explicitamente:
- **Fluxo implícito** (`response_type=token`) — desabilitado, sem exceção. Não deve aparecer em
  `response_types_supported` no discovery.
- **Resource Owner Password Credentials** (`grant_type=password`) — desabilitado. *Nota:* o AutoLog hoje
  depende de um equivalente (`POST /auth/login` com e-mail e senha em
  `manutencaoCarro-backend/src/auth/auth.controller.ts`); ele **não é migrado**, morre na Spec 08.
- `redirect_uri` por **comparação exata de string** — sem wildcard, sem match por prefixo, sem porta livre.
  URIs de preview do Cloudflare precisam ser registradas uma a uma.

Fluxos permitidos, e apenas estes:
- **Authorization Code + PKCE** — SPAs (garage, autolog) e qualquer cliente futuro.
- **Client Credentials** — serviço↔serviço (payment→mail etc.).

### 3.2 PKCE obrigatório para todo cliente
`code_challenge_method=S256` **exigido inclusive de clientes confidenciais**, não só públicos.
Requisição sem `code_challenge` → erro. `plain` → erro. Sem exceção configurável.

### 3.3 Tokens de curta duração
- **Access token: 10 min**; `id_token`: 10 min.
- **Refresh token**: rotativo a cada uso, com **detecção de reuso** (reuso revoga a família inteira),
  janela deslizante curta e **teto absoluto de sessão** (após o qual exige login novo, mesmo ativo).
- Armazenamento: refresh em **cookie `HttpOnly` + `Secure` + `SameSite=Lax` + `Path` restrito ao endpoint
  de token**, no domínio do IdP. Access token **apenas em memória** no SPA.
  **Nada de JWT em `localStorage`** — corrige a exposição atual do AutoLog
  (`manutencaoCaarro/services/tokenStore.ts`, chave `authToken`).

### 3.4 DPoP (RFC 9449) — tokens atados ao cliente
- IdP emite e valida prova DPoP em `/connect/token`, com **`nonce`** (`DPoP-Nonce`) para impedir replay,
  validação de `htm`/`htu`/`iat` e cache de `jti` para janela curta.
- Access token carrega `cnf.jkt` (thumbprint da chave pública do cliente). **Token exfiltrado não é
  utilizável em outro dispositivo.**
- O SPA gera par de chaves **não-exportável** via WebCrypto, guardado em IndexedDB (Spec 05/08).
- **Consequência de escopo:** todo resource server precisa validar `cnf.jkt` — isso é requisito da
  Spec 02 (`Ogis.Auth`), não item opcional para depois.
- Client credentials (serviço↔serviço, rede interna) segue Bearer.

### 3.5 Assinatura e descoberta
Tokens **RS256** com chave em rotação (ativa + anterior publicadas); `JWKS` em
`/.well-known/jwks.json`; discovery em `/.well-known/openid-configuration`. Todo serviço OGIS valida
**offline** pelo JWKS — sem chamada síncrona ao IdP no caminho quente.

### 3.6 Endpoints
`/connect/authorize`, `/connect/token`, `/connect/userinfo`, `/connect/logout`, `/connect/revoke`,
`/connect/introspect`, mais os dois `.well-known`.

### 3.7 Credenciais locais
- Senha com **Argon2id** para contas novas.
- **Verificação transparente de hashes `bcrypt` legados** (`users.senha` do AutoLog) com **rehash para
  Argon2id no primeiro login bem-sucedido** → nenhum usuário existente é forçado a resetar senha.

### 3.8 MFA — para **todos** os usuários, não só admin
Isto é consequência direta do step-up da Spec 02: um usuário sem segundo fator cadastrado **não tem como
satisfazer** uma exigência de `acr` elevado, e ficaria travado.
- Fatores: **TOTP** e **passkey (WebAuthn)**.
- **Obrigatório** para contas com permissões administrativas.
- Opcional-mas-induzido para os demais, com **fallback por código enviado por e-mail** (via `ogis-mail`)
  para quem ainda não cadastrou — é o que impede o beco sem saída.
- `acr` / `amr` / `auth_time` refletidos no token, base para o step-up.

### 3.9 Ciclo de vida da conta
Verificação de e-mail (via `ogis-mail`), recuperação de senha com token de uso único e expiração curta,
alteração de senha revogando as demais sessões.

### 3.10 Defesas
Lockout progressivo por conta; rate limit por IP e por conta nos endpoints de token e login; respostas e
tempos indistinguíveis para impedir enumeração de usuários; CSRF nos formulários; cabeçalhos de segurança.

### 3.11 Telas do IdP
Login, registro, esqueci-a-senha, verificação de e-mail, cadastro/uso de MFA e consentimento —
server-side, com o visual OGIS mínimo (não é um SPA).

## 4. Modelo de dados (inicial)
`users` (id GUID, email único normalizado, email_verified, password_hash, password_algo, status,
created_at, updated_at), `user_identities` (user_id, provider, provider_subject — único por par),
`user_mfa_factors` (tipo, segredo/credencial, confirmado_em), `sessions` (sid, user_id, ip, acr, auth_time,
created_at, revoked_at), `refresh_tokens` (família, rotação, flag de reuso), `login_attempts`,
`audit_events` (append-only), `signing_keys`.

## 5. Arquivos-chave
- `src/OgisIdentity.Api/Program.cs` — OpenIddict (perfil 2.1), DPoP, EF Core, Redis, rate limit, healthchecks.
- `src/OgisIdentity.Domain/` — `User`, `UserIdentity`, `MfaFactor`, `Session`, `AuditEvent`.
- `src/OgisIdentity.Application/Services/` — `PasswordService` (Argon2id + bcrypt legado), `MfaService`,
  `TokenService`, `AccountService`, `AuditService`.
- `src/OgisIdentity.Infrastructure/Persistence/` — DbContext + migrations.
- `src/OgisIdentity.Infrastructure/Dpop/` — validação de proof, `nonce`, cache de `jti`.
- `docker-compose.dev.yml`, `Dockerfile` — espelhar o padrão de `ogis-payment`.
- `tests/OgisIdentity.Tests/` — xUnit.

## 6. Critérios de aceite

**Positivos**
- Discovery e JWKS aceitos por um cliente OIDC real; fluxo code+PKCE emite access + id + refresh válidos.
- Rotação de refresh funciona; **reuso de refresh já consumido revoga a família** e é auditado.
- Senha bcrypt legada autentica e é reescrita como Argon2id (verificável no banco).
- Access token emitido com `cnf.jkt`; requisição com prova DPoP válida é aceita.
- Usuário cadastra TOTP/passkey; `acr`/`amr`/`auth_time` aparecem corretos no token.
- Access token **não** é persistido em nenhum storage do navegador.

**Negativos (igualmente obrigatórios)**
- `response_types_supported` **não** contém `token`; `grant_types_supported` **não** contém `password`.
- Requisição sem `code_challenge` → recusada. `code_challenge_method=plain` → recusada.
- `redirect_uri` divergente por um caractere (ou com wildcard) → recusada.
- Requisição sem prova DPoP para token DPoP-bound → `401`. Prova replayada → recusada pelo `nonce`.
- 10 tentativas erradas → lockout; endpoints de token respeitam rate limit.

## 7. Verificação
- Testes de integração xUnit: code+PKCE ponta a ponta, rotação, detecção de reuso, client credentials,
  bcrypt→Argon2id, MFA, lockout — **e a bateria negativa inteira do item 6**.
- Varredura de conformidade OAuth 2.1 sobre o discovery publicado.
- Teste de DPoP com duas chaves distintas: token obtido com a chave A rejeitado ao ser usado com a chave B.
- `docker compose -f docker-compose.dev.yml up -d --build` e login manual pela tela do IdP.

## 8. Gate de conclusão
Spec 02 só inicia com: testes positivos **e negativos** verdes, IdP subindo em Docker, e um cliente OIDC de
teste completando login, refresh e requisição DPoP contra `id.ogis.cloud` em staging.
