# Rotina diária

Procedimento da tarefa agendada `blog-trafego-diario` e de qualquer rodada editorial. O dono normalmente não está presente: decida pelas regras de `AGENTS.md` e registre o que fez. A meta é mover cliques, não bater número de posts.

## 1. Preparar

- `git fetch && git checkout master && git pull --ff-only`, depois `git checkout -b editorial/AAAA-MM-DD-lote`.
- O working tree tem alterações antigas de modo de arquivo. Nunca use `git add -A` ou `git add .`; adicione só os arquivos que você mudou.

## 2. Diagnóstico

- Rode `npm run dougseo -- brief` e leia o Markdown que ele imprime (cerca de 1 minuto). Ele mostra o placar, a fila sugerida (seção 0), consultas perto do topo, canibalização, o efeito das mudanças, os posts novos com estado no índice e o acervo.
- Leia `editorial/pautas.md`, que tem a fila ativa com evidência.
- Não leia `editorial/historico/` nem os JSON de `editorial/reports/`, a menos que um item exija.
- Se o Search Console falhar, registre o erro e siga com `pautas.md` e o inventário.

## 3. Montar o lote

Siga a ordem de `AGENTS.md`: correção factual, seção 0 do brief, descoberta (seção 5), canibalização e posts novos com sinal de demanda. O limite é de 8 ações, com no máximo 3 posts novos. Antes de executar, anote para cada item:

- URL e ação;
- evidência (números do brief ou fonte com data);
- resultado esperado (por exemplo, “CTR acima de 1% em ‘steam sales 2026’”).

URLs marcadas com ⏸ ficam de fora, salvo erro factual.

## 4. Executar

- **Título e descrição** (skill `update-post` e `editorial/docs/06`): parta da consulta com mais impressões e coloque os termos dela no começo do título. O título responde à pergunta, cabe em cerca de 60 caracteres e não promete o que a fonte não sustenta. Revise também a seção que responde à consulta.
- **Atualização de conteúdo** (skill `update-post`): fonte primária, fatos corrigidos e `updatedDate` só em mudança substancial.
- **Post novo** (skill `new-post`): intent check, fontes primárias e capa com `scripts/codex-cover.sh`, uma de cada vez. Acrescente pelo menos 2 links de entrada a partir de posts com impressões no mesmo cluster.
- **Descoberta**: para post novo desconhecido pelo Google, coloque links de entrada em páginas com impressões. Depois do deploy, reenvie o sitemap.
- Publique direto (`draft: false`) apenas o que foi verificado; o restante segue `editorial/docs/08`.

## 5. Validar

Rode `npm run dougseo -- audit | grep -q '"ok": true' && npm run build`. Se falhar, corrija. Se não conseguir corrigir, abra o PR como rascunho e descreva o bloqueio.

## 6. PR, merge e deploy

- Faça commits temáticos (posts novos, atualizações, registro) com a linha `Co-Authored-By` exigida pela sessão.
- Rode `gh pr create --repo dougkusanagi/dougdesign-astro --base master`. O corpo traz as ações com a evidência, as URLs, as validações e os limites, e termina com a linha de atribuição exigida.
- Com o CI verde, rode `gh pr merge --squash --delete-branch` e depois `git checkout master && git pull --ff-only`.
- Confira o deploy com `curl` em 2 ou 3 URLs (HTTP 200, `<title>` e canonical). Não use navegador.
- Rode `npm run dougseo -- search-console sitemap --submit`.

## 7. Registrar (curto)

- Acrescente em `editorial/historico/AAAA-MM.md` uma seção `## DD/MM`, com no máximo cerca de 25 linhas: ações (URL, motivo e evidência), leituras da seção 4 do brief para mudanças com 7+ dias de dados e limites.
- Atualize `editorial/pautas.md` só quando a fila mudar: entra item novo com evidência, sai item concluído.
- Quando uma leitura confirmar ou derrubar uma hipótese (por exemplo, se título com a consulta exata subiu ou não o CTR), registre o aprendizado em `editorial/docs/10-fontes-e-armadilhas.md` ou no documento da etapa.

## 8. Resposta final

Informe a contagem de ações por tipo, as URLs, o link do PR, o estado do merge e do deploy, se o sitemap foi reenviado e as pendências com o motivo.
