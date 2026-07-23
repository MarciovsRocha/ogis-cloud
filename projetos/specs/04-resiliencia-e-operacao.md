# Spec 04 — OgisIdentity: Resiliência, Observabilidade e Operação

**Projeto:** ogis-identity
**Posição na sequência:** 4 de 10 — **depende do gate da Spec 03**.
**Severidade:** Alta (o requisito pede um sistema "à prova de falhas"; sem isto, o IdP é um SPOF — e, com
o ABAC da Spec 02, o **Redis** também entra na conta).
**Documento mestre:** `INTEGRACAO-OGIS-AUTOLOG.md`, seção 1.4.

## 1. Objetivo
Tornar o IdP operável e resistente a falhas nos containers da VPS IONOS, com duas propriedades bem
entendidas:
- validação de token nos consumidores é **offline por JWKS** → IdP fora do ar impede *novos logins*, mas
  **não derruba as APIs**;
- o **PEP do ABAC consulta o Redis no caminho quente** → o Redis deixou de ser conveniência de cache e
  virou dependência de decisão. Sua degradação precisa ser projetada, não descoberta em produção.

## 2. Escopo

### 2.1 Alta disponibilidade
2+ réplicas do container atrás do proxy reverso; **estado zero no processo** (sessão, lockout, score de
risco e listas de revogação no Redis); *graceful shutdown*; *readiness* correta para o proxy não rotear
para instância que ainda não subiu.

### 2.2 Redis como dependência de caminho quente (**novo**)
- Redis com persistência e, se viável, réplica — sessões e `risk:{sid}` não podem evaporar em restart.
- **Política de degradação explícita** (definida na Spec 02, operacionalizada aqui):
  `fail-open` para leitura, `fail-closed` para ação de `assurance` elevado. Configurável por aplicação.
- Toda decisão tomada em modo degradado é auditada e **alertada** — modo degradado silencioso é a pior
  combinação possível.
- Teste de carga do PEP: latência adicionada por requisição deve ficar sub-milissegundo; se não ficar,
  o desenho precisa mudar antes de ir a produção.

### 2.3 Rotação de chaves de assinatura
Chave nova publicada no JWKS **antes** de entrar em uso; chave antiga mantida até expirar o último token
emitido com ela. Procedimento documentado e **ensaiado**.

### 2.4 Persistência
Postgres com backup diário + **PITR**, e **restauração testada** — um restore que nunca foi testado não é
backup, é esperança.

### 2.5 Observabilidade
- `/health/live`, `/health/ready`; logs estruturados com correlation id.
- Métricas de autenticação: logins ok/falha, latência do `/connect/token`, taxa de refresh, **reuso de
  refresh detectado**, lockouts, falhas de prova DPoP.
- **Métricas do motor de risco** (novo): score médio, taxa de **step-up exigido**, taxa de step-up
  concluído com sucesso, **estimativa de falso positivo** (step-up seguido de autenticação bem-sucedida do
  mesmo usuário no mesmo contexto), decisões em modo degradado.
- **Nunca** logar tokens, provas DPoP, senhas ou hashes.

### 2.6 Alertas
Pico de falhas de login; detecção de reuso de refresh; IdP não-ready; **Redis indisponível**; **salto na
taxa de step-up** (indica limiar mal calibrado ou incidente real); expiração próxima de certificado/chave.

### 2.7 Resiliência do consumidor (no `Ogis.Auth`)
Cache de JWKS com TTL, *stale-while-revalidate* e retry com backoff — validado por teste com o IdP
derrubado. O mesmo para a consulta de risco, respeitando a política de degradação.

### 2.8 Revogação como ação administrativa
Revogar sessão/família de refresh de um usuário permanece **operação explícita de administrador**
(não é reação automática do motor de risco, que só faz step-up). Precisa ser: um clique na admin,
efeito em segundos via lista de revogação no Redis, auditado.

### 2.9 Segurança operacional
Segredos por variável de ambiente (padrão do `ogis-payment`); TLS terminado no proxy com HSTS; cabeçalhos
de segurança nas telas do IdP; `audit_events` exportado para armazenamento retido e imutável.

### 2.10 Runbook
`docs/runbook.md`: deploy, rollback, rotação de chave, **revogar sessões de um usuário**, restaurar backup,
**operar com Redis fora do ar**, **recalibrar limiares de risco**, responder a suspeita de comprometimento.

## 3. Arquivos-chave
- `docker-compose.yml` (produção), `Dockerfile`, configuração do proxy reverso.
- `src/OgisIdentity.Api/Program.cs` — healthchecks, métricas, rate limit, graceful shutdown.
- `src/Ogis.Auth/JwksCache.cs`, `src/Ogis.Auth/RiskGate.cs` (política de degradação).
- `docs/runbook.md`, scripts de backup/restore.

## 4. Critérios de aceite
- Derrubar 1 das 2 réplicas não interrompe logins em andamento.
- Com o IdP **inteiro** fora do ar, as APIs continuam aceitando tokens válidos já emitidos.
- Com o **Redis** fora do ar, leitura continua funcionando e ação sensível é negada — ambas auditadas e
  alertadas.
- Rotação de chave executada sem invalidar tokens em circulação.
- Restore do backup em ambiente limpo, com login funcionando após o restore.
- Revogação administrativa surte efeito em segundos.
- Nenhum token, prova DPoP ou segredo presente nos logs (verificado por inspeção).

## 5. Verificação
- **Chaos drill**: matar réplica, derrubar o IdP, derrubar o Redis — comportamento observado de cada um
  registrado em `docs/runbook.md`.
- Teste de carga no `/connect/token` e no PEP, com metas de latência definidas e medidas.
- Restore de backup cronometrado e documentado.
- Revisão do painel de métricas de risco após uma semana de shadow mode (Spec 02).

## 6. Gate de conclusão
Specs 05+ só entram em **produção** após: HA validado, drill de falha executado (incluindo Redis), restore
testado, painel de métricas de risco no ar e runbook escrito.
