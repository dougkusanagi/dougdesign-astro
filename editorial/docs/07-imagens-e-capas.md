# 07. Imagens e Capas

- Destino final: `src/assets/images/posts/<slug>.png|jpg`.
- Resolucao minima: `1200x675`.
- Sem texto livre. Logos de marcas famosas (ex: Apple, Google, PlayStation) podem e devem ser usados na capa se o post for sobre elas, desde que a IA consiga reproduzi-los corretamente e sem invenções. Evitar estilos cyberpunk/artificiais.
- Registrar prompt e alt text no `featured_image`.
- Capas devem ser geradas prioritariamente usando a ferramenta `generate_image` do Antigravity.
- Use `dougseo cover generate --slug <slug>` (ou `--html`) apenas como fallback local se a geração via `generate_image` falhar ou estiver indisponível.
