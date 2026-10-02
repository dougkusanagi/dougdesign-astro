## AdSense

O componente `AdSense` renderiza blocos de anúncios do Google AdSense de forma otimizada para performance (Performance-First loading) e integrada ao layout: rótulo "Publicidade" discreto, fundo neutro e altura reservada para evitar deslocamento de layout (CLS).

## Interface do Componente (Props)

| Propriedade | Tipo | Padrão | Descrição |
|---|---|---|---|
| `slot` | `string` | **Obrigatório** | Identificador do slot de anúncio fornecido pelo Google AdSense. |
| `format` | `string` | — | Valor de `data-ad-format`, por exemplo `auto` ou `fluid`. |
| `fullWidthResponsive` | `boolean` | `false` | Define `data-full-width-responsive="true"`. |
| `layout` | `string` | — | Define `data-ad-layout`, usado pelo bloco In-article. |
| `layoutKey` | `string` | — | Define `data-ad-layout-key`, usado pelo bloco In-feed. |
| `size` | `'leaderboard' \| 'rectangle' \| 'tall' \| 'infeed' \| 'article'` | `leaderboard` | Altura mínima reservada enquanto o anúncio carrega (ver `global.css`, seção Publicidade). |
| `class` | `string` | — | Classes aplicadas ao contêiner. Se o bloco for ocultado, tudo que estiver no `class` (margens, bordas) some junto. |

## Carregamento Otimizado (Performance-First)

O script oficial carrega independentemente da escolha no banner de cookies; o consentimento controla armazenamento e personalização. Antes de iniciar scripts externos, o Layout aguarda a decodificação da imagem principal (com limite de 2,5 s), duas pinturas e uma oportunidade ociosa (limite de 1 s).

* Unidades manuais são solicitadas quando ficam a até 300 px da área visível; cada bloco é inicializado uma vez.
* Blocos pendentes reservam a altura de `size`.
* Respostas `unfilled` e `unfill-optimized` recolhem o contêiner. O prazo de 10 s começa quando a unidade é solicitada, não na abertura da página.
* Anúncios automáticos continuam sob o controle da configuração do dono no AdSense. Podem inserir conteúdo e provocar CLS; este carregamento não garante sua eliminação.

## Posicionamento

| Página | Posições |
|---|---|
| Home | Logo após os destaques; meio do feed (2); barra lateral (retângulo + bloco fixo que acompanha a rolagem). |
| Artigo | Dentro do texto (após o 3º parágrafo e, em textos longos, de novo mais adiante); após o artigo; barra lateral (retângulo + bloco fixo). |
| Listagens | Abaixo do cabeçalho e no meio da grade. |

## Exemplo de Uso

```astro
---
import AdSense from '../components/AdSense.astro';
---
<AdSense slot="1234567890" format="auto" fullWidthResponsive={true} size="rectangle" class="my-8" />
```
