---
title: "Como instalar e usar o Claude Code no terminal"
slug: claude-code
pubDate: 2026-07-16T08:00:00-03:00
updatedDate: 2026-09-30T23:00:00-03:00
author: Guto Tech
category: Inteligencia Artificial
draft: false
scheduled: false
meta_description: "Como instalar, fazer login e usar o Claude Code no terminal: requisitos, instalador nativo, claude doctor, permissões e primeiros comandos."
description: "Como instalar, fazer login e usar o Claude Code no terminal: requisitos, instalador nativo, claude doctor, permissões e primeiros comandos."
image: ../../assets/images/posts/claude-code.png
readingTime: 6 min
featured_image:
  prompt: High quality premium aesthetic clean vector illustration, terminal
    window with code commands, glowing orange and white anthropic icon, dark
    interface background, no text, no logos, 16:9 ratio
  alt: Janela de terminal com comandos do Claude Code
  generated_path: src/assets/images/posts/claude-code.png
keyword_principal: Claude Code
content_type: guia
cluster: inteligencia-artificial
assunto: Claude Code
intencao_busca: "instalar o Claude Code, fazer login e dar os primeiros passos no terminal"
decisao_do_leitor: decidir
fato_novo: "Revisão em 30/09/2026 com a documentação oficial de instalação e visão geral do Claude Code."
canonical_role: principal
internal_links:
  to: []
  from_needed: []
canibalizacao:
  status: revisado
  resumo: Revisão factual de 30/09/2026; existem outros dois textos sobre Claude Code no site, com intenções diferentes (visão geral e comparação com Copilot).
fontes_oficiais:
  - https://code.claude.com/docs/en/setup
  - https://code.claude.com/docs/en/overview

---

**Resposta curta:** a forma recomendada de instalar o Claude Code é o **instalador nativo**, que faz atualizações automáticas em segundo plano. Depois, abra um terminal na pasta do projeto, rode `claude` e siga o login pelo navegador. Você precisa de uma conta Pro, Max, Team, Enterprise ou Console; o plano gratuito do claude.ai não inclui o Claude Code. Tudo abaixo segue a [documentação oficial de instalação](https://code.claude.com/docs/en/setup) e a [visão geral](https://code.claude.com/docs/en/overview), conferidas em 30/09/2026.

## O que é o Claude Code

Segundo a Anthropic, é uma ferramenta de programação com agente que lê a base de código, edita arquivos, executa comandos e se integra às suas ferramentas de desenvolvimento. Funciona no terminal, em extensões para IDEs (VS Code e JetBrains), no app desktop e no navegador. A documentação cita usos como escrever testes, corrigir erros de lint, criar commits e pull requests e conectar ferramentas externas pelo Model Context Protocol (MCP).

## Requisitos

- **Sistema:** macOS 13 ou superior, Windows 10 (1809+) ou Windows Server 2019+, Ubuntu 20.04+, Debian 10+ ou Alpine 3.19+.
- **Hardware:** 4 GB de RAM ou mais, processador x64 ou ARM64.
- **Rede:** conexão com a internet e país com suporte da Anthropic.
- **Shell:** Bash, Zsh, PowerShell ou CMD.

## Instalação

No macOS, Linux ou WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

No Windows (PowerShell):

```powershell
irm https://claude.ai/install.ps1 | iex
```

Há também Homebrew (`brew install --cask claude-code`), WinGet (`winget install Anthropic.ClaudeCode`) e pacotes apt, dnf e apk. Instalações por Homebrew, WinGet e gerenciadores de pacotes do Linux não atualizam sozinhas. O pacote npm (`npm install -g @anthropic-ai/claude-code`) continua disponível e exige Node.js 22 ou superior; a documentação pede para não usar `sudo` com npm.

## Verificar a instalação

Abra um terminal novo e rode:

```bash
claude --version
claude doctor
```

O primeiro mostra a versão. O `claude doctor` imprime diagnósticos somente de leitura sobre a instalação e as configurações, sem iniciar uma sessão. Se o terminal disser que `claude` não foi encontrado, o diretório de instalação provavelmente não está no PATH.

## Login e primeira sessão

```bash
cd meu-projeto
claude
```

Na primeira vez, o Claude Code pede o login pelo navegador. Se a variável `ANTHROPIC_API_KEY` estiver definida, ele pede para você aprovar a chave em vez de abrir o navegador. Não existe um comando `claude login` separado na documentação atual de instalação.

## Primeiros usos

Descreva a tarefa em linguagem natural, por exemplo:

```bash
claude "escreva testes para o módulo de autenticação, rode e corrija as falhas"
```

O Claude Code planeja, altera arquivos e verifica o resultado. Você também pode usá-lo em scripts com `claude -p "..."`, em pipes e em CI. Para dar instruções permanentes ao projeto, crie um arquivo `CLAUDE.md` na raiz; ele é lido no início de cada sessão.

## Segurança e permissões

O Claude Code pode executar comandos e editar arquivos, então leia os pedidos de permissão antes de aprovar, principalmente para scripts que você não conhece. Não rode a ferramenta com privilégios de administrador sem necessidade. No Windows, o modo de isolamento (sandbox) só é suportado no WSL 2, segundo a documentação.

## Limites desta revisão

Conferimos a documentação oficial em 30/09/2026, mas não repetimos a instalação nem testamos os comandos em todos os sistemas. Nomes de comandos, requisitos e planos mudam com frequência; confirme na página oficial antes de instalar.
