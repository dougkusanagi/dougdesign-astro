# 08. Publicacao e Agendamento

- `dougseo publish --slug <slug>` publica localmente mudando `draft: false`.
- `dougseo schedule --slug <slug> --at <ISO_DATE>` deixa `draft: true` e `scheduled: true`.
- O workflow do GitHub promove automaticamente drafts vencidos no branch padrao.
- Vercel continua sendo acionada por push, sem painel manual como passo obrigatorio.
- **Divisão Editorial:** Divida posts entre "Evergreen" (atemporais) e "Urgente" (novidades factuais).
- **Escalonamento de Publicações:** Nunca publique múltiplos posts Evergreen ao mesmo tempo. Use `dougseo schedule` para agendá-los nos horários de pico (08:00, 12:00 e 18:00 local), mantendo a meta de 3 posts diários.
- **Relatório de Links:** Sempre liste as URLs públicas esperadas de todos os posts gerados no final da execução.
