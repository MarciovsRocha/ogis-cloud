# Spec 02 — OgisIdentity: Autorização Multi-App (RBAC) + **ABAC/Zero Trust** + pacote `Ogis.Auth`

**Projeto:** ogis-identity
**Posição na sequência:** 2 de 10 — **depende do gate da Spec 01**.
**Severidade:** Alta (requisito central: níveis de acesso por aplicação + avaliação contínua de risco).
**Documento mestre:** `INTEGRACAO-OGIS-AUTOLOG.md`, seções 1.2 e 1.2.1.

## 1. Objetivo
Entregar duas camadas complementares de autorização e o pacote que as aplica em todo o ecossistema:

- **RBAC por aplicação** — *o que* este usuário pode fazer em *qual* sistema OGIS.
- **ABAC / Zero Trust** — se ele pode fazer isso **agora**, deste lugar, com este comportamento —
  reavaliado **a cada requisição**, não só no login.
- **`Ogis.Auth`** — pacote compartilhado que valida token, DPoP e política, para que payment, mail,
  autolog e garage tenham exatamente o mesmo comportamento.

Isto substitui os dois mecanismos ad-hoc atuais: `ADMIN_EMAILS` + coluna `isAdmin`
(`manutencaoCarro-backend/src/main.ts`, `users/entities/user.entity.ts`) e a flag `isAdmin` no documento
Firestore `users/{uid}` lida em `ogis/src/contexts/AuthContext.jsx`.

---

## 2. Camada 1 — RBAC por aplicação

```
Tenant (ogis.cloud)
 └─ Application (garage, autolog, payment, mail, manager)   → client_id + audience
     └─ Role (owner, admin, staff, member, …)               → escopo = Application
         └─ Permission ("vehicles:write", "events:publish", "discounts:manage", …)
User ──< UserApplicationRole >── (Application, Role)  [+ escopo opcional por recurso]
```

Tabelas: `applications`, `roles`, `permissions`, `role_permissions`, `user_application_roles`.
Permissões seguem `recurso:ação`, declaradas por aplicação e versionadas por seed/migration.

**Novo nesta revisão — campo `assurance` por permissão.** Cada permissão declara o **nível de garantia
exigido** para ser exercida (ex.: `read` = básico; `payments:create`, `identity:manage`, `users:manage` =
elevado). É o que conecta o RBAC ao motor de risco: o PEP compara o `assurance` exigido com o `acr` e o
`auth_time` do token e com o score de risco da sessão.

**Emissão de claims por audiência:** o token pedido para `autolog` carrega **apenas** roles e permissões do
AutoLog. Claims: `sub`, `aud`, `ogis:app`, `roles[]`, `perms[]`, `tenant`, `amr`, `acr`, `auth_time`, `sid`,
`cnf.jkt`.

**Compactação:** se `perms[]` estourar o tamanho de header, emitir só `roles[]` e expor
`GET /permissions?app=` no IdP, com cache curto no consumidor (Redis).

---

## 3. Camada 2 — ABAC / Zero Trust (PDP + PEP)

### 3.1 Arquitetura
- **PDP** (*Policy Decision Point*) — serviço de políticas do `ogis-identity`, regras versionadas em código,
  publicando um **score de risco por sessão** no Redis em `risk:{sid}`.
- **PEP** (*Policy Enforcement Point*) — dentro do **`Ogis.Auth`**, executando no gateway e em cada
  resource server. Por requisição combina:
  1. `perms[]` do token (RBAC, validado **offline** por JWKS);
  2. `cnf.jkt` × prova DPoP da requisição;
  3. consulta ao Redis: `risk:{sid}`, lista de revogação, `acr`/`auth_time` vigentes.

O Redis fica no mesmo datacenter → custo sub-milissegundo, e **preserva a propriedade de que o IdP fora do
ar não derruba as APIs**.

### 3.2 Degradação (obrigatório definir, não deixar implícito)
Se o Redis estiver indisponível: **`fail-open` para leitura**, **`fail-closed` para ação sensível**
(`assurance` elevado). Configurável por aplicação, com o default acima. Toda decisão tomada em modo
degradado é auditada.

### 3.3 Atributos avaliados
Escolha do usuário — sem fingerprint de dispositivo, cuja função é parcialmente coberta pelo binding de
chave do DPoP:

1. **Rede e geolocalização** — IP, ASN, país, **viagem impossível**, proxy/Tor/bot score. Os headers do
   Cloudflare (`CF-Connecting-IP`, `CF-IPCountry`, bot score) chegam de graça no gateway.
2. **Comportamento** — horário atípico frente ao baseline do usuário, volume e velocidade de requisições,
   sequência anômala de ações, tentativa de escalada de privilégio. Baseline construído a partir de
   `audit_events`.
3. **Sensibilidade da ação** — o `assurance` da permissão exercida entra na conta: criar pagamento, alterar
   senha, gerir permissões e rotas admin exigem confiança maior que uma leitura.

### 3.4 Resposta ao risco: **step-up de autenticação**
Única reação automática. Quando o risco supera o limiar da ação, o PEP responde:

```
401 Unauthorized
WWW-Authenticate: DPoP error="insufficient_user_authentication", acr_values="mfa", max_age=300
```

O SPA reenvia o usuário ao IdP com `acr_values` e `prompt=login`; após TOTP/passkey o IdP emite token com
`acr`/`amr` elevados e `auth_time` recente, e **a ação original é retomada** (o front guarda a intenção
antes de redirecionar — Specs 05 e 08).

Sem bloqueio silencioso: o usuário sempre tem caminho de saída. Revogação total de sessão continua
existindo, mas como **ação administrativa explícita** (Spec 04), não como reação automática.

### 3.5 Rollout em duas etapas — **shadow mode é obrigatório**
O motor entra primeiro em **shadow mode**: pontua, audita e **relata** quantos step-ups teria disparado —
sem forçar nenhum. Só depois de calibrar os limiares com tráfego real é que o enforcement é ligado.
Ligar enforcement sem baseline gera falsos positivos em massa, e o desfecho previsível é o time desligar
o Zero Trust inteiro.

---

## 4. Camada 3 — pacote `Ogis.Auth`
- `services.AddOgisAuth(audience)` — validação de JWT via **JWKS com cache, TTL e retry**
  (*stale-while-revalidate*); issuer/audience/lifetime estritos.
- **Validação DPoP**: confere `cnf.jkt` do token contra a prova da requisição (`htm`, `htu`, `iat`, `jti`).
- **PEP**: policies `RequirePermission("...")` / `RequireRole("...")` que já embutem a checagem de
  `assurance` × risco e emitem o `401` de step-up quando necessário.
- `ICurrentUser` (sub, app, perms, acr, sid).
- Cliente de client-credentials para chamadas serviço↔serviço, com cache de token.

## 5. Seed inicial
Aplicações `garage`, `autolog`, `payment`, `mail`; roles e permissões derivadas do contrato v1 (Spec 00) —
**toda rota `@Admin()` do Nest vira uma permissão nomeada**, com `assurance` atribuído.

## 6. Auditoria
Toda mudança de role/permissão e **toda decisão do PDP** (permitida, step-up exigido, degradada) gera
evento append-only em `audit_events`. É esse histórico que alimenta o baseline comportamental.

## 7. Arquivos-chave
- `src/OgisIdentity.Domain/Authorization/` — `Application`, `Role`, `Permission` (com `Assurance`),
  `UserApplicationRole`.
- `src/OgisIdentity.Application/Authorization/ClaimsBuilder.cs` — claims por audiência.
- `src/OgisIdentity.Application/Risk/` — `RiskEngine`, avaliadores de rede/geo, comportamento e ação.
- `src/OgisIdentity.Api/Controllers/Admin/` — CRUD administrativo.
- `src/Ogis.Auth/` — pacote compartilhado (o artefato mais reutilizado de todo o plano):
  `JwksCache.cs`, `DpopValidator.cs`, `PermissionHandler.cs`, `RiskGate.cs`.
- Seeds/migrations com o mapa de permissões e seus `assurance`.

## 8. Critérios de aceite
- Token emitido para `autolog` **não** dá acesso a rota do `payment` (audiência errada → 401).
- Usuário admin no `garage` e membro no `autolog` recebe claims corretas em cada token.
- `RequirePermission("vehicles:write")` nega sem a permissão (403) e permite com ela.
- **Access token de um dispositivo é rejeitado em outro** (DPoP `cnf.jkt` divergente → 401).
- Ação de `assurance` elevado com `auth_time` antigo → **`401` com `insufficient_user_authentication`**;
  após step-up, a mesma ação é permitida.
- IdP derrubado: APIs continuam validando tokens já emitidos via JWKS em cache.
- Redis derrubado: leitura continua (`fail-open`), ação sensível é negada (`fail-closed`), tudo auditado.
- Shadow mode produz relatório de step-ups hipotéticos **sem** afetar usuários.
- Toda rota `@Admin()` do contrato v1 tem permissão equivalente mapeada, com `assurance`.

## 9. Verificação
- Testes xUnit de `ClaimsBuilder` (matriz usuário × aplicação × role) e de negação cruzada entre apps.
- Testes do `RiskEngine` com a matriz de cenários: país novo, viagem impossível, horário atípico, rajada de
  requisições, ação sensível com `auth_time` velho — cada um exigindo step-up e, após ele, sucesso.
- Teste de integração do `Ogis.Auth` contra o IdP real em Docker, incluindo IdP indisponível e Redis
  indisponível.
- Ensaio de shadow mode com tráfego de staging e revisão do relatório de falsos positivos.

## 10. Gate de conclusão
Specs 03+ só iniciam com: `Ogis.Auth` empacotado e consumido por ao menos um serviço de teste, matriz de
permissões (com `assurance`) seedada, DPoP validado ponta a ponta, testes de negação cruzada verdes, e o
motor de risco rodando em **shadow mode** com relatório revisado.
