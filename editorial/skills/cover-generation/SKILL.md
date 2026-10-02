# Gerar ou revisar capa

Use ao criar/trocar capa; em atualização preserve a existente se adequada.

1. Defina imagem específica ao assunto, 1200×675 ou maior, sem estética neon/cyberpunk genérica ou texto flutuante. Logos são opcionais e precisam ser fiéis; não force uma marca que o gerador deforma.
2. Gere com o Codex CLI: `scripts/codex-cover.sh <slug> "<cena>"` (usa `codex exec` + `image_gen`, sem API key) e salve `src/assets/images/posts/<slug>.jpg`. Registre prompt, caminho e alt. Se o Codex falhar ou atingir a quota, registre o motivo; Antigravity `generate_image` ou um cartão informativo local são alternativas quando adequadas. Não substitua imagem raster solicitada por vetor genérico nem use SVG como capa.
3. Inspecione o arquivo local visualmente. A skill solicita revisão independente por subagente quando houver ferramenta de delegação disponível, usando a ferramenta real da sessão (não presumir `invoke_subagent`). Envie caminho e critérios: pertinência, fidelidade de logos, ausência de deformações/texto estranho e risco de parecer prova de teste/lançamento fictício.
4. Se houver reprovação, ajuste o prompt/composição até duas vezes, depois simplifique ou use fallback específico. Quando não houver delegação, faça revisão visual direta e registre essa limitação; não invente aprovação independente.
5. Confira arquivo final, dimensões, import no frontmatter e alt descritivo. Identifique ilustração conceitual quando necessário e não a chame de screenshot/foto de teste. Confira recorte mobile quando afetado.
