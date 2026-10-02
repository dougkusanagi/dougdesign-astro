# Rodada de 02/10/2026 — crescimento e correção factual

Horários em `America/Sao_Paulo`. Fontes consultadas em 02/10/2026, entre 18:50 e 19:35. Estado final: **12 URLs publicadas (4 novas e 8 atualizadas)**, nenhum agendamento futuro. Cadência do dia (meta de 5 novos e 3 atualizações): **4 novos** (1 abaixo da meta) e **8 atualizações substanciais**.

## Atualizações (8)

| URL | Problema encontrado | Correção | Commit |
|---|---|---|---|
| `/gta-6-no-nintendo-switch-2-rockstar-confirma-versao-portatil-e-deixa-fas-em-frenesi/` | Título/descrição afirmavam confirmação da Rockstar que nunca existiu; corpo dizia o contrário. 156 impressões no GSC. | Título honesto, tabela do que é oficial, nota de correção. | `0e59eaa` |
| `/gta-6-plataformas-confirmadas-lancamento-exclusividade/` | "Lançado em 2025", especulação de 30 FPS. | Data de 19/11/2026, plataformas, decisão para quem joga no PC. | `0e59eaa` |
| `/gta-vi-preco-80-dolares-rumor/` | US$ 80 tratado como rumor; projeção de R$ 499–549. | Preços oficiais (R$ 449,90/549,90; US$ 79,99/99,99). | `0e59eaa` |
| `/ps-plus-vs-xbox-game-pass-2026-qual-assinatura-vale-mais/` | Planos do Game Pass desatualizados, jogos/datas sem fonte, link para si mesmo. 538 impressões no GSC. | Preços lidos nas páginas oficiais (Essential R$ 43,90; Premium R$ 59,90; Ultimate R$ 76,90; PC R$ 59,99; PS Plus Essential/Extra/Deluxe). | `830e1e8` |
| `/como-usar-deepseek-coder-no-vscode/` | Ensinava `config.json` (obsoleto) e `deepseek-coder` (fora da lista da API); alegava superar o Copilot "na experiência". | `config.yaml`, modelos `deepseek-flash`/`deepseek-v4-pro`, preços oficiais, limites de verificação. Exemplo **não** executado com chave real. | `830e1e8` |
| `/gta-6/` | Requisitos de PC inventados, "final de 2025". | Guia-base com fatos oficiais. | `e4bb699` |
| `/expectativas-novidades-lancamento-gta-6/` | "RAGE 9", ray tracing e "testes fechados" sem fonte. | Foco em história, personagens e cenário oficiais. | `e4bb699` |
| `/gta-6-expectativas-lancamento/` | "Lançamento em maio de 2026". | Linha do tempo dos adiamentos. | `e4bb699` |

Os cinco artigos de GTA 6 passam a ter perguntas distintas (guia, preço, plataformas/PC, Switch 2, mundo e adiamentos), com links entre si. Nenhum redirecionamento foi feito.

## Novos posts (4)

| URL | Pergunta | Fontes primárias | Commit |
|---|---|---|---|
| `/lancamentos-games-outubro-2026-datas-plataformas/` | Quais jogos saem em outubro? | Xbox, Nintendo, Steam; calendários (secundários) identificados como tais | `17c1c5b`, `2ba66a7`, `43171c4` |
| `/gears-of-war-e-day-requisitos-pc-preco-game-pass/` | O PC roda? Quanto custa? Game Pass? | Steam (API pública) e Xbox | `a8790c5`, `15a707e` |
| `/phantom-blade-zero-requisitos-pc-preco-edicoes/` | Requisitos, preço e edições | Steam | `2ba66a7` |
| `/ace-combat-8-requisitos-pc-preco-edicoes/` | Requisitos, preço e edições | Steam | `43171c4` |

O quinto novo post da meta do dia ficou pendente (ver abaixo).

## Deploy e verificação

Conferidos por `curl` às ~19:36: HTTP 200, título novo, uma `<h1>` e `og:image` em PNG/JPG para GTA 6 (×6 URLs do cluster, 3 atualizados em `e4bb699`), guia de outubro, Gears e Phantom Blade Zero; PS Plus vs Game Pass e DeepSeek conferidos antes. O guia de Ace Combat 8 (`43171c4`) retornou 404 no primeiro teste, com o deploy ainda em andamento; ver nota no fim. Audit (`ok: true`) e build limpos antes de cada push, exceto um push feito com o audit falhando por `pubDate` futuro, corrigido em `15a707e`.

## Pendências e limites

- **Pendente do dia:** mais um post novo. Candidato: *Call of Duty: Modern Warfare 4* (requisitos de PC aparecem como "TBD" na Steam; aguardar publicação) e requisitos do PC de *Star Wars: Galactic Racer* (R$ 229,90 na Steam, não apurado).
- **Capas:** os quatro guias novos saíram primeiro com cartões feitos por script (sessão sem `image_gen`). Depois foram trocados por ilustrações geradas pelo Codex CLI (`scripts/codex-cover.sh`, `image_gen`), em JPG 1672×941, inspecionadas visualmente (sem texto, logotipos ou personagens de jogos). Não houve revisão independente por subagente. O `ps-plus-vs-xbox-game-pass-2026...`, os cinco de GTA 6 e o DeepSeek mantêm as capas anteriores, já descritas como ilustração gerada por IA.
- **Datas na Steam Brasil:** a Steam mostra 1/10 (Ace Combat 8), 22/10 (CoD MW4) e 28/10 (Phantom Blade Zero), um dia antes do anunciado. A hipótese de fuso não foi confirmada oficialmente.
- **DeepSeek:** a configuração segue a documentação; não foi rodada com chave real.
- **GTA 6:** as datas dos adiamentos de 2025 vêm de reportagens que não foram abertas na íntegra; o artigo declara isso. Os detalhes do "Olhar Estendido" (duração) vêm da imprensa.
- **Gears:** preço em reais da loja Xbox, horário de liberação e tamanho do pré-carregamento no console não foram apurados.
- **Fila P0 ainda aberta** (ver `posts-priorizados-2026-10-01.md`): Astro 7 (nº 02), Steam Deck 2 (03), Meta Quest 4 vs Vision Pro Lite (04), retrocompatibilidade Switch 2 (05), comparativo de portáteis (06), Monster Hunter Wilds (09), cloud gaming (10). Itens 01, 07 e 08 foram tratados hoje.
- **Medição:** GSC cobre só 04–28/09; avaliar efeito das correções em 08/10 (portáteis) e a partir de 12/10, com janelas equivalentes. Não há resultado de tráfego nesta rodada.
