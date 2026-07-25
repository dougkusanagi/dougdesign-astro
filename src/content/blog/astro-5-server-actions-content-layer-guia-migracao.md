---
title: "Astro 5 Content Layer e Server Actions: Guia Prático de Migração e
  Performance"
slug: astro-5-server-actions-content-layer-guia-migracao
pubDate: 2026-07-25T12:00:00-03:00
author: Lila Dev
category: Programacao
draft: false
scheduled: false
meta_description: Aprenda a migrar para a Content Layer do Astro 5 e utilizar
  Server Actions com validação Zod para máxima performance e tipagem em projetos
  web.
description: Guia passo a passo de migração para a nova Content Layer do Astro 5
  e implementação de Server Actions seguras com TypeScript.
image: ../../assets/images/posts/astro-5-server-actions-content-layer-guia-migracao.jpg
featured_image:
  prompt: A modern developer environment with clean Astro framework code on
    monitor, minimalist dark theme, high tech web development aesthetic
  alt: Código de migração para a Content Layer e Server Actions no Astro 5
  generated_path: src/assets/images/posts/astro-5-server-actions-content-layer-guia-migracao.jpg
keyword_principal: astro 5 content layer server actions
content_type: guia-pratico
cluster: astro
assunto: Astro 5 Server Actions e Content Layer
intencao_busca: guia pratico de migracao e performance no astro 5
decisao_do_leitor: Atualizar a arquitetura de coleções do Astro para a versão 5
  garantindo tipagem estática e carregamento rápido de conteúdos remotos ou
  locais.
fato_novo: Nova API glob loader e Server Actions nativas integradas com esquema
  Zod sem necessidade de endpoints API manuais.
canonical_role: support
internal_links:
  to:
    - astro-7
    - astro-rotas-dinamicas-desempenho-seo
  from_needed: []
canibalizacao:
  status: clear
  resumo: Tutorial focado nas especificidades técnicas da migração de coleções no
    Astro 5.
fontes_oficiais:
  - https://docs.astro.build
updatedDate: 2026-07-25T15:13:33.855Z
---

O Astro 5 reformulou a maneira como projetos gerenciam dados estáticos e dinâmicos com a introdução da **Content Layer** e a estabilização das **Server Actions**. Nas versões anteriores, a pasta `src/content/` era restrita a arquivos locais Markdown e MDX. Com a nova arquitetura, qualquer fonte de dados — de APIs Headless CMS como Sanity e Strapi até bancos de dados SQL — pode ser consumida com validação de esquema estrita via Zod.

Se você está planejando preparar sua base de código para os próximos lançamentos ou quer entender os fundamentos que antecedem inovações futuras demonstradas na evolução do [Astro 7 e sua arquitetura de rotas](/astro-7/), este guia cobre a reestruturação das coleções e formulários.

## O que muda no arquivo `src/content.config.ts` com a nova Content Layer?

A principal mudança estrutural é a substituição do utilitário `defineCollection` baseado no sistema de arquivos implícito pelo carregador explícito `glob` ou carregadores de API personalizados.

### Como era no Astro 4 (Sintaxe antiga)

```typescript
// src/content/config.ts (Legado)
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
  }),
});

export const collections = { blog };
```

### Como fica no Astro 5 (Sintaxe atual recomendada)

```typescript
// src/content.config.ts (Astro 5+)
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
  }),
});

export const collections = { blog };
```

Note que o arquivo de configuração foi movido da subpasta para a raiz do código fonte em `src/content.config.ts`. Essa alteração reduz o tempo de build em projetos com milhares de arquivos, pois o Astro deixa de varrer diretórios não especificados.

## Como implementar Server Actions nativas para processamento de formulários seguros?

Antes das Server Actions, enviar formulários para interatividade (como um cadastro de newsletter ou comentários) exigia a criação manual de rotas de API em `src/pages/api/newsletter.ts` com manipulação de objetos `Request` e `Response`.

No Astro 5, você define a ação diretamente no servidor com validação tipada:

```typescript
// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  subscribeNewsletter: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email('Digite um e-mail válido.'),
    }),
    handler: async (input) => {
      // Integração direta com serviço de e-mail ou banco de dados
      return { success: true, message: `Inscrição confirmada para ${input.email}` };
    },
  }),
};
```

E no seu componente `.astro`, o envio é tratado de forma totalmente integrada:

```astro
---
import { actions } from 'astro:actions';
const result = Astro.getActionResult(actions.subscribeNewsletter);
---

<form method="POST" action={actions.subscribeNewsletter}>
  <input type="email" name="email" required />
  <button type="submit">Inscrever-se</button>
</form>

{result?.data?.success && <p class="sucesso">{result.data.message}</p>}
```

A combinação dessa manipulação de ações no servidor com a entrega estática de páginas garante o menor envio de JavaScript possível para o cliente. Se o seu foco é otimizar o ranqueamento e o tempo de carregamento no Google, vale aprofundar na estratégia de [rotas dinâmicas, desempenho e SEO no Astro](/astro-rotas-dinamicas-desempenho-seo/) para manter pontuações máximas no Core Web Vitals.
