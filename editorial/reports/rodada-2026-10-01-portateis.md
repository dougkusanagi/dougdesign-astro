# Rodada de portáteis — 01/10/2026

## Escopo e decisão

Autorização: pedido do dono para continuar trabalhando para trazer visitantes ao blog. Rodada focada em duas URLs existentes, sem nova publicação, agendamento, divulgação ou mudança de anúncios. Leitura da sequência editorial obrigatória e skills de planejamento, medição, atualização, capa e publicação. Documentação Astro de coleções consultada antes da edição.

P02 foi antecipada porque reúne demanda observada e afirmações factuais inadequadas. O guia de preço foi incluído como correção complementar e interlink útil; não há evidência de demanda nessa URL no período consultado. Duas revisões substanciais ocupam esta rodada; não se criou pauta para preencher quantidade.

## Baseline conferido hoje

Fonte: interface autenticada do Chrome, Search Console `https://www.dougdesign.com.br/`, tipo Web, opção 28 dias. O gráfico efetivamente cobria **04–28/09/2026**, sem dados posteriores, apesar da leitura em 01/10. Sem filtros de país/dispositivo. A CLI não tinha credencial de service account; não se extraiu token ou cookie.

- Site: 65 cliques, 7,97 mil impressões, CTR 0,8%, posição 7,4.
- `/rog-ally-x-vs-steam-deck-oled-qual-comprar/`: 10 cliques, 671 impressões, CTR 1,5%, posição 7,1.
- Consultas **com filtro dessa página**: `rog ally x vs steam deck oled` (1/36), `rog ally x steam deck` (1/31), `rog ally x vs steam deck` (1/19), `steam deck oled vs rog ally x` (1/17), `steam deck ou rog ally x` (1/9). Pares = cliques/impressões; não somar como total da página.
- `/steam-deck-oled-preco-aumento/`: 0 cliques/0 impressões e “Nenhum dado” com filtro da página. Isso não prova ausência de indexação.

GA4: propriedade **370923251**, nome `dougdesign.com.br - GA4`, card Últimos 30 dias; intervalo **01–30/09/2026** confirmado no seletor personalizado. 53 usuários ativos, 90 visualizações, 66 sessões, 0 eventos principais. Não atribuir os números às revisões anteriores nem comparar diretamente com cliques GSC. Tráfego do proprietário/verificações não foi isolado. AdSense não foi medido nesta rodada.

## Intenção e candidatos

Inventário atualizado para leitura: 597 posts, 555 publicados, 42 drafts, 1 scheduled. Artefatos derivados não entram no commit.

Dois `intent check` com os slugs existentes retornaram conflito com a própria URL, esperado para atualização. Ollama indisponível/timeout, portanto a comparação semântica automática não concluiu. Revisão manual incluiu os corpos de:

- Comparativo Ally X em Games: alvo da escolha entre RC72LA e Deck OLED.
- `/melhor-pc-portatil-2026-rog-ally-vs-steam-deck/` em Tecnologia: trata do Ally original, embora compartilhe a pergunta de compra. Ainda contém autonomia sem método; revisão própria pendente, sem consolidar por título.
- `/steam-deck-oled-preco-aumento/`: anúncio de preço/custo, intenção complementar.
- `/steam-deck-2/`: sucessor/rumores, não usado como interlink por conter estimativas sem fonte específica.

Nenhuma URL nova, mudança de slug ou redirect. Links do corpo sincronizados com `internal_links.to`. Comparativo e preço se ligam reciprocamente; comparativo também aponta para Steam Famílias e Switch 2 já revisados. Não se forçou a quantidade de links no guia de preço.

## Fontes realmente consultadas em 01/10/2026

- [ASUS, ficha regional do RC72LA](https://rog.asus.com/us/gaming-handhelds/rog-ally/rog-ally-x-2024/spec/) e [apresentação do Ally X](https://rog.asus.com/us/gaming-handhelds/rog-ally/rog-ally-x-2024/): Z1 Extreme, versões de SSD, tela, bateria, sistema, memória e portas. A página global `/gaming-handhelds/rog-ally/rog-ally-x-2024/spec/` exibia dados incompatíveis de notebook (16", RTX 4060, 1,85 kg) tanto no web tool quanto no navegador; foi descartada. A regional americana traz dados coerentes e identifica o modelo. Não confundir ficha global incorreta com mudança de hardware.
- [Valve, ficha OLED](https://www.steamdeck.com/en/tech/oled): corrigida RAM LPDDR5 (não LPDDR5X), CPU descrita por arquitetura oficial, sem codinome não documentado.
- [Deck Verified](https://www.steamdeck.com/en/verified): estados e suporte de anti-cheat; não há garantia universal de jogos por sistema.
- [SteamOS/software](https://www.steamdeck.com/en/software): suspensão/retomada sem cronometragem fictícia.
- [Xbox PC Game Pass](https://www.xbox.com/en-US/xbox-game-pass/pc-game-pass): requisito Windows e requisitos por jogo; instalação distinta de cloud gaming.
- [Loja Steam Deck](https://store.steampowered.com/steamdeck): conteúdo renderizado no navegador; indisponível para compra na região consultada, sem preço brasileiro. Faixa de autonomia atribuída à Valve, com condições de 30 FPS/brilho e volume 50%.
- [Comunicado exato Valve](https://steamcommunity.com/games/1675200/announcements/detail/672869045073085560): web tool não mostrou corpo; navegador mostrou texto e data **27/05/2026 às 14:22 -03:00**. Confirma US$ 789/949, custos de memória/armazenamento, desafios logísticos e ausência de mudança no aparelho. Não menciona IA, margem da Valve, previsão de preço brasileiro ou atraso de sucessor. [Arquivo oficial de notícias](https://www.steamdeck.com/en/news?p=15&pubDate=20260422) corroborou o anúncio; não foi tratado como checkout atual.
- [Astro, coleções](https://docs.astro.build/en/guides/content-collections/): contrato e renderização; nenhum código de componente foi alterado.

Não houve benchmark, teste físico, cotação brasileira, compra ou verificação de garantia de um vendedor. As notas de correção explicitam isso nos textos. Preservados autores, slugs, pubDate, draft false e scheduled false; updatedDate só nas duas revisões substanciais.

## Capas

Skill `cover-generation` exigiu revisão independente, executada por subagente apenas para as imagens. Comparativo existente aprovado condicionalmente à identificação visível como ilustração gerada por IA, pois interfaces têm texto fictício; legenda e alt corrigidos, sem geração nova.

Capa antiga do preço reprovada: formato/controles não correspondem ao Steam Deck e arquivo quadrado. Nova capa pelo **image_gen integrado**, sem API key, salva em `src/assets/images/posts/steam-deck-oled-preco-aumento-v2.png`; original preservado. Prompt completo no frontmatter. Silhueta abstrata sem controles/marcas/interface, etiqueta vazia, moedas e caixa; não pretende reproduzir produto. Revisão visual direta e independente aprovada com legenda conceitual explícita. Dimensões: nova 1672 × 941; comparativo existente 1376 × 768. Astro gerou WebP de 68 KB para a capa nova no primeiro build.

## Validação e publicação

- Auditoria individual: ambas aprovadas, sem issues.
- Auditoria geral: `ok: true`, nenhuma issue em revisados; dívida preexistente de 495 legados/1.877 issues listada como resumo, sem alegação de saneamento completo.
- Unitários: 7 arquivos/40 testes aprovados.
- Typecheck da CLI: aprovado.
- Mobile local: ambas as URLs conferidas em viewport 390 × 844; uma H1, capa carregada, publicação original e atualização visíveis; largura de documento 375 px, sem overflow da página. Tabela comparativa permite rolagem horizontal em seu próprio espaço. Viewport restaurado e servidor parado com `astro dev stop` depois da conferência.
- Build final serial: aprovado às 19:11 -03:00, 650 páginas. Uma tentativa anterior concorrente falhou porque os builds compartilhavam `dist/.prerender`; execução restante encerrada e build refeito em sequência. Conferência do HTML final: H1 única, canonical www, description, datas JSON-LD, capas e duas URLs no sitemap aprovados; `git diff --check` aprovado.
- Commit/push e deploy: em verificação.

URLs atualizadas nesta rodada: `https://www.dougdesign.com.br/rog-ally-x-vs-steam-deck-oled-qual-comprar/` e `https://www.dougdesign.com.br/steam-deck-oled-preco-aumento/`. Estado inicial do relatório: conteúdo local revisado, produção ainda com a versão anterior. Nenhuma URL criada ou postagem agendada nesta rodada.

## Próxima avaliação

08/10/2026 em America/Sao_Paulo: verificar cobertura GSC após deploy, consultas/CTR por página e navegação no GA4. Comparar períodos equivalentes quando disponíveis e registrar números absolutos com baixo volume. Não há ganho de visitantes comprovado hoje. P03 (Penpot/Figma) segue na fila; comparativo do Ally original fica como revisão factual pendente, sem redirect automático.
