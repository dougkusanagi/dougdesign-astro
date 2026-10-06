# Análise de renda e melhorias — 06/10/2026

Registro de análise e recomendações do dono do projeto. Não é instrução editorial: as regras de [AGENTS.md](../AGENTS.md) e de [editorial/docs](../editorial/docs/) continuam valendo. Nomes de repositórios privados, clientes e preços de serviços foram generalizados de propósito, porque este repositório é público.

Meta do dono: aumentar a renda extra. O blog é uma das frentes; as outras são venda de sites e sistemas pequenos e um produto SaaS a partir de projetos já existentes.

## 1. O que os dados mostram

| Medida | Valor | Fonte e limite |
| --- | --- | --- |
| Cliques e impressões, 09/09–06/10 | 66 cliques, 8.990 impressões, CTR 0,73%, posição média 7,5 | Search Console, web, [relatório](../editorial/reports/search-console-performance-2026-10-06T22-12-08-911Z.json) |
| Impressões por semana (4 semanas) | 2.581 → 2.561 → 1.952 → 1.896 | Mesma consulta; queda de cerca de 27% em duas semanas |
| Concentração | 3 URLs (Wolverine no PS Plus, ROG Ally vs Steam Deck, Super Mario Odyssey 2) somam 31 dos 66 cliques | `topPages` do mesmo relatório |
| Receita AdSense e audiência GA4 | US$ 0 e cerca de 50 usuários por mês | [plano de 30/09](plano-trafego-e-adsense-2026-09-30.md) e [plano de 01/10](plano-melhorias-blog-2026-10-01.md); não reconsultado |
| Indexação | 327 indexadas e 561 não indexadas (106 "detectada, não indexada") | Search Console, 30/09 |
| Posts novos desde 29/09 | 7 no git, contra a meta de 5 por dia; mais de 500 arquivos de post editados em lote | `git log` |
| Inspeção dos 20 posts mais novos (04/10) | 15 indexados e 5 ainda desconhecidos | [relatório](../editorial/reports/search-console-2026-10-04T15-18-33-200Z.json) |

Estimativa de ordem de grandeza (premissa, não dado): 10 mil visitas por mês, 1,3 página por visita e RPM de R$ 8 rendem cerca de R$ 100 por mês em AdSense. Confirme o RPM real no painel quando houver volume. Para comparar: uma landing page de escopo fechado vendida a um cliente local rende, sozinha, mais que isso.

Conclusão: nos próximos 90 dias o blog funciona melhor como vitrine e laboratório do que como motor de renda. Não escalar para 5 posts por dia enquanto metade das URLs não é indexada.

## 2. Renda: onde apostar

| # | Ideia | Por quê | Primeiro passo |
| --- | --- | --- | --- |
| 1 | Serviço local: landing pages e sistemas pequenos | Já existem pacotes de escopo fechado definidos em material privado. Falta funil de prospecção; a renda vem em semanas. | CLI `dougleads`: lista negócios locais sem site, gera uma demo por IA e prepara a mensagem de WhatsApp. O envio é sempre do dono, conforme a regra de não divulgar sem instrução. |
| 2 | Renda recorrente com hospedagem e manutenção | Mensalidade por cliente, rodando em infraestrutura própria. | Incluir a mensalidade em todo orçamento. |
| 3 | SaaS vertical: promoções e stories de ofertas para lojas pequenas | Há um gerador de promoções multi-loja (`catali`, público) com exportação PDF/JPG/capa 4:5 e editores de artes sociais. Em vez de três produtos, um só. | Usar um negócio real já atendido como cliente beta, vender para cerca de 5 lojas manualmente e só então automatizar a cobrança. |
| 4 | Alternativa: pedido por WhatsApp para atacado e revenda | Existe um sistema interno de catálogo, sacola e texto de pedido pronto. | Generalizar o que já funciona para um negócio real. |

Pausar ou não vender:

- Espaço visual colaborativo (`atelier-desk`, público) e plataformas próprias de deploy: mercados com concorrentes consolidados. Manter como estudo ou uso interno.
- `taskpilot` (agente de uso de computador local): 0/3 no probe de 20/09; pesquisa, não produto.
- App de notas Markdown: mercado saturado; serve de portfólio open source.
- App de busca de torrents: não monetizar, por risco legal e de meios de pagamento.
- Editor de fotos com IA local: exige GPU NVIDIA e cerca de 18 GB de modelos. Usar como ferramenta interna para vender "foto de produto com IA" a lojistas.
- Sorteios de Instagram: só como isca de tráfego; a coleta no Instagram é frágil e arriscada em termos de uso.
- Segundo blog automatizado: só depois de o primeiro provar tração; se fizer, prefira site de ferramentas ou calculadoras a notícias.

## 3. Blog: mais visitas

- Foco no que já funciona: as impressões vieram de eventos (Wolverine, Mario, Quest 4). Um radar de anúncios com posts rápidos e fontes oficiais responde a isso.
- Atualizar os três campeões toda semana. Super Mario Odyssey 2 tem 1.269 impressões com CTR de 0,63% na posição média 5.
- Poda das URLs fracas: unir ou redirecionar posts legados finos em vez de editá-los em lote.
- Template "requisitos + preço em R$ + edições", como no guia do Galactic Racer com a API pública da Steam.

## 4. Interface (site ao vivo, 06/10)

- Home no mobile (375 px): o banner BETA e o cartão de consentimento ocupam quase metade da primeira tela, e o título do hero fica sob o cartão. Remover o aviso BETA e transformar o consentimento numa barra baixa.
- O site não oferece serviço nenhum e o formulário de contato só abre um `mailto:`. Criar `/servicos` com os pacotes, botão de WhatsApp e formulário que gere mensagem pronta.
- A newsletter oferece só RSS enquanto a inscrição "está em preparação". Ligar a um provedor ou remover o texto.

## 5. Performance

- `inlineStylesheets: "always"` coloca cerca de 78 KB de CSS em cada uma das cerca de 650 páginas; a home tem 217 KB de HTML. Testar `"auto"`.
- A home tem 19 imagens e Lighthouse mobile 73, contra 97 no post (medição de 30/09). Deixar só a imagem do LCP como eager.
- O `dist` tem 585 MB, 459 MB em imagens, com cerca de 6 variantes WebP por capa. Reduzir para duas larguras.

## 6. CLI assistente (`dougseo`)

- `dougseo today`: cruza o Search Console (impressões altas, CTR baixo, posição 4–15) e entrega as atualizações e pautas do dia.
- `dougseo watch`: monitora RSS oficiais, passa pelo `intent check` e cria rascunhos com revisão pendente.
- `dougseo measure`: compara cada URL antes e depois de uma edição.
- `post from-steam <appid>`: rascunho a partir da API pública da Steam.
- Separar um núcleo comum (IA, Codex, autenticação Google) para reaproveitar em `dougleads` e num gerador de propostas.
- Dívida admitida no README da CLI: os comandos `analytics` devolvem o mesmo relatório e `queue list` só mostra o que já venceu.

## 7. Correção de higiene

O `git status` listava mais de 1.400 arquivos modificados com 0 inserções e 0 remoções: ruído do bit de permissão em `/mnt/e` (NTFS no WSL). `git config core.fileMode false` resolve localmente.

## 8. Plano de 30 dias

1. Semana 1: `/servicos`, botão de WhatsApp, remover o BETA e ajustar o consentimento.
2. Semanas 1–2: `dougleads` com 20 prospectos e 10 demos; meta de fechar 2 landings.
3. Semana 3: convidar cerca de 5 lojas para testar o gerador de promoções.
4. Semana 4: `dougseo today` e `measure`, a 1 ou 2 posts por dia só nos clusters que respondem.

## 9. Limites desta análise

- O PageSpeed Insights excedeu a cota; os números de performance vêm dos docs de 30/09.
- Dos repositórios, foram lidos só README, árvore de arquivos e commits recentes.
- Não foi verificado se o negócio que serve de caso nos sistemas internos é cliente ou do próprio dono, o que muda como usá-lo como vitrine.
- Nenhuma estimativa aqui é promessa de tráfego, indexação ou renda.
- A inspeção visual foi feita no navegador embutido do app; painéis de sugestão do próprio navegador não fazem parte do site e foram desconsiderados.
