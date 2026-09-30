# 04. Frontmatter e scaffold

O contrato técnico está em `src/content.config.ts`; vários campos são opcionais para compatibilidade com o legado. Para posts novos e revisões completas, o contrato editorial exige:

- Identificação: `title`, `slug`, `author`, `category`.
- Estado: `pubDate`, `draft`, `scheduled`; `updatedDate` quando houver revisão substancial.
- Busca: `meta_description` manual (máximo 160 caracteres), `description`, `keyword_principal`.
- Intenção: `content_type`, `cluster`, `assunto`, `intencao_busca`, `decisao_do_leitor`, `fato_novo`, `canonical_role`.
- Evidência: `fontes_oficiais`, `canibalizacao.status` e `canibalizacao.resumo`.
- Navegação: `internal_links.to` e `internal_links.from_needed` (este último registra pendências, não links já implantados).
- Imagem: `image`, `featured_image.prompt`, `featured_image.alt`, `featured_image.generated_path`.

Use `content_type` adequado, como `noticia`, `guia`, `tutorial` ou `comparativo`. Evergreen/Urgente é classificação operacional, não um novo campo do schema. `canonical_role: pilar|apoio` descreve o papel no cluster, não altera sozinho a tag canonical.

`fato_novo` deve explicar a contribuição ou mudança verificada; não precisa inventar novidade em um tutorial. `fontes_oficiais` contém páginas específicas realmente consultadas, também citadas junto às afirmações no corpo.

`dougseo post scaffold` gera um ponto de partida, não conteúdo aprovado. Substitua descrições, corpo, prompt, alt e status de canibalização; o padrão é `noticia`. Remova o `# título` do corpo, pois a página já renderiza a H1. Guias/comparativos precisam de estrutura própria, sem cabeçalhos de notícia herdados.

Datas: novos agendados usam ISO com fuso; revisões preservam a publicação original. Não mude `updatedDate` por ajuste cosmético ou mero acréscimo de link. Se uma ferramenta o alterar automaticamente, restaure a data anterior quando não houve revisão substancial. `readingTime`, se presente, deve refletir o texto final.
