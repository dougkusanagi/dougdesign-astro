---
title: 'Astro 7: como combinar páginas estáticas e SSR por rota'
slug: astro-7
pubDate: 2026-07-18 18:00:00-03:00
updatedDate: '2026-10-02T20:34:41-03:00'
author: Lila Dev
category: Programacao
draft: false
scheduled: false
meta_description: Configure páginas estáticas e SSR no Astro 7 sem output hybrid. Exemplo com adaptador Node, prerender por
  rota e verificação após o build.
description: Exemplo reproduzível para manter o conteúdo estático e renderizar uma rota sob demanda com o adaptador Node.
image: ../../assets/images/posts/astro-7-v2.jpg
readingTime: 5 min
featured_image:
  prompt: 'Ilustração editorial tridimensional de duas rotas representadas por trilhas de pequenos blocos: uma termina em
    pilhas de páginas em branco e outra em uma pequena máquina de servidor ligada a uma página vazia, sobre mesa azul clara,
    desenvolvimento web com páginas estáticas e resposta do servidor, nenhuma tela com código e nenhum foguete ou logotipo.
    Sem texto, logos ou marcas.'
  alt: Ilustração conceitual de duas trilhas de blocos ligadas a páginas empilhadas e a um servidor sobre fundo azul
  generated_path: src/assets/images/posts/astro-7-v2.jpg
keyword_principal: Astro 7
content_type: tutorial
cluster: astro-renderizacao
assunto: Astro 7
intencao_busca: configurar páginas estáticas e SSR por rota sem output hybrid
decisao_do_leitor: escolher a renderização por rota e validar o comportamento no build e no servidor
fato_novo: Configuração hybrid removida do tutorial e substituída por exemplo executado com Astro 7.3.5 e adaptador Node 11.1.6,
  sem garantias de SEO ou Core Web Vitals.
canonical_role: pilar
internal_links:
  to: []
  from_needed: []
canibalizacao:
  status: revisado
  resumo: Tutorial por rota distinto do post de novidades e do guia getStaticPaths/rotas dinâmicas, lidos manualmente; esses
    legados ainda requerem revisão antes de serem recomendados. Sem nova URL ou redirect.
fontes_oficiais:
- https://docs.astro.build/en/guides/upgrade-to/v5/
- https://docs.astro.build/en/guides/on-demand-rendering/
- https://docs.astro.build/en/guides/integrations-guide/node/
- https://docs.astro.build/en/basics/astro-components/
---

**No Astro 7, mantenha a saída estática e adicione `export const prerender = false` às rotas que precisam executar no servidor.** É necessário um adaptador compatível com o ambiente de hospedagem. Você não deve usar `output: 'hybrid'`: esse valor foi removido no Astro 5.

**Correção em 02/10/2026:** a versão anterior ensinava a opção removida e prometia notas máximas de Core Web Vitals. A configuração foi substituída por um exemplo executado; as garantias de performance e ranqueamento foram retiradas.

## Quando uma rota precisa de servidor?

Uma página que mostra conteúdo editorial pode ser gerada no build. Já uma resposta que depende do parâmetro da requisição pode precisar de renderização sob demanda. A pergunta prática é: “este HTML pode ser preparado antes do visitante chegar ou precisa consultar dados naquele momento?”.

Um campo de busca não exige SSR por si só: uma busca local no navegador pode ser suficiente. O exemplo abaixo apenas demonstra que o servidor lê uma query diferente a cada requisição. Ele não implementa busca em banco de dados, login, autorização ou cache.

A [migração oficial para Astro 5](https://docs.astro.build/en/guides/upgrade-to/v5/) explica a união do comportamento híbrido ao modo estático. “Combinar estático e servidor” continua sendo possível; a configuração com aquele nome deixou de existir.

## Ambiente e instalação do exemplo

Executamos este projeto isolado em 02/10/2026 com **Node 22.22.1, Astro 7.3.5 e `@astrojs/node` 11.1.6**. As versões abaixo permitem reproduzir o ambiente consultado; confira compatibilidade antes de trocar uma delas no seu projeto.

Em uma pasta nova, crie `package.json`:

```json
{
  "name": "doug-render-example",
  "private": true,
  "type": "module",
  "dependencies": {
    "astro": "7.3.5",
    "@astrojs/node": "11.1.6"
  }
}
```

Depois execute `npm install`. Salve o lockfile gerado e use `npm ci` nas próximas instalações reproduzíveis. O [exemplo completo no repositório](https://github.com/dougkusanagi/dougdesign-astro/tree/master/editorial/examples/astro-renderizacao) inclui os arquivos e o lockfile utilizados.

## Configure o adaptador sem output hybrid

Crie `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'static',
  adapter: node({ mode: 'standalone' }),
});
```

A [documentação do adaptador Node](https://docs.astro.build/en/guides/integrations-guide/node/) descreve o modo `standalone`, que gera um servidor executável. Esse é o ambiente testado aqui. Para Vercel, Netlify ou outro destino, use o adaptador correspondente e valide a implantação naquele ambiente; trocar a importação não é evidência de deploy bem-sucedido.

## Crie uma página estática e outra sob demanda

Em `src/pages/index.astro`, use:

```astro
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Página estática</title>
  </head>
  <body>
    <h1>Página estática</h1>
    <a href="/pesquisa?q=Astro">Consultar Astro</a>
  </body>
</html>
```

Em `src/pages/pesquisa.astro`, adicione:

```astro
---
export const prerender = false;
const query = Astro.url.searchParams.get('q') ?? '';
---
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Consulta dinâmica</title>
  </head>
  <body>
    <h1>Consulta dinâmica</h1>
    <p>Termo recebido: {query}</p>
    <a href="/">Voltar</a>
  </body>
</html>
```

O código entre `---` é o frontmatter do [componente Astro](https://docs.astro.build/en/basics/astro-components/). A interpolação `{query}` apresenta o valor como texto; não use `set:html` para inserir esse parâmetro como HTML.

## Verifique a saída de produção

Compile com `npx astro build`. Em seguida, execute o servidor construído:

```bash
HOST=127.0.0.1 PORT=4327 node dist/server/entry.mjs
```

Em outro terminal, faça duas requisições:

```bash
curl 'http://127.0.0.1:4327/pesquisa?q=Astro'
curl 'http://127.0.0.1:4327/pesquisa?q=Outro'
```

Na execução do blog, ambas retornaram HTTP 200 e textos diferentes: `Termo recebido: Astro` e `Termo recebido: Outro`. Também conferimos que `dist/client/index.html` foi gerado e que não havia `dist/client/pesquisa/index.html`: a segunda rota foi atendida pelo servidor.

Uma requisição com `%3Cscript%3E` exibiu o texto escapado `&lt;script&gt;` no HTML recebido. Esse teste cobre a interpolação deste exemplo; não é uma auditoria completa de segurança da aplicação.

Depois de conferir, encerre o servidor com Ctrl+C. Para hospedagem pública, configure o processo e a rede conforme seu provedor; o endereço local acima foi usado apenas no teste.

## E se a maioria das páginas for dinâmica?

A [documentação de renderização sob demanda](https://docs.astro.build/en/guides/on-demand-rendering/) permite `output: 'server'` para renderizar por padrão no servidor. Nesse caso, exporte `prerender = true` nas páginas que devem ser estáticas. O critério permanece o mesmo: escolha por necessidade de dados, não por uma promessa abstrata de SEO.

Este teste foi executado no modo estático com uma exceção dinâmica. A alternativa com saída `server` está documentada pela equipe Astro; não a apresentamos como uma segunda implantação testada neste artigo.

## Erros que vale conferir antes do deploy

- **Ainda existe `output: 'hybrid'`:** remova a opção antiga e escolha `static` ou `server`.
- **A rota exige servidor, mas falta adaptador:** configure o adaptador do runtime e repita o build.
- **A query não altera uma página estática:** confirme se você precisa de execução por requisição e se a rota exporta `prerender = false`.
- **Funciona no desenvolvimento, mas falha publicado:** execute a saída de produção e confira o ambiente de hospedagem; uma rota SSR não pode ser servida apenas como pasta de HTML.

SSG e SSR não garantem métricas máximas. Imagens, fontes, scripts, layout, cache e tempo de resposta continuam afetando a experiência. O resultado demonstrado aqui é o comportamento das duas rotas, sem benchmark de Core Web Vitals nem medição de tráfego.

*Capa: ilustração conceitual gerada por IA sobre páginas estáticas e resposta do servidor.*
