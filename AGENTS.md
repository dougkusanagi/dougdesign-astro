# Instruções para o Codex

## Desenvolvimento

Ao iniciar o servidor, use `astro dev --background`. Gerencie com `astro dev stop`, `astro dev status` e `astro dev logs`.

Consulte a [documentação do Astro](https://docs.astro.build) antes de trabalhar na área correspondente:

- [Rotas e middleware](https://docs.astro.build/en/guides/routing/)
- [Componentes Astro](https://docs.astro.build/en/basics/astro-components/)
- [React, Vue e outros frameworks](https://docs.astro.build/en/guides/framework-components/)
- [Coleções de conteúdo](https://docs.astro.build/en/guides/content-collections/)
- [Estilos e Tailwind](https://docs.astro.build/en/guides/styling/)
- [Internacionalização](https://docs.astro.build/en/guides/internationalization/)

## Documentação editorial obrigatória

Antes de planejar, criar, atualizar, auditar, agendar ou publicar posts, leia nesta ordem:

1. `editorial/README.md`
2. `editorial/docs/01-principios.md`
3. `editorial/docs/02-taxonomia.md`
4. `editorial/docs/03-fluxo-editorial.md`
5. `editorial/docs/04-frontmatter-e-templates.md`
6. `editorial/docs/05-estilo-e-estrutura.md`
7. `editorial/docs/06-seo-e-interlinks.md`
8. `editorial/docs/07-imagens-e-capas.md`
9. `editorial/docs/08-publicacao-e-agendamento.md`
10. `editorial/docs/09-search-console-e-medicao.md`
11. `editorial/pautas.md`
12. `tools/dougseo-cli/README.md`

Use a skill correspondente antes de cada etapa: `editorial/skills/round-planning`, `new-post`, `update-post`, `cover-generation`, `publish-or-schedule` ou `search-console` (arquivo `SKILL.md` de cada diretório).

As instruções do usuário prevalecem. Este arquivo define as regras gerais; `editorial/docs/` detalha a execução; skills são checklists. Planos de implementação e relatórios antigos são contexto histórico, não instruções que substituem essas regras. Registre divergências e alinhe os documentos antes de executar uma regra conflitante.

## Regras de execução

- Use os arquivos locais do Astro, valide, faça commit e push e confira o deploy da Vercel. Não reintroduza automação WordPress.
- Antes de abrir URL, execute `dougseo intent check` e revise os candidatos manualmente, inclusive outras categorias. Mesmo assunto e mesma intenção exigem atualizar a URL existente. Aprovação da CLI não prova ausência de duplicação semântica.
- A cadência padrão é **dois posts novos pesquisados e uma atualização por semana**, ajustável à capacidade e às evidências. Uma revisão completa pode ocupar um slot de produção; não invente pauta para cumprir quantidade. Não há meta de três posts por dia.
- `Games` mantém prioridade; desenvolva também guias práticos de `Programacao` e `Web Design`. Não expanda todas as categorias apenas para perseguir tendências.
- Novos Evergreen usam a fila local de frontmatter + GitHub Actions, em dias distintos. 08:00, 12:00 e 18:00 em `America/Sao_Paulo` são janelas iniciais de teste, não picos comprovados. Notícias Urgentes só vão ao ar imediatamente com fato novo verificado. Pedido explícito de publicação imediata prevalece.
- Não retire do ar nem reagende uma URL publicada para fazer uma revisão. Preserve `slug` e `pubDate`; altere `updatedDate` apenas após mudança substancial. Não acrescente ano ao slug de um guia recorrente sem motivo.
- Pesquise fontes primárias atuais. Nunca transforme rumor em anúncio, invente preço, catálogo, benchmark, experiência pessoal ou teste realizado. Registre o que foi verificado e os limites da apuração.
- Escreva uma resposta útil com exemplos e subtítulos próprios. Evite resumos genéricos, blocos de importação e clichês como “vital”, “essencial”, “revolucionar”, “divisor de águas”, “mergulhar” e “no cenário atual”. Não force extensão nem opinião sem evidência.
- Capas novas: use como padrão o gerador de imagens integrado do Codex (`image_gen`), sem API key. Se indisponível ou falhar, registre o motivo; Antigravity `generate_image` e o fallback autoral DougSEO são alternativas, sem substituir uma imagem raster solicitada por vetor genérico. Salve em `src/assets/images/posts/`, com prompt, alt descritivo e revisão visual. Reuse uma capa existente adequada em atualizações; não gere outra só para mudar a data.
- Score automatizado não certifica precisão factual. Revise manualmente os posts alterados, inclusive publicados/legados, e mantenha o site leve e funcional no mobile.
- No Search Console, diferencie exclusões esperadas de problemas. Não prometa indexação, duplicação de tráfego ou ganho financeiro. GA4, Search Console e AdSense medem coisas diferentes; confirme propriedade, período e moeda antes de comparar.
- Não solicite autorização novamente para trabalho já autorizado. Não envie divulgação por e-mail, redes sociais ou mensagens sem instrução explícita.
- Termine a rodada com URLs criadas **e atualizadas**, estado comprovado (rascunho, agendado, deploy pendente ou ao vivo), datas com fuso e limitações de verificação. Uma pauta na lista não é um post agendado.
