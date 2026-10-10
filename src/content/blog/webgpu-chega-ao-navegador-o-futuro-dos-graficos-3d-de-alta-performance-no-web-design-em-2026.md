---
title: "WebGPU nos navegadores: Chrome, Firefox e Safari já suportam, com ressalvas"
meta_description: "O WebGPU já funciona em Chrome, Edge, Firefox e Safari, mas por plataforma: Linux e Android ainda estão em andamento em parte, segundo o web.dev."
description: "O WebGPU já funciona em Chrome, Edge, Firefox e Safari, mas por plataforma: Linux e Android ainda estão em andamento em parte, segundo o web.dev."
pubDate: 2026-06-19T12:00:00
author: Maya Pixel
category: Web Design
image: ../../assets/images/posts/webgpu-chega-ao-navegador-o-futuro-dos-graficos-3d-de-alta-performance-no-web-design-em-2026.jpg
draft: false
readingTime: 5 min
slug: webgpu-chega-ao-navegador-o-futuro-dos-graficos-3d-de-alta-performance-no-web-design-em-2026
scheduled: false
updatedDate: 2026-10-10T00:42:57-03:00
featured_image:
  prompt: ""
  alt: "Capa do post sobre o suporte do WebGPU nos navegadores"
  generated_path: src/assets/images/posts/webgpu-chega-ao-navegador-o-futuro-dos-graficos-3d-de-alta-performance-no-web-design-em-2026.jpg
keyword_principal: "WebGPU suporte navegadores"
content_type: noticia
cluster: design-systems
assunto: "WebGPU nos navegadores"
intencao_busca: "saber quais navegadores e sistemas já suportam WebGPU"
decisao_do_leitor: decidir
fato_novo: "web.dev (25/11/2025): Chrome e Edge 144, Firefox 141, Safari 26, com cobertura por plataforma"
canonical_role: apoio
internal_links:
  to: []
  from_needed: []
quality_notes:
  below_word_target_reason: null
canibalizacao:
  status: legado-importado
  resumo: Conteudo importado para a stack Astro; revisar antes de republicar ou
    expandir.
fontes_oficiais:
  - https://web.dev/blog/webgpu-supported-major-browsers
---

O **WebGPU** já está disponível nos principais navegadores, mas **por plataforma**, não em toda parte. É o que o [web.dev](https://web.dev/blog/webgpu-supported-major-browsers) informou em **25 de novembro de 2025**.

## Quem suporta, segundo o web.dev

| Navegador | Versão | Onde funciona |
| --- | --- | --- |
| Chrome e Edge | 144 (a primeira versão com WebGPU é a 113) | Windows (com Direct3D 12), macOS e ChromeOS desde a 113; Android a partir do Chrome 121, no Android 12 ou mais novo com GPUs Qualcomm e ARM |
| Firefox | 141 | Windows desde a 141; macOS Tahoe 26 em processadores ARM64 desde a 145 |
| Safari | 26 | macOS Tahoe 26, iOS 26, iPadOS 26 e visionOS 26 |

## O que ainda está em andamento

- **Chromium (Chrome e Edge):** "suporte ao Linux e suporte ampliado nas plataformas existentes estão em andamento".
- **Firefox:** suporte ao Linux, ao Android e aos Macs com Intel está em andamento.

## O que isso quer dizer para quem cria sites

- **Verifique o recurso, não o navegador.** O suporte depende do sistema e da GPU, então use detecção de recurso e tenha uma alternativa quando o WebGPU não estiver disponível.
- **A tabela é de novembro de 2025.** O próprio web.dev avisa que o suporte avança; confira a página de status da implementação para o estado atual. Não verifiquei versões mais novas.

## O que mudou neste texto

A versão anterior dizia que o WebGPU "chegou ao navegador" como novidade de 2026, de forma genérica, sem versões nem plataformas. A tecnologia já estava no Chrome desde a versão 113.

**Correção editorial de 10/10/2026:** substituímos o texto por um resumo do suporte por navegador e plataforma, com a fonte do web.dev. O endereço permanece o mesmo.

## Fonte

- web.dev, "WebGPU is now supported in major browsers" (25/11/2025): https://web.dev/blog/webgpu-supported-major-browsers
