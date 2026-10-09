---
title: "AI APIs do Chrome: quais já estão estáveis e quais ainda não"
meta_description: "Translator, Language Detector e Summarizer estão estáveis no Chrome 138; Prompt só em extensões; Writer, Rewriter e Proofreader em teste. Veja o que usar."
description: "Translator, Language Detector e Summarizer estão estáveis no Chrome 138; Prompt só em extensões; Writer, Rewriter e Proofreader em teste. Veja o que usar."
pubDate: 2026-04-23T20:07:07
author: Guto Tech
category: Programacao
image: ../../assets/images/posts/chrome-built-in-ai-apis-o-que-ja-esta-pronto-para-uso.jpg
draft: false
readingTime: 4 min
slug: chrome-built-in-ai-apis-o-que-ja-esta-pronto-para-uso
scheduled: false
updatedDate: 2026-10-09T09:05:39
featured_image:
  prompt: ""
  alt: "Chrome Built-in AI APIs: o que já está pronto para uso"
  generated_path: src/assets/images/posts/chrome-built-in-ai-apis-o-que-ja-esta-pronto-para-uso.jpg
keyword_principal: "Chrome Built-in AI APIs: o que já está pronto para uso"
content_type: noticia
cluster: programacao
assunto: "Chrome Built-in AI APIs: o que já está pronto para uso"
intencao_busca: Resumo do que já está em estável nas AI APIs do Chrome e por
decisao_do_leitor: decidir
fato_novo: "Chrome Built-in AI APIs: o que já está pronto para uso"
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
  - https://developer.chrome.com/blog/ai-api-updates-io25
  - https://developer.chrome.com/docs/ai/built-in-apis
---

**Resposta direta:** segundo a página oficial do Chrome for Developers (atualizada em 12 de setembro de 2025), três **AI APIs** estão estáveis desde o **Chrome 138**: **Translator**, **Language Detector** e **Summarizer**. O **Prompt API** está estável apenas em extensões do Chrome. **Writer**, **Rewriter** e **Proofreader** continuam em teste (developer trial ou origin trial). Veja o status na tabela e confira a página oficial antes de decidir, porque ele muda a cada versão.

O anúncio inicial, no Google I/O 2025, está no [post oficial de 20 de maio de 2025](https://developer.chrome.com/blog/ai-api-updates-io25).

## Status de cada API

| API | Na web | Em extensões |
|---|---|---|
| Translator | estável (Chrome 138) | estável (Chrome 138) |
| Language Detector | estável (Chrome 138) | estável (Chrome 138) |
| Summarizer | estável (Chrome 138) | estável (Chrome 138) |
| Prompt | listado para o Chrome 148 | estável (Chrome 138) |
| Writer | developer trial | developer trial |
| Rewriter | developer trial | developer trial |
| Proofreader | developer trial (a página também cita origin trial) | developer trial |

Fonte: [Built-in AI APIs, Chrome for Developers](https://developer.chrome.com/docs/ai/built-in-apis). A página não detalha datas por API nem requisitos de hardware; esses ficam na seção "Get started" da documentação do Chrome. Algumas APIs também podem exigir entrar no Early Preview Program, sem que a página diga quais.

## Por que isso importa

Estas APIs rodam modelos no próprio navegador, perto do usuário. Isso interessa para desempenho, privacidade e custo, e é uma alternativa a chamar sempre um modelo remoto.

## O impacto prático para times web

Essas APIs não servem apenas para demos bonitas. Elas podem influenciar fluxos reais como resumo de conteúdo, adaptação de texto, revisão, tradução e assistentes embutidos em produto. Isso muda a conversa para quem trabalha com SaaS, dashboards, documentação, educação e produtividade.

Também coloca uma pressão boa sobre design e front-end: se a IA está mais próxima da interface, a experiência de uso precisa ficar melhor. Não basta “ter um botão de IA”. É preciso integrar bem, explicar limites e evitar fricção.

## Onde eu tomaria cuidado

Ter API disponível não significa que qualquer caso de uso está resolvido. Ainda existem variações de suporte, estágios diferentes de maturidade e decisões importantes de fallback. O caminho correto é tratar essas capacidades como oportunidade de produto, não como atalho irresponsável.

Para conteúdo editorial, a pauta também ajuda a responder uma curiosidade crescente: como a IA vai ficar mais nativa na web?

## Minha leitura editorial

Essa foi uma das notícias mais interessantes do I/O 2025 para quem trabalha com interface, browser e experiência digital. Ela é menos chamativa para o público geral, mas tem mais impacto estrutural para quem constrói produto.

Além disso, encaixa muito bem no tipo de busca que costuma amadurecer com o tempo. Hoje a pessoa procura por curiosidade; amanhã procura para implementar.

## Quem deve acompanhar mais de perto

- front-end e full stack;

- times de produto web;

- quem projeta experiências com IA embutida;

- desenvolvedores de extensões e ferramentas de produtividade.

## Leia também no Doug Design

- [Firefly AI Assistant da Adobe](https://www.dougdesign.com.br/firefly-ai-assistant-da-adobe-o-que-ele-faz-e-por-que-isso-importa/)

- [Figma, IA e design-to-code em 2026](https://www.dougdesign.com.br/do-desenho-ao-codigo-novas-ias-que-transformam-wireframes-feitos-a-mao-em-sites-prontos/)

## Perguntas frequentes

### Essas APIs já estão prontas para produção?

Translator, Language Detector e Summarizer estão estáveis desde o Chrome 138; as demais ainda não. Mesmo as estáveis têm limites de suporte, então a decisão de uso em produção depende do caso, do suporte e da estratégia de fallback.

### Qual é a vantagem da IA no navegador?

Maior integração com a interface, potencial de menor latência e experiências mais naturais no ambiente web.

### Essa pauta é relevante para SEO?

Sim, porque combina notícia oficial, termos técnicos claros e implicações práticas para quem desenvolve na web.

## Fonte oficial

- [Chrome for Developers: AI APIs are in stable and origin trials](https://developer.chrome.com/blog/ai-api-updates-io25)
