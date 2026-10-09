# 03. Fluxo editorial

O passo a passo operacional está em `editorial/rotina-diaria.md`. Este documento explica a lógica de cada etapa.

## Diagnosticar antes de escrever

1. Rode `dougseo brief`. Ele lê o Search Console da propriedade `www`, o histórico do Git e o inventário, e devolve o placar, a fila sugerida, as consultas nas posições 4–20, a canibalização, o efeito das mudanças anteriores e o estado dos posts novos no índice.
2. Leia `editorial/pautas.md`, a fila ativa com evidência. Se o Search Console falhar, registre o erro e use a fila e o inventário como hipótese.
3. Priorize conforme `AGENTS.md`: erro factual; URL com impressões e resposta, título ou CTR inadequados; descoberta de post novo; canibalização; post novo com sinal de demanda.
4. Para cada pauta, registre a URL, a ação, a evidência com data e o resultado esperado. Antes de abrir uma URL nova, rode `intent check` e revise títulos e corpos de candidatos em todas as categorias.

## Produzir e revisar

5. Crie scaffold só para intenção nova. Numa revisão, edite o arquivo existente. Pesquise as fontes antes de afirmar fatos.
6. Escreva uma resposta direta e conteúdo que permita executar a tarefa ou decidir. Teste o código quando houver e registre o ambiente e o resultado.
7. Preencha o frontmatter e confira interlinks e capa. A revisão factual é separada do score automatizado.
8. Rode `dougseo audit` e `npm run build`. A auditoria aplica requisitos editoriais a posts revisados e lista o legado como dívida; use `--slug` para a URL alterada. A CLI não certifica fatos.
9. Faça testes adicionais só se mudou código ou comportamento. Em alteração apenas documental, confira comandos, links locais e o diff.
10. Publique ou agende, abra o PR, faça o merge com CI verde e verifique produção com `curl`. Reenvie o sitemap. Não marque sucesso só porque o comando local terminou.

## Medir

- Depois de alterar uma URL, ela fica 14 dias em observação. O brief marca essas URLs com ⏸ e, na seção 4, compara janelas iguais antes e depois da mudança.
- Com 7 ou mais dias de dados, registre a leitura (melhorou, piorou, estável ou volume baixo) no histórico do mês. Poucos cliques não provam causa: registre os números absolutos.
- Quando um padrão se repetir em várias URLs (por exemplo, títulos com a consulta exata elevando o CTR), registre o aprendizado em `docs/10` ou no documento da etapa.

## Registro mínimo da rodada

Em `editorial/historico/AAAA-MM.md`, numa seção `## DD/MM` de no máximo cerca de 25 linhas:

- ações (URL, motivo e evidência) e o estado comprovado de cada uma;
- fontes realmente abertas, com data, e os limites da apuração;
- leituras da seção 4 do brief;
- commit, PR e deploy.

Nunca guarde tokens ou chaves em relatórios.
