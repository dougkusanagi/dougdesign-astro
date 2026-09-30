# Plano de crescimento orgânico e AdSense — 29 de setembro a 30 de novembro de 2026

## Ponto de partida

- **GA4, últimos 30 dias**, propriedade `370923251`: 45 usuários ativos, 58 visualizações e 56 sessões. São métricas diferentes das impressões e cliques do Search Console.
- **Search Console**, intervalo selecionado “3 meses”: 64 cliques, 7,71 mil impressões, CTR de 0,8% e posição média 7,5. O gráfico disponível cobria 4–27 de setembro; não representa três meses completos.
- Entre as consultas vistas estavam “meta quest 4” (474 impressões, posição média 10,1, CTR 0,2%), “rog ally x vs steam deck oled” (35 impressões) e “penpot vs figma” (26 impressões). A página principal de Quest 4 recebeu 436 impressões e 1 clique para a consulta; outra URL de Quest 4 recebeu 38 impressões e nenhum clique.
- **AdSense:** o site Doug Design aparece como pronto e com `ads.txt` autorizado. O painel aberto exibiu RPM de US$ 0,55, mas esse cartão agregava propriedades e tinha só cinco visualizações recentes; não serve para calcular RPM próprio do Doug Design. A receita atual por mil visualizações do site ainda não foi medida isoladamente.

A meta de **1.000 visualizações mensais consistentes** é um marco de trabalho, sem data prometida. A conta ilustrativa de R$ 10 por mil visualizações continua sendo apenas uma hipótese: receita estimada depende de um RPM efetivamente observado, filtrado para o Doug Design.

## Cadência para oito semanas

Meta por semana: **dois posts novos pesquisados e uma atualização substancial de URL existente**. Uma das pautas novas começa por desenvolvimento ou web design; a segunda vem de uma dúvida real no Search Console, incluindo Games somente quando houver intenção distinta e uma fonte confiável. Se não houver boa pauta de Games, ambas podem ser de desenvolvimento/web design. Antes de cada URL nova, executar `dougseo intent check`; conflito significa revisar a URL já existente.

Use terça às 08h e quinta às 12h, horário de São Paulo, como primeiros horários de teste — ainda não há dados que comprovem picos do público. Uma notícia realmente urgente, com fato oficial confirmado, pode sair assim que estiver apurada. A atualização semanal mantém slug, `pubDate` e URL pública.

| Semana | Dois posts novos | Atualização de URL existente |
| --- | --- | --- |
| 29/09–05/10 | God of War Laufey (Urgente, já publicado) e guia Figma → Penpot (Evergreen, preparado para 01/10 às 12h) | Meta Quest 4: corrigir a promessa falsa de lançamento e responder ao estado oficial |
| 06/10–12/10 | Um guia de web design/desenvolvimento e uma pauta distinta escolhida no Search Console | ROG Ally X vs Steam Deck OLED, se a revisão factual justificar; página recebeu 644 impressões e 10 cliques |
| 13/10–19/10 | Repetir o critério de intenção, evidência e contribuição prática | Penpot vs Figma somente após revisão das alegações e do CTR da página |
| 20/10–26/10 | Duas pautas novas aprovadas pelo intent check | Atualizar a página antiga com maior combinação de procura, desatualização e oportunidade real |
| 27/10–02/11 | Duas pautas novas; Games segue condicionado a demanda e apuração | Atualizar a próxima URL priorizada pelos dados da semana |
| 03/11–09/11 | Duas pautas novas com exemplo ou checklist aplicável | Atualizar uma URL existente que esteja factual ou editorialmente fraca |
| 10/11–16/11 | Duas pautas novas selecionadas por consulta, concorrência interna e fonte primária | Atualizar a URL priorizada após revisão de conteúdo e cliques |
| 17/11–23/11 | Duas pautas novas; não repetir tema se a intenção já tiver URL adequada | Última atualização do ciclo, escolhida com os dados mais recentes |

Os temas depois da primeira semana são decisões semanais, não títulos pré-aprovados. Isso evita criar artigos duplicados e permite substituir uma pauta por uma atualização completa se os dados pedirem.

## Revisão semanal de desempenho

1. No Search Console, compare os últimos 28 dias com os 28 dias anteriores por página e consulta: cliques, impressões, CTR e posição. Confira qual URL responde à consulta antes de escrever outra.
2. No GA4, permaneça na propriedade `370923251` e anote visualizações, usuários ativos, sessões e usuários que retornam, se disponíveis. Registre intervalo e nomes das métricas.
3. No AdSense, filtre especificamente Doug Design e anote visualizações de página, receita e RPM de página no mesmo período. Se o relatório não permitir separar o site ou houver volume insuficiente, registre “não mensurável” em vez de usar o total da conta.
4. Para cada artigo, revise fato atualizado, título/descrição, respostas à dúvida, qualidade das fontes, links que continuam úteis e estado de indexação. Impressões com poucos cliques são candidatas à investigação; CTR isolado não prova que o título seja a única causa.
5. Em 30/11, comparar o período com a linha de base e escolher os assuntos a manter. Não atribuir uma variação pequena a uma mudança isolada nem inferir receita relevante antes de obter tráfego e RPM próprios.

## Trabalho inicial preparado

- Atualização local da página [Meta Quest 4](https://www.dougdesign.com.br/meta-quest-4-chega-ao-mercado-a-nova-fronteira-dos-jogos-vr-e-o-que-ele-significa-para-o-futuro/), preservando a URL e removendo a afirmação de que o produto chegou ao mercado.
- Novo guia evergreen [Como migrar do Figma para o Penpot](https://www.dougdesign.com.br/como-migrar-do-figma-para-o-penpot-sem-perder-componentes-e-tokens/), com piloto, segurança de tokens e checklist de validação. Capa autoral via fallback DougSEO porque `generate_image` do Antigravity não estava disponível; imagem 1200×675 revisada localmente e aprovada em revisão visual independente.
- A comparação Penpot vs Figma e a página de tokens existentes têm afirmações sem suporte suficiente e não foram recomendadas como leitura interna até revisão factual. Assim, o novo guia não força interlinks para esses textos; as fontes oficiais do Penpot e Figma sustentam os passos técnicos.
- A atualização do Quest 4 e o novo guia estão no checkout local. A auditoria editorial completa passou sem issues; o build Astro concluiu 622 páginas. O guia está marcado `draft: true` e `scheduled: true` para 01/10/2026 às 12:00 `America/Sao_Paulo`. O workflow `.github/workflows/editorial-scheduled-publish.yml` existe no repositório e roda a cada dez minutos; sem push deste estado, a fila remota não recebe o agendamento.
- Ainda não houve deploy desta versão. A URL do Quest 4 continua pública com o conteúdo anterior; a URL do novo guia é a pretendida, mas não está publicada nem ativa na fila remota. Ambas dependem do push e do deploy para refletir o resultado em produção.
