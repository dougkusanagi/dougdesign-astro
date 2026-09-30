## BetaNotice

Aviso discreto (faixa fina no topo, não fixa) informando que o site está numa versão beta do novo layout. O link "Saiba mais" abre um diálogo explicando o que muda, o que não muda e como enviar feedback.

*   Pode ser dispensado; a escolha fica em `localStorage` (`dougdesign-beta-notice-v1`) e é aplicada antes da primeira pintura para não piscar.
*   Para encerrar o beta, remova `<BetaNotice />` de `src/layouts/Layout.astro` e o selo "Layout v2 · Beta" de `Footer.astro`.
