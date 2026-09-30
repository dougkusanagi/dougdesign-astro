# 06. SEO, intenção e interlinks

Antes de nova URL, rode `dougseo intent check --category <categoria> --subject <assunto> --intent <intencao>`; use `--slug` para testar um slug candidato. Um conflito com a própria URL é esperado se estiver verificando uma atualização: não crie outra para contornar isso.

A comparação exata da CLI depende dos metadados e da categoria. Legados podem repetir o título nesses campos; busca semântica pode estar indisponível. Revise manualmente avisos e candidatos em todas as categorias. Registre a conclusão, sem tratar `ok: true` como garantia.

- Mesmo assunto e intenção: atualizar a URL que já responde à dúvida.
- Assunto próximo e intenção distinta: explicitar a diferença e ligar os artigos quando útil.
- Possível duplicação entre existentes: comparar conteúdo, consultas por página e links antes de escolher pilar ou consolidar. Não apagar, mudar slug ou redirecionar em lote por similaridade de título.

Título deve responder à busca e corresponder aos fatos. Escreva descrição específica, sem prometer data, preço ou confirmação ausentes. CTR varia com consulta, posição, dispositivo e aparência da busca: priorize oportunidades, não metas universais.

Prefira 3 a 6 interlinks úteis no corpo, com âncoras naturais; não force quantidade nem ligue a um artigo falso/desatualizado. Confira destino publicado, HTTP e intenção. Use URLs do host canônico `https://www.dougdesign.com.br/` ou paths locais; sincronize `internal_links.to` com o corpo. Implante links de retorno de artigos relevantes quando melhorar a navegação.

Preserve URLs já conhecidas. Redirect permanente apenas para destino de intenção equivalente; não envie todos os 404 para a home. Exclusão por canonical ou redirect pode ser esperada. Marque qualquer consolidação proposta para investigação antes da execução.
