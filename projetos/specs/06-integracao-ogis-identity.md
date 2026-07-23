# Spec 06 — ogis-payment: adoção do OgisIdentity (`Ogis.Auth`, DPoP e step-up)

**Projeto:** ogis-payment (.NET 10)
**Posição na sequência:** 6 de 10 — **depende do gate da Spec 05**.
**Atenção:** esta spec pertence à pipeline de integração OGIS↔AutoLog e é **independente** da sequência
interna 01–05 deste repo (descontos, webhooks, recorrência…). Só deve ser iniciada **após o merge do PR #1**,
para não conflitar com a branch `feat/gateway-psp-pagarme`.
**Documento mestre:** `INTEGRACAO-OGIS-AUTOLOG.md` (raiz deste repo).

## 1. Objetivo
Migrar a autenticação do microserviço de pagamentos de **Firebase JWT** para o **OgisIdentity**, sem janela
de indisponibilidade, substituir a checagem ad-hoc de "owner" por permissões nomeadas, e aplicar
**DPoP + step-up** — pagamento é a ação mais sensível de todo o ecossistema, e é o caso de uso que justifica
o Zero Trust existir.

## 2. Situação atual
- `Program.cs` exige `FIREBASE_CONNECTION_DATA` / `FIREBASE_PROJECT_ID` e valida tokens do Firebase.
- Autorização administrativa (CRUD de `/api/v1/discounts/*`, `/webhooks/logs`) é feita por checagem de owner
  no controller, não por um modelo de permissões.

## 3. Escopo

### 3.1 Transição sem downtime
**Validação dupla temporária**: aceitar tokens do Firebase **e** do OgisIdentity simultaneamente (dois
esquemas de autenticação; política que aceita qualquer um). Permite que o front do Garage (Spec 05) migre
gradualmente e dá rollback imediato.

### 3.2 Adotar `Ogis.Auth` (Spec 02)
`AddOgisAuth("payment")` — validação por JWKS com cache, **validação de DPoP (`cnf.jkt`)**, `ICurrentUser`,
e o PEP que consulta risco/`assurance` no Redis.

### 3.3 Permissões nomeadas, com `assurance`
| Rota | Permissão | `assurance` |
|---|---|---|
| CRUD `/api/v1/discounts/*` | `discounts:manage` | **elevado** |
| `GET /api/v1/webhooks/logs` | `payments:read` | elevado (expõe PII) |
| `POST /api/v1/payments/create` | `payments:create` | **elevado** → step-up |
| `POST /api/v1/discounts/validate` | apenas autenticado | básico |

Registrar essas permissões na aplicação `payment` do IdP (seed da Spec 02).

### 3.4 Step-up em criação de pagamento
Criar pagamento com `auth_time` antigo ou sessão de risco elevado responde
`401 + WWW-Authenticate: ... insufficient_user_authentication`; o front (Spec 05) leva ao MFA e **retoma a
criação**. O fluxo precisa ser **idempotente** o suficiente para a retomada não gerar cobrança duplicada —
verificar contra o que a Spec 02 interna (webhooks/idempotência) definir.

### 3.5 Identidade no Firestore
Se o fluxo de pagamento grava/lê identidade no Firestore (participantes vinculados ao uid do Firebase),
mapear o `sub` do IdP para o identificador usado, com a tabela de correspondência gerada na migração da
Spec 03. **Levantar antes de codificar.**

### 3.6 Remoção do Firebase (segunda etapa)
Após o Garage estar 100% no IdP: retirar o esquema Firebase, `FIREBASE_CONNECTION_DATA` e a exigência
correspondente no boot do `Program.cs`.

## 4. Arquivos-chave
- `OgisPayment.Api/Program.cs` — esquemas de autenticação, políticas, DI do `Ogis.Auth`.
- `OgisPayment.Api/Controllers/DiscountsController.cs`, `PaymentsController.cs`, `WebhooksController.cs` —
  trocar checagem de owner por `RequirePermission`.
- `appsettings.json` / env — `Ogis:Authority`, `Ogis:Audience`, `Ogis:Redis`.
- `OgisPayment.Tests` — testes de autorização, DPoP e step-up.
- **Armadilha conhecida** (`ESTADO-ATUAL.md`): o feed NuGet `git.mps.com.br` retorna 401 — restaurar com
  `--source https://api.nuget.org/v3/index.json`. **Publicar o `Ogis.Auth` num feed que não dependa dele**,
  senão essa armadilha passa a bloquear todos os serviços, não só os testes.

## 5. Critérios de aceite
- Token do Firebase **e** token do IdP autenticam durante a transição.
- Usuário sem `discounts:manage` recebe 403 no CRUD de descontos; com a permissão, 200.
- `/webhooks/logs` exige `payments:read`.
- Access token sem prova DPoP válida → 401; token de outro dispositivo → 401.
- `POST /payments/create` com `auth_time` antigo → step-up; após MFA, criação conclui **uma única vez**.
- Com o IdP fora do ar, tokens já emitidos continuam sendo aceitos (JWKS em cache).
- Com o Redis fora do ar, criação de pagamento é **negada** (`fail-closed`, por ser ação sensível) e a
  negação é auditada.
- Na etapa final, a API sobe **sem** nenhuma variável do Firebase.

## 6. Verificação
- `OgisPayment.Tests` com casos de autorização por permissão, DPoP e step-up
  (`dotnet test --no-restore` — ver armadilha do NuGet).
- `docker compose -f docker-compose.dev.yml up -d --build` e fluxo real ponta a ponta: validar desconto →
  criar pagamento com token do IdP → step-up → pagamento criado.
- Derrubar o Redis em staging e confirmar o comportamento `fail-closed` na criação de pagamento.

## 7. Gate de conclusão
Spec 07 só inicia após: payment aceitando tokens do IdP em produção, permissões e step-up aplicados, e
testes verdes. A remoção do Firebase é liberada apenas quando a Spec 05 estiver estável em produção.
