## AdSense

O componente `AdSense` renderiza blocos de anúncios do Google AdSense de forma otimizada para performance (Performance-First loading).

## Interface do Componente (Props)

| Propriedade | Tipo | Padrão | Descrição |
|---|---|---|---|
| `slot` | `string` | **Obrigatório** | Identificador do slot de anúncio fornecido pelo Google AdSense. |
| `format` | `string` | — | Valor de `data-ad-format`, por exemplo `auto` ou `fluid`. |
| `fullWidthResponsive` | `boolean` | `false` | Define `data-full-width-responsive="true"`. |
| `layout` | `string` | — | Define `data-ad-layout`, usado pelo bloco In-article. |
| `layoutKey` | `string` | — | Define `data-ad-layout-key`, usado pelo bloco In-feed. |

## Carregamento Otimizado (Performance-First)

Para evitar impactos negativos na nota do Lighthouse e nas métricas de Core Web Vitals (FCP/LCP), o script oficial do Google AdSense (`adsbygoogle.js`) só é carregado depois que o visitante autoriza anúncios. O Layout inicializa cada bloco uma única vez e observa blocos adicionados depois por navegação do Astro ou pelo conteúdo do artigo.

Quando o Google informa `data-ad-status="filled"`, o rótulo de carregamento é removido. Se informa `data-ad-status="unfilled"`, o contêiner é recolhido para não deixar uma área vazia ocupando a página.

## Exemplo de Uso

```astro
---
import AdSense from '../components/AdSense.astro';
---
<div class="sidebar-ad">
  <AdSense slot="1234567890" format="auto" />
</div>
```
