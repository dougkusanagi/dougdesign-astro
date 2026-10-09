# Search Console e medição

Use no planejamento e depois de publicar. Siga `editorial/docs/09-search-console-e-medicao.md`.

1. Comece por `npm run dougseo -- brief`. Use `search-console performance|opportunities` só para investigações pontuais.
2. Leia consultas e páginas juntas. Não atribua uma consulta a uma página sem conferir.
3. Para post novo desconhecido pelo Google: confira HTTP, canonical, sitemap e links de entrada; acrescente links a partir de páginas com impressões; depois do deploy, rode `search-console sitemap --submit`. Reinspecione com `search-console inspect --slug <slug>` dias depois, não no mesmo dia.
4. Separe redirect e canonical esperados de 404 e de páginas não indexadas. Confira exemplos, rastreamento, HTTP, canonical, sitemap, robots/noindex, interlinks e qualidade antes de concluir a causa.
5. `inspect` só consulta o índice. A solicitação de indexação é manual, pela interface, após o deploy. Não use a Indexing API para artigos.
6. Leia o efeito das mudanças na seção 4 do brief (janelas iguais, 7+ dias de dados). Registre números absolutos; com poucos cliques, não afirme causa. GA4 e GSC medem coisas diferentes.
7. Registre a leitura no histórico do mês e o aprendizado em `docs/10` quando um padrão se repetir.
