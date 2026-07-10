# ConsentBanner

O componente `ConsentBanner` gerencia o banner flutuante de consentimento de cookies da plataforma, em total conformidade com a LGPD e privacidade do usuário.

## Interface do Componente (Props & Slots)

Este componente não aceita propriedades externas (Props). Ele gerencia seu estado internamente utilizando localStorage.

## Comportamento Interativo

*   **Chaves de Armazenamento:**
    *   `dougdesign-consent-v1`: Armazena se os cookies gerais de personalização foram aceitos (`accepted`) ou recusados (`rejected`).
    *   `dougdesign-comments-consent-v1`: Armazena a escolha de comentários (`comments-accepted` ou `comments-rejected`).
*   **Eventos Disparados:**
    *   `doug:consent-granted`: Emitido no `document` global quando o usuário clica em "Aceitar Tudo".
    *   `doug:consent-denied`: Emitido no `document` global quando o usuário clica em "Recusar Tudo".

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
