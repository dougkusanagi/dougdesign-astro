---
title: "Figma Variables: Como criar temas claros e escuros no Design System"
slug: figma-variables-temas-claro-escuro-design-system
pubDate: 2026-06-24T21:39:51.000Z
updatedDate: 2026-09-30T22:00:00-03:00
author: Maya Pixel
category: Web Design
draft: false
scheduled: false
meta_description: "Como criar temas claro e escuro no Figma com Variables: tokens primitivos e semânticos, modos, aplicação em frames e como levar os valores ao código."
description: "Como criar temas claro e escuro no Figma com Variables: tokens primitivos e semânticos, modos, aplicação em frames e como levar os valores ao código."
image: ../../assets/images/posts/figma-variables-temas-claro-escuro-design-system.png
readingTime: 4 min
featured_image:
  prompt: A clean user interface showing a toggle switch between light mode and
    dark mode, sleek UI cards, vibrant colors, design system tokens visual
    representation, 16:9 aspect ratio, no text, no logos
  alt: Mockup de interface mostrando transição entre tema claro e tema escuro no
    Figma
  generated_path: src/assets/images/posts/figma-variables-temas-claro-escuro-design-system.png
keyword_principal: "Figma Variables: Como criar temas claros e escuros no Design System"
content_type: guia
cluster: web-design
assunto: "Figma Variables: Como criar temas claros e escuros no Design System"
intencao_busca: como usar para criar temas claros e escuros
decisao_do_leitor: decidir
fato_novo: "Revisão em 30/09/2026 com a documentação oficial de modos do Figma e a restrição da Variables REST API a planos Enterprise."
canonical_role: apoio
internal_links:
  to:
    - https://www.dougdesign.com.br/como-criar-um-design-system-multiplataforma-em-2026-sincronizando-figma-e-codigo-para-web-e-mobile/
  from_needed: []
quality_notes:
  below_word_target_reason: null
canibalizacao:
  status: aprovado
  resumo: Sem conflito de intenção na categoria Web Design.
fontes_oficiais:
  - https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma
  - https://help.figma.com/hc/en-us/articles/15343816063383-Guide-to-variables-in-Figma
  - https://developers.figma.com/docs/rest-api/variables

---

**Resposta rápida:** para criar temas claro e escuro no Figma, crie uma coleção de Variables com tokens **semânticos** (por exemplo `bg-page`, `text-main`), adicione um **modo** para cada tema (`Light` e `Dark`) e aponte cada token para a cor primitiva certa em cada modo. Depois, aplique o modo ao frame: tudo que estiver dentro troca de cor sem duplicar telas ou componentes. O passo a passo abaixo segue a documentação oficial do Figma ([guia de variáveis](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma) e [modos de variáveis](https://help.figma.com/hc/en-us/articles/15343816063383-Guide-to-variables-in-Figma)).

## Primitivas e semânticas: por que separar

O erro mais comum é aplicar cores cruas (como `blue-500` ou `white`) direto nos elementos. Com dois níveis, o tema vira uma troca de apontamento:

1. **Tokens primitivos:** a paleta bruta da marca (ex.: `brand-blue = #0055FF`, `slate-900 = #0F172A`).
2. **Tokens semânticos:** papéis funcionais, como `bg-page` ou `text-main`. No modo claro, `bg-page` aponta para `slate-50`; no escuro, para `slate-900`.

O Figma permite que uma variável **referencie** outra, e é isso que faz a camada semântica funcionar. Os componentes da tela devem usar só os tokens semânticos.

## Passo a passo para criar os modos

1. Abra a visualização de **Variables** e selecione (ou crie) a coleção dos tokens semânticos.
2. Clique em **New variable mode**, à direita dos cabeçalhos das colunas. O Figma duplica os valores da primeira coluna no novo modo.
3. Renomeie os modos, por exemplo `Light` e `Dark`.
4. Para cada token semântico, escolha a cor primitiva de cada modo. Exemplo: `text-main` aponta para `slate-900` em `Light` e para `white` em `Dark`.

Quantos modos cabem em uma coleção **depende do seu plano**, segundo o Figma. Confira na página de planos antes de desenhar um sistema com muitos temas (por exemplo, claro, escuro e alto contraste).

## Aplicando o modo a um frame

1. Selecione o frame (ou camada, componente, seção).
2. Na barra lateral direita, em **Appearance**, clique em **Apply variable mode**.
3. Passe o mouse sobre a coleção e escolha o modo.

O modo aparece como uma etiqueta ao lado do nome da camada, no painel de camadas. Por padrão os objetos ficam em **Auto**: herdam o modo do contêiner pai e, se nenhum pai definir um, usam o modo padrão da coleção. Por isso basta aplicar `Dark` em um frame raiz para que tudo dentro acompanhe.

## Do Figma para o código

Dá para alimentar o código com os mesmos valores, mas o caminho depende do plano:

- **Variables REST API:** o Figma documenta endpoints para consultar, criar, atualizar e apagar variáveis ([documentação](https://developers.figma.com/docs/rest-api/variables)). Segundo a documentação e discussões oficiais do fórum, o acesso exige um assento completo em uma organização no plano Enterprise.
- **Plugins:** existem plugins da comunidade que exportam variáveis para JSON ou CSS. Avalie a manutenção e as permissões de cada um antes de usar em um projeto da empresa.
- **Convenção de nomes:** mantenha nomes de tokens iguais no Figma e no código (por exemplo `text-main`). Isso reduz a tradução manual. Para um fluxo completo de sincronização, veja o guia de [design system multiplataforma](https://www.dougdesign.com.br/como-criar-um-design-system-multiplataforma-em-2026-sincronizando-figma-e-codigo-para-web-e-mobile/).

## Erros que valem evitar

- **Tokens com nome de cor** (`blue-header`). Prefira nomes de função (`bg-header`).
- **Semânticos sem equivalente em todos os modos.** Um token sem valor no modo escuro quebra a tela justamente nesse tema.
- **Cores crus em um componente.** Basta um para o tema parecer "furado".
- **Só testar o modo claro.** Reveja contraste de texto nos dois modos.

## Minha leitura

Em sistemas com mais de um tema, Variables com modos tendem a ser mais simples de manter do que layouts duplicados, porque a decisão de cor fica em um único lugar. Para projetos pequenos, com um tema só, a separação em primitivos e semânticos ainda ajuda, mas o ganho é menor. Esta avaliação é uma opinião editorial, não uma medição.

## Limites desta revisão

Conferimos os procedimentos na documentação oficial do Figma em 30/09/2026. Não testamos a criação do sistema em um arquivo real nem os plugins citados, e a interface e os limites por plano podem mudar.
