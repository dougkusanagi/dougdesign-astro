# Criar post

Use para abrir intenção realmente nova. Leia as regras de escrita, frontmatter e SEO.

1. Registre o sinal de demanda (consulta no GSC sem página adequada, lançamento ou evento com data confirmada, ou dúvida complementar de cluster com impressões). Sem sinal, não crie. Depois rode `dougseo intent check --category <categoria> --subject <assunto> --intent <intencao>`. Revise avisos e candidatos inclusive em outras categorias. Conflito de mesma intenção exige atualização.
2. Abra fontes primárias atuais e registre datas. Defina a contribuição própria: exemplo reproduzível, comparação fundamentada ou fato novo confirmado. Não invente experiência/teste.
3. Use `dougseo post scaffold` com os argumentos obrigatórios; o comando não faz pesquisa e o scaffold não é aprovação. Ajuste tipo/cluster, todas as descrições e corpo; retire a H1 duplicada e placeholders.
4. Escreva subtítulos próprios para guias/comparativos; notícias podem usar sequência cronológica. Cite evidência junto aos fatos e explique limites/decisão prática. Teste código quando necessário e registre o resultado.
5. Insira interlinks úteis para URLs publicadas e corretas, e pelo menos 2 links de entrada a partir de posts com impressões no mesmo cluster; sincronize metadados. Use a skill de capa (uma capa por vez) e registre a revisão visual.
6. Faça revisão factual manual, `dougseo audit --scope all` e build. Score alto não substitui apuração; não contorne avisos com campos fictícios.
7. Siga `publish-or-schedule`. Registre a rodada no histórico do mês e confira o estado real após o deploy; o brief mede o post nas rodadas seguintes.
