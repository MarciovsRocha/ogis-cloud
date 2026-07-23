# projetos/ — Central de documentação da integração OGIS Garage + AutoLog

Este diretório é o **ponto de partida** para desenvolver a integração em **qualquer estação de trabalho ou
sessão nova do Claude**. Tudo o que foi decidido e planejado está aqui, sem depender do histórico de
nenhuma conversa anterior.

> Nada de código foi escrito ainda. O que existe é planejamento, e ele é a fonte da verdade.

## Leia nesta ordem

| Ordem | Arquivo | O que responde |
|---|---|---|
| 1 | **[COMO-COMECAR.md](COMO-COMECAR.md)** | Como retomar o trabalho em outra máquina/sessão. **Comece aqui.** |
| 2 | **[PLANO-MESTRE.md](PLANO-MESTRE.md)** | Por que, o quê e como: mapa dos dois ecossistemas, arquitetura alvo, fases, riscos |
| 3 | **[ESTADO-DOS-REPOSITORIOS.md](ESTADO-DOS-REPOSITORIOS.md)** | Onde cada repo está (branch, commit, remoto), como rodar, quais segredos são necessários |
| 4 | **[specs/00-PIPELINE.md](specs/00-PIPELINE.md)** | Índice da sequência de 11 specs e as decisões fixadas |
| 5 | `specs/NN-*.md` | A spec da vez, com escopo, critérios de aceite e gate |

## O que estamos construindo, em três frases

O OGIS Garage (`ogisgarage.com.br`) e o AutoLog (manutenção veicular) são dois produtos com ecossistemas
incompatíveis: autenticação diferente (Firebase vs JWT próprio), banco diferente (Firestore vs Postgres) e
stack de frontend diferente. Eles passam a ser **produtos separados porém integrados**, sob subdomínios de
`ogisgarage.com.br`, compartilhando um **serviço central de identidade da ogis.cloud** (`id.ogis.cloud`) que
todos os sistemas OGIS vão usar. No caminho, o backend do AutoLog é **reescrito de NestJS para .NET**.

## Regra do pipeline

As specs são **sequenciais e com gate**: a spec `N+1` só começa quando o *gate de conclusão* da spec `N`
foi cumprido e verificado. Isso não é burocracia — cada gate existe porque pular aquela verificação quebra
alguma coisa mais adiante. O caso mais crítico é a **Spec 00**: sem o inventário do schema real, a reescrita
do backend parte de premissas falsas.

## Os 6 repositórios

| Repo | Papel | Situação |
|---|---|---|
| `ogis` | Frontend OGIS Garage (React 19/Vite/Cloudflare) | Existente |
| `manutencaoCaarro` | Frontend AutoLog (React 18/TS/Vite) | Existente |
| `manutencaoCarro-backend` | Backend AutoLog (NestJS) | Existente — **será substituído** |
| `ogis-payment` | Microserviço de pagamentos (.NET 10) | Existente |
| `ogis-identity` | IdP central da ogis.cloud | **Novo** — só documentação |
| `ogis-autolog-api` | Backend AutoLog em .NET | **Novo** — só documentação |

Detalhes de cada um (remoto, branch, como rodar, segredos) em
[ESTADO-DOS-REPOSITORIOS.md](ESTADO-DOS-REPOSITORIOS.md).

## Sobre as cópias

As specs também vivem dentro de cada repositório, em `.specs/`, junto do código que elas descrevem —
é lá que elas devem ser editadas durante o desenvolvimento. **Esta pasta é a cópia consolidada de
governança**, para leitura e retomada. Se divergirem, o `.specs/` do repositório vence.
Ver o procedimento de sincronização em [COMO-COMECAR.md](COMO-COMECAR.md).
