# Como começar (outra estação de trabalho ou sessão nova do Claude)

Este documento existe para que o desenvolvimento comece **sem depender de nenhuma conversa anterior**.

---

## 1. Preparar a estação

```bash
# 1. Clonar os repositórios existentes
git clone https://github.com/MarciovsRocha/ogis.git
git clone https://github.com/fabiogarbato/manutencaoCaarro.git
git clone https://github.com/fabiogarbato/manutencaoCarro-backend.git
git clone git@github.com:MarciovsRocha/ogis-payment.git        # SSH
git clone https://github.com/MarciovsRocha/ogis-cloud.git      # esta documentação

# 2. Buscar as branches de documentação (se já tiverem sido enviadas)
for r in ogis manutencaoCaarro manutencaoCarro-backend ogis-payment; do
  git -C $r fetch origin && git -C $r checkout docs/integracao-ogis-autolog
done
```

**Se as branches `docs/integracao-ogis-autolog` não existirem no remoto**, elas ainda não foram enviadas —
use as specs desta pasta (`ogis-cloud/projetos/specs/`) como fonte e copie-as para o `.specs/` de cada repo.
Ver o mapa de qual spec pertence a qual repo em [specs/00-PIPELINE.md](specs/00-PIPELINE.md).

**Os repos `ogis-identity` e `ogis-autolog-api` não têm remoto** — precisam ser criados no GitHub antes de
qualquer trabalho fora da estação original. Enquanto isso, suas specs (01–04, 07, 09) estão preservadas aqui.

Pré-requisitos e segredos: [ESTADO-DOS-REPOSITORIOS.md](ESTADO-DOS-REPOSITORIOS.md), seção 5.

---

## 2. Retomar com o Claude

Numa sessão nova, cole este prompt:

```
Vou continuar a integração dos projetos OGIS Garage e AutoLog (manutençãoCarro).
Todo o planejamento está em D:\projects\ogis-cloud\projetos\ (ajuste o caminho se necessário).

Leia, nesta ordem:
1. projetos/README.md
2. projetos/PLANO-MESTRE.md
3. projetos/ESTADO-DOS-REPOSITORIOS.md
4. projetos/specs/00-PIPELINE.md

Depois me diga qual é a próxima spec pendente e comece por ela, seguindo o escopo
e os critérios de aceite do arquivo da spec. Respeite a regra do pipeline: não
avance para a spec seguinte antes de cumprir o gate de conclusão da atual.
```

**Não peça ao Claude para replanejar.** As decisões abaixo já foram tomadas e discutidas; revisitá-las sem
motivo novo custa tempo e produz divergência entre os documentos.

---

## 3. Decisões já fechadas (não reabrir sem motivo)

**Produto e infraestrutura**
- Projetos **separados porém integrados**, com link direto entre si, sob governança da ogis.cloud.
- **Subdomínios** (não path-based): `ogisgarage.com.br`, `app.ogisgarage.com.br`, `id.ogis.cloud`,
  `api.ogis.cloud`.
- Backend AutoLog: **reescrita completa (big bang)** de NestJS para .NET, com o Nest congelado por 30 dias
  como rollback.
- Infra: **containers em VPS IONOS**.
- Cache: **Redis (L2) + edge cache do Cloudflare**.
- Destino dos dados do Firestore: **decisão deliberadamente adiada** para a Spec 10.

**Segurança (estado da arte, definido pelo usuário)**
- **OAuth 2.1 estrito**: fluxo implícito e ROPC desabilitados e verificados por **teste negativo**;
  `redirect_uri` por comparação exata (sem wildcard).
- **PKCE S256 obrigatório para todo cliente**, inclusive confidenciais.
- **Access token de 10 min em memória**; refresh rotativo com detecção de reuso em cookie
  `HttpOnly + Secure + SameSite=Lax + Path` restrito. **Zero JWT em `localStorage`.**
- **DPoP (RFC 9449)** nos SPAs, validado por **todos** os resource servers.
- **ABAC/Zero Trust** com PDP no IdP e PEP no `Ogis.Auth`, risco por rede/geo, comportamento e
  sensibilidade da ação.
- **Step-up MFA é a única reação automática** ao risco; revogação de sessão é ação administrativa.
- **Shadow mode obrigatório** antes de ligar o enforcement do motor de risco.

---

## 4. Por onde começar de fato

A próxima spec pendente é a **[00 — Inventário e contratos](specs/00-inventario-e-contratos.md)**, no repo
`manutencaoCarro-backend`. Ela é pré-requisito de todas as outras, e a razão é concreta: o backend usa
`synchronize: true`, então o TypeORM vem alterando o schema sozinho e **o banco de produção pode ter
divergido das entidades**. Reescrever em .NET sem esse inventário é construir sobre uma planta errada.

Ordem completa e gates: [specs/00-PIPELINE.md](specs/00-PIPELINE.md).

---

## 5. Regras de trabalho

1. **Uma spec por vez**, respeitando o gate de conclusão.
2. **Editar a spec dentro do repositório** (`<repo>/.specs/NN-*.md`), não a cópia desta pasta — é lá que ela
   convive com o código que descreve.
3. **Ressincronizar esta pasta ao concluir uma spec**, para que a governança não fique desatualizada:
   ```bash
   cp <repo>/.specs/NN-*.md ogis-cloud/projetos/specs/
   ```
   e atualizar a coluna *Status* em `specs/00-PIPELINE.md` (nos repos e aqui).
4. **Documentação em branch separada** (`docs/...`), nunca dentro de uma branch de feature com PR aberto.
5. **Segredo nenhum entra em repositório** — nem aqui, nem nos `.specs/`.
6. Ao terminar uma spec, atualizar também o `ESTADO-ATUAL.md` do repo correspondente, quando existir
   (`ogis` e `ogis-payment` já usam esse padrão de memória entre estações).
