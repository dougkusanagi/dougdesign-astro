---
title: Como Criar Agentes de IA Locais com LangChain e Ollama em Node.js
slug: criar-agentes-ia-locais-langchain-ollama-node
pubDate: 2026-07-10T18:00:00-03:00
updatedDate: 2026-07-10T21:14:47.585Z
author: Guto Tech
category: Inteligencia Artificial
draft: false
scheduled: false
meta_description: Guia completo com código prático para criar agentes de IA
  locais usando LangChain.js, Ollama e modelos de código aberto no ecossistema
  Node.js.
description: Aprenda como estruturar e rodar agentes de inteligência artificial
  totalmente locais e seguros usando JavaScript, LangChain e Ollama.
image: ../../assets/images/posts/criar-agentes-ia-locais-langchain-ollama-node.png
readingTime: 6 min
featured_image:
  prompt: A concept of localized artificial intelligence nodes connected together,
    neon circuit boards, server network rack glow, 16:9 aspect ratio, 1200x675,
    no text, no logo
  alt: Representação de rede de circuitos com nós de inteligência artificial
    brilhando em tons neon de azul e violeta
  generated_path: src/assets/images/posts/criar-agentes-ia-locais-langchain-ollama-node.png
keyword_principal: Agentes IA locais
content_type: guia
cluster: inteligencia-artificial
assunto: Agentes IA locais
intencao_busca: como criar agentes de ia locais com langchain e ollama em nodejs
decisao_do_leitor: decidir
fato_novo: Evolução da biblioteca LangChain.js e maior eficiência dos modelos
  locais compactos em 2026
canonical_role: apoio
internal_links:
  to:
    - como-usar-deepseek-coder-no-vscode
    - local-ai-2026-como-rodar-o-deepseek-coder-offline-com-ollama
    - como-se-proteger-de-prompt-injection-ia
  from_needed: []
quality_notes:
  below_word_target_reason: null
canibalizacao:
  status: validado
  resumo: Sem conflitos de canibalização encontrados.
fontes_oficiais:
  - https://js.langchain.com
---

# Como Criar Agentes de IA Locais com LangChain e Ollama em Node.js

## Resumo rápido

Criar agentes de IA locais permite processar dados sensíveis sem enviá-los para APIs proprietárias de nuvem, reduzindo custos operacionais de tokens a zero. Para fazer isso no ecossistema Node.js, você pode usar o **LangChain.js** como orquestrador e o **Ollama** para executar modelos compactos eficientes (como o *Llama 3* ou o *DeepSeek-Coder*). O segredo para o agente funcionar de forma estável localmente está em estruturar ferramentas (tools) simples e manter o prompt do sistema focado no formato JSON para evitar que o modelo alucine durante o raciocínio de tomada de decisão.

---

## Por que Rodar Agentes de IA Totalmente em Ambiente Local?

O desenvolvimento corporativo moderno esbarra constantemente em barreiras de conformidade de privacidade de dados. Enviar códigos confidenciais ou dados cadastrais de clientes para serviços de nuvem expõe a empresa a riscos de conformidade com a LGPD e GDPR.

Ao rodar modelos em sua própria máquina de desenvolvimento ou em datacenters locais, você garante que as informações nunca saiam da rede interna. Além disso, no desenvolvimento web com tecnologias de alto desempenho como o [Astro](https://dougdesign.com.br/novidades-astro-7-desenvolvimento-web/), utilizar microsserviços ou builders locais agiliza a velocidade de compilação sem depender de conexões externas ativas.

---

## Arquitetura de Agentes Locais com Ollama e Modelos Open Source

Um agente de inteligência artificial difere de uma API básica de chat porque ele segue o padrão **ReAct** (Reasoning and Acting). Ele avalia o problema inicial, planeja quais ferramentas utilizar, executa os comandos, observa o retorno dessas ferramentas e repete o fluxo até encontrar a resposta final.

A infraestrutura básica para este fluxo consiste em:
- **Ollama:** Executa em segundo plano no sistema operacional e gerencia o modelo (por exemplo, `llama3` ou `qwen2.5-coder`).
- **LangChain.js Core:** Biblioteca de comunicação com o Ollama e tratamento das conversas.
- **LangChain Tools:** Funções Javascript nativas que o modelo pode escolher chamar (ex: pesquisar no disco, efetuar chamadas HTTP ou formatar dados).

---

## Implementando o Agente com LangChain.js e Node.js (Exemplo Prático)

Certifique-se de que o Ollama está rodando localmente com o modelo desejado baixado:

```bash
ollama run qwen2.5-coder:7b
```

No seu projeto Node.js, instale as dependências da biblioteca oficial do LangChain:

```bash
npm install @langchain/community @langchain/core langchain
```

Abaixo está a estrutura base de código para instanciar o modelo do Ollama, declarar uma ferramenta personalizada de leitura de arquivos e configurar o agente tomador de decisão:

```javascript
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { createReactAgent } from "@langchain/langchain/agents";
import { Tool } from "@langchain/core/tools";
import { AgentExecutor } from "langchain/agents";
import { PullPromptTemplate } from "@langchain/core/prompts";
import fs from "fs";

// 1. Instanciar o modelo local rodando via Ollama
const model = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "qwen2.5-coder:7b",
  temperature: 0.1 // Temperatura baixa reduz alucinações na escolha de ferramentas
});

// 2. Definir as ferramentas que o agente pode utilizar
const lerArquivoTool = new Tool({
  name: "ler_arquivo_local",
  description: "Lê o conteúdo de um arquivo de log local para encontrar exceções. Recebe como entrada o caminho absoluto do arquivo.",
  func: async (caminho) => {
    try {
      const conteudo = fs.readFileSync(caminho.trim(), "utf-8");
      return conteudo;
    } catch (err) {
      return `Erro ao ler arquivo: ${err.message}`;
    }
  }
});

const tools = [lerArquivoTool];

// 3. Montar a execução do Agente ReAct
const prompt = await PullPromptTemplate.fromHub("hwchase17/react");
const agent = await createReactAgent({
  llm: model,
  tools,
  prompt
});

const executor = new AgentExecutor({
  agent,
  tools,
  verbose: true // Exibe o fluxo de raciocínio no terminal
});

// Execução
const resultado = await executor.invoke({
  input: "Analise o arquivo C:/Users/Public/logs.txt e me diga qual erro crítico ocorreu."
});

console.log("Resultado final do agente:", resultado.output);
```

---

## Lidando com Limitações de Contexto e Latência Local

Executar modelos localmente exige cuidados técnicos especiais que você não encontra em serviços em nuvem escaláveis. O maior limitador é a quantidade de memória RAM e VRAM dedicada disponível no computador.

Se você utilizar modelos acima de 8 bilhões de parâmetros em máquinas com menos de 16GB de memória, a latência de geração subirá drasticamente, tornando o tempo de resposta do agente inviável para aplicações de uso contínuo. Ao desenvolver agentes locais, priorize modelos quantizados e configure limites rígidos de histórico de mensagens para não estourar a janela de contexto de hardware durante loops longos de raciocínio.

---

## Fontes Oficiais

- Documentação do LangChain.js: https://js.langchain.com
- Repositório Oficial do Ollama: https://github.com/ollama/ollama
