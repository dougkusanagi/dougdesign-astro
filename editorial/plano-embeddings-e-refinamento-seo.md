# Plano de Aprimoramento - Busca Semântica, Refinamento de Conteúdo e SEO

Este plano detalha os passos para implementar a busca semântica no CLI editorial, aprimorar a qualidade do conteúdo de acordo com o E-E-A-T do Google e reverter o tráfego estagnado do blog.

## 1. Integração do Ollama (Busca Semântica)

### Nova Feature de Embeddings no CLI
Criar um módulo `embeddings.ts` no `tools/dougseo-cli/src/lib/` que se conectará à API do Ollama local (`nomic-embed-text`) para:
- Obter vetores de representação semântica (embeddings) de títulos, assuntos e intenções de busca.
- Calcular a similaridade de cosseno (Cosine Similarity) entre dois vetores.
- Gerenciar um arquivo de cache local (`editorial/inventory/embeddings-cache.json`) para evitar requisições redundantes a cada verificação de intenção.

### Atualização do Intent Check
Modificar a função `checkIntent` para:
- Torná-la assíncrona.
- Comparar semanticamente a nova pauta proposta com todas as postagens existentes.
- Emitir alertas/avisos de similaridade caso a pontuação de cosseno supere `0.82`, prevenindo canibalização sutil de assuntos.

---

## 2. Refinamento de Conteúdo e E-E-A-T

### Regras no AGENTS.md
Atualizar as regras gerais em `AGENTS.md` para exigir:
- **Adeus à rigidez:** Proibir o uso estrito do template factual (`O que aconteceu`, `O que é oficial`) para posts *Evergreen* e tutoriais. Esses posts devem usar H2s dinâmicos baseados nas dúvidas do usuário.
- **Tom de Especialista Humano:** Injetar pontos de vista fortes, exemplos de código específicos, alertas práticos baseados em erros comuns e conclusões opinativas reais.
- **Lista de Palavras Banidas:** Banir jargões e clichês clássicos de IA (ex: *vital*, *essencial*, *revolucionar*, *divisor de águas*, *mergulhar*, *ecossistema em constante evolução*).

### Reescrever Posts Agendados
Reescrever os 15 posts atualmente agendados e os 5 novos posts para adequá-los a essas diretrizes.

---

## 3. Diagnóstico de Tráfego e Plano de Crescimento SEO

Com base na análise dos prints de GA4 e GSC fornecidos:

### Diagnóstico do Problema
1. **Esteira de Tráfego Efêmero:** O tráfego do blog é altamente dependente de palavras-chave temporais de jogos (ex: `ps plus junho 2026`, `ps plus extra maio 2026`, `ps plus julho 2026`). Embora gerem picos rápidos de cliques, a busca por essas palavras-chave despenca a zero assim que o mês acaba. Isso gera a estagnação: o tráfego novo de cada mês apenas substitui o tráfego morto do mês anterior.
2. **CTR Baixo (2%):** A média de cliques está abaixo do esperado mesmo com a posição média em `8.4`. Isso aponta para meta-descriptions genéricas ou títulos pouco atrativos.
3. **Falta de Ativos Atemporais (Evergreen):** Não há tráfego acumulado de longo prazo vindo de guias técnicos densos que performam de forma estável o ano todo.

### Plano de Ação
1. **Transição para Posts Hub (Evergreen):** Em vez de focar 90% em listas mensais, criar posts pilar duradouros (ex: *"Tudo sobre os planos PS Plus Extra e Deluxe"* ou *"Guia definitivo de preços do Nintendo Switch 2"*).
2. **Auditoria e Otimização de CTR:** Implementar melhorias de copy nos títulos e descrições do inventário existente para subir o CTR médio de 2% para pelo menos 5%.
3. **Espaçamento e Automação Semântica:** Utilizar o novo sistema de embeddings do Ollama para garantir que toda nova pauta expanda os tópicos do blog em vez de competir com artigos já posicionados.
