# Exemplo do artigo /astro-7/

Executado em 02/10/2026 com Node 22.22.1, Astro 7.3.5 e @astrojs/node 11.1.6.

```bash
npm ci
npx astro build
HOST=127.0.0.1 PORT=4327 node dist/server/entry.mjs
```

Em outro terminal, consulte `/` e `/pesquisa?q=Astro` em `http://127.0.0.1:4327`.
A home é pré-renderizada em `dist/client/index.html`; pesquisa é SSR e muda com a query.
Testados HTTP 200 para q=Astro e q=Outro e interpolação escapada para q=%3Cscript%3E.
Não implementa banco, autenticação, cache ou teste de performance. Ctrl+C encerra o servidor.
As versões são fixadas para reprodução; conferir atualizações antes de uso em produção.
