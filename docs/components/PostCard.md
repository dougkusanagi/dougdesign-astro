# PostCard

O componente `PostCard` é responsável por renderizar resumos de postagens na listagem principal do feed do blog.

## Interface do Componente (Props)

| Propriedade | Tipo | Padrão | Descrição |
|---|---|---|---|
| `post` | `BlogEntry` | **Obrigatório** | Objeto contendo os dados e metadados do post carregado de coleções do Astro. |

## Exemplo de Uso

```astro
---
import { getCollection } from 'astro:content';
import PostCard from '../components/PostCard.astro';

const posts = await getCollection('blog');
---
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  {posts.map(post => <PostCard post={post} />)}
</div>
```
