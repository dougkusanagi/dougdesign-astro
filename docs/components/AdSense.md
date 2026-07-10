# AdSense

O componente `AdSense` renderiza blocos de anúncios do Google AdSense de forma otimizada para performance (Performance-First loading).

## Interface do Componente (Props)

| Propriedade | Tipo | Padrão | Descrição |
|---|---|---|---|
| `slot` | `string` | **Obrigatório** | Identificador do slot de anúncio fornecido pelo Google AdSense. |
| `format` | `'auto' \| 'fluid'` | `'auto'` | O formato geométrico do bloco de anúncios. |
| `responsive` | `boolean` | `true` | Habilita blocos responsivos. |

## Carregamento Otimizado (Performance-First)

Para evitar impactos negativos na nota do Lighthouse e nas métricas de Core Web Vitals (FCP/LCP), o script oficial do Google AdSense (`adsbygoogle.js`) não é carregado no primeiro carregamento de página. O carregamento do anúncio ocorre utilizando um **Intersection Observer** ou de forma postergada (lazy-load) somente quando o usuário interage com o site ou quando o elemento está prestes a entrar na tela.

## Exemplo de Uso

```astro
---
import AdSense from '../components/AdSense.astro';
---
<div class="sidebar-ad">
  <AdSense slot="1234567890" format="auto" />
</div>
```
