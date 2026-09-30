## Design System (layout v2 · beta)

Fonte única de verdade: `src/styles/global.css`. Componentes usam **tokens semânticos** (não cores fixas), então claro/escuro funcionam sem `dark:` espalhado pelo HTML.

## Princípios

1.  **Leitura primeiro.** Superfícies calmas, texto em tom suave (nunca preto/branco puro) e medida de ~65 caracteres nos artigos.
2.  **Azul de marca só em elementos grandes ou de ação:** mega menu, faixa "Explore por tema", cabeçalho de categoria, newsletter, botão primário.
3.  **Sem animação contínua.** Movimento só em resposta à interação e respeitando `prefers-reduced-motion`.
4.  **Desempenho como requisito:** sem carrossel em JavaScript, imagens com proporção fixa, fontes com pré-carga só do essencial, `content-visibility` nas seções longas.

## Tokens

| Token (utilitário) | Uso |
|---|---|
| `canvas` | Fundo da página |
| `surface` / `surface-2` | Cartões e áreas rebaixadas |
| `line` / `line-strong` | Divisórias e bordas |
| `ink` / `ink-2` / `ink-3` | Texto forte, corrido e secundário |
| `accent` / `accent-strong` / `accent-soft` | Links, ações e realces sobre superfícies |
| `brand-50 … brand-950` | Escala da marca; `brand-600` = `#0866fa` |

Cada categoria tem um matiz próprio (`data-cat="games"` etc.) usado só no marcador de categoria.

## Classes utilitárias do sistema

`.wrap` (container), `.eyebrow`, `.h-display`, `.h-section`, `.meta`, `.cat`, `.btn` (+ `-primary`, `-ink`, `-outline`, `-white`), `.icon-btn`, `.chip`, `.field`, `.panel`, `.thumb`, `.snap-row`, `.badge-beta`, `.stretched`, `.hover-title`, `.prose`.

## Componentes

`Header` (com mega menu e busca), `BetaNotice`, `Footer`, `Logo`, `PostCard`, `SectionHeading`, `PageHero`, `Pagination`, `CategoryBand`, `Picks`, `Hero`, `Feed`, `Sidebar`, `Newsletter`, `MuralJobs`, `JobCard`, `LivePixWidget`, `AdSense`, `ConsentBanner`, `GiscusComments`, `ReadingProgressBar`.

## Taxonomia

`src/lib/nav.ts` concentra as categorias exibidas (rótulos com acento, descrições, contagens e últimos posts). Novas categorias entram ali.
