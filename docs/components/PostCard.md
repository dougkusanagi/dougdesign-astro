## PostCard

O componente `PostCard` renderiza o resumo de uma publicação em quatro formatos. O título é o único link do cartão e usa um pseudo-elemento para tornar a área inteira clicável (melhor para leitores de tela e SEO do que um link vazio sobreposto).

## Interface do Componente (Props)

| Propriedade | Tipo | Padrão | Descrição |
|---|---|---|---|
| `post` | `BlogEntry` | **Obrigatório** | Entrada da coleção `blog`. |
| `variant` | `'lead' \| 'card' \| 'row' \| 'compact'` | `card` | Formato do cartão (ver abaixo). Os nomes antigos `hero`, `sidebar`, `highlight` e `feed` continuam aceitos. |
| `loading` | `'lazy' \| 'eager'` | `lazy` | Use `eager` apenas para imagens acima da dobra. |
| `fetchpriority` | `'high' \| 'low' \| 'auto'` | `auto` | Use `high` apenas na imagem candidata a LCP. |
| `headingLevel` | `'h1' \| 'h2' \| 'h3'` | `h2` (lead) / `h3` | Nível do título, para manter a hierarquia da página. |

## Variantes

*   **lead** — manchete principal da home: imagem grande, título em destaque, resumo e autor.
*   **card** — vertical (imagem, categoria, título, resumo, data). Usado em grades de categoria, arquivo, autor e relacionados.
*   **row** — linha do feed: texto à esquerda e miniatura à direita (no celular, miniatura quadrada e resumo oculto).
*   **compact** — título curto com miniatura pequena, para listas laterais.

## Exemplo de Uso

```astro
---
import { getPublishedPosts } from '../lib/blog';
import PostCard from '../components/PostCard.astro';

const posts = await getPublishedPosts();
---
<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
  {posts.slice(0, 3).map((post) => <PostCard post={post} variant="card" />)}
</div>
```
