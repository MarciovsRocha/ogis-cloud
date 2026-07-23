# Spec 09 — Camada de Cache: Redis (L2) + Edge Cloudflare

**Projeto:** transversal — `ogis-autolog-api`, `ogis`, `ogis-payment`, `ogis-identity`
**Posição na sequência:** 9 de 10 — **depende do gate da Spec 08**.
**Severidade:** Média (custo e latência; também reduz a pressão de leitura no Firestore, o que influencia
a decisão da Spec 10).

## 1. Objetivo
Implementar cache nas duas aplicações para eliminar leituras desnecessárias de banco — requisito explícito
do usuário — em duas camadas: **Redis compartilhado** no servidor e **cache de borda do Cloudflare** para
conteúdo público.

## 2. Escopo

### 2.1 Servidor — `HybridCache` (.NET) com L1 memória + L2 Redis
Um Redis por ambiente, com prefixo de chave por serviço. Convenção de chave:
`{app}:{recurso}:{versão}:{identificador}` e **tags** para invalidação em lote.

Candidatos, por serviço:
- **autolog**: tabela FIPE (`services/fipe.ts` no front consome; cachear no servidor), lista de veículos do
  usuário, licença/trial (leitura em quase toda requisição), agregados de relatório.
- **identity**: resolução de permissões por usuário+aplicação (TTL curto), JWKS nos consumidores,
  lockout/rate-limit (já no Redis pela Spec 04).
- **payment**: catálogo de formas de pagamento/PSP e taxas (leitura frequente, escrita rara).
- **garage**: leituras do Firestore (eventos, participantes, galeria) — é aqui que o ganho de custo aparece.

Regras: **invalidação por tag na escrita** (nunca depender só de TTL para dado do próprio usuário); TTL
curto para dado sensível a permissão; nada de cachear resposta que dependa do token sem incluir o `sub`
na chave (risco de vazamento entre usuários).

### 2.2 Borda — Cloudflare
- Endpoints públicos (eventos, evento por id, galeria, páginas estáticas) com `Cache-Control` e **`ETag`**;
  `stale-while-revalidate` para absorver picos.
- **Cache tags + purge** disparado na escrita (admin publica evento → purge da tag correspondente).
- Nada autenticado no edge: `Cache-Control: private, no-store` em toda rota que exige token.

### 2.3 Cliente
- Garage: TanStack Query já presente — padronizar `staleTime`/`gcTime` e eliminar fetch direto remanescente.
- AutoLog: adotar TanStack Query nos hooks `hooks/useVehicles.ts` e `hooks/useMaintenance.ts`, hoje com
  estado manual.

## 3. Arquivos-chave
- `ogis-autolog-api/src/**/Program.cs` (registro do `HybridCache` + Redis), serviços de leitura por módulo.
- `ogis/src/services/api.js` (camada de leitura do Firestore + React Query), `ogis/functions/api/[[path]].js`
  e `wrangler.jsonc` (headers e purge no edge).
- `manutencaoCaarro/hooks/{useVehicles,useMaintenance}.ts`.
- `docker-compose.yml` de cada serviço — Redis compartilhado.

## 4. Critérios de aceite
- Hit ratio do Redis medido e reportado por recurso; leituras repetidas não chegam ao banco.
- Escrita invalida o cache correspondente **imediatamente** (sem esperar TTL) — testado por rota.
- Resposta autenticada **nunca** é servida a outro usuário (teste explícito de isolamento por `sub`).
- `CF-Cache-Status: HIT` nos endpoints públicos; purge por tag funcionando após publicação.
- Queda do Redis **não derruba** os serviços (degrada para L1/origem).

## 5. Verificação
- Medir leituras do Firestore e queries no Postgres antes/depois, com número registrado no PR.
- Teste de isolamento: usuário A lê recurso, usuário B pede o mesmo path e recebe **os dados dele**.
- Derrubar o Redis em staging e confirmar que a aplicação continua respondendo.

## 6. Gate de conclusão
Spec 10 usa os números de leitura do Firestore **pós-cache** como entrada da decisão.
