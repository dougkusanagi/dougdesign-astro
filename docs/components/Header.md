## Header (mega menu e busca)

Cabeçalho fixo que recolhe ao rolar para baixo e reaparece ao rolar para cima. Inclui:

*   **Explorar** — abre o mega menu, um painel azul de marca com todas as categorias, prévia das publicações recentes da categoria em foco (desktop) e atalhos. No celular o painel ocupa a tela toda, abaixo da barra superior.
*   **Busca instantânea** — botão de lupa, `Ctrl/⌘ + K` ou `/`. O índice (`/search-index.json`) só é baixado na primeira abertura. Sem JavaScript, o botão leva a `/posts/?search=focus`.
*   **Tema** — botão `#theme-toggle` alterna claro/escuro e guarda a escolha em `localStorage` (`theme`).

## Acessibilidade

*   `aria-expanded` e `aria-controls` nos botões do menu; `Esc` fecha e devolve o foco.
*   Links do painel só recebem foco quando ele está aberto.
*   A busca usa `<dialog>` modal, navegação por setas e `Enter`.

## Dados

As categorias e os posts recentes vêm de `getCategoryStats()` (`src/lib/nav.ts`), calculado em build.
