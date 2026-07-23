# Spec 08 — AutoLog (front): OIDC com DPoP, roteamento e nova API

**Projeto:** manutencaoCaarro (React 18 + Vite 5 + TypeScript)
**Posição na sequência:** 8 de 10 — **depende do gate da Spec 07**.
**Severidade:** Média-alta (login e todo o consumo de API do produto).
**Documento mestre:** `INTEGRACAO-OGIS-AUTOLOG.md` (raiz deste repo), Fase 3.

## 1. Objetivo
Remover a autenticação própria do AutoLog (JWT em `localStorage`) e adotar **OIDC code+PKCE S256 com DPoP**
contra `id.ogis.cloud`, reutilizando o módulo **`@ogis/auth-web`** entregue na Spec 05; apontar para a API
.NET; e introduzir roteamento real para permitir link direto vindo do OGIS Garage.
Publicado em `app.ogisgarage.com.br`.

## 2. Situação atual (levantada)
- `services/tokenStore.ts`: JWT em `localStorage` (chave `authToken`), cacheado em memória. **Sai inteiro.**
- `services/http.ts`: `createHttpClient({ getToken, onUnauthorized, logoutOnUnauthorized })` — a abstração
  `getToken()` já existe, então o raio de impacto é pequeno: troca-se a fonte do token e acrescenta-se a
  assinatura DPoP por requisição.
- `contexts/AuthContext.tsx`: login/registro/verify/resendVerification/logout + derivação de licença; usa
  `services/api.ts`, `authEvents`, e limpa cache de fotos no logout.
- `components/AuthPage.tsx` (login/registro) e `LicenseActivationPage.tsx`.
- `App.tsx` navega por **state (`View`)**, sem router → não existe URL para deep-link.
- `url.ts` define `URL_BASE` do backend Nest.

## 3. Escopo

### 3.1 Autenticação
1. Adotar **`@ogis/auth-web`** (Spec 05): code+PKCE S256, DPoP com chave não-exportável em IndexedDB,
   access token **só em memória**, refresh silencioso, tratamento de step-up com retomada da ação.
2. **Excluir `services/tokenStore.ts`.**
3. **`POST /auth/login` (equivalente a ROPC) é removido em definitivo, não migrado** — OAuth 2.1 proíbe o
   grant de senha (Spec 01). Login, registro, verificação de e-mail e recuperação de senha passam **todos**
   a ser telas do IdP.
4. Reescrever `contexts/AuthContext.tsx`: mantém `status/isAuthenticated/user/license/loading/logout` e a
   derivação de licença (agora vinda da API), mas `login`/`register`/`verify`/`resendVerification` deixam de
   existir — viram redirecionamento ao IdP. Ajustar `App.tsx` e demais consumidores.
5. `services/http.ts`: `getToken` passa a vir do `@ogis/auth-web`; cada requisição leva prova DPoP;
   `onUnauthorized` distingue **três** casos — token expirado (refresh silencioso), step-up exigido
   (redirect com `acr_values` + retomada), sessão inválida (logout). `services/adminApi.ts`
   (`logoutOnUnauthorized:false`) usa o mesmo mecanismo.
6. `components/AuthPage.tsx` reduz-se a uma tela "entrar" que dispara o redirect;
   `components/AdminPanel.tsx` decide visibilidade por `perms[]` do token, não por `isAdmin` booleano.

### 3.2 Roteamento
Introduzir **react-router**: mapear cada `View` de `App.tsx` para uma rota (`/dashboard`, `/veiculos`,
`/manutencoes`, `/relatorios`, `/calendario`, `/perfil`, `/configuracoes`, `/admin`) + `/auth/callback` e
`/auth/silent`. Habilita deep-link vindo do Garage, retomada de ação pós-step-up e voltar/avançar do
navegador.

### 3.3 API e integração
- `url.ts` → `https://api.ogis.cloud/autolog`.
- Vars `VITE_OIDC_*` por ambiente; `redirect_uri` registrada **exatamente** no IdP (sem wildcard — Spec 01).
- Header com **link direto de volta para `ogisgarage.com.br`**, fechando a navegação entre os produtos
  (SSO por cookie do IdP: travessia sem novo login).

### 3.4 Higiene
`npm run typecheck` limpo; `jsPDF`/`XLSX` hoje são `declare var` globais em `App.tsx` — mover para import
dinâmico enquanto o arquivo estiver aberto.

## 4. Arquivos-chave
`contexts/AuthContext.tsx`, `services/{http,tokenStore,api,adminApi,authEvents}.ts`, `url.ts`,
`components/{AuthPage,AdminPanel,Header,Sidebar,LicenseActivationPage}.tsx`, `App.tsx`, `vite.config.ts`.

## 5. Critérios de aceite
- Login via IdP (senha ou Google) funciona; usuário antigo entra com a **mesma senha** (bcrypt → Argon2id,
  Specs 01/03).
- **Nenhum token em `localStorage`/`sessionStorage`** (verificado no DevTools).
- Requisições carregam prova DPoP; token copiado para outro navegador é **rejeitado**.
- Access token de 10 min renovado silenciosamente — **sem deslogar o usuário a cada 10 minutos**.
- Step-up numa ação sensível redireciona, autentica e **retoma a ação** sem perder o formulário.
- Todas as telas funcionam contra a API .NET, incluindo upload/preview de anexos e relatórios.
- Deep-link direto para `/veiculos` autentica e abre a tela correta.
- Navegar de `ogisgarage.com.br` para `app.ogisgarage.com.br` sem novo login.
- `npm run typecheck` e `npm run build` OK.

## 6. Verificação
- Bateria manual em staging: login → dashboard → criar veículo → lançar manutenção → anexar PDF → parser de
  NF → relatório PDF/XLSX → painel admin → logout.
- Sessão longa: aba aberta 30+ min, uso normal, sem logout espúrio.
- Revogar sessão no IdP e confirmar que o app cai para anônimo.
- Teste de licença expirada (modo leitura) preservado.

## 7. Gate de conclusão
Specs 09/10 só iniciam após: AutoLog em produção com OIDC/DPoP e API .NET, sem regressão reportada por 72h.
