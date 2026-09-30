# 05. Estilo, evidência e revisão

Abra com a resposta à dúvida principal. Organize subtítulos pelas perguntas reais do leitor, com parágrafos claros e exemplos que acrescentem informação. Evite jargão vazio, clichês listados em `AGENTS.md`, resumo espelhado e texto de importação (“URL publicada”, “Conteúdo espelhado”).

Guias e tutoriais não usam seções genéricas de notícia como “O que aconteceu” e “O que ainda falta confirmar”. Uma notícia pode usar estrutura cronológica se ajudar. Não há número de palavras que garanta ranking; resolva a pergunta sem encher texto. A meta interna da CLI é apenas uma heurística; quando necessário, justifique concisão em `quality_notes.below_word_target_reason`.

## Evidência por formato

- Tutorial: pré-requisitos, versões consultadas, código/etapas reproduzíveis, resultado esperado, falhas frequentes e limitações. Só diga “testado” quando executado; registre como e o resultado.
- Comparativo: critérios, vantagens e limites para perfis distintos, preços datados quando verificados e recomendação fundamentada. Não invente FPS/autonomia nem deduza duração de bateria apenas pela capacidade. Dados de terceiros precisam de fonte e método identificados.
- Notícia: fato confirmado, fonte direta, datas do anúncio/evento, disponibilidade local quando conhecida e impacto. Título e descrição não podem afirmar mais que as fontes.
- Correção: remova a afirmação falsa de título, descrição, corpo e alt se necessário. Adicione nota de correção quando a versão anterior puder ter induzido decisão errada.

## Antes de aprovar

Confirme que fatos e opinião estão separados, links sustentam as afirmações, a conclusão ajuda a decidir e não há relato pessoal fictício. Se não houve teste, escreva como análise das fontes. Não use imagem sintética como prova de uso de um produto.

Revise manualmente todos os textos alterados. `audit` pode aprovar legados e publicados sem fazer o score completo; mesmo um score 100 não verifica fatos, catálogo, links acessíveis nem resultados de código.
