# ogis.cloud — landing page

Landing page institucional/comercial da **holding ogis.cloud** (serviços digitais gerenciados para
PMEs de Curitiba). Parte do ecossistema Ogis.

## Stack
- **React 19 + Vite** · **Tailwind v4** (`@tailwindcss/vite`) + **daisyUI v5**
- `react-router-dom` (rotas `/`, `/termos`, `/privacidade`) · `react-helmet-async` (SEO) · `lucide-react`
- Deploy: **Cloudflare** (Wrangler) — domínio `ogis.cloud`

## Identidade visual
Tema "Premium Dark + Gold" (stone `#1c1917` + ouro `#ca8a04`), fontes **Poppins / Open Sans**.
Definida em `src/index.css` como dois temas daisyUI: `ogis-light` (padrão) e `ogis-dark`.
> Intencionalmente **distinta** da paleta corporativa teal (`ogis-corp`) do `ogis-manager`.

## Comandos
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # dist/
npm run lint
npm run preview   # build + wrangler dev
npm run deploy    # build + wrangler deploy
```

## Configuração (antes do deploy)
Edite `src/config.js`:
- `WHATSAPP_NUMERO` — **placeholder** `5541999999999` → número real (só dígitos, 55 + DDD + número).
- `BRAND.email` — e-mail de contato (padrão `contato@ogis.cloud`).

Todas as ações (auditoria, planos, contato) abrem **WhatsApp** ou **e-mail** com uma mensagem
pré-preenchida conforme a opção clicada. Os textos ficam em `MSG` / `ASSUNTO` no `config.js`.

## Estrutura
```
src/
  config.js              # contato/CTAs + navegação (edite os placeholders aqui)
  index.css              # Tailwind v4 + daisyUI + temas ogis-light/ogis-dark
  App.jsx                # rotas + tema (data-theme)
  hooks/useTheme.js      # alterna claro/escuro com persistência
  data/                  # solucoes.js, planos.js (conteúdo dos cards)
  components/            # Navbar, Hero, Solucoes, ComoFunciona, Planos, ParaQuem,
                         # Confianca, CTAAuditoria, Contato, Footer, SEO, Wordmark...
  pages/                 # LandingPage, Termos, Privacidade
```
