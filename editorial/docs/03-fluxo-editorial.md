# 03. Fluxo editorial

## Planejar antes de escrever

1. Leia `editorial/pautas.md` e o relatório recente. Atualize o inventário quando necessário.
2. Consulte Search Console/GA4 se houver acesso; registre fonte, propriedade e período. Sem dados atuais, use a evidência histórica com data e marque a pauta como hipótese.
3. Priorize: erro factual que prejudica o leitor; URL com demanda observada e resposta inadequada; dúvida complementar do cluster; notícia confirmada relevante.
4. Registre assunto, intenção, leitor, decisão, diferencial, fontes a consultar e URL existente/candidata. Rode `intent check`; revise também títulos/corpos e outras categorias.

## Produzir e revisar

5. Crie scaffold apenas se a intenção for nova. Para revisão, edite o arquivo existente. Pesquise as fontes antes de afirmar fatos.
6. Escreva resposta direta e conteúdo que permita executar a tarefa ou decidir. Teste código quando necessário; documente ambiente e resultado no relatório.
7. Preencha frontmatter, confira interlinks e capa. Faça revisão factual separada do score automatizado.
8. Execute `dougseo audit --scope all` e `npm run build`. Para publicado/legado, confira manualmente os mesmos requisitos editoriais exigidos em novo conteúdo: a auditoria atual não os aplica integralmente.
9. Faça testes adicionais se mudou código/comportamento. Em alteração só documental, confira comandos, links locais e diff; não rode E2E sem necessidade.
10. Publique/agende, faça commit/push e verifique produção. Atualize pauta e relatório com evidências; não marque sucesso apenas porque o comando local terminou.

## Registro mínimo da rodada

- Data, escopo, autorização existente e arquivos alterados.
- Decisão de atualizar/criar, resultado do intent check e candidatos revisados.
- Fontes realmente abertas, data de consulta, fatos corrigidos, testes realizados e limites.
- Verificações locais, commit/deploy e URLs com estado comprovado.
- Métricas de referência e próxima revisão. Nunca guarde tokens ou chaves em relatórios.
