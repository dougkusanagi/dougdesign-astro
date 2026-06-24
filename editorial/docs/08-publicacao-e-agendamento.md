# 08. Publicacao e Agendamento

- `dougseo publish --slug <slug>` publica localmente mudando `draft: false`.
- `dougseo schedule --slug <slug> --at <ISO_DATE>` deixa `draft: true` e `scheduled: true`.
- O workflow do GitHub promove automaticamente drafts vencidos no branch padrao.
- Vercel continua sendo acionada por push, sem painel manual como passo obrigatorio.
