---
title: "Como usar o DeepSeek no VSCode com a extensão Continue"
slug: como-usar-deepseek-coder-no-vscode
pubDate: 2026-07-06T08:00:00.000Z
updatedDate: 2026-10-02T14:00:00-03:00
author: Guto Tech
category: Inteligencia Artificial
draft: false
scheduled: false
meta_description: "Configure o DeepSeek no VSCode com o Continue (config.yaml). O deepseek-coder saiu da lista da API: veja os modelos atuais, os custos e como guardar a chave."
description: "Passo a passo para usar a API do DeepSeek no VSCode com o Continue, com os modelos atuais, os preços oficiais e cuidados para não vazar a chave."
image: ../../assets/images/posts/como-usar-deepseek-coder-no-vscode.png
readingTime: 5 min
featured_image:
  prompt: "A sleek IDE workspace showing glowing AI code completion, DeepSeek themed branding elements, modern programming interface, dark neon theme, no text, no logo. Ilustração gerada por IA; o código na tela é ilegível e não representa uma tela real."
  alt: "Ilustração gerada por IA de um monitor com um editor de código escuro e uma lista de sugestões iluminada em ciano; o texto na tela é ilegível"
  generated_path: src/assets/images/posts/como-usar-deepseek-coder-no-vscode.png
keyword_principal: DeepSeek no VSCode
content_type: tutorial
cluster: inteligencia-artificial
assunto: DeepSeek no VSCode com a extensão Continue
intencao_busca: como usar o DeepSeek Coder no VSCode
decisao_do_leitor: configurar o assistente e saber quanto ele custa antes de usar
fato_novo: "Em 02/10/2026 a documentação do Continue usa config.yaml (config.json está obsoleto) e a lista de modelos da API do DeepSeek traz deepseek-flash e deepseek-v4-pro, sem deepseek-coder. O texto anterior ensinava config.json com deepseek-coder e afirmava resultados superiores ao Copilot sem teste."
canonical_role: apoio
internal_links:
  to:
    - /como-se-proteger-de-prompt-injection-ia/
  from_needed: []
quality_notes:
  below_word_target_reason: null
canibalizacao:
  status: revisado
  resumo: "Atualização da URL (196 impressões no GSC, 04–28/09). Os links para Astro 7 e TypeScript 5.8 foram removidos por não ajudarem na tarefa. Nenhuma URL nova ou consolidação."
fontes_oficiais:
  - https://docs.continue.dev/customize/model-providers/more/deepseek
  - https://api-docs.deepseek.com/quick_start/pricing
  - https://api-docs.deepseek.com/guides/fim_completion
---

**Para usar o DeepSeek no VSCode, instale a extensão Continue, crie uma chave de API no console do DeepSeek e adicione um modelo com `provider: deepseek` no arquivo `config.yaml` do Continue.** O nome `deepseek-coder`, que este guia usava antes, não consta na lista atual de modelos da API; hoje a documentação traz `deepseek-flash` e `deepseek-v4-pro`.

> **Nota de correção — 02/10/2026:** a versão anterior mandava editar `config.json` com o modelo `deepseek-coder`, dizia que o DeepSeek tinha "resultados equivalentes ou até superiores" ao GitHub Copilot "na minha experiência" e chamava a precificação de "fração" dos concorrentes. Não há teste nosso que sustente isso, e a configuração estava desatualizada. Esses trechos foram removidos.

**Limite desta revisão:** a configuração abaixo segue a documentação oficial do Continue e do DeepSeek, consultada em 02/10/2026. Não rodamos o exemplo com uma chave real, então não registramos tempo de resposta, qualidade de código nem erro de ponta a ponta.

## O que você precisa

- VSCode com a extensão **Continue** instalada pelo marketplace;
- uma conta no console do DeepSeek e uma chave de API (o uso da API é pago e cobrado por tokens; veja a seção de custo);
- o arquivo de configuração do Continue aberto no editor.

## Passo a passo

1. **Instale o Continue** no marketplace do VSCode.
2. **Crie a chave de API** no [console do DeepSeek](https://platform.deepseek.com). Copie-a uma vez e não a cole em um repositório.
3. **Abra o `config.yaml` do Continue.** A [documentação do Continue](https://docs.continue.dev/reference) afirma que `config.yaml` substitui o `config.json`, que está obsoleto. Se você tem um `config.json` antigo, migre as entradas para o YAML.
4. **Adicione o modelo.** O formato da [página do DeepSeek no Continue](https://docs.continue.dev/customize/model-providers/more/deepseek) é:

```yaml
name: Minha configuração
version: 0.0.1
schema: v1

models:
  - name: DeepSeek Flash
    provider: deepseek
    model: deepseek-flash
    apiKey: ${{ secrets.DEEPSEEK_API_KEY }}
```

O campo `provider: deepseek` e os campos `name`, `model` e `apiKey` vêm da documentação do Continue. A sintaxe `${{ secrets.NOME }}` aparece no exemplo oficial de configuração do Continue com outro provedor; consulte a documentação do Continue para saber onde guardar o valor da chave no seu ambiente. Prefira isso a escrever a chave em texto puro no arquivo.

5. **Escolha o modelo no painel do Continue** e faça uma pergunta de teste. Se aparecer erro de autenticação, confirme se a chave é a mesma do console e se o saldo da conta cobre o uso.

Você pode adicionar também `deepseek-v4-pro`, o outro modelo da lista. Os dois aceitam chamada de ferramentas e saída JSON, segundo a [página de preços do DeepSeek](https://api-docs.deepseek.com/quick_start/pricing).

## Autocompletar no editor

O Continue permite marcar um modelo com `roles: [autocomplete]` para sugestões enquanto você digita. O DeepSeek documenta uma função de preenchimento de código (FIM) em beta, com URL de base separada (`https://api.deepseek.com/beta`) e limite de 4 mil tokens por resposta, e a página de preços diz que ela funciona no modo sem raciocínio. **Não testamos essa combinação com o Continue**, então trate o autocompletar como experimento: use o chat e a edição como caminho principal.

## Quanto custa

Preços oficiais por 1 milhão de tokens, em dólar, conforme a [página de modelos e preços](https://api-docs.deepseek.com/quick_start/pricing) em 02/10/2026. Os valores mudam entre horário de pico e fora de pico (fora de pico custa metade):

| Modelo | Entrada (cache miss) | Saída |
| --- | --- | --- |
| `deepseek-flash` | US$ 0,15 fora de pico; US$ 0,30 no pico | US$ 0,60 fora de pico; US$ 1,20 no pico |
| `deepseek-v4-pro` | US$ 0,66 fora de pico; US$ 1,32 no pico | US$ 1,98 fora de pico; US$ 3,96 no pico |

O horário de pico é de segunda a sexta, das 01h às 04h e das 06h às 10h UTC, exceto feriados chineses. O preço de entrada com cache é menor: US$ 0,003 a US$ 0,006 (Flash) e US$ 0,022 a US$ 0,044 (Pro). O custo em reais depende do câmbio e de impostos da sua operadora de cartão, e a empresa pode ajustar os valores: confira a página antes de recarregar.

Para estimar seu uso, multiplique tokens por preço. Mil tokens de entrada com o Flash fora de pico custam US$ 0,00015. Um chat longo com arquivos grandes consome mais, então acompanhe o saldo no console nos primeiros dias.

## Cuidados com a chave e com o código

- **Nunca versione a chave.** Se ela for exposta, revogue-a no console e crie outra.
- **Saiba o que o editor envia.** Em chat e edição, trechos do seu código vão para a API do DeepSeek. Não envie código com segredos ou dados de clientes sem avaliar a política da sua empresa.
- **Revise o que o modelo gera.** Respostas podem estar erradas ou inseguras; leia o diff antes de aceitar. Veja também [como se proteger de prompt injection](https://www.dougdesign.com.br/como-se-proteger-de-prompt-injection-ia/) em ferramentas de IA integradas ao editor.

## DeepSeek substitui o Copilot?

Não temos como afirmar. A comparação depende do seu fluxo, da linguagem, do repositório e do que você aceita pagar, e não fizemos um teste lado a lado. Se você quer decidir, rode as mesmas tarefas curtas nos dois por alguns dias (um bug, um teste, uma refatoração) e compare o resultado e o custo.

## Fontes

- [DeepSeek no Continue — documentação](https://docs.continue.dev/customize/model-providers/more/deepseek), consultada em 02/10/2026
- [Referência de configuração do Continue](https://docs.continue.dev/reference), consultada em 02/10/2026
- [Modelos e preços — API do DeepSeek](https://api-docs.deepseek.com/quick_start/pricing), consultada em 02/10/2026
- [FIM Completion — API do DeepSeek](https://api-docs.deepseek.com/guides/fim_completion), consultada em 02/10/2026
