# Doug Design: plano de renda, blog e CLI

Para implementar: começar em [EXECUCAO-REFATORACAO.md](EXECUCAO-REFATORACAO.md).
Tarefas e dependências estão nesse arquivo; estados em [progresso-renda.md](progresso-renda.md);
proposta visual em [interface-refatoracao.md](interface-refatoracao.md).
As decisões consolidadas de execução substituem recomendações históricas conflitantes.

Data: 06/09/2026. Status: proposta executável; não é uma refatoração já realizada.

Atualização de decisões: [stories, preços e apoio](stories-precos-apoio-2026-09-06.md)
prevalece sobre recomendações anteriores deste arquivo sobre preço, adblock e
LivePix. O proprietário mora em Magé, Baixada Fluminense. Manter LivePix opcional
na sidebar com carga leve; substituir interrupção de adblock por aviso dispensável.
Descartar preços antigos de R$ 497/897 e usar os pacotes/escopos do documento novo.

## 1. Decisão recomendada

Durante oito semanas: **2 artigos novos + 2 atualizações substanciais por semana**, com uma terceira publicação nova apenas quando houver capacidade e pauta sustentada por fontes. Priorizar recuperar o acervo, fazer os links comerciais funcionarem e vender um produto pequeno. Não voltar a cinco posts por dia.

O primeiro produto proposto é um **Kit de Landing Pages Astro para Freelancers**, acompanhado de uma ferramenta gratuita de briefing. É compatível com as seções de programação e web design e pode ser produzido, testado e entregue digitalmente por um agente. A demanda ainda precisa ser validada; não pressupor que os leitores de games querem comprar esse kit.

AdSense continua como complemento. Aceitar cookies e renderizar anúncios resolve a implementação; não garante volume, preenchimento ou renda. A queda histórica do GA4 não prova, isoladamente, perda de posicionamento: comparar aquisição orgânica, Search Console, alterações de medição, canais e datas da migração.

Este plano usa inspeção do código e as verificações anteriores da tarefa. Não foi feita nova extração completa de GA4/GSC/AdSense em 06/09. Os preços, limites e critérios comerciais abaixo são hipóteses de teste, não projeções ou benchmarks de mercado.

## 2. Frequência e foco editorial

| Dia | Entrega | Critério |
|---|---|---|
| Segunda | Atualizar uma URL existente | Queda de cliques, informação desatualizada ou intenção mal atendida |
| Terça | Novo tutorial com artefato útil | Exemplo executável, ferramenta ou demonstração original |
| Quinta | Novo guia de decisão ou segundo tutorial | Lacuna comprovada; sem sobrepor intenção existente |
| Sexta | Atualizar outra URL e revisar resultados | Corrigir fontes, links e fatos; registrar mudanças |

Usar inicialmente 12h de Brasília para novos posts, por conveniência operacional. Não há evidência de que 08h/12h/18h sejam os melhores horários deste blog. Notícias entram excepcionalmente, substituindo uma entrega da semana quando necessário. Não preencher calendário sem pauta boa.

Dedicação sugerida: 40% recuperação do acervo, 30% conteúdo novo, 30% produto/distribuição/medição. Se o tempo for insuficiente, reduzir novos posts para um. Publicar mais não é requisito técnico de SEO: o Google alerta contra páginas geradas em escala sem valor adicional [1].

Foco comercial experimental: web design, Astro e programação aplicada. Preservar categorias e URLs de games, hardware e mobile; continuar atualizando as páginas que já atraem leitores. Após exportar dados, escolher dois clusters prioritários por demanda observada, capacidade de oferecer ajuda real e afinidade com uma oferta. Não transformar o blog inteiro num catálogo de assuntos sem relação.

## 3. Problemas encontrados no projeto

| Evidência local | Implicação | Mudança proposta |
|---|---|---|
| `src/components/Sidebar.astro`: três links para `https://amazon.com.br`, sem tag; preços literais e fotos genéricas | Estes botões não constituem um fluxo de afiliados configurado | Catálogo real por produto, links fornecidos pelo programa; retirar preço sem fonte e imagem que não representa o item |
| Mesmo arquivo: `maisLidos` é um array fixo | O título sugere um ranking que não é calculado | Chamar de seleção editorial até existir relatório válido; depois gerar ranking com período e data |
| `src/components/Newsletter.astro`: somente RSS | Ainda não há captação de e-mail | Formulário funcional ou texto coerente com RSS; newsletter comercial só com integração operacional |
| `src/components/MuralJobs.astro`: promete milhares de profissionais diariamente | Promessa não sustentada pelos números disponíveis | Remover a promessa; não vender alcance sem dados |
| `TickerUrgente.astro`: últimos cinco posts sempre recebem URGENTE | Conteúdo antigo/evergreen parece notícia imediata | Usar Últimas publicações; urgência apenas com tipo e prazo explícitos |
| `Layout.astro`: identificador `AW-5927498436558135` acompanha o número do publisher | Associação a Google Ads não foi demonstrada | Confirmar destino no painel; retirar config se não corresponder a conta/destino real, preservando GA4 e AdSense |
| `post-ops.ts`: publicar e agendar escrevem `updatedDate` | Data editorial muda sem revisão do conteúdo | Separar revisão substancial, agendamento e registro operacional |
| `queue.ts`: publica vencidos diretamente | O serviço não aplica por si só um gate de qualidade | Validar antes de qualquer mutação, inclusive invocação via CI |
| `cli.ts`: `--commit` e `--push` chamam a mesma função | Contrato das flags precisa de correção e teste | Commit local e envio remoto como operações distintas |
| `intent-check.ts`: comparação exata limitada à categoria | Duplicata pode atravessar categorias | Unicidade global de URL/intenção; similaridade apenas como sinal para revisão |
| `src/lib/blog.ts`: publicado significa apenas `!draft` | Um post futuro com flag incorreta pode aparecer | Estado e data elegível compartilhados entre site, feed, sitemap e CLI |
| Esquema Astro, indexação CLI e aliases distribuídos | Regras podem divergir | Contrato único com adaptação gradual dos legados |
| `post create --with-ai` ainda é scaffold | Flag promete mais do que executa | Remover/depreciar com mensagem clara, ou implementar geração explicitamente separada |
| Workflow a cada 10 min, Bun latest, sem concurrency explícita | Custo operacional e concorrência desnecessários | Fixar runtime/lockfile e serializar a promoção da fila |
| Documentação exige 3 posts/dia e AGENTS também recomenda 2–3/semana | Agentes recebem objetivos incompatíveis | Uma política editorial canônica e atualização das referências |

Não reabrir a migração por aparência. O próximo trabalho é confiabilidade, conteúdo útil e conversão, com preservação das URLs canônicas `https://www.dougdesign.com.br/<slug>/`.

## 4. Monetização que pode virar implementação completa

### 4.1 Primeiro: afiliados contextuais nos artigos existentes

Entregas: `src/data/offers.yml`, validador, componente de oferta, seleção por post/cluster, aviso de afiliação e evento de clique consentido. Cada oferta contém id, nome, destino direto, programa, identificação válida quando exigida, categorias, origem da imagem, data de verificação e status. Não construir redirecionador que esconda o destino. Links patrocinados usam `rel="sponsored noopener noreferrer"`.

Começar por até dez páginas de intenção de compra que apareçam nos dados, sem criar dez novos reviews. Usar texto “Consultar preço na loja” quando não houver fonte autorizada e atualizada. Recomendar um item porque resolve o caso descrito, não inserir o mesmo mouse em todos os posts. As compras precisam passar por links corretamente configurados para serem atribuídas pela Amazon [2].

Consigo implementar catálogo, componentes, auditoria, métricas e testes. **Depende de você:** conta aprovada no programa e links/identificadores verdadeiros. Sem esses dados, preparar infraestrutura e ocultar ofertas inativas; nunca inventar tag. Receita de afiliados vem do relatório do programa, não do evento de clique no GA4.

### 4.2 Principal experimento: Kit de Landing Pages Astro para Freelancers

Produto mínimo: três páginas originais (profissional autônomo, serviço local, portfólio), componentes reutilizáveis, formulário configurável, README de instalação/publicação, acessibilidade básica, checklist de entrega e licença clara. Sem fontes, imagens ou assets de terceiros redistribuídos sem licença. Começar com uma versão de avaliação gratuita e demonstrações públicas.

Preço inicial para teste: **R$ 49**, sem assinatura. É uma proposta, sujeita à sua decisão antes de abrir cobrança. Não oferecer suporte ilimitado; documentação, escopo e política de atualização precisam estar explícitos. Não vender apenas um ZIP de código que nunca foi instalado do zero.

Funil: tutorial de Astro → demonstração gratuita → página `/produtos/kit-landing-pages-astro/` → checkout hospedado → confirmação de pagamento → entrega protegida. CTA aparece somente em conteúdo relacionado. O produto deve funcionar sem cadastro no blog.

Implementação: checkout externo, webhook com assinatura, idempotência por evento/pedido, armazenamento privado do arquivo, token de download com expiração e reemissão, e-mail transacional e recibo do provedor. Página de sucesso nunca libera arquivo só por receber query string. Pagamentos assíncronos só liberam entrega após confirmação efetiva. Stripe documenta fulfillment por webhook inclusive para Payment Links [3]; usar integração equivalente se a conta disponível for outra.

Testar pagamento aprovado, pendente, falho, evento duplicado, download expirado e reenvio. Não disponibilizar o ZIP pago dentro de `public/` nem no bundle público. Se repositório for público, manter material comercial fora dele.

Consigo criar produto, demos, checkout integrado, entrega e testes. **Depende de você:** conta de pagamento habilitada, identidade de vendedor, preço/condições comerciais finais e domínio de envio quando houver e-mail. Não consigo garantir aprovação, vendas nem atendimento humano por você.

### 4.3 Ferramenta gratuita: gerador de briefing de landing page

Rota proposta `/ferramentas/briefing-landing-page/`. Perguntas guiadas sobre público, objetivo, oferta, provas e seções; exportação Markdown/HTML pronta para usar com um agente. Funciona localmente no navegador, sem API de IA nem custo por utilização. Uma página útil, com exemplos; não gerar milhares de URLs de briefings.

É a ponte para o kit: “Use este briefing em um modelo pronto”. Download gratuito sem e-mail obrigatório; convite opcional para receber atualizações. Implementável integralmente em código sem conta externa. Resultado não promete pesquisa de mercado nem parecer profissional.

Critério para uma segunda ferramenta: uso comprovado da primeira. Candidatas posteriores: gerador de tokens CSS acessíveis e checklist interativo de publicação Astro. Evitar um verificador remoto de qualquer URL na primeira versão: adiciona SSRF, custos e manutenção.

### 4.4 Serviço com escopo fechado, se você quiser atender clientes

Página de diagnóstico técnico Astro/Vercel: formulário de qualificação, escopo, exemplos reais do próprio blog e entrega de relatório. Hipótese de preço: R$ 290 por diagnóstico de um site; correções e migrações orçadas separadamente. Começar por captação de interesse, sem checkout, até definir capacidade e prazo.

Posso implementar o funil e apoiar tecnicamente as entregas. Isto **não** é renda autônoma totalmente executada pelo agente: demanda negociação, acesso aos projetos e responsabilidade de entrega do proprietário. Por isso não é o produto principal deste plano, embora um cliente possa representar mais receita que muitas impressões de anúncios.

### 4.4.1 Como divulgar o serviço sem transformar o blog em propaganda

Esta é uma boa extensão do blog porque os próprios tutoriais podem demonstrar o trabalho. A apresentação deve dizer “projetos enxutos, com escopo e preço claros” em vez de “freelance barato”: a segunda expressão atrai comparação por preço e reduz a confiança no serviço.

Implementação proposta:

- criar `/freelance/` ou `/servicos/` com três ofertas delimitadas: landing page, site institucional pequeno e sistema/automação sob diagnóstico;
- inserir, apenas em posts de `Web Design` e `Programacao` e em artigos que resolvem problemas de negócio, uma caixa curta do autor depois do conteúdo: “Precisa aplicar isso no seu negócio? Veja se um projeto enxuto faz sentido para você”;
- colocar na home uma faixa pequena depois do conteúdo principal ou antes do rodapé, sem ocupar o lugar do primeiro anúncio e sem aparecer como pop-up;
- usar casos reais, screenshots do próprio site, antes/depois e métricas verificáveis. Não usar mockups de IA como se fossem trabalhos entregues;
- remover CTAs de serviço de posts de games e notícias quando não houver relação natural;
- manter disclosure de que o autor também presta serviço, sem insinuar que um tutorial é recomendação independente de um cliente.

O formulário precisa filtrar curiosos antes de liberar WhatsApp ou agenda. Campos mínimos: nome e empresa, cidade, site ou Instagram, o que precisa ser resolvido, tipo de entrega, prazo, faixa de investimento (`até R$500`, `R$500–R$1.000`, `R$1.000–R$2.500`, `acima de R$2.500`), como conheceu o blog e melhor canal de retorno. Exigir uma descrição concreta do problema e aceitar respostas sem consentimento de marketing. Mostrar uma mensagem de recebimento e prazo de resposta; não prometer orçamento automático.

O primeiro contato pode ser triado por regras simples: projeto alinhado, URL/perfil existente, problema específico, prazo e orçamento compatíveis. Leads sem contexto recebem uma resposta curta pedindo os dados faltantes; não entram automaticamente numa lista de marketing. O endereço de e-mail e o WhatsApp ficam ocultos até o formulário ser enviado. Tally pode ser reutilizado se a conta permitir um formulário separado; qualquer provedor deve ter exportação, exclusão e proteção antispam.

Faixas de preço são hipóteses para testar o posicionamento, não uma obrigação: landing page enxuta a partir de R$ 497, site pequeno a partir de R$ 897 e sistema/automação sob diagnóstico. A oferta de R$ 500 precisa especificar número de páginas, quem fornece textos e imagens, prazo, revisões, domínio, hospedagem e manutenção. Cobrar 50% para iniciar e 50% na entrega é uma opção contratual a ser definida pelo proprietário, não uma regra escondida no formulário.

Consigo implementar página, prova de trabalho, formulário, triagem, eventos de funil, respostas-modelo e integração com agenda. **Depende de você:** aprovar preços/escopo, fornecer portfólio e contato de atendimento, responder leads e assumir contrato, pagamento, suporte e entrega final. O blog pode gerar interesse; não deve fingir que o agente é o prestador responsável.

### 4.5 Depois: newsletter e patrocínio

Newsletter: uma edição semanal, resumo de dois materiais úteis e uma oferta contextual. Implementar inscrição, confirmação, cancelamento e lista de supressão; nunca reativar quem cancelou. E-mail transacional e marketing têm consentimentos distintos. Deixar templates e campanhas como rascunho; enviar a terceiros só com autorização explícita de envio.

Patrocínio/mural pago: adiar até haver audiência demonstrável ou interessados reais. Depois, página de mídia com números datados, formulário, moderação, expiração e identificação de patrocínio. Não construir um marketplace agora. LivePix permanece opcional, sem bloquear a leitura nem ocupar o espaço principal de conversão.

### 4.5.1 Prospecção local, criativos e calls

É possível montar uma operação pequena e personalizada para negócios da sua região, mas ela deve ser tratada como vendas, não como mais um robô de publicação. O fluxo executável seria: escolher um nicho local, levantar uma lista curta usando dados públicos, revisar site/Google Business/Instagram de cada negócio, preparar uma observação específica, enviar uma mensagem pedindo permissão para apresentar uma melhoria, qualificar pelo formulário e só então enviar proposta e link de agenda.

Os criativos devem usar captura real de tela, tipografia consistente, uma frase sobre um problema local e uma chamada única. Exemplos: “Seu cliente encontra o endereço e o WhatsApp em 10 segundos?”; “A página abre bem no celular?”; “O botão de orçamento funciona?”. Uma peça com a home atual do negócio e uma sugestão concreta tende a ser mais crível que uma arte genérica de “faça seu site”. Não gerar rostos, lojas ou depoimentos fictícios.

Posso pesquisar e organizar prospects, criar variações de criativos, escrever mensagens individuais, montar propostas em PDF/HTML e configurar um calendário de reuniões. **Não devo enviar mensagens, propostas ou convites nem criar/agendar calls sem autorização explícita no canal e na conta usados.** O envio deve respeitar opt-out, volume baixo, identificação e regras da plataforma; não comprar listas nem disparar para contatos coletados de forma duvidosa. A confirmação final da reunião deve ficar visível para você.

Para o primeiro teste, usar um único nicho (por exemplo, profissionais autônomos ou negócios locais com atendimento por WhatsApp), no máximo 20 prospects, três criativos e uma oferta fechada. Medir respostas qualificadas, propostas aceitas e chamadas realizadas; impressões e curtidas não contam como cliente. Parar ou ajustar a oferta se não houver respostas depois de uma amostra razoável, sem aumentar spam.

## 5. Como avaliar dinheiro sem prometer dinheiro

Receita bruta de anúncios = pageviews / 1.000 × RPM de página observado. O Google informa que a receita varia com tráfego, conteúdo, localização e configuração [4]. Exemplo apenas aritmético: 5.000 pageviews e RPM hipotético de R$ 5 gerariam R$ 25; isso não estima o RPM do blog.

Dez vendas hipotéticas a R$ 49 gerariam R$ 490 brutos, antes de taxas, reembolsos, impostos, suporte e infraestrutura. Não há evidência aqui para prever dez vendas. A comparação explica por que testar uma oferta própria, não por que ela necessariamente venderá.

Métricas: cliques orgânicos por URL/cluster; sessões qualificadas; visualizações de oferta; cliques de afiliados; início de checkout; compras confirmadas; receita líquida após custos conhecidos; horas de manutenção. AdSense deve permanecer separado da receita comercial. Somar apenas moedas/períodos compatíveis. Atribuição desconhecida aparece como desconhecida.

Usar 28 dias completos contra 28 anteriores para operação, 90 dias para contexto e anotar migração/correções. Antes de comparar receita GA4, confirmar integração com AdSense: ausência de dados não significa zero receita. GSC e GA4 medem coisas diferentes e não devem coincidir à força.

Após oito semanas: se a oferta teve poucas visitas qualificadas, falta evidência sobre demanda. Se teve pelo menos 100 visitas qualificadas e nenhum início de checkout, revisar promessa/demo/preço antes de criar outro produto; é um gatilho operacional, não significância estatística. Se há checkout sem compra, testar checkout e custos. Não rodar testes A/B com amostra minúscula.

## 6. Arquitetura alvo: refatoração gradual

Manter Astro estático e Vercel. Não trocar de framework ou adotar CMS remoto para resolver lógica editorial. Extrair somente o código compartilhado necessário:

```text
packages/content-core/       # schema, estados, datas, taxonomia, URLs e validação
tools/dougseo-cli/src/
  commands/                  # parsing e apresentação; sem regra de negócio
  services/                  # operações verificadas e idempotentes
  adapters/                  # filesystem, Git, Google, imagens, pagamentos
src/data/offers.yml          # catálogo comercial sem credenciais
src/data/products.yml        # metadados públicos; sem arquivo pago
src/components/commerce/     # ofertas e CTAs contextuais
editorial/config/policy.yml  # frequência, timezone e regras canônicas
editorial/reports/           # relatórios agregados; sem PII/segredos
editorial/prompts/           # instruções versionadas de operação
```

Conteúdo e catálogo ficam em arquivos. Pedidos, tokens de entrega e inscrições exigem armazenamento durável privado quando forem implementados; não usar Git para PII nem filesystem efêmero da função. Só adicionar serviço de banco/storage nessa etapa. Adaptador Vercel/rotas dinâmicas apenas para os endpoints necessários; blog continua pré-renderizado. Não iniciar com painel administrativo ou microsserviços.

### Contrato editorial

Schema versionado com estado `draft | ready | scheduled | published | archived`. `publishedAt` é publicação original; `scheduledAt` é planejamento; `updatedAt` muda por revisão substantiva; `lastReviewedAt` pode registrar revisão sem alteração. Adaptação dos nomes atuais `pubDate`/`updatedDate` durante migração. URL imutável por padrão.

Metadados editoriais agrupam intenção, assunto, cluster, fontes e evidências. Autoria representa quem realmente escreveu/revisou; confirmar se os nomes atuais são pessoas, pseudônimos ou personas. Se forem personas editoriais, declarar isso e não inventar experiência, currículo, testes de produto ou anos de uso. Imagem gerada serve de ilustração; não é prova de benchmark nem foto de produto testado.

`ready` exige fontes verificadas, links válidos, ausência de afirmações sem suporte, capa quando pertinente e revisão editorial. Verificações automáticas podem apontar problemas, mas score e contagem de palavras não provam qualidade. Legados recebem relatório e correção progressiva, sem exclusão em massa.

### CLI confiável para agentes

Manter Bun inicialmente e fixar versão e lockfiles; mudança de runtime não entrega renda. Fazer CLI e Astro consumirem o mesmo contrato. Parsing estrito, tipos explícitos, erro estruturado, saída JSON estável no stdout e logs no stderr. Segredos nunca aparecem em relatórios ou comandos copiados.

Comandos novos abaixo são **contratos propostos**, não executáveis ainda:

```sh
dougseo doctor --json
dougseo content audit --scope all --json
dougseo content migrate --dry-run --report <arquivo>
dougseo intent check --subject <assunto> --intent <intencao> --json
dougseo post validate --slug <slug> --json
dougseo post schedule --slug <slug> --at <ISO_COM_OFFSET> --dry-run
dougseo queue run --dry-run --json
dougseo metrics sync --days 28 --json
dougseo opportunities list --json
dougseo offers audit --json
dougseo release verify --base-url https://www.dougdesign.com.br --json
```

Preservar aliases antigos com avisos durante transição. `--dry-run` nunca escreve; `--commit` nunca envia; `--push` é explícito. Estagiar somente arquivos da operação, jamais `git add .`. Falha parcial retorna quais arquivos/URLs foram alterados. Escrita atômica por arquivo e manifesto por lote; repetir a execução não duplica alterações nem publicação. Serializar fila em CI e detectar mudanças concorrentes antes de push.

Agendamento considera America/Sao_Paulo e timestamps explícitos. GitHub Actions executa uma fila de vencidos; não prometer pontualidade exata do scheduler. Fila vazia não gera commit/deploy. Marcar publicado localmente não significa estar ao vivo: verificar deployment e URL pública e reportar ambos separadamente.

### Blog e aquisição

Home: conteúdo principal mais cedo, seleção útil por tema, ferramenta e oferta pertinentes. Rever espaço ocupado por ticker, banner, mural vazio e apoio; medir mobile antes/depois. Não aumentar densidade de anúncios para compensar falta de tráfego.

Artigos: sumário quando útil, referências, revisão datada, autor transparente, exemplos reproduzíveis, relacionados por intenção e CTA coerente. Categorias existentes ganham introdução útil; não indexar combinações de filtros e buscas internas indiscriminadamente. Não atualizar títulos em massa para o ano corrente.

Manter testes de consentimento, inicialização única de AdSense e estados `filled`/`unfilled`. Estado pendente pode permanecer se Google não responder; não declarar bloqueio apenas por atraso. Medir receita pelo provedor, não pelo número de iframes. Formulários necessários precisam funcionar sem aceitar marketing.

## 7. Sequência de implementação e aceite

| Fase | Escopo | Aceite | Dependência |
|---|---|---|---|
| P0 — base | Exportar URL/status/canonical, métricas e estado Git; corrigir afirmações comerciais e política conflitante | Relatório de baseline; nenhuma URL removida; zero promessas de público sem fonte | Dados Google podem exigir acesso; registrar lacuna sem inventar |
| P1 — CLI | Contrato compartilhado, datas, flags, validação, fila e CI | Fixtures legadas preservam URLs; dry-run sem escrita; commit sem push; repetição segura | P0 |
| P2 — conversão | Catálogo afiliado, layout mobile, CTA, ranking honesto | Destinos e avisos corretos; sem preço inventado; formulário sem marketing funciona | P0; links verdadeiros para ativar afiliados |
| P3 — produto | Briefing gratuito, kit, demo, documentação, página de venda | Instalar kit do zero; exportar briefing; acessibilidade e mobile verificados | P2; pode produzir arquivos enquanto conta comercial está pendente |
| P4 — entrega | Checkout, webhook, storage privado e confirmação | Fluxos de pagamento e reentrega testados, nenhuma compra falsa no GA4 | Conta habilitada e dados comerciais |
| P5 — retenção | Newsletter e relatório semanal agregado | Confirmação/cancelamento/supressão funcionam; PII fora do Git | Provedor, domínio e autorização de envio |
| P6 — operação | Prompts/skills, documentação única, revisão de resultados | Agente novo executa rodada piloto sem histórico e sem comandos fictícios | P1; ajustar comercial conforme P2–P5 entregues |

Ordem prática: entregar P0 e P2 pequenos antes de investir semanas na arquitetura. P1 deve atacar bugs de publicação antes de reorganizar diretórios. Produto gratuito e primeiro kit precedem infraestrutura comercial sofisticada. Não condicionar receita a “refatorar tudo”.

Estimativa de esforço técnico, não prazo garantido: P0/P2 básico 2–4 dias; P1 3–6 dias; P3/P4 5–10 dias; P5/P6 2–4 dias. Aprovações de contas e conteúdo podem alongar o calendário. Sem assinar plano pago de ferramenta/serviço automaticamente; reportar necessidade e custo verificado quando surgir.

### Verificação e reversão

Comparar manifesto de URLs antes/depois, HTTP 200/301/308, canonical, robots, sitemap e RSS. Redirecionamentos só quando motivados; não apagar URL por tráfego baixo. Testar datas inválidas/futuras, conteúdo inválido, fronteira de timezone, concorrência de fila e flags Git em repositório temporário sem remoto produtivo.

Testes de comércio usam sandbox; não fazer compras reais nem cliques em anúncios para testar. Testes do consentimento simulam a rede AdSense. Usar build, testes unitários e E2E relevantes, além de smoke público após deploy. Commit por entrega; rollback por revert e verificação pública. Conteúdo e dados comerciais têm backup próprio; revert de código não desfaz pagamento.

## 8. Skills, ferramentas e MCPs

Reutilizar skills editoriais existentes, refatorando-as após política unificada. Criar posteriormente skills locais `release-verification`, `monetization-offers`, `digital-product-delivery` e `weekly-review`. Cada uma deve ter entradas, passos reais, critérios de aceite e saída; não repetir documentos longos nem pedir confirmações já autorizadas.

MCP não é pré-requisito. O CLI já oferece GA4/GSC; corrigir esses adaptadores antes de acrescentar integrações. Git CLI e APIs oficiais bastam para a maior parte da operação. Plugin Vercel é opcional para deployments/logs; GitHub é opcional para PRs/actions; Semrush só após existir uma pergunta que GSC não resolve e orçamento. Não instalar todos por padrão nem assumir credenciais disponíveis. Se forem escolhidos, conferir capacidades reais antes de escrever chamadas em prompts.

Geração de imagem: preservar prioridade atual do Antigravity quando disponível; verificar disponibilidade real. Na refatoração, centralizar fallback: ferramenta autorizada disponível, ilustração local existente ou capa de template. Nunca alegar ter usado `generate_image` sem tê-la chamado. Não adicionar MCP não verificado para satisfazer uma regra antiga.

Os prompts prontos estão em [prompts-refatoracao-2026-09-06.md](prompts-refatoracao-2026-09-06.md). Eles descrevem skills propostas como futuras, não como ferramentas já instaladas.

## 9. O que não priorizar

### Remoções recomendadas na implementação

O proprietário autorizou sugerir remoções. A recomendação é reduzir módulos que
disputam atenção sem entregar utilidade ou receita demonstrada. Isso não autoriza
apagar o acervo ou perder URLs existentes.

| Elemento | Decisão proposta | Motivo e condição para voltar |
|---|---|---|
| Mural de vagas na home | Remover a seção da home; preservar os dados existentes | Hoje não há vagas no módulo nem demanda comprovada. Voltar em página própria somente com oportunidades reais e interesse observado |
| Faixa vermelha URGENTE permanente | Remover a faixa animada; últimas publicações já têm espaço no feed | Acrescenta ruído e urgência falsa. Alerta excepcional só com fato atual e expiração |
| Cards Amazon genéricos | Remover até existirem ofertas verificadas; depois usar contexto do artigo | Destinos genéricos, preços fixos e fotos não comprovadas não ajudam a compra |
| Mais Lidos estático | Substituir por seleção editorial curta | Não apresentar curadoria manual como ranking medido |
| Newsletter sem inscrição | Trocar o convite por um link discreto de RSS até integrar captação | Evitar um bloco grande prometendo função indisponível |
| LivePix destacado na sidebar | Reduzir para link de apoio no rodapé | Apoio voluntário pode ficar disponível sem anteceder leitura e oferta contextual |
| Modal que interrompe leitura por adblock | Remover a interrupção; avaliar aviso discreto opcional | Leitor deve conseguir consumir conteúdo mesmo sem preencher anúncios |
| Ofertas universais repetidas em todos os temas | Remover | Games, hardware e tutoriais de código têm necessidades diferentes |

Estas são decisões de simplificação do próximo ciclo, não resultados de um teste
A/B já realizado. Medir navegação, leitura e conversão após cada entrega. Não
remover o AdSense funcional por falta de uma impressão isolada.

- SaaS com login/assinatura antes de validar o kit.
- Mais banners e bloqueio de leitura para pedir desativação de adblock.
- Marketplace de vagas sem recrutadores interessados.
- Postagem diária automática para atingir número.
- Comparadores de preços com scraping frágil e preço desatualizado.
- Reviews que dizem “testamos” sem teste; personas com credenciais inventadas.
- API de IA paga para uma ferramenta que funciona com formulário e templates.
- Mudança de domínio, URLs, framework ou exclusão maciça do acervo.

## 10. Primeira entrega recomendada

1. Tornar honesta a vitrine atual: Amazon, ranking, mural e ticker.
2. Registrar dados de aquisição e receita com lacunas explícitas.
3. Corrigir gates de publicação/datas/flags antes da próxima rodada automática.
4. Publicar briefing gratuito e demo do primeiro template.
5. Configurar afiliados reais e validar interesse no kit antes de ampliar catálogo.

Entrega deste planejamento: somente documentos. Nenhum post novo, cobrança, newsletter enviada, conta criada ou MCP instalado nesta rodada.

## Fontes consultadas em 06/09/2026

1. Google: conteúdo de IA deve agregar valor; escala não substitui qualidade. https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
2. Amazon Brasil: atribuição por Links Especiais e políticas do programa. Conferir regras de preços, imagens e identificação antes da ativação. https://associados.amazon.com.br/help/operating/policies
3. Stripe: entrega após pagamento, webhooks e idempotência. https://docs.stripe.com/checkout/fulfillment
4. Google AdSense: fatores que afetam receita. https://support.google.com/adsense/answer/9902?hl=pt-BR
