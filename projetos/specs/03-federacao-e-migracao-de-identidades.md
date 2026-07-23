# Spec 03 — OgisIdentity: Federação Google e Unificação de Identidades

**Projeto:** ogis-identity
**Posição na sequência:** 3 de 10 — **depende do gate da Spec 02**.
**Severidade:** Alta (migração de usuários reais; erro aqui gera perda de acesso).

## 1. Objetivo
Permitir **login com Google** federado diretamente no IdP (sem passar pelo Firebase) e unificar as duas
bases de usuários existentes — Firebase Auth (projeto `ogis-garage`, usada pelo OGIS Garage) e a tabela
`users` do Postgres do AutoLog — em uma identidade única por pessoa.

## 2. Escopo
1. **Provedor externo Google (OIDC)** registrado no IdP; `amr` do token registra o meio de autenticação.
   Arquitetura extensível: adicionar Apple/Microsoft depois deve ser configuração, não código novo.
2. **Vinculação de identidades** via `user_identities (user_id, provider, provider_subject)`:
   - Login Google com e-mail **verificado** que já existe como conta local → vincula ao usuário existente.
   - Login Google com e-mail não verificado pelo provedor → **nunca** vincula automaticamente; exige
     confirmação por e-mail (defesa contra account takeover por pré-registro).
   - Uma conta pode ter senha local **e** Google simultaneamente.
3. **Migração Firebase → OgisIdentity**: `firebase auth:export` → script idempotente que cria `users` +
   `user_identities` (`provider='google'`, subject do Google quando disponível; `provider='firebase'` como
   ponte transitória para contas sem subject Google). Flag `isAdmin` do Firestore `users/{uid}` vira
   atribuição de role na aplicação `garage` (Spec 02).
4. **Migração AutoLog → OgisIdentity**: importar `users` do Postgres preservando o hash bcrypt
   (`password_algo='bcrypt'`), `nome`, `email`, `isAdmin` → role na aplicação `autolog`. Campos de
   verificação legados (`firstLoginToken`, `firstLoginExpiresAt`, `firstLoginVerified`,
   `firstLoginAttempts`) são traduzidos para o estado de verificação de e-mail do IdP e **descartados**.
5. **Resolução de colisões** (e-mails presentes nas duas bases, levantados na Spec 00): merge em um único
   `user`, com as duas identidades vinculadas e as roles de **ambas** as aplicações preservadas. Lista de
   colisões revisada manualmente antes da execução.
6. **Execução da migração**: script versionado, idempotente, com *dry-run* obrigatório, relatório
   (criados / vinculados / colididos / ignorados) e procedimento de rollback documentado.

## 3. Arquivos-chave
- `src/OgisIdentity.Infrastructure/ExternalProviders/GoogleProvider.cs`
- `src/OgisIdentity.Application/Identity/IdentityLinkingService.cs`
- `tools/migrate-firebase.{cs|sh}`, `tools/migrate-autolog-users.{cs|sh}`
- Entradas: export do Firebase; `users` do Postgres AutoLog; `docs/inventario-identidades.md` (Spec 00).

## 4. Critérios de aceite
- Login Google cria conta nova ou vincula à existente conforme as regras acima; e-mail não verificado nunca
  vincula sozinho.
- Usuário do Garage (hoje Firebase/Google) entra no IdP e mantém seu papel de admin quando aplicável.
- Usuário do AutoLog entra com a **mesma senha de antes** (bcrypt aceito, rehash Argon2id — Spec 01).
- Colisões resultam em **um** usuário com duas identidades e as roles das duas aplicações.
- Dry-run produz relatório idêntico à execução real (contagens conferem).

## 5. Verificação
- Dry-run em cópia dos dados de produção, relatório revisado item a item.
- Amostra de 10 contas reais (5 Firebase, 3 AutoLog, 2 colisões) autenticando após a migração em staging.
- Teste xUnit do `IdentityLinkingService` cobrindo as quatro combinações de e-mail verificado × conta existente.

## 6. Gate de conclusão
Spec 04 só inicia após: migração executada com sucesso em staging, relatório sem divergência, e as 10
contas de amostra autenticando — com o rollback testado.
