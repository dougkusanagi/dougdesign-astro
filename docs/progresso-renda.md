# Estado da refatoração

## Ponto de retomada

Planejamento consolidado; **R01 é a próxima tarefa**. Ler `EXECUCAO-REFATORACAO.md`.
Não iniciar produto/checkout antes de baseline e entregas de interface/serviço.

Branch: `codex/plano-renda-refatoracao`. Conferir HEAD ao retomar.
Arquivos preexistentes não relacionados: `tmp/` e
`editorial/reports/content-freshness-2026-07-11T04-15-07-471Z.json`; não estagiar.

## Evidências existentes

| Entrega | Estado | Evidência |
|---|---|---|
| Plano, preços e prompts de implementação | Documentado | Commits 975244c, cf90b90, a63a91a; decisões consolidadas na entrada única |
| Separação dos stories | Concluída fora do blog | Pasta na Área de Trabalho; cinco PNGs, galeria, prompts e controle por canal; nenhuma postagem executada |
| Lazy loading das duas imagens secundárias da home | Verificado localmente, enviado à branch | b7bd9c7 e 7ef185c; build 620 páginas; HTML eager/high na principal e lazy nas secundárias |
| Ganho numérico de PageSpeed dessa alteração | Não medido | Prints do usuário: 74 mobile, 99 desktop; não são medição após alteração |
| Refatoração geral da interface/CLI | Não implementada | Backlog abaixo |

Correções de migração/AdSense anteriores não equivalem à conclusão de R03–R09.
Revalidar os comportamentos afetados; não reiniciar a migração do zero.

## Quadro de execução

| ID | Estado | Evidência / bloqueio |
|---|---|---|
| R01 | pendente | Capturar baseline atual de rotas, UI e métricas |
| R02 | pendente | Há instruções históricas conflitantes; consolidar nos arquivos operacionais |
| R03 | pendente | — |
| R04 | pendente | — |
| R05 | pendente | — |
| R06 | pendente | Especificação de interface pronta |
| R07 | pendente | — |
| R08 | pendente | Manter escolhas recentes de apoio/adblock |
| R09 | pendente | Lazy loading isolado não conclui auditoria |
| R10 | pendente | — |
| R11 | pendente | Confirmar destino/provedor de recebimento antes da ativação |
| R12 | pendente | Confirmar links de afiliados válidos antes da ativação |
| R13 | pendente | Confirmar acesso e disponibilidade de relatórios |
| R14 | pendente | — |
| R15 | pendente | — |
| R16 | pendente | Conta comercial e condições necessárias antes da ativação |
| R17 | pendente | Provedor/domínio e autorização de envio necessários |
| R18 | pendente | — |

## Modelo de registro por tarefa

```text
ID e estado:
Data / branch / HEAD inicial:
O que mudou e por quê:
Arquivos e artefatos:
Validação (comandos + resultados):
Commit / preview / produção, se houver:
Pendências e dependências:
Próximo passo exato:
```

Registrar também tentativas que falharam quando ajudam a não repeti-las; não incluir
segredos, PII de leads nem relatórios enormes. Referenciar artefatos por caminho.
