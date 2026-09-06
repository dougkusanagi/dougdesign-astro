# Entrada única para executar a refatoração

## Como retomar

Leia AGENTS.md, este documento, `progresso-renda.md` e `interface-refatoracao.md`.
Depois leia somente os detalhes e skills pertinentes à tarefa escolhida.
`plano-renda-refatoracao-2026-09-06.md` contém justificativas e arquitetura;
`prompts-refatoracao-2026-09-06.md` contém procedimentos auxiliares. Este documento
é a referência consolidada para ordem e decisões de execução. Instrução nova do
proprietário prevalece; registre-a aqui antes de continuar trabalho afetado.

Branch atual: `codex/plano-renda-refatoracao`. Confirmar branch, HEAD, status e
diffs em cada retomada. Não sobrescrever trabalho existente nem enviar a master
por inferência. Não refazer algo só porque seu estado ainda não foi registrado:
primeiro buscar a implementação e evidências. Stories são externos ao repositório.

## Decisões vigentes

- Preservar Astro, Vercel, URLs e conteúdo. Refatorar por incrementos.
- Frequência proposta: 2 novos + 2 revisões substanciais por semana. Remover regras
  contraditórias de volume na tarefa R02, antes da próxima rodada editorial.
- Retirar mural vazio da home, ticker de urgência permanente, ofertas falsas e
  ranking sem medição; seleção editorial explicitamente nomeada é permitida.
- **Manter LivePix opcional na sidebar desktop**, após conteúdo útil; mobile após
  artigo. Já existe carregamento adiado: verificar e preservar, não reimplementar.
- **Adblock: aviso amigável e dispensável**, sem travar leitura, no máximo uma
  vez por sete dias após dispensado; detecção inconclusiva não acusa bloqueador.
- AdSense funcional continua; não esconder scripts de ferramentas de medição.
- Serviço de freelance discreto é prioridade antes de checkout de produto digital.
  Formulário inicial curto com problema, serviço, faixa e contato; mais detalhes
  numa segunda etapa. Recusar marketing não impede solicitar orçamento.
- Preços e limites de escopo seguem `stories-precos-apoio-2026-09-06.md`, cuja parte
  remanescente trata de serviços e apoio. R$ 497/897 foram superados. Magé é a base
  local, não motivo para desconto irrestrito. Sistema sob orçamento.
- Kit, pagamentos e newsletter são etapas posteriores. Não criar infraestrutura
  comercial antes de validar oferta. Nenhuma mensagem a terceiros está autorizada
  apenas por existir um prompt de prospecção.

## Estados e critérios

Estados: pendente, em andamento, implementado, verificado, bloqueado, publicado.
Implementado significa código pronto; verificado exige evidência de aceite;
publicado exige deployment e URL pública confirmados. Documentação pronta não
significa funcionalidade pronta. Bloqueio inclui motivo, dependência e próximo passo.

Manter uma tarefa principal em andamento. Ao concluí-la, atualizar progresso,
registrar validação e commit, e escolher a próxima elegível na ordem abaixo.
Se uma depender de dado externo, avançar para outra independente e registrar a
pendência. Não reduzir requisitos nem inventar dado para marcar conclusão.

## Backlog ordenado

| ID | Entrega | Depende de | Aceite / evidência mínima |
|---|---|---|---|
| R01 | Baseline de rotas, interface e performance | — | Manifesto URL/canonical/status, prints mobile/desktop e relatório de medições datadas; limitações explícitas |
| R02 | Política editorial e documentação sem conflitos | — | AGENTS, docs e skills consistentes com decisões vigentes; comandos futuros identificados |
| R03 | Segurança da publicação e flags Git | R01, R02 | Validação antes de mutação, dry-run sem escrita, commit sem push, testes em Git temporário |
| R04 | Estados, datas e taxonomia compartilhados | R03 | Legados mantêm URLs; agendamento não finge revisão; site/RSS/sitemap concordam; casos futuros/timezone testados |
| R05 | Fila e CI reproduzíveis | R04 | Runtime fixo, lockfile, concorrência serializada, repetição segura, fila vazia sem commit/deploy |
| R06 | Simplificação da home | R01 | Wireframe deste plano aplicado; mural vazio/ticker permanente removidos; feed sem duplicatas entre módulos; prints comparáveis |
| R07 | Componentes de leitura e navegação | R06 | Artigo/categoria/busca/mobile/tema/teclado verificados; foco visível, hierarquia e alvos de toque adequados |
| R08 | Anúncios, apoio e consentimento | R06 | Aviso dispensável persistente, LivePix preservado, formulário independente de marketing; testes de consentimento e estados dos slots |
| R09 | Performance e acessibilidade medidas | R07, R08 | Mediana de 3 medições equivalentes em home/artigo por perfil; diferenças documentadas, erros críticos corrigidos, sem regressão dos anúncios |
| R10 | Página de serviços e CTA contextual | R07 | Oferta/escopo reais, home discreta, CTA somente em conteúdo relacionado, sem alegações de resultado inventadas |
| R11 | Formulário e triagem de contatos | R10 | Recebimento real confirmado com teste autorizado ou sandbox, erros/abuso tratados, sem PII no GA4; contato/provedor pendente bloqueia ativação |
| R12 | Catálogo afiliado válido | R07 | Links verdadeiros, disclosures, ofertas inativas ocultas, sem preço/imagem sem fonte; tags ausentes bloqueiam ativação |
| R13 | Relatório de aquisição e receita | R04 | GSC/GA4/provedor com fonte/data, 28 dias comparáveis, ausente ≠ zero; sem confundir clique e venda |
| R14 | Briefing gratuito e demo de template | R10 | Exportação local segura, acessível e útil; teste de instalação do template; intenção/URL checada |
| R15 | Kit digital final | R14 | 3 templates instaláveis, docs/licença, artefatos privados, versão/checksum; demanda avaliada antes de ampliar |
| R16 | Checkout e entrega privada | R15 | Conta/preço definidos; webhook autenticado/idempotente, testes pago/pendente/duplicado/expirado/reembolso; sem pagamento real de teste |
| R17 | Newsletter opcional | R11, R13 | Confirmação/cancelamento/supressão, provedor real, rascunhos; envio depende de autorização |
| R18 | Skills e ensaio de retomada | R05, R09, R13 | Skills usam comandos existentes; agente consegue retomar pelo registro; rodada piloto não publica por engano |

R06 pode avançar enquanto R03–R05 estiverem bloqueadas por um motivo documentado.
R10–R13 podem preceder novo trabalho arquitetural opcional: dar prioridade ao que
viabiliza um contato real. Ordem é de dependência/valor, não compromisso de executar
todo o backlog numa única sessão.

## Fechamento de cada entrega

1. Conferir diff e arquivos afetados, preservando alterações alheias.
2. Executar testes pertinentes; registrar comando e resultado, sem dizer apenas “testado”.
3. Comparar rotas se a entrega afeta conteúdo/roteamento; comparar screenshots se afeta UI.
4. Registrar tarefa, decisão, pendências e artefatos em `progresso-renda.md`.
5. Commit pequeno; registrar hash após criá-lo. Push só na branch de trabalho.
6. Se houver preview, testar e registrar URL. Não chamar preview de produção.
7. Antes de parar: escrever o próximo comando/arquivo e o ponto exato de retomada.

## Prompt único para solicitar implementação

```text
Implemente a refatoração do Doug Design na branch codex/plano-renda-refatoracao.
Comece por AGENTS.md, docs/EXECUCAO-REFATORACAO.md, docs/progresso-renda.md e
docs/interface-refatoracao.md. Verifique o estado real do Git e do código.
Siga o backlog pela próxima tarefa elegível e seus critérios de aceite.
Não refaça trabalho verificado; não confunda documento com implementação.
Conclua e valide cada entrega antes de marcar seu estado. Atualize progresso,
evidências, bloqueios e ponto de retomada durante o trabalho e antes de encerrar.
Preserve URLs, AdSense e LivePix; aplique o aviso amigável de adblock do plano.
Mantenha alterações na branch de trabalho. Se faltar conta/dado externo, registre
a dependência e avance no que for independente. Não invente credenciais, receita,
depoimentos ou autorização de envio a terceiros. Stories ficam fora do projeto.
```
