## ConsentBanner

O componente `ConsentBanner` gerencia as preferências de cookies e scripts do site. A adequação à LGPD depende também da configuração dos fornecedores e da revisão da política de privacidade.

## Interface do Componente (Props & Slots)

Este componente não aceita propriedades externas (Props). Ele gerencia seu estado internamente utilizando localStorage.

## Comportamento Interativo

*   **Chaves de Armazenamento:**
    *   `dougdesign-consent-v1`: Armazena se os cookies gerais de personalização foram aceitos (`accepted`) ou recusados (`rejected`).
    *   `dougdesign-comments-consent-v1`: Armazena a escolha de comentários (`comments-accepted` ou `comments-rejected`).
*   **Eventos Disparados:**
    *   `doug:consent-granted`: Emitido no `document` global quando o usuário clica em "Aceitar tudo".
    *   `doug:consent-denied`: Emitido no `document` global quando o usuário clica em "Recusar tudo".
*   O botão "Preferências de cookies" no rodapé reabre o painel para revisão ou revogação da escolha.

O painel é compacto (canto inferior) e os controles de comentários (Giscus) ficam recolhidos em "Comentários (Giscus)". Os IDs `consent-accept`, `consent-reject`, `consent-comments-accept` e `consent-comments-reject` são usados pelos testes E2E e pelo script do componente.

## Exemplo de Uso

O banner deve ser incluído uma única vez no layout principal do site:

```astro
---
import ConsentBanner from '../components/ConsentBanner.astro';
---
<html>
  <body>
    <!-- Outros componentes -->
    <ConsentBanner />
  </body>
</html>
```
