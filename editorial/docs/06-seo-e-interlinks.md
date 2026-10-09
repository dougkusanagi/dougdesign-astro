# 06. SEO, intenção e interlinks

Antes de nova URL, rode `dougseo intent check --category <categoria> --subject <assunto> --intent <intencao>`; use `--slug` para testar um slug candidato. Um conflito com a própria URL é esperado se estiver verificando uma atualização: não crie outra para contornar isso.

A comparação exata da CLI depende dos metadados e da categoria. Legados podem repetir o título nesses campos; busca semântica pode estar indisponível. Revise manualmente avisos e candidatos em todas as categorias. Registre a conclusão, sem tratar `ok: true` como garantia.

- Mesmo assunto e intenção: atualizar a URL que já responde à dúvida.
- Assunto próximo e intenção distinta: explicitar a diferença e ligar os artigos quando útil.
- Possível duplicação entre existentes: comparar conteúdo, consultas por página e links antes de escolher pilar ou consolidar. Não apagar, mudar slug ou redirecionar em lote por similaridade de título.

## Títulos e descrições que ganham clique

O maior desperdício medido em 08/10/2026 era de CTR: cerca de 10 mil impressões em 28 dias, a maioria nas posições 5–10, com CTR de 0,68%. Ao ajustar título e descrição:

- Parta da consulta com mais impressões da página (seção 1 do brief) e use os termos dela, de preferência no começo. O brief aponta quais termos da consulta faltam no título.
- Responda à pergunta que a consulta implica. Quem busca “steam sales 2026” quer o calendário de promoções, não uma promoção passada. Quem busca “super mario odyssey 2” quer saber se o jogo existe.
- Mantenha o título em cerca de 60 caracteres. Inclua ano, mês ou “preço em reais” quando isso diferenciar o resultado.
- A descrição traz o dado concreto que o leitor vai encontrar (data, preço, requisito, passo), sem prometer o que a fonte não confirma.
- O título precisa corresponder ao conteúdo. Se a página não responde à consulta, revise o texto antes de trocar o título.
- Depois da troca, deixe a URL 14 dias em observação e leia o resultado na seção 4 do brief.

CTR varia com consulta, posição, dispositivo e aparência da busca (AI Overview, vídeos, notícias). A referência de CTR do brief serve para ordenar oportunidades, não como meta.

## Interlinks e redirects

Prefira 3 a 6 interlinks úteis no corpo, com âncoras naturais; não force quantidade nem ligue a um artigo falso/desatualizado. Confira destino publicado, HTTP e intenção. Use URLs do host canônico `https://www.dougdesign.com.br/` ou paths locais; sincronize `internal_links.to` com o corpo. Implante links de retorno de artigos relevantes quando melhorar a navegação. Post novo recebe pelo menos 2 links de entrada a partir de páginas que já têm impressões no mesmo cluster. Em 08/10, o único guia novo já indexado era também o único com página de referência conhecida pelo Google.

Preserve URLs já conhecidas. Redirect permanente apenas para destino de intenção equivalente; não envie todos os 404 para a home. Exclusão por canonical ou redirect pode ser esperada. Marque qualquer consolidação proposta para investigação antes da execução.
