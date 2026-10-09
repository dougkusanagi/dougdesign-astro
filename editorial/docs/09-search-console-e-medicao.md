# 09. Search Console, Analytics e AdSense

## Acessos (estado em 08/10/2026)

| Fonte | Acesso pela CLI | Observação |
|---|---|---|
| GSC `https://www.dougdesign.com.br/` | sim (service account, usuário completo) | Dados desde 04/09/2026. É a fonte do `dougseo brief`. |
| GSC `https://dougdesign.com.br/` (sem `www`) | **não** | Guarda impressões de páginas indexadas com o canonical antigo. Falta o dono adicionar a service account como usuário completo, ou criar uma propriedade de domínio `sc-domain:dougdesign.com.br`. |
| GA4 `370923251` | **não** (403) | A Google Analytics Data API está desativada no projeto da service account. Falta o dono ativá-la e conferir se a service account tem a função Leitor na propriedade. |
| AdSense | só pela interface | `dougseo analytics adsense` depende do GA4 vinculado. |

Confirme a propriedade e o período antes de ler números. Não extraia cookies ou tokens, não imprima segredos e não configure acesso novo só para contornar falta de credenciais. Sem acesso, registre a limitação e siga com a evidência histórica datada.

## Comandos

- `dougseo brief`: o ponto de partida de toda rodada. Traz placar de 28 dias e de 7 dias, fila sugerida, consultas nas posições 4–20, CTR abaixo do esperado, canibalização, efeito das mudanças (janelas iguais antes e depois), posts novos com estado no índice e acervo. Opções: `--days`, `--cooldown` (padrão 14), `--top`, `--no-inspect` e `--json`.
- `dougseo search-console sitemap [--submit]`: mostra quando o Google baixou o sitemap pela última vez; com `--submit`, reenvia o índice.
- `dougseo search-console inspect --slug <slug...>` (ou `--latest 20`): consulta o estado no índice. Não é teste ao vivo nem pedido de indexação.
- `dougseo search-console performance|opportunities` e `dougseo analytics ...`: relatórios brutos, para investigações pontuais.

Os JSON gerados ficam em `editorial/reports/`, fora do Git. O que importa entra resumido no histórico do mês.

## Interpretar e agir

- Priorize falsidade factual e depois consultas com demanda e resposta inadequada. Compare consulta **e** página antes de atribuir uma oportunidade a uma URL.
- Redirect e “página alternativa com canonical” podem ser exclusões esperadas. Compare a URL final, o canonical declarado e o escolhido, e a data do último rastreamento. Os legados rastreados antes de setembro ainda declaram canonical sem `www` e migram conforme o Google os rastreia de novo.
- “Detectada, mas não indexada” e “URL desconhecida”: confira HTTP, robots/noindex, sitemap, links de entrada, duplicação e utilidade. Não atribua causa ou penalidade sem evidência.
- 404: restaure o conteúdo útil que deveria existir, redirecione para um equivalente quando houver, ou mantenha o 404 de conteúdo removido sem equivalente.
- Valide a correção de um grupo só depois de conferir os exemplos. Diferencie “validação iniciada”, “aprovada” e “pendente”.
- Para blog comum, a solicitação manual de indexação usa a Inspeção de URL na interface, após o deploy. Não use a Indexing API como submissor de posts; ela não é para artigos. Solicitação não garante indexação. [Orientação oficial](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

## Medição honesta

- Registre datas efetivas, propriedade, tipo de busca e origem (CLI ou interface). Totais por consulta não são totais por página, e cerca de 58% das impressões vêm de consultas anonimizadas.
- Não iguale clique do GSC, sessão do GA4 e visualização de página.
- Uma mudança só pode ser lida com 7 ou mais dias de dados depois dela. Use a seção 4 do brief, que compara janelas iguais. Com volume baixo, registre números absolutos e incerteza; poucos cliques não provam causa.
- **Visitas do dono e dos agentes** não devem entrar no GA4. O dono abre `https://www.dougdesign.com.br/?interno=1` uma vez em cada navegador e aparelho; isso desliga a tag do Google e os anúncios nesse navegador (`?interno=0` desfaz). Agentes verificam produção com `curl`, que não executa a tag.
- AdSense: confira domínio, moeda, período, receita e RPM de página efetivo. Aprovação e `ads.txt` autorizado não informam renda. Uma simulação usa `pageviews / 1000 × RPM`, com a hipótese explícita; não prometa ganhos nem aumente anúncios em prejuízo da leitura. [RPM de página](https://support.google.com/adsense/answer/112030?hl=pt-BR).
