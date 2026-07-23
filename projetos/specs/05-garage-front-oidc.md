# Spec 05 — OGIS Garage (front): Firebase Auth → OIDC, com DPoP e step-up

**Projeto:** ogis (React 19 + Vite 7 + Cloudflare)
**Posição na sequência:** 5 de 10 — **depende do gate da Spec 04**.
**Severidade:** Média-alta (toca o login de produção de `ogisgarage.com.br`).
**Documento mestre:** `INTEGRACAO-OGIS-AUTOLOG.md` (raiz deste repo), Fase 3.

## 1. Objetivo
Trocar o login do Garage — hoje `signInWithPopup` do Firebase com `isAdmin` lido do Firestore — por
**OIDC (Authorization Code + PKCE S256) com DPoP** contra `id.ogis.cloud`. É o primeiro consumidor real do
IdP e valida SSO, DPoP e step-up com o menor raio de impacto, antes da reescrita do backend AutoLog.

**Entrega estrutural desta spec:** o módulo compartilhado **`@ogis/auth-web`**, consumido depois pelo
AutoLog (Spec 08). Escrever essa lógica duas vezes é como ela vai divergir e quebrar em produção.

## 2. Situação atual (levantada)
- `src/contexts/AuthContext.jsx`: `onAuthStateChanged` do Firebase; cria/lê `users/{uid}` no Firestore;
  expõe `{ user, login, logout, loading, getIdToken }`, com `getIdToken` usado para chamar o `ogis-payment`.
- `src/services/firebase.js`: config vinda de `import.meta.env.VITE_FIREBASE_*` em **build-time** (armadilha
  já documentada em `ESTADO-ATUAL.md` sobre o preview do Cloudflare).
- `src/services/api.js`: fala **direto com o Firestore** (events, participants) — **fora do escopo desta
  spec** (ver Spec 10); o Firebase **continua** sendo usado para dados nesta fase.

## 3. Escopo

### 3.1 Módulo `@ogis/auth-web` (novo, compartilhado)
- Cliente OIDC sobre `oidc-client-ts`: code+PKCE **S256**, refresh silencioso, logout no IdP.
- **DPoP**: gerar par de chaves **não-exportável** via WebCrypto (`extractable: false`), persistir em
  **IndexedDB**, assinar cada requisição (`htm`/`htu`/`iat`/`jti`), tratar o desafio `DPoP-Nonce`.
- **Access token só em memória** — nenhuma escrita em `localStorage`/`sessionStorage`. Recarregar a página
  recupera a sessão por **refresh silencioso**, não por leitura de storage.
- **Step-up**: interceptar `401` com `WWW-Authenticate: ... error="insufficient_user_authentication"`,
  **persistir a intenção da ação em curso**, redirecionar ao IdP com `acr_values`/`prompt=login`, e
  **retomar a ação** após o retorno. Sem isso o usuário perde o formulário preenchido e a feature vira
  reclamação.
- Fila de requisições durante renovação de token, para não disparar N refreshes simultâneos.

### 3.2 Integração no Garage
- Reescrever `src/contexts/AuthContext.jsx` sobre o `@ogis/auth-web`, mantendo **a mesma interface pública**
  (`user`, `login`, `logout`, `loading`, `getIdToken`) — assim as páginas, `PaymentService.js` e
  `DiscountAdminService.js` não mudam. `getIdToken` passa a devolver o access token do IdP.
- Rotas `/auth/callback` e `/auth/silent` em `src/routes/AppRoutes.jsx`.
- `isAdmin` deixa de vir do documento Firestore e passa a vir de `roles[]`/`perms[]` do token (aplicação
  `garage`). Ajustar `src/pages/Admin.jsx` e `src/pages/DiscountAdmin.jsx`.
- **Separar autenticação de dados**: o Firebase App continua inicializado para Firestore/Storage, mas
  `getAuth`/`GoogleAuthProvider` saem de `src/services/firebase.js`. Se as regras do Firestore dependerem
  de `request.auth`, esta spec **exige** que os acessos afetados passem por API — mapear **antes** de
  começar a codificar (é o achado que pode antecipar a Spec 10).
- Header/menu OGIS com **link direto para o AutoLog** (`app.ogisgarage.com.br`), aproveitando o SSO por
  cookie do IdP.

### 3.3 Configuração
`VITE_OIDC_AUTHORITY`, `VITE_OIDC_CLIENT_ID`, `VITE_OIDC_REDIRECT_URI` cadastradas no Cloudflare **em
Production e em Preview** — mesma armadilha do `ESTADO-ATUAL.md`. Como a Spec 01 exige `redirect_uri` por
**comparação exata**, **cada URL de preview precisa ser registrada individualmente no IdP** (ou usar uma
URL de preview estável). Não existe wildcard.

## 4. Arquivos-chave
- Novo: `packages/auth-web/` (ou repo próprio) — `@ogis/auth-web`.
- `src/contexts/AuthContext.jsx` (reescrita), `src/services/firebase.js` (remoção do auth),
  `src/routes/AppRoutes.jsx` (callbacks), `src/pages/Admin.jsx`, `src/pages/DiscountAdmin.jsx`,
  `src/services/{PaymentService,DiscountAdminService}.js` (consumo do token),
  `src/components/` (header com link para o AutoLog), `vite.config.js` (proxy `/api`).

## 5. Critérios de aceite
- Login com Google pelo IdP funciona; sessão sobrevive a refresh da página; logout encerra no IdP.
- **Nenhum token em `localStorage`/`sessionStorage`** (verificado no DevTools).
- Requisições saem com prova DPoP válida; o par de chaves é **não-exportável** (confirmar no console que
  `exportKey` falha).
- Access token de 10 min é renovado silenciosamente — usuário **não** é deslogado a cada 10 minutos.
- Step-up: ação sensível dispara redirect ao IdP e, após MFA, **conclui a ação original** sem perda de
  contexto.
- Admin do Garage enxerga `/admin` e `/admin/descontos`; não-admin recebe negação.
- Nenhum acesso ao Firestore quebra por perda de `request.auth`.
- `npm run build` OK e preview do Cloudflare funcional (vars em Preview + `redirect_uri` registrada).

## 6. Verificação
- Fluxo manual em staging: login → área admin → criar código de desconto → gerar link de pagamento
  (este último deve **disparar step-up**, por ser ação de `assurance` elevado — Spec 06).
- Deixar a aba aberta por 30+ minutos e confirmar que a sessão continua viva por refresh silencioso.
- Copiar o access token para outro navegador e confirmar que é **rejeitado** (DPoP).
- Navegar de `ogisgarage.com.br` para `app.ogisgarage.com.br` sem novo login (após a Spec 08).
- Revogar a sessão no IdP e confirmar que o app cai para anônimo ao expirar o access token.

## 7. Gate de conclusão
Spec 06 só ocorre após: login OIDC do Garage estável em produção por alguns dias, DPoP e step-up
verificados, e o Firebase Auth ainda disponível como rollback.
