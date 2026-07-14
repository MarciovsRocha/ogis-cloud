# ogis.cloud — landing page

Landing page institucional/comercial da **holding ogis.cloud** (serviços digitais gerenciados para
PMEs de Curitiba). Parte do ecossistema Ogis.

## Stack
- **React 19 + Vite** · **Tailwind v4** (`@tailwindcss/vite`) + **daisyUI v5**
- `react-router-dom` (rotas `/`, `/termos`, `/privacidade`) · `react-helmet-async` (SEO) · `lucide-react`
- Deploy: **Cloudflare** (Wrangler) — domínio `ogis.cloud`

## Identidade visual
Tema **único** "Premium Dark + Gold" (stone `#1c1917`/`#0c0a09` + ouro `#ca8a04`/`#eab308`),
fontes **Poppins / Open Sans**. Definido em `src/index.css` como o tema daisyUI `ogis-dark`
(sem modo claro). `data-theme="ogis-dark"` fica fixo no `index.html`.
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
  index.css              # Tailwind v4 + daisyUI + tema ogis-dark
  App.jsx                # rotas (/, /termos, /privacidade)
  data/                  # solucoes.js, planos.js (conteúdo dos cards)
  components/            # Navbar, Hero, Solucoes, ComoFunciona, Planos, ParaQuem,
                         # Confianca, CTAAuditoria, Contato, Footer, SEO, Wordmark...
  pages/                 # LandingPage, Termos, Privacidade
email-signature/         # assinatura de e-mail (ver seção abaixo)
```

## Assinatura de e-mail

Assinatura de e-mail HTML na identidade da ogis.cloud (fundo asfalto + ouro), com o **logo
embutido em base64** — **não depende de nenhum link/imagem externa** (funciona offline e não
"quebra" se um servidor de imagens sair do ar).

```
email-signature/
  gerar-assinatura.py          # gera o logo + o HTML (fonte da verdade)
  logo-mark.png                # badge da marca (gerado)
  assinatura-ogis-cloud.html   # a assinatura pronta (gerado) — edite os [placeholders]
```

### 1. Gerar / regenerar

O HTML é **gerado** pelo script (não edite o base64 na mão). Requer Python + [Pillow](https://python-pillow.org/):

```bash
cd email-signature
pip install Pillow          # só na primeira vez
python gerar-assinatura.py
```

Isso reescreve `logo-mark.png` e `assinatura-ogis-cloud.html`. Regere sempre que quiser mudar
o desenho do logo (cores/proporções ficam no topo de `gerar-assinatura.py`).

### 2. Personalizar os dados

Abra `assinatura-ogis-cloud.html` e troque os campos entre `[colchetes]`:

| Campo | Onde |
|---|---|
| Nome | `[Marcio Rocha]` |
| Cargo | `[Desenvolvedor Full-Stack &amp; Arquiteto de Software]` |
| E-mail | `mailto:[contato@ogis.cloud]` **e** o texto `[contato@ogis.cloud]` |
| Telefone | `tel:+5541999999999` **e** o texto `[+55 (41) 99999-9999]` |
| Local | `[Curitiba, PR &mdash; Brasil]` |

O wordmark **ogis.cloud** já aponta para `https://ogis.cloud`. Os ícones (✉ ☎ ⚑) são glifos
monocromáticos em ouro — troque-os no `HTML` do script se preferir outros.

### 3. Instalar no cliente de e-mail

Método que funciona na maioria dos clientes: **abra o HTML no navegador, selecione a assinatura
renderizada (Ctrl+A), copie (Ctrl+C) e cole no editor de assinatura**. Ao colar o conteúdo já
renderizado, o cliente reaproveita a imagem embutida.

- **Gmail** → ⚙️ *Ver todas as configurações* → *Geral* → *Assinatura* → **cole** a assinatura.
- **Outlook (web)** → *Configurações* → *E-mail* → *Redigir e responder* → *Assinatura* → **cole**.
- **Outlook (desktop)** → *Arquivo* → *Opções* → *Email* → *Assinaturas…* → **cole** na caixa.
- **Apple Mail** → *Mail* → *Preferências* → *Assinaturas* → crie uma e **cole** o conteúdo.
- **Thunderbird** → *Configurações da conta* → *Assinatura*: marque "usar HTML" e cole o HTML,
  ou aponte para o arquivo `assinatura-ogis-cloud.html`.

> **Compatibilidade:** o logo vai embutido (data URI), o que dispensa hospedagem. Alguns clientes
> antigos (ex.: Outlook desktop clássico) podem não exibir imagens base64. Se cair nesse caso,
> hospede `logo-mark.png` (ex.: em `https://ogis.cloud/logo-mark.png`) e troque o `src` do `<img>`
> pelo URL. O restante (cores, layout, ícones) é HTML/CSS inline e funciona em todos.
