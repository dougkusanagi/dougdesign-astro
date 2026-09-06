# Performance: avaliação inicial

Os prints fornecidos mostram 74 mobile, 99 desktop, 93 acessibilidade e 100 em boas práticas e SEO. Não incluem LCP, TBT, CLS nem auditorias detalhadas. Esses números são a referência do usuário; não houve nova execução PageSpeed nesta rodada.

É plausível melhorar mobile, mas não prometer 100 nem atribuir o problema ao AdSense sem evidência. O teste exibido mostra banner de consentimento; uma navegação com todos os cookies aceitos pode ter carga diferente.

Inspeção do código: Hero.astro já prioriza a imagem principal com eager/high; PostCard.astro já usa Image, widths e sizes. As duas imagens secundárias do hero também usam eager, sendo candidatas a carregamento lazy se estiverem abaixo da dobra. LivePixWidget.astro já usa IntersectionObserver e margem de 200px, portanto não propor esse mecanismo como se estivesse ausente.

Próxima auditoria: executar três medições por perfil em home e artigo, analisar mediana e waterfall, identificar elemento LCP real, peso da imagem escolhida, fontes, CSS bloqueante, trabalho de scripts e deslocamentos de layout. Comparar primeira visita, consentimento recusado e aceito. Não servir versão especial para Lighthouse nem ocultar anúncios só do teste.

Priorizar evidências de LCP/TBT/CLS; revisar os problemas concretos de acessibilidade antes de atribuir os 93 a contraste ou labels. Confirmar que reserva/recolhimento dos slots não produz saltos de layout e que anúncios continuam funcionando após mudanças. Não perseguir 99→100 desktop ao custo da experiência ou monetização.

Metas de campo no percentil 75: LCP até 2,5s, INP até 200ms, CLS até 0,1. Lighthouse não mede INP real numa simples carga e sua nota pode variar. Fontes: https://web.dev/articles/vitals e https://developer.chrome.com/docs/lighthouse/performance/performance-scoring .

Nenhuma otimização funcional aplicada nesta rodada; escopo foi avaliar possibilidade e organizar os criativos.
