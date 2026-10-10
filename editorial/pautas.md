# Pautas — fila ativa

Atualizada em 08/10/2026. A ordem do dia sai de `dougseo brief` (seção 0) combinada com esta fila; a política de prioridade está em `AGENTS.md`. O histórico das rodadas fica em [historico/](historico/). Planejamento não é publicação: o agendamento real está no frontmatter e no GitHub Actions.

Mantenha este arquivo curto. Item concluído sai daqui e vai para o histórico do mês; item novo só entra com evidência datada.

## Estados

`candidata` (hipótese) → `planejada` (ação e motivo definidos) → `em pesquisa`/`em revisão` → `pronta` (revisão factual, capa, links, audit e build) → `agendada` (data futura, push e workflow conferidos) → `ao vivo` (deploy e URL pública verificados). `adiada`/`descartada` exigem motivo; conflito de intenção transforma a ação em atualização.

## Fila

| ID | Prioridade | Ação | URL ou tema | Evidência | Condição e próximo passo |
|---|---|---|---|---|---|
| P11 | alta | Descoberta | Posts de 01/10 a 07/10 | Inspeção de URL em 08/10: Ace Combat 8, Phantom Blade Zero, Galactic Racer, lançamentos de outubro e Penpot como “URL desconhecida”. | Links de entrada a partir de páginas com impressões (Gears, lançamentos de outubro, PS Plus vs Game Pass). `sitemap --submit` após o deploy. Reinspecionar em 12/10 com `search-console inspect --slug`. |
| P18 | alta | Revisar classe A | 30 páginas com 100+ impressões ou 2+ cliques (`reports/triagem-acervo-2026-10-09.csv`) | 77% das impressões e a maior parte dos cliques estão nelas; posição média 5–10. | À medida que saírem do ⏸ (a partir de ~19/10): melhorar a resposta e a profundidade para subir de posição. Título sozinho muda pouco em posição 8–10. |
| P19 | alta | Corrigir (erro factual) | 15 posts de risco alto e 32 de risco médio (`reports/varredura-titulos-afirmativos-2026-10-09.csv`) | Títulos que afirmam chegada ou confirmação sem fonte primária; em 15 o corpo diz o contrário. Maiores: Pokémon Legends: Arceus 2 (157 imp, 2 cliques), Genshin 5.0 Natlan (52), Mario Kart 9 (23). | Prioridade 1 do `AGENTS.md` (vale mesmo em observação). Por post: abrir a fonte primária; corrigir título, descrição e corpo, ou consolidar com 301 se não houver fato novo. Começar por impressões. |
| P14 | média | Diferenciar | Meta Quest 4: pilar × rumores | “meta quest 4”: 906 impressões no pilar (pos. 9,6) e 39 na página de rumores. | Depois de 16/10 (observação). Comparar os textos; diferenciar intenções ou consolidar com 301. |
| P15 | média | Atualizar | Steam Famílias (`/como-funciona-o-novo-compartilhamento-de-biblioteca-steam-familias-em-2026-guia-completo-de-configuracao/`) | 146 impressões, posição 7,7 e 0 cliques. | Depois de 14/10. Título e descrição pela consulta real; conferir regras na documentação da Steam. |
| P16 | média | Comparar | RTX 5080 × 4090 (`/rtx-5080-vs-rtx-4090-vale-a-pena-o-upgrade/` e `/gpu-ia-local-2026-rtx-5080-vs-rtx-4090/`) | Página principal com 440 impressões e 0 cliques; consultas “4090 x 5080” e variações na posição 9–10. | Depois de 14/10. Confirmar que as intenções são distintas (jogos × IA local) e ajustar títulos à consulta. |
| P17 | média | Medir formato | Guias “requisitos de PC, preço e edições” | 10 guias desde 02/10; em 08/10 só o de Gears estava indexado (202 impressões, 1 clique, posição 8,5). | Em 30/10, comparar no brief impressões e cliques por guia com 21+ dias de dados. Se a maioria não passar de poucas impressões, parar o formato e rever a estratégia de posts novos. |

## Correções factuais pendentes (prioridade 1 quando houver tráfego)

- Vision Pro 2 × Quest Pro 2; Meta Connect descrito como evento futuro; Quest 3S.
- Dívida do cluster Switch 2 (promessas de compatibilidade total em URLs ainda não revisadas).
- Promessas universais em cloud gaming com teclado e mouse.
- Comparativo do ROG Ally original em Tecnologia: alegações de autonomia sem método.
- Itens P0/P1 restantes da [fila de 29 posts prioritários](reports/posts-priorizados-2026-10-01.md). Consulte essa fila só quando os itens acima acabarem.

## Sem evidência de demanda (baixa; só com sinal novo)

- P04: CSS Subgrid, com três URLs de intenção próxima. Comparar antes de mexer; não criar uma quarta.
- P05: Astro × Next.js para blog (`/astro-vs-nextjs-2026-qual-framework-escolher/`).
- P06–P08: tutoriais candidatos (links quebrados no Astro, datas de publicação no Astro, compatibilidade no Steam Deck).

## Medição e acessos

- 12/10: reinspecionar os posts novos (P11) e ler na seção 4 do brief as revisões de 30/09 a 02/10.
- Validação de canonical iniciada em 29/09 no GSC: conferir o status na interface (dono).
- Acessos do GSC (com e sem `www`) e do GA4 funcionando desde 08/10. Pendências do dono: vincular o AdSense ao GA4 (opcional, para ver receita pela CLI) e abrir `?interno=1` nos próprios navegadores.
- Decisão do dono, quando quiser: o que fazer com os legados sem impressão (164 em 08/10, somando as duas propriedades). O brief atualiza esse número.
