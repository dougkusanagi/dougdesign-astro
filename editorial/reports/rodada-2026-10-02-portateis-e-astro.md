# Portáteis e tutorial Astro — continuação de 02/10/2026

Autorização: novo pedido para continuar trazendo visitantes. Skills locais round-planning, update-post, cover-generation e publish-or-schedule, além de imagegen, aplicadas. Três revisões substanciais, sem novos posts ou agendamento; link de retorno cosmético no Ally X preserva updatedDate. Prioridades P0 nº 02, 03 e 06.

## Decisões por URL

- `/melhor-pc-portatil-2026-rog-ally-vs-steam-deck/`: ofertas do Ally original RC71L, versões Z1 e Z1 Extreme. Removidos tempos fictícios de bateria, temperatura, garantia universal e compatibilidade total. Recomendação por biblioteca e oferta completa. Demanda histórica da triagem 01/10: 0 cliques, 92 impressões, posição 7,6 no GSC Web 04–28/09/2026, propriedade www. Não é resultado atual.
- `/steam-deck-2/`: limites da informação sobre sucessor, sem Zen 5/RDNA presumidos, ganho de 50%, tela de 8 polegadas ou 120 Hz. Consulta delimitada a fontes abertas; declaração de continuidade da linha não é ficha de produto. Sem demanda quantificada nesta rodada.
- `/astro-7/`: corrigido output hybrid, removidas garantias de SEO/CWV, tutorial executável com Node, static e prerender false. Sem demanda quantificada.
- `/rog-ally-x-vs-steam-deck-oled-qual-comprar/`: somente link contextual para RC71L e internal_links sincronizado, datas preservadas. Não conta como revisão substancial.

Slugs, pubDate, autoria e estado público preservados. Intent check Ally usou Codex: conflito esperado com a própria URL e candidatos relacionados. Lidos comparativo Ally X e guias preço OLED/Steam Deck2, que respondem a modelos/perguntas distintas. Astro e Deck2 via Ollama: conflito com próprios slugs e comparação semântica indisponível; lidos manualmente novidades Astro7 e rotas dinâmicas/getStaticPaths. Eles têm erros remanescentes e não foram recomendados como interlinks. Nenhum redirect ou nova URL. Outros candidatos do Ally classificados relacionados (PC vs smartphone, Portal, Switch2, modo Xbox), sem mesma dupla de modelos. Sem consolidação automática.

## Pesquisa e limites

Fontes abertas em 02/10/2026:

- ASUS regional US RC71L: `https://rog.asus.com/us/gaming-handhelds/rog-ally/rog-ally-2023/spec/`. Z1/Extreme, tela, sistema, 40 Wh e peso. Não comprova garantia de uma oferta brasileira.
- Valve OLED: `https://www.steamdeck.com/en/tech/oled`; Deck Verified: `https://www.steamdeck.com/en/verified`. Specs separadas de FPS e autonomia medida.
- Xbox PC Game Pass: `https://www.xbox.com/en-US/xbox-game-pass/pc-game-pass`, Windows 22H2 e requisitos por jogo; nenhum preço novo usado.
- Livreto Valve 2022: `https://media.steampowered.com/apps/valve/2022/steamDeck_booklet_EN.pdf`, baixado e lido com pdftotext; seção The Future (linha multigeracional). Web retornou erro para PDF, acesso HTTP direto funcionou. Noticiário `https://www.steamdeck.com/en/news` aberto via web e navegador; primeira página mostrava Steam/SteamOS, sem ficha Deck2. Não cobre todas as entrevistas ou todo o arquivo. Busca retornou rumores recentes de terceiros; não viraram fatos no artigo.
- Astro: migração v5 (remoção hybrid), on-demand-rendering, adaptador Node, componentes Astro. npm registry consultado para versões e peers.

Search Console CLI continua sem service account. Navegador colaborativo não tinha sessão de GSC aberta; não houve medição nova nem extração de credenciais. Sem ganho de visitantes comprovado. Reavaliar portáteis em 08/10 e cobertura/consultas do restante a partir de 12/10 com períodos equivalentes.

## Exemplo de código e validação

Projeto isolado em `/tmp/doug-astro-render`, preservado em `editorial/examples/astro-renderizacao/`: Node 22.22.1, Astro 7.3.5, @astrojs/node 11.1.6, lockfile. Instalado, build passou; servidor standalone em 127.0.0.1:4327. q=Astro e q=Outro retornaram 200 com texto correspondente; q=%3Cscript%3E escapado. Home HTML existe em dist/client; pesquisa não gera HTML estático. Servidor encerrado após teste. Não houve teste de Vercel/Netlify, banco, login, cache ou benchmark CWV para esse exemplo.

Primeira tentativa com versões 7.0.0/11.0.0 revelou avisos de npm audit; exemplo foi atualizado para 7.3.5/11.1.6, instalação sem vulnerabilidades reportadas. As dependências do site principal não foram modificadas nesta rodada; revisar seus avisos de segurança numa tarefa técnica própria antes de ampliar SSR. Essa observação não é auditoria completa do site.

Unitários do blog: 40 aprovados. Typecheck CLI aprovado. Audit completo aprovado antes do build; dívida legada listada separadamente. Git diff check sem erro. Não escrevemos testes que só espelham o texto.

## Capas

Capas antigas: 1024×1024, fora do padrão atual; comparação antiga parecia foto de teste e Astro continha código fictício. Geradas novas pelo script padrão Codex CLI/image_gen, sem API key, em JPG 1672×941; prompt e alt no frontmatter, legenda IA no corpo. Inspeção direta e independente pela skill. Ally v2 e Astro v2 aprovadas; primeira Deck2 v2 parecia tablet sem controles, descartada; v3 aprovada, com controles visíveis e sem alegação de design anunciado. Revisão independente concluída para as três capas. Originais preservados. Build/deploy e URLs: registrar abaixo após conferência.

Build local concluído às 20:37 -03:00, 655 páginas. Audit completo: ok true, sem issues em revisados; legado 489 posts/1854 issues. Interlinks dos quatro arquivos retornaram HTTP 200 antes do push. Datas das revisões: portáteis 20:32:54 -03:00 e Astro 20:34:41 -03:00. Publicação original preservada em todos; Ally X mantém updatedDate de 01/10 às 19:05 -03:00. Estado nesta etapa: pronto local, deploy a conferir.
