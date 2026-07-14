---
title: "Como Configurar e Usar o Claude Code no Terminal"
slug: claude-code
pubDate: 2026-07-16T08:00:00-03:00
updatedDate: 2026-07-16T08:00:00-03:00
author: Guto Tech
category: Inteligencia Artificial
draft: true
scheduled: true
meta_description: Guia de instalação e uso do Claude Code no terminal. Aprenda a configurar o Agent Mode e integrá-lo com MCPs para automação de tarefas locais.
description: Domine o novo Claude Code da Anthropic diretamente no terminal do desenvolvedor.
image: ../../assets/images/posts/claude-code.png
readingTime: 6 min
featured_image:
  prompt: "High quality premium aesthetic clean vector illustration, terminal window with code commands, glowing orange and white anthropic icon, dark interface background, no text, no logos, 16:9 ratio"
  alt: "Claude Code terminal window"
keyword_principal: Claude Code
content_type: guia
cluster: inteligencia-artificial
assunto: Claude Code
intencao_busca: como usar agent mode no claude code terminal
decisao_do_leitor: decidir
fato_novo: Claude Code
canonical_role: principal
internal_links:
  to: []
  from_needed: []
canibalizacao:
  status: validado
  resumo: Validado localmente sem conflitos de intenção.
fontes_oficiais:
  - https://anthropic.com
---

O lançamento do **Claude Code** pela Anthropic trouxe a capacidade de os desenvolvedores usarem modelos de inteligência artificial de ponta (como o Claude 3.5 Sonnet) diretamente no prompt de comando, permitindo que a IA analise o diretório atual, execute comandos locais e faça refatorações de código inteiras de forma autônoma.

Neste artigo, passamos pelas etapas de instalação e mostramos como ativar e tirar o máximo proveito do **Agent Mode** integrado.

## O que é o Claude Code?

Ao contrário de assistentes de chat tradicionais integrados em IDEs, o Claude Code opera no shell do sistema operacional. Ele é capaz de:
*   Escrever, ler e editar arquivos locais diretamente.
*   Executar comandos do sistema (como rodar testes ou buildar o projeto).
*   Diagnosticar e consertar lints e erros de compilação de forma iterativa.
*   Integrar-se com servidores de contexto (MCP) locais.

## Instalação e Configuração Básica

Para instalar o Claude Code globalmente em seu sistema de desenvolvimento, execute o comando correspondente:

```bash
# Instalando via npm globalmente
npm install -g @anthropic-ai/claude-code

# Executando a configuração inicial e login
claude login
```

O comando de login abrirá o navegador para autenticação segura com sua conta Anthropic. Uma vez logado, basta rodar `claude` no diretório raiz do seu projeto para iniciar a sessão interativa.

## Explorando o Agent Mode

O verdadeiro diferencial do Claude Code é seu **Agent Mode**, habilitado por padrão. Quando você faz uma requisição complexa (ex: *"Crie testes unitários para a rota de autenticação e certifique-se de que passem"*), a IA não apenas cospe um bloco de código, mas planeja e executa uma sequência de passos:

1. **Leitura de Contexto:** Analisa a estrutura de arquivos e as dependências do projeto.
2. **Implementação:** Cria o arquivo de testes.
3. **Execução:** Roda o comando de testes do seu `package.json`.
4. **Correção Automática:** Se o teste falhar por uma importação errada, ela corrige o arquivo e testa novamente até obter sucesso.

## Avisos de Segurança Importantes

Como o Claude Code pode rodar comandos em seu terminal de forma autônoma, sempre preste atenção aos prompts de permissão que aparecem na tela ao executar comandos desconhecidos ou scripts externos. Nunca execute sessões de agente com privilégios de administrador (root/sudo) sem real necessidade.
