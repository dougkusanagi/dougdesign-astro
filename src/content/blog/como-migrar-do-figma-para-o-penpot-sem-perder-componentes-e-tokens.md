---
title: "Figma para Penpot: como migrar componentes e tokens com segurança"
slug: como-migrar-do-figma-para-o-penpot-sem-perder-componentes-e-tokens
pubDate: 2026-10-01T12:00:00-03:00
updatedDate: 2026-09-30T00:12:02.238Z
author: Maya Pixel
category: Web Design
draft: true
scheduled: true
meta_description: "Aprenda a migrar do Figma para o Penpot: faça um piloto, leve
  componentes e tokens e valide layouts antes de mudar a equipe."
description: Um roteiro de migração de Figma para Penpot com inventário, arquivo
  piloto, importação de componentes e tokens, revisão de layouts e critérios
  para liberar a mudança.
image: ../../assets/images/posts/como-migrar-do-figma-para-o-penpot-sem-perder-componentes-e-tokens.png
readingTime: 6 min
featured_image:
  prompt: "Ilustração editorial vetorial, 1200 x 675, composição limpa sobre fundo
    claro: duas pranchetas de interface lado a lado, a marca oficial Figma na
    primeira e o símbolo oficial Penpot na segunda, componentes e amostras de
    tokens atravessando uma seta entre as telas. Aparência de produto
    profissional, formas nítidas, paleta sóbria com laranja e violeta de um lado
    e índigo e verde do outro, sem texto adicional, sem efeitos neon e sem
    estética cyberpunk."
  alt: Pranchetas de interface com componentes e amostras de tokens entre as
    marcas Figma e Penpot.
  generated_path: src/assets/images/posts/como-migrar-do-figma-para-o-penpot-sem-perder-componentes-e-tokens.png
keyword_principal: migrar do Figma para o Penpot
content_type: guia
cluster: figma-penpot-migracao
assunto: Migrar de Figma para Penpot
intencao_busca: Checklist para importar arquivos, componentes e tokens de um
  projeto Figma no Penpot e validar uma migração piloto antes de mudar toda a
  equipe.
decisao_do_leitor: Validar um piloto de migração sem interromper o trabalho da equipe.
fato_novo: A documentação oficial do Penpot orienta usar o Exporter para
  arquivos e bibliotecas complexas, validar um arquivo piloto e tratar a
  migração como pontual, não como sincronização contínua.
canonical_role: apoio
internal_links:
  to: []
  from_needed: []
quality_notes:
  below_word_target_reason: Não relatamos um teste de migração próprio. O guia
    separa as capacidades documentadas pelo Penpot de um checklist de validação
    que cada equipe precisa executar nos próprios arquivos.
canibalizacao:
  status: revisado
  resumo: A URL publicada Penpot vs Figma atende comparação e escolha de
    ferramenta; este guia atende execução de uma migração piloto. Intent check
    local não apontou conflito literal, mas a busca semântica não estava
    disponível por ausência do Ollama. Os artigos legados existentes sobre
    comparação e tokens contêm afirmações sem suporte suficiente; por isso não
    são recomendados como links internos até revisão factual.
fontes_oficiais:
  - https://help.penpot.app/user-guide/first-steps/migration-guide/
  - https://help.penpot.app/user-guide/design-systems/design-tokens/
  - https://help.penpot.app/user-guide/export-import/export-import-files/
  - https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma
  - https://help.figma.com/hc/en-us/articles/360040028114-Export-from-Figma
---

Não existe uma migração de Figma para Penpot que garanta, com um clique, que cada biblioteca, tela responsiva e token mantenha o comportamento original. Para reduzir surpresa, escolha um arquivo representativo, faça uma cópia de segurança, migre esse piloto e compare o resultado com critérios definidos antes de mudar o restante do time.

O guia oficial do Penpot recomenda auditar arquivos, bibliotecas, componentes, tokens e plugins antes da exportação. Para arquivos complexos, o **Penpot Exporter para Figma** leva arquivos, slides, componentes, variantes, Auto Layout, estilos, variáveis e bibliotecas. Mesmo com o plugin, a documentação prevê limpeza de layout: Auto Layout do Figma se converte em Flex e Grid no Penpot. A migração é pontual; o Exporter não mantém sincronização contínua entre as ferramentas.

## O que precisa entrar no inventário antes de exportar?

Comece pelos arquivos que sustentam o produto, não pelo mais simples da pasta. Registre quais telas são ativas e dependem umas das outras. Liste:

- bibliotecas compartilhadas e a cadeia de componentes usados pelas telas;
- variantes, propriedades e estados que precisam continuar editáveis;
- variáveis nativas do Figma, conjuntos de tokens e temas;
- fontes, ícones, imagens, protótipos, plugins e integrações que influenciam o fluxo;
- layouts que usam Auto Layout, redimensionamento, conteúdo variável ou breakpoints.

Essa lista vira a régua de comparação. Se o arquivo depende de um plugin que não existe no Penpot, documente o que ele faz e como a equipe vai substituir esse passo. Exporte assets estáticos como SVG, PNG ou JPG quando fizer sentido; esse caminho é diferente de importar um arquivo de design editável.

## Como escolher um arquivo piloto que revele os problemas?

Escolha uma tela comum e uma tela difícil: por exemplo, uma página com formulário e uma composição com navegação responsiva, variantes e componentes aninhados. Inclua ao menos uma biblioteca usada por mais de uma tela. Um arquivo vazio ou um mockup simples pode importar sem erros e ainda assim esconder os problemas que interromperiam o trabalho real.

Antes de abrir o Exporter, duplique o arquivo de origem e anote a versão do Figma, o nome das bibliotecas e o conjunto de telas incluídas. Depois da importação, confira se componentes continuam reutilizáveis, se as variantes preservam estados e se texto, fontes e imagens aparecem como esperado. Não trate a aparência da primeira tela como prova de que todo o sistema migrou corretamente.

## Como levar tokens sem apagar os que já existem?

O guia do Penpot descreve dois caminhos para tokens: exportar JSON pelo Tokens Studio ou encaminhar variáveis nativas do Figma pelo Tokens Studio ou pelo Exporter. O arquivo resultante precisa seguir o formato esperado pelo Penpot. Um fragmento de token de cor no formato documentado tem esta estrutura:

```json
{
  "Global": {
    "color": {
      "brand": {
        "$value": "#5B5BD6",
        "$type": "color"
      }
    }
  }
}
```

Esse exemplo mostra somente uma cor; não representa a exportação completa de um design system. Compare também os nomes e as referências entre tokens primitivos, semânticos e de componente, para que os elementos importados continuem apontando para os valores corretos.

Faça a importação em uma cópia do arquivo. A documentação alerta que importar uma biblioteca com tokens substitui o conjunto de tokens existente; o fluxo de importação também permite substituir o conjunto global do arquivo. Exporte um backup dos tokens antes de testar, confirme os conjuntos e temas resultantes e aplique alguns tokens em componentes críticos antes de considerar a tarefa concluída.

## O que precisa de ajuste manual depois da importação?

Revise dimensões, espaçamentos, restrições, alinhamentos e comportamento com texto maior. Compare a mesma tela em larguras distintas — desktop, tablet e mobile, se esses tamanhos fizerem parte do produto. No Penpot, Flex e Grid são os modelos de layout correspondentes ao Auto Layout do Figma; confira o resultado e refaça regras que não tenham a mesma leitura visual.

Cheque ainda fontes ausentes, ícones que chegaram como imagem, estados de componentes, interações de protótipo e qualquer passo que antes dependia de plugin. Para a passagem ao desenvolvimento, peça a uma pessoa de frontend que valide nomes de tokens, medidas e assets exportados. O objetivo é encontrar divergências com consequência no produto, não alcançar uma correspondência visual perfeita em cada camada decorativa.

## Quando a equipe pode trocar o fluxo inteiro?

Feche o piloto com um registro curto de exceções, tempo gasto e tarefas que precisaram ser refeitas. Eu liberaria a mudança somente quando três condições forem verdadeiras: telas críticas passam na comparação; componentes e tokens importantes continuam reutilizáveis; e designers e desenvolvimento conseguem concluir uma entrega sem recorrer ao Figma para recuperar informação perdida.

Se esses critérios falharem, mantenha as ferramentas em paralelo e corrija o processo ou escolha outro arquivo para o piloto. A documentação do Penpot também recomenda esse período de uso simultâneo. Como o Exporter não sincroniza alterações depois da migração, defina qual ferramenta é a fonte oficial enquanto a equipe valida a mudança — duas fontes editáveis sem regra de ownership criam divergências por conta própria.

**Limite deste roteiro:** não executei a migração dentro de uma conta Figma/Penpot nesta revisão. Os passos sobre o Exporter e tokens vêm da documentação oficial consultada em 29 de setembro de 2026; a comparação de componentes, telas e responsabilidades é o checklist recomendado para validar o seu próprio projeto.

## Fontes oficiais

- [Migration Guide — Penpot](https://help.penpot.app/user-guide/first-steps/migration-guide/)
- [Design Tokens — Penpot](https://help.penpot.app/user-guide/design-systems/design-tokens/)
- [Export and import files — Penpot](https://help.penpot.app/user-guide/export-import/export-import-files/)
- [Guide to variables in Figma — Figma](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
- [Export from Figma — Figma](https://help.figma.com/hc/en-us/articles/360040028114-Export-from-Figma)
