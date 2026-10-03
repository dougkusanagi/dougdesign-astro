# Cloud gaming e Monster Hunter Wilds — continuação de 02/10/2026

Autorização: pedido para continuar trabalhando por mais visitantes. Skills locais round-planning, update-post, search-console, cover-generation e publish-or-schedule; imagegen aplicado à geração das capas pelo script padrão Codex CLI. Quatro revisões substanciais, nenhuma URL nova ou agendada. Slugs, pubDate, autores e estado publicado preservados e comparados automaticamente com HEAD. Estado antes do push: pronto local, condicionado à conclusão do build.

## Perguntas e decisões

- `/cloud-gaming-brasil-2026-avanco/`: decidir se vale vender o console. Retirados ping abaixo de 20 ms, datacenters não documentados, previsão de 90% de uso e biblioteca inteira; incluídos catálogo por título/loja, requisitos, horas e roteiro proposto para avaliação na conexão do leitor. Não executamos gameplay ou medição de rede.
- `/cloud-gaming-brasil-2026-analise/`: calcular custo mensal/anual antes de comprar hardware. Retiradas comparações sem cálculo e previsão de fim dos consoles. Fórmula incremental, tabela Xbox datada e exemplos hipotéticos com premissas explícitas. R$ 60, R$ 200 e R$ 3.000 são valores didáticos, não ofertas.
- `/monster-hunter-wilds-performance-ps5-xbox/`: escolher modo gráfico do PS5/Series X/S. Retirados testes inventados, FSR 3 obrigatório, causa térmica e vantagem de plataforma sem medição. Tabela Capcom distingue meta de FPS, saída e renderização variável.
- `/monster-hunter-wilds-no-ps5-pro-modos-de-performance-e-resolucao-revelados/`: avaliar ray tracing e upgrade do PS5. Corrigida promessa de 60 FPS com ray tracing e maior densidade de criaturas. Capcom marca RT nos modos 30/40 FPS e desativado em 60. Nenhum benchmark ou compra recomendada por dado inventado.

Cada URL tem nota de correção, resposta direta, fontes específicas e interlinks sincronizados. Duas análises de nuvem tinham intenção equivalente no legado; foram diferenciadas como avaliação funcional e cálculo de custo, sem apagar nem redirecionar URLs. Monster Hunter: comparação geral de consoles e decisão de upgrade ao Pro. Não se propõe consolidação com base apenas em títulos.

Intent check executado para os quatro slugs com Ollama: conflito esperado com a própria URL; comparação semântica indisponível por conexão/timeout. Não tratamos isso como validação de exclusividade. Lidas manualmente as quatro páginas, comparativo de assinaturas 2026 e artigos de resolução Xbox Cloud/jogos comprados; buscados conteúdos relacionados entre Games e Tecnologia. Artigos de catálogo/resolução e teclado/mouse têm intenções relacionadas e dívida remanescente; não usados como interlinks para sustentar promessa universal. A comparação do PS5 Pro revelou erro factual novo e foi incluída na rodada.

## Fontes realmente consultadas em 02/10/2026

- `https://www.xbox.com/pt-BR/cloud-gaming`: web e navegador colaborativo. Requisitos, títulos comprados selecionados, dispositivo/região e limites. Navegador mostrou Essential R$ 43,90/5 h, Premium R$ 59,90/10 h, Ultimate R$ 76,90/15 h mensais; PC Game Pass sem nuvem. A extração web mostrava placeholders para preço; preços foram conferidos no DOM renderizado. Não contratado serviço ou conferido checkout autenticado.
- `https://www.nvidia.com/en-us/geforce-now/system-reqs/`: requisitos Windows de 15 Mbps em 720p/60 e 25 Mbps em 1080p/60, Ethernet/5 GHz e latência de rede abaixo de 80 ms. Página global não prova plano brasileiro, ping de cidade nem atraso total de comando.
- `https://abya.com/gfn/pt-BR`: operação regional disponível no Brasil, necessidade de licença/loja compatível, catálogo e FAQ de horas base/adicionais/prioridade. FAQ mistura idiomas e pode não refletir todos os planos do checkout; nenhum preço local ou especificação de GPU afirmado com base nela.
- `https://www.monsterhunter.com/wilds/en-us/`: web falhou, navegador abriu. Botão Performance na seção Products. Tabela lida com linhas e imagens de plataforma identificadas no DOM: PS5/Series X 30/40/60, Series S 1080p/30, PS5 Pro RT ativado em 30/40, desligado em 60. Notas de renderização variável/upscaling e quedas sob carga. Não significa FPS constante ou imagem capturada por nós.
- `https://info.monsterhunter.com/wilds/update/en-us/Ver.1.041.00.00.html`: web 403, navegador funcionou. Patch de 18/02/2026, otimizações CPU/GPU/LOD/cache e inicialização PS5 com muitos complementos. Não é versão mais recente nem comparação Pro/base.
- `https://info.monsterhunter.com/wilds/update/en-us/`: navegador; índice com versões posteriores por plataforma, até 1.042.00.02 Steam na consulta.
- `https://info.monsterhunter.com/wilds/update/en-us/Ver.1.042.00.01.html`: navegador; PS5 se refere à Demo 1.0.1, Steam à correção de render scaling. Não atribuído ao jogo completo do PS5.
- `https://manual.capcom.com/mhwilds/pt-br/ps5/top/`: manual consultado; histórico menciona 1.042.00.00. Nenhuma etapa do menu executada no jogo.
- `https://www.monsterhunter.com/wilds/en-us/product/`: navegador, seção de produtos. Nenhuma compra/aceitação de termos.
- Documentação Astro de content collections consultada; schema e código do site não alterados.

As datas dos patches são históricas. Não antecipamos funcionalidades de atualização futura observada no site. Não há teste próprio, benchmark independente utilizado ou medição térmica. A conta de 25 ms por quadro em 40 FPS é aritmética, não medida de latência.

## Medição e próximos trabalhos

GSC CLI: sem service account configurada. Navegador de Search Console redirecionou à página pública `/search-console/about`, sem relatórios autenticados. Nenhuma métrica nova, configuração de credenciais ou extração de cookies/tokens. Baseline histórico da triagem de 01/10: GSC www, Web, 04–28/09/2026, sem filtro país/dispositivo — cloud avanço 1 clique/94 impressões/posição 7,3; cloud análise 0/82/8,8; Wilds geral 0/78/6,6. PS5 Pro sem dado quantificado nesta rodada. Estes números antecedem o deploy e não medem seu resultado.

Avaliar a partir de 12/10, se GSC cobrir dias após o deploy: consultas e páginas, cliques/impressões e comparação de períodos equivalentes. Nenhuma promessa de indexação ou crescimento. Total registrado do dia passa de 4 novos/12 revisões substanciais para **4 novos/16 revisões**. Quinto novo permanece pendente de apuração; não foi preenchido com outra intenção repetida. Pendências: P0 04 headsets, cluster Switch 2 e tutoriais; conferir dívida do cloud teclado/mouse e catálogo por título. Correções factuais continuam tendo prioridade.

## Capas e verificação local

Três capas JPG 1672×941 geradas por `scripts/codex-cover.sh`, Codex login ChatGPT/image_gen, sem API key. Slugs de arquivo com sufixo v2 preservam originais; capa Wilds reutilizada no Pro por tema equivalente. Prompt integral da cena, procedência e alt no frontmatter, legenda conceitual no corpo. Inspeção direta e independente por subagente conforme skill: três aprovadas, sem texto/logo/deformação grave, aparência artesanal sem prova de teste. A primeira mostra controle remoto, não gamepad; alt corrigido para o objeto real.

Audit completo: ok true, sem issues em revisados. Dívida legada separada: 486 posts/1844 issues, sem certificação factual do restante do acervo. Unitários: 40 aprovados. Typecheck CLI aprovado. Diff check sem erro. Todos os sete destinos de interlinks retornaram HTTP 200 antes do push. Datas originais e estado publicados comparados com HEAD nos quatro arquivos; descrições entre 133 e 143 caracteres. Build/deploy e verificação pública: registrar abaixo quando concluídos.

## Produção comprovada

Build local concluído em 02/10 às 22:30:41 -03:00: 655 páginas, sem erro. Commit `b00472b` enviado a master. [Vercel success](https://vercel.com/dougkusanagis-projects/dougdesign-astro/FFyVX3ESDS1JYHGH2b81JywWp39c). **Quatro revisões ao vivo, verificadas em 02/10/2026 às 22:33:46 -03:00 (America/Sao_Paulo):**

- `https://www.dougdesign.com.br/cloud-gaming-brasil-2026-avanco/`
- `https://www.dougdesign.com.br/cloud-gaming-brasil-2026-analise/`
- `https://www.dougdesign.com.br/monster-hunter-wilds-performance-ps5-xbox/`
- `https://www.dougdesign.com.br/monster-hunter-wilds-no-ps5-pro-modos-de-performance-e-resolucao-revelados/`

As quatro retornaram HTTP 200, canonical www preservado, uma H1, novas descrições/títulos, notas de correção e capas raster HTTP 200; todas presentes no sitemap público. Datas originais conferidas no HTML; updatedDate nuvem 22:26:41 -03:00 e Wilds 22:28:58 -03:00 (DOM em UTC). Capas carregadas com alt correto.

Viewport 390×844 nas quatro sem overflow horizontal. Texto legível e tabelas com rolagem horizontal própria. Conferência complementar às 23:39 -03:00: anúncio automático no topo cobriu parte da tabela do PS5 Pro; na primeira inspeção nuvem também havia anúncio fixo sobre trechos de leitura. Não se declara experiência livre de sobreposição, nem foram mudados os formatos automáticos reservados ao dono. Este é um limite observado, com acompanhamento técnico próprio.

IndexNow success após deploy: notificação, não confirmação de indexação. CI remoto Test Suite confirmado success às 23:39 -03:00, incluindo E2E. Sem métricas atuais ou ganho de tráfego demonstrado. Nenhuma URL nova ou agendada nesta continuação.
