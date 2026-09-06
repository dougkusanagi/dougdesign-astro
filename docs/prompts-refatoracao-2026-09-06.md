# Prompts para um agente começar sem histórico

Data: 06/09/2026. Cole o prompt de entrada seguido de **uma fase**. As fases são implementação futura. O plano é contexto de projeto, não autorização para comprar serviços, enviar campanhas ou inventar credenciais.

## Prompt de entrada

```text
Trabalhe no repositório C:\Users\dl_ag\dev\dougdesign-astro.
Objetivo: tornar o Doug Design um blog confiável com receita mensurável por
afiliados e um produto digital, preservando o acervo e as URLs existentes.

Leia AGENTS.md e docs/plano-renda-refatoracao-2026-09-06.md. Inspecione git status,
branch e diffs antes de editar. Preserve alterações existentes, tmp/ e relatórios
não relacionados. O domínio canônico é https://www.dougdesign.com.br/.

Não dependa de memória da conversa. Confirme versões, comandos, credenciais
disponíveis e estado do deploy sem imprimir segredos. Leia documentação oficial
atual para as APIs e recursos Astro que alterar. Antes de operar posts, leia os
documentos editoriais na ordem do AGENTS e a skill correspondente.

Implemente somente a fase solicitada abaixo, levando-a até os critérios de aceite.
Divida em mudanças pequenas e verificáveis; não reescreva o blog de uma vez.
O plano contém comandos futuros: use --help e o código para verificar se existem.
Ferramenta/MCP/skill propostos não devem ser tratados como já instalados.

Não invente preços de produtos de terceiros, comissão, audiência, autoria,
experiência de uso, pagamento ou resultado de analytics. Dados ausentes são
ausentes, não zero. Não mude URLs nem datas editoriais para simular atualização.

Avance no trabalho local autorizado. Se faltar acesso externo, conclua o que
independe dele e registre exatamente o dado necessário. Não crie cadastros nem
faça compras. Não envie e-mails, campanhas ou mensagens a terceiros sem autorização
explícita de envio. Respeite decisões já autorizadas na sessão.

Ao terminar, relate arquivos, testes, limitações, commit se criado e estado real
da publicação. Diferencie pronto localmente, enviado e confirmado ao vivo.
Atualize um registro de progresso em docs/progresso-renda.md com fase, decisões,
evidências e próximos passos. Não marque etapa incompleta como concluída.
```

## Fase 0 — fatos, medição e vitrine honesta

```text
Execute P0 e as correções pequenas de P2 do plano. Gere um manifesto de URLs,
canonicals, estados e datas antes de editar. Identifique a data real da migração
no Git/deploy e compare períodos disponíveis de GA4 e GSC sem atribuir causalidade
apenas ao gráfico. Use adaptadores já existentes; não exponha credenciais.

Trabalhe na branch codex/plano-renda-refatoracao ou numa branch derivada, sem enviar
alterações diretamente a master. A autorização de sugerir remoções foi incorporada
à seção 9 do plano; implemente as remoções pertinentes a esta fase.

Em Sidebar.astro retire preços sem fonte e imagens de produtos não verificadas.
Links sem afiliação real não devem ser vendidos como monetização configurada.
Renomeie o ranking fixo para seleção editorial. Remova promessa não comprovada
de milhares de visitantes no MuralJobs e remova o mural vazio da home, preservando
dados. Retire a faixa URGENTE permanente. Troque o bloco da newsletter por link
discreto de RSS enquanto só houver RSS. Reduza LivePix a apoio no rodapé e remova
a interrupção da leitura por modal de adblock. Preserve o AdSense funcional.
Confirme o identificador AW do Layout no destino
real; remova apenas se inválido, preservando GA4 e AdSense.

Centralize a política proposta de 2 novos + 2 atualizados por semana em arquivo
de configuração e alinhe AGENTS/docs/skills para remover a obrigação conflitante
de 3 posts por dia. O horário inicial é hipótese, não dado de audiência.

Aceite: nenhuma URL removida; vitrine sem afirmações não sustentadas; manifestos
comparáveis; build e testes relevantes aprovados. Não publique posts nesta fase.
```

## Fase 1 — CLI e contrato editorial

```text
Execute P1 do plano. Primeiro corrija publicação sem validação, flags Git e datas;
depois extraia schema/taxonomia/URLs/estados para packages/content-core.
Mantenha compatibilidade com frontmatter legado e aliases de comandos.

Implemente validação compartilhada antes de publish/schedule/queue; detecção global
de slug/intenção; escrita atômica; manifesto de operação; dry-run sem mutação;
--commit sem push e --push explícito. Não estagie arquivos fora da operação.
Separe data original, agendamento, revisão e mudança operacional. Não altere
updatedDate por agendamento. Faça blog, RSS e sitemap compartilharem elegibilidade
de publicação. Trate datas inválidas e futuras de modo consistente.

Fixe runtime/lockfiles no CI e serialize fila. Execução repetida não duplica
publicação; fila vazia não gera commit. Detecte conflito concorrente sem force push.
Saída JSON no stdout, logs no stderr, segredos redigidos e códigos de saída claros.

Teste regressões com fixtures: URL legada, intenção em categorias distintas,
timezone, postagem futura, falha de validação, repetição e semântica das flags.
Testes Git usam remoto temporário. Não invoque push produtivo em teste.
Compare manifestos de URLs e documente migração/reversão. Não faça migração em
massa do conteúdo antes de gerar e revisar o dry-run.
```

## Fase 2 — afiliados e conversão contextual

```text
Execute P2. Crie catálogo tipado de ofertas e componente acessível. Valide destino,
programa, identificação exigida, status, fonte de imagem e data de verificação.
Use links diretos fornecidos pelo programa e disclosure perto da oferta, com
rel sponsored. Sem preço autorizado e atualizado, use Consultar preço na loja.

Associe ofertas a até dez URLs existentes com intenção de compra confirmada nos
dados. Sem credenciais/links reais, deixe itens inativos e liste a dependência;
não crie tags fictícias. Não alegue uso pessoal dos produtos sem evidência.

Eventos consentidos: offer_view e affiliate_click com ids e posição, sem PII.
Clique não é venda. Mantenha compra e receita como dados externos confirmados.
Reveja home/mobile para antecipar conteúdo e reduzir módulos vazios. Preserve
consentimento e funcionalidade dos formulários mesmo com marketing recusado.

Aceite: links reais quando ativos; fallback honesto; medição única; ausência de
regressão de URL/AdSense; QA mobile e teclado. Documente parâmetros para ativação.
```

## Fase 2B — serviço discreto e prospecção local

```text
Execute a parte de serviço do plano somente depois de ler a seção 4.4.1 e 4.5.1.
O objetivo é gerar interesse qualificado sem transformar o blog em propaganda.

Crie uma página /freelance/ ou /servicos/ com três ofertas de escopo fechado e
preços marcados como hipóteses até aprovação do proprietário. Inclua exemplos
reais, limitações, prazo de resposta e disclosure. Em posts de Web Design e
Programacao relacionados, use uma caixa curta após o conteúdo; não coloque CTA
em todos os artigos nem antes da primeira resposta. Na home use uma faixa pequena,
sem pop-up e sem competir com o conteúdo ou o anúncio.

Implemente formulário separado para nome/empresa, cidade, site ou Instagram,
problema, entrega, prazo, faixa de investimento e canal. Descrição concreta do
problema é obrigatória. O e-mail/WhatsApp só aparece depois do envio. Marketing
é opt-in separado. Valide, limite abuso, não exponha PII em analytics e não envie
lead para uma lista sem consentimento. Se Tally for usado, confirme o formulário
real e mantenha uma rota de exportação/exclusão.

Use triagem explicável e respostas-modelo para dados faltantes. Não invente
portfólio, clientes, métricas ou depoimentos. Eventos registram apenas etapas do
funil; proposta enviada e venda confirmada vêm do sistema de atendimento/pagamento.

Para prospecção, escolha um nicho e até 20 negócios de fontes públicas. Gere uma
observação específica por negócio e três criativos baseados em capturas reais,
sem pessoas/lojas fictícias ou aparência de imagem gerada. Prepare mensagens e
propostas individuais pedindo permissão para conversar. Não enviar nada, criar
conta, adicionar contato, marcar reunião ou aceitar convite sem autorização
explícita do proprietário no canal correspondente. Calendário precisa mostrar
fuso, duração, política de cancelamento e confirmação.

Aceite: CTA contextual; formulário filtra curiosos; página funciona no mobile;
criativos parecem documentação real; lista e propostas são auditáveis; nenhum
envio externo ocorre sem autorização; métricas distinguem resposta qualificada,
proposta, call e venda.
```

## Fase 3 — produto e ferramenta gratuita

```text
Execute P3. Crie gerador de briefing local no navegador com exportação Markdown
e HTML seguro. Não execute HTML arbitrário fornecido pelo usuário. Não envie
briefings para serviços externos. Adicione exemplos e CTA contextual para o kit.

Produza três landing pages Astro originais para freelancers, documentação,
componentes acessíveis, configuração de formulário e demonstrações. Teste cada
template instalando do zero com as instruções do pacote. Use assets redistribuíveis
e registre licenças. Entregue ZIP versionado com checksum fora de public/.

Crie página do Kit de Landing Pages Astro com conteúdo demonstrável, escopo,
pré-requisitos e preço de teste identificado como pendente de ativação comercial.
Não mostre checkout ativo sem produto pronto e conta configurada. Não invente
depoimentos, clientes, escassez ou vendas. Páginas propostas devem passar pela
checagem de intenção/URLs antes de serem criadas.

Aceite: exportação válida; nenhum custo por chamada IA; kit reproduzível; preview
mobile/teclado; assets licenciados; instruções compreensíveis para outro agente.
```

## Fase 4 — venda e entrega

```text
Execute P4 apenas para a conta/provedor efetivamente configurado. Se nenhum estiver
disponível, implemente adaptador e fluxo sandbox e liste dependências exatas.
Verifique documentação oficial antes de escolher tipos de evento e autenticação.

Preserve páginas estáticas; adicione endpoints mínimos para checkout/webhook e
downloads. Verifique assinatura, valor, moeda, produto e estado pago no servidor.
Use armazenamento durável privado para pedidos e tokens; idempotência por evento
e pedido; token expirável e arquivo privado. Página de sucesso não é prova de
pagamento. Confirme pagamentos assíncronos antes de entregar.

Teste pago/pendente/falha/repetição/expiração/reenvio/reembolso em sandbox. Não
emita purchase antes de confirmação nem duplique purchase. Não envie PII ao GA4.
Registre receita, taxas conhecidas, reembolso e conciliação separadamente.
Prepare mensagens transacionais; envios reais dependem de autorização e domínio
configurado. Não comprar nem aceitar termos pelo proprietário.

Aceite: produto pago não público; pedido entregue uma vez; reenvio controlado;
credenciais só no servidor; testes completos; instruções de operação e recuperação.
```

## Fase 5 — retenção e relatório

```text
Execute P5. Integre um provedor de e-mail disponível, sem assinar plano pago.
Implemente inscrição, confirmação, cancelamento e supressão com validação e
proteção contra abuso. Cadastro de marketing separado de compra/download.
Não versionar e-mails, tokens ou dados pessoais. Produza edição semanal rascunho.
Não enviar campanhas sem autorização explícita de envio.

Agregue GSC, GA4, AdSense quando disponível e pedidos confirmados num relatório
de 28 dias versus anteriores. Mostre origem, atualização, moeda e ausência de
dados. Não misture clique de afiliado com receita. Relacione URLs a ofertas e
clusters sem forçar atribuição. Proponha 2 atualizações e 2 pautas da semana com
evidências; falta de dados produz pendência, não lista fictícia de vencedores.
```

## Fase 6 — skills e operação sem histórico

```text
Execute P6 após inspecionar o que realmente foi entregue. Aplique a skill de
criação de skills disponível no ambiente antes de escrever novas SKILL.md.
Atualize skills editoriais existentes e crie somente as necessárias:
release-verification, monetization-offers, digital-product-delivery, weekly-review.
Cada skill referencia uma fonte de política única e usa comandos existentes.

MCPs são opcionais. Inspecione capacidades e autorização; não instale GitHub,
Vercel ou Semrush por pressuposto. Use CLI/APIs existentes quando suficientes.
Inclua nos prompts os nomes reais das ferramentas apenas após descoberta.

Faça um ensaio de rodada editorial com agente sem histórico: inventário, intenção,
fontes, rascunho, capa disponível, validação, agendamento em dry-run e relatório.
Não fabrique experiência humana e não publique só para concluir o ensaio.
Documente distinção entre publicação local, push, deploy pronto e URL verificada.

Aceite: instruções sem regras conflitantes, sem ferramentas fictícias, sem pedido
repetido de autorização já concedida e sem mudanças fora do escopo da rodada.
```

## Prompt de revisão semanal após implementação

```text
Leia a política editorial atual e o registro de progresso. Use a skill weekly-review
se já existir; caso contrário, use os comandos disponíveis confirmados por --help.
Revise 28 dias completos contra 28 anteriores; informe lacunas e data da coleta.
Selecione duas atualizações e duas pautas novas apenas se houver base suficiente.
Associe cada pauta à dúvida real e à evidência; monetização é opcional e contextual.

Antes de criar URL, execute a checagem de intenção. Priorize atualizar quando já
existe conteúdo equivalente. Pesquise fontes primárias atuais; diferencie análise
documental de teste realizado. Use capa autorizada disponível e registre origem.
Valide pelos gates implementados. Cumpra escopo de publicação concedido nesta sessão.

Ao fim, liste URLs criadas/atualizadas com estado e data de agendamento ou confirmação
pública; receita observada separada de hipóteses; próximo experimento e seu critério
de decisão. Não aumentar frequência automaticamente para compensar queda de visitas.
```
