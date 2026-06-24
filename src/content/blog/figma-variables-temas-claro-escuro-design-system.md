---
title: "Figma Variables: Como criar temas claros e escuros no Design System"
slug: figma-variables-temas-claro-escuro-design-system
pubDate: 2026-06-24T21:39:51.000Z
updatedDate: 2026-06-24T21:42:11.211Z
author: Maya Pixel
category: Web Design
draft: false
scheduled: false
meta_description: Guia definitivo sobre Figma Variables. Aprenda a estruturar
  cores semânticas e criar modos para temas claros e escuros no seu Design
  System.
description: Guia definitivo sobre Figma Variables. Aprenda a estruturar cores
  semânticas e criar modos para temas claros e escuros no seu Design System.
image: ../../assets/images/posts/figma-variables-temas-claro-escuro-design-system.png
readingTime: 4 min
featured_image:
  prompt: A clean user interface showing a toggle switch between light mode and
    dark mode, sleek UI cards, vibrant colors, design system tokens visual
    representation, 16:9 aspect ratio, no text, no logos
  alt: Mockup de interface mostrando transição entre tema claro e tema escuro no
    Figma
  generated_path: src/assets/images/posts/figma-variables-temas-claro-escuro-design-system.png
keyword_principal: Figma Variables
content_type: guia
cluster: web-design
assunto: Figma Variables
intencao_busca: como usar para criar temas claros e escuros
decisao_do_leitor: decidir
fato_novo: Consolidação do uso de Figma Variables e integração direta com tokens
  de design via exportação JSON.
canonical_role: apoio
internal_links:
  to:
    - https://dougdesign.com.br/como-criar-um-design-system-multiplataforma-em-2026-sincronizando-figma-e-codigo-para-web-e-mobile/
    - https://dougdesign.com.br/do-desenho-ao-codigo-novas-ias-que-transformam-wireframes-feitos-a-mao-em-sites-prontos/
    - https://dougdesign.com.br/claude-3-5-sonnet-desenvolvimento-melhores-praticas/
  from_needed: []
quality_notes:
  below_word_target_reason: null
canibalizacao:
  status: aprovado
  resumo: Sem conflito de intenção na categoria Web Design.
fontes_oficiais:
  - https://help.figma.com/hc/en-us/articles/15343816063383-Guide-to-variables-in-Figma
---

# Figma Variables: Como criar temas claros e escuros no Design System

**Resposta rápida:** As Figma Variables são valores dinâmicos reutilizáveis que substituíram a necessidade de duplicar componentes para diferentes temas de cor. Para estruturar temas claro (Light Mode) e escuro (Dark Mode) de forma profissional, você deve criar uma coleção de variáveis baseada em tokens semânticos (ex: `bg-primary`, `text-secondary`) e, em seguida, adicionar múltiplos modos (Modes) a essa coleção. Isso permite que qualquer frame herde e alterne as cores automaticamente ao mudar as configurações de exibição do contêiner.

## A diferença entre Cores Primitivas e Semânticas

O erro mais comum na transição para o Figma Variables é tentar aplicar as cores primitivas (como `blue-500` ou `white`) diretamente nos elementos da tela. A arquitetura recomendada para Design Systems estruturados exige duas camadas distintas:

1. **Tokens Primitivos:** Onde você define a paleta global de cores física da marca (ex: `brand-blue = #0055FF`, `slate-900 = #0F172A`).
2. **Tokens Semânticos:** Onde você atribui papéis funcionais para as cores baseadas no contexto (ex: `bg-page` recebe `slate-50` no modo claro e `slate-900` no modo escuro).

Ao construir as telas, os seus componentes devem referenciar exclusivamente os tokens semânticos. Isso garante que a transição de cor ocorra de forma harmônica e controlada.

## Como estruturar os Modos no Figma

Para criar o switch de temas, abra o painel **Local Variables** e clique no ícone de adição para criar colunas extras de variáveis (os modos). Nomeie a primeira coluna como `Light` e a segunda como `Dark`. 

A partir daí, basta mapear cada variável semântica para apontar para a respectiva cor primitiva do tema. Por exemplo:
- A variável `text-main` apontará para `slate-900` na coluna `Light` e para `white` na coluna `Dark`.

Ao finalizar, ao arrastar qualquer frame ou componente para dentro de uma seção configurada com o modo correspondente, o Figma reajustará toda a paleta instantaneamente, sem que você precise alterar uma única camada de cor manualmente.

## Integração de Design com Código

Essa facilidade do Figma Variables se estende ao desenvolvimento de código-fonte. Projetos maduros de front-end, como discutimos no guia para criar um [design system multiplataforma](https://dougdesign.com.br/como-criar-um-design-system-multiplataforma-em-2026-sincronizando-figma-e-codigo-para-web-e-mobile/), exportam essas variáveis diretamente em formato JSON.

Isso permite que as mesmas cores definidas no Figma alimentem frameworks utilitários ou APIs de geração de código visual automática, como as novas ferramentas de [conversão de wireframes em código](https://dougdesign.com.br/do-desenho-ao-codigo-novas-ias-que-transformam-wireframes-feitos-a-mao-em-sites-prontos/). O trabalho do designer de UI agora está mais próximo do que nunca da arquitetura lógica desenvolvida em copilotos como o [Claude 3.5 Sonnet](https://dougdesign.com.br/claude-3-5-sonnet-desenvolvimento-melhores-praticas/).

## Minha leitura

O uso de Figma Variables com modos é uma obrigatoriedade para qualquer profissional que trabalha com interfaces escaláveis. Ele elimina o retrabalho crônico de manter layouts duplicados e estabelece um canal direto de comunicação semântica de cores com os desenvolvedores de front-end.

## Leia também

- [Como criar um design system multiplataforma sincronizando Figma e código](https://dougdesign.com.br/como-criar-um-design-system-multiplataforma-em-2026-sincronizando-figma-e-codigo-para-web-e-mobile/)
- [Do desenho ao código: novas IAs que transformam wireframes feitos a mão em sites prontos](https://dougdesign.com.br/do-desenho-ao-codigo-novas-ias-que-transformam-wireframes-feitos-a-mao-em-sites-prontos/)
- [Claude 3.5 Sonnet: Melhores Práticas para Desenvolvimento de Software](https://dougdesign.com.br/claude-3-5-sonnet-desenvolvimento-melhores-praticas/)

## Fonte

- Guia oficial de variáveis do Figma: https://help.figma.com/hc/en-us/articles/15343816063383-Guide-to-variables-in-Figma
