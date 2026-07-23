# Spec 07 — AutoLog API: reescrita completa NestJS → .NET (big bang)

**Projeto:** ogis-autolog-api (novo, .NET 10) — substitui `D:\projects\manutencaoCarro-backend`
**Posição na sequência:** 7 de 10 — **depende dos gates das Specs 00, 02 e 06**.
**Severidade:** Alta (substituição total do backend de produção do AutoLog).
**Documento mestre:** `INTEGRACAO-OGIS-AUTOLOG.md` (raiz deste repo).

## 1. Objetivo
Reescrever o backend do AutoLog em .NET, **reproduzindo o contrato HTTP v1** (`docs/contrato-autolog-v1.md`,
Spec 00) para que o frontend atual continue funcionando, com autenticação delegada ao OgisIdentity e
persistência gerenciada por migrations.

Estratégia escolhida pelo usuário: **big bang** — a API .NET substitui o Nest de uma vez, com cutover em
janela de manutenção e o Nest mantido congelado como rollback.

## 2. Arquitetura
.NET 10, hexagonal (`Domain / Application / Infrastructure / Controllers`), espelhando `ogis-payment`.
**EF Core + Npgsql com migrations** — `synchronize: true` do TypeORM não é reproduzido em hipótese alguma.
Baseline gerada a partir do schema real (`docs/schema-real-autolog.sql`, Spec 00), preservando os dados
de produção. Docker + `docker-compose.dev.yml`, publicado atrás de `api.ogis.cloud/autolog`.

## 3. Mapeamento de módulos

| Nest (origem) | .NET (destino) | Notas |
|---|---|---|
| `auth/*` (JWT, bcrypt, first-login, guards) | **removido** | Substituído pelo OgisIdentity (`AddOgisAuth("autolog")`) |
| `users/*` | `Users` | Só perfil da aplicação; identidade referencia o `sub` (GUID) do IdP |
| `licenses/*` + `trials/*` | `Licensing` | Enums `LicensePlan`/`LicenseStatus`; trial em `TrialService` (portar `trials/utils/trial.utils.ts`) |
| `vehicles/*` | `Vehicles` | Isolamento por dono vira **filtro global do EF Core** por `sub`, não checagem manual por rota |
| `maintenances/*` + `attachments` | `Maintenance` | Portar `mappers/*.ts` como especificação dos DTOs de saída |
| `storage/*` (`file-validation.ts`) | `Storage` | Disco local → **S3/MinIO (ou R2)**; manter validação de MIME/tamanho e o padrão de chave `vehicles/{ownerId}/{uuid}.ext` |
| `mail/*` | delegar ao **ogis-mail** | Não reimplementar envio de e-mail |
| `ai/nf-parser` | `NfParser` | `pdf-parse` → PdfPig/Docnet + provedor LLM; reavaliar heurísticas do parser durante o port |
| `common/filters/all-exceptions.filter.ts` | middleware de erro | Reproduzir o envelope da v1; padronizar `ProblemDetails` (RFC 7807) só na v2 |

## 4. Escopo adicional
1. **Autorização por permissão** (Spec 02): toda rota `@Admin()` do Nest vira `RequirePermission(...)`
   na aplicação `autolog` (ex.: `users:manage`, `licenses:manage`). O seed `ADMIN_EMAILS` de
   `manutencaoCarro-backend/src/main.ts` é **eliminado**.
1.1. **`AddOgisAuth("autolog")`** traz junto, sem código próprio: validação de JWT por JWKS em cache,
   **validação de DPoP (`cnf.jkt`)** e o **PEP do ABAC** (risco no Redis). Cada permissão declara seu
   **`assurance`** — `users:manage` e `licenses:manage` são elevados e podem disparar **step-up**
   (`401 insufficient_user_authentication`), que o front trata na Spec 08. A API **não** implementa
   autenticação própria em hipótese alguma.
1.2. **Degradação** (Spec 04): Redis fora do ar → leitura segue (`fail-open`), ação administrativa é
   negada (`fail-closed`); ambas auditadas.
2. **Cache** (Spec 09): `HybridCache` (L1 memória + L2 Redis) em FIPE, lista de veículos, licença/trial e
   resolução de permissões, com invalidação por tag em escrita.
3. **Limpeza de schema** (migration separada, **após** o cutover do IdP): remover `senha`, `firstLoginToken`,
   `firstLoginExpiresAt`, `firstLoginVerified`, `firstLoginAttempts`, `isAdmin` de `users`.
4. **Migração de arquivos**: mover os anexos do disco do container Nest para o bucket, com verificação de
   integridade (contagem + checksum) antes de descartar a origem.

## 5. Critérios de aceite
- **Testes de contrato**: para cada rota da v1, resposta da API .NET idêntica à do Nest (mesmo banco, mesmo
  payload) — status, shape e mensagens de erro.
- Nenhuma rota autentica por conta própria; toda autenticação vem do token do IdP.
- Access token sem prova DPoP válida, ou de outro dispositivo, é rejeitado com 401.
- Rota administrativa com `auth_time` antigo responde step-up; após MFA, a mesma chamada é aceita.
- Um usuário **não** acessa veículo/manutenção de outro (filtro global testado explicitamente).
- Upload rejeita MIME/tamanho inválidos como hoje; download autenticado da foto do veículo funciona.
- Migrations sobem do zero num banco vazio **e** aplicam sobre a baseline do banco real.
- 100% dos anexos migrados e verificados.

## 6. Verificação
- Suíte xUnit por módulo (padrão de `OgisPayment.Tests`) + testes de contrato usando os *golden files* da Spec 00.
- Ambiente paralelo em staging apontando para uma cópia do banco de produção; bateria manual:
  login → criar veículo → lançar manutenção → anexar PDF → parser de NF → relatório → export.
- Ensaio completo do cutover em staging, cronometrado, incluindo o rollback.

## 7. Plano de cutover
1. Deploy da API .NET em paralelo (sem tráfego). 2. Testes de contrato verdes contra o banco real copiado.
3. Janela de manutenção: parar o Nest, aplicar migrations, apontar o gateway para a .NET.
4. Bateria de fumaça. 5. Nest **congelado por 30 dias** como rollback; só depois a limpeza de schema.

## 8. Gate de conclusão
Spec 08 só inicia após: cutover concluído, testes de contrato verdes em produção e 72h sem incidente.
