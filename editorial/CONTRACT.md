# Contrato operacional editorial

Este arquivo é a referência curta para qualquer rodada de conteúdo. Os documentos em `editorial/docs/` explicam o contexto; este contrato define o que precisa ser verdade antes de publicar.

## Cadência e tipos

- **Evergreen:** 2–3 artigos de alta qualidade por semana, em URLs estáveis. Agende em horários diferentes (08:00, 12:00 ou 18:00) somente quando isso fizer sentido para a audiência.
- **Urgente:** publique imediatamente apenas quando houver valor temporal comprovado e fontes verificáveis.
- Atualize artigos que já recebem impressões antes de criar uma nova URL para o mesmo assunto e intenção.

## Pré-publicação obrigatória

1. Rode `dougseo intent check --keyword "..." --intent "..."` e reutilize uma URL existente quando houver conflito.
2. Valide frontmatter, imagem de capa, links internos, título, descrição e ausência de H1 duplicado.
3. Rode `dougseo audit --scope drafts` (ou `all`) e corrija todos os erros bloqueadores.
4. Confirme que o canonical, sitemap, RSS e links públicos usam `https://www.dougdesign.com.br`.

## Publicação e medição

- Use `dougseo schedule --slug <slug> --at <ISO_DATE>` para filas agendadas; não use o painel da Vercel.
- Após a rodada, registre URL pública, status (live/agendada), data, impressão, clique e conversão esperada.
- Toda CTA de newsletter, contato ou afiliado deve levar a um fluxo real e mensurável; não mascarar sucesso com uma confirmação simulada.

## Critérios de saída

Uma rodada só está concluída quando o build passa, os testes passam, o relatório de auditoria foi salvo e os próximos experimentos de monetização têm evento/UTM definidos.
