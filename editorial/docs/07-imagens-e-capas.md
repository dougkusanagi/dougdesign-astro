# 07. Imagens e capas

Destino: `src/assets/images/posts/<slug>.png|jpg`, mínimo 1200×675, proporção 16:9. Use caminho relativo válido no `image` e registre `featured_image.prompt`, `alt` e `generated_path`.

Use como padrão o gerador de imagens integrado do Codex (`image_gen`), seguindo a skill `imagegen`, sem API key. Gere, copie o resultado para o projeto e registre prompt, caminho e alt. O gerador integrado é uma ferramenta da sessão Codex; `codex exec` e `dougseo cover generate` não oferecem essa geração raster automaticamente.

Se indisponível, falhar ou atingir quota, registre o motivo. Antigravity `generate_image` é alternativa quando disponível; DougSEO com `--svg <arquivo>` permite fallback autoral específico quando adequado ao pedido. Não substitua silenciosamente uma imagem raster solicitada por um vetor genérico. `--html` é compatibilidade, não um renderizador HTML separado.

Prefira imagem que explique o tema, sem neon/cyberpunk genérico ou texto flutuante. Logos são opcionais: só use marca real e fiel quando ajudar. Não force geração de logo que a ferramenta deforma. Ilustração conceitual não deve parecer screenshot, produto anunciado ou evidência de teste; identifique-a quando essa distinção importar.

Inspecione o arquivo visualmente antes de aprovar, seguindo a skill. Registre falhas/repetições sem declarar revisão inexistente. Alt descreve o que se vê, sem repetir promessa do título nem dizer “mesa de testes” se não houve teste real.

Em atualizações, mantenha uma capa adequada. Troque se enganosa, fora do tema ou de baixa qualidade. Confira recorte e desempenho no mobile; não adicione scripts pesados para exibir imagens.
