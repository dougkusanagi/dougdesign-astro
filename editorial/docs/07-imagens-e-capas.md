# 07. Imagens e capas

Destino: `src/assets/images/posts/<slug>.png|jpg`, mínimo 1200×675, proporção 16:9. Use caminho relativo válido no `image` e registre `featured_image.prompt`, `alt` e `generated_path`.

Use como padrão o **Codex CLI**: `scripts/codex-cover.sh <slug> "<cena>"` executa `codex exec` com a ferramenta integrada `image_gen` (sem API key; exige `codex login` com ChatGPT), localiza o PNG em `~/.codex/generated_images/` e salva `src/assets/images/posts/<slug>.jpg` em 16:9. Registre prompt, caminho e alt no frontmatter. O script não aprova a imagem: inspecione-a.

Se o Codex estiver indisponível, falhar ou atingir quota, registre o motivo. Antigravity `generate_image` é alternativa quando disponível; um cartão informativo local ou DougSEO com `--svg <arquivo>` é fallback quando adequado ao pedido, mas não use SVG como capa de post (o `og:image` em SVG não aparece em redes sociais). Não substitua silenciosamente uma imagem raster solicitada por um vetor genérico. `--html` é compatibilidade, não um renderizador HTML separado.

Prefira imagem que explique o tema, sem neon/cyberpunk genérico ou texto flutuante. Logos são opcionais: só use marca real e fiel quando ajudar. Não force geração de logo que a ferramenta deforma. Ilustração conceitual não deve parecer screenshot, produto anunciado ou evidência de teste; identifique-a quando essa distinção importar.

Inspecione o arquivo visualmente antes de aprovar, seguindo a skill. Registre falhas/repetições sem declarar revisão inexistente. Alt descreve o que se vê, sem repetir promessa do título nem dizer “mesa de testes” se não houve teste real.

Em atualizações, mantenha uma capa adequada. Troque se enganosa, fora do tema ou de baixa qualidade. Confira recorte e desempenho no mobile; não adicione scripts pesados para exibir imagens.
