# Revisão das instruções editoriais — 29/09/2026

Escopo autorizado pelo usuário: conferir existência de pautas/instruções e melhorar ou corrigir o fluxo do Codex. Esta rodada modifica documentação e planejamento, sem criar, alterar ou agendar posts.

## Correções

- Removida contradição entre três posts diários e cadência sustentável semanal; revisões completas podem substituir novas publicações.
- Criada fila com oito pautas, estado, prioridade, data-alvo de trabalho, evidência e condições de execução. Cinco são revisões planejadas; três são hipóteses de tutorial. Não equivale à fila de publicação.
- Separados pesquisa factual, score automatizado e verificação em produção; exigida revisão manual também em publicados/legados.
- Proibidas experiência/benchmark fictícios, alteração cosmética de data e promessas não verificadas. Preservar URL e publicação em revisões.
- Documentadas limitações reais: post update só adiciona fontes/data; scaffold não é conteúdo aprovado; queue list mostra vencidos; --commit também faz push com git add .; inspeção GSC não pede indexação.
- Capas têm fallback explícito para ferramenta indisponível, logos opcionais fiéis, alt sem alegação de teste e revisão visual verificável.
- Métricas exigem propriedade, intervalo e origem; exclusão esperada não é erro automático. Aprovação do AdSense não significa renda.
- docs/README.md aponta ao sistema editorial; planos antigos foram marcados como contexto de implementação.

## Evidências e validação

Leitura das instruções, seis skills, código da CLI, schema do Astro, workflow e relatório de retomada. Fontes externas consultadas: documentação oficial do Astro sobre coleções e Google Search Central sobre conteúdo útil e recrawl, referenciadas nos guias.

- Links locais dos documentos operacionais conferidos sem destinos ausentes.
- npm run dougseo -- doctor: sucesso.
- npm run dougseo -- queue list: nenhuma publicação vencida.
- Leitura direta de indexAllPosts: nenhum post com scheduled ativo no momento da conferência. Nenhum comando de publicação/agendamento executado.
- git diff --check: sem problemas de whitespace.
- Sem testes de aplicação/build nesta rodada: alteração exclusivamente documental, sem mudança de código ou posts por este agente.

Há alterações de conteúdo em paralelo no workspace; ficaram fora do escopo e do commit desta revisão. Antes de executar a fila de pautas, revalidar arquivos/estado para não repetir trabalho.

## URLs

Nenhum post publicado ou agendado nesta rodada. As URLs da fila são destinos existentes para investigação; candidatos novos não receberam slug nem data de publicação.
