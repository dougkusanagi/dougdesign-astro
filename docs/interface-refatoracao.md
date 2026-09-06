# Proposta de interface — Doug Design

## Diagnóstico do print

A identidade azul, tipografia e cards já oferecem uma base aproveitável. O problema
principal é hierarquia: ticker, anúncio superior, hero, mural vazio e destaques
adiam o feed. A sidebar combina ranking longo, apoio e ofertas genéricas; no fim
há bastante espaço pouco útil. Os vazios de anúncios no print não provam falha
de AdSense: podem corresponder a carregamento, consentimento ou falta de campanha.

Proposta: simplificar a estrutura, manter a identidade e dar mais espaço à leitura.
Não substituir tudo por uma landing page de freelancer nem inserir produto em
todos os cards. Layout proposto, ainda não implementado ou validado por usuários.

## Estrutura desktop proposta

```text
Logo     Categorias / Todos os artigos           Buscar  Tema
Anúncio superior responsivo, com estados tratados
Destaque principal                  Dois destaques secundários
Últimos artigos                     Seleção editorial (até 5)
Lista de 6–8 artigos                 LivePix opcional
  anúncio contextual                Anúncio lateral, se adequado
  continuação da lista              Oferta válida contextual, se existir
Ver todos os artigos
Faixa discreta: Precisa de um site ou sistema? Conheça meu trabalho
Rodapé: Sobre / Contato / Serviços / RSS / Privacidade / Cookies / Apoiar
```

Retirar a seção separada “Destaques do Doug” se repetir a função do hero/seleção.
Distribuir sua curadoria nos dois espaços restantes. Não repetir o mesmo artigo
no hero, seleção e feed na mesma home. Não deixar altura mínima de coluna criando
um grande vazio quando módulos opcionais estiverem ausentes.

## Mobile

Header compacto com menu acessível, busca e tema. Um destaque principal; os dois
secundários viram links/cards compactos. Feed de coluna única sem carrossel que
esconda conteúdo. Metadados secundários pequenos, porém legíveis; títulos sem
truncamento que esconda a pergunta principal. Sidebar não se transforma numa
sequência interminável antes do rodapé: curadoria curta e apoio após conteúdo.

Evitar sobreposição entre consentimento, aviso de adblock e CTA. Cookie banner
oferece escolhas acessíveis; aviso de apoio é in-flow e dispensável. Nenhum banner
impede leitura ou acesso ao botão de fechar. Respeitar prefers-reduced-motion.

## Linguagem visual e componentes

- Manter azul e modos claro/escuro. Definir tokens de espaçamento, cor e tipografia.
- Corpo de artigo aproximadamente 18px e entrelinha 1,6–1,75; largura de leitura
  alvo 65–75 caracteres. Ajustar por testes reais, não pelo print reduzido.
- Containers consistentes: conteúdo amplo na home, leitura limitada no artigo.
- Reduzir sombras/bordas em caixas aninhadas; usar espaço para separar seções.
- Imagens responsivas com dimensões reservadas; preservar prioridade da principal.
- Estados explícitos para links, foco, botões, formulário e dados indisponíveis.
- Tokens devem atender contraste adequado em ambos os temas; inspecionar problemas
  reais antes de afirmar que esse é o motivo da nota de acessibilidade 93.
- Alvos de toque confortáveis, em geral 44px, sem fazer todo texto virar botão.

## Artigo, categoria, busca e serviços

Artigo: título/resposta inicial cedo, autor e datas verdadeiros, sumário útil em
artigos longos, referências, relacionados curtos. Um CTA de serviço após conteúdo
somente quando relacionado. Apoio opcional em seguida, sem competir com três CTAs.

Categoria: título, introdução curta e listagem consistente; preservar URLs. Busca:
rótulo, estado vazio útil e filtros compreensíveis; evitar novas páginas indexáveis
para toda combinação de filtro. Serviços: problema resolvido, escopo, prova real,
faixa de preço e formulário curto; não vender promessa de primeira posição Google.

## Anúncios e apoio

Preservar unidades funcionais. Reservar espaço por formato para reduzir saltos;
colapsar falta de preenchimento apenas conforme estado confiável. Medir efeito
do recolhimento em CLS e da posição em receita. Não esconder anúncio carregado.
Manter LivePix já adiado, com link de fallback. Texto de adblock e frequência
seguem EXECUCAO-REFATORACAO.md. Não adicionar outro script comercial sem necessidade.

## Aceite visual e técnico

Comparar home, artigo, categoria, busca e serviços em 360/390/768/1440px,
claro/escuro e teclado. Conferir imagens, foco, menu, consentimento aceito/recusado,
anúncio filled/unfilled/pendente e fechamento de aviso. Não clicar anúncios reais
para testar. Capturar screenshots de referência e depois da mudança.

Sem scroll horizontal; sem perda de links/rotas; CTA de serviço não invasivo;
conteúdo chega antes de módulos promocionais secundários; nenhum ranking ou
número inventado. Build e E2E pertinentes aprovados. Repetir medições comparáveis
de performance e registrar diferença, mesmo quando não houver ganho. Nota 100
não é critério obrigatório nem substitui experiência com anúncios e consentimento.
