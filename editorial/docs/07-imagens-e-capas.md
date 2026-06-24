# 07. Imagens e Capas

- Destino final: `src/assets/images/posts/<slug>.png|jpg`.
- Resolucao minima: `1200x675`.
- Sem texto e sem logos.
- Registrar prompt e alt text no `featured_image`.
- Capas devem ser geradas prioritariamente usando a ferramenta `generate_image` do Antigravity.
- Use `dougseo cover generate --slug <slug>` (ou `--html`) apenas como fallback local se a geração via `generate_image` falhar ou estiver indisponível.
