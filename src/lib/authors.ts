export interface AuthorProfile {
  name: string;
  role: string;
  bio: string;
}

export function authorSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const PROFILES: Record<string, Omit<AuthorProfile, 'name'>> = {
  'zeca-games': { role: 'Analista de games', bio: 'Acompanha lançamentos, serviços de assinatura e a experiência real de jogar no Brasil, separando anúncio oficial de rumor.' },
  'guto-tech': { role: 'Analista de tecnologia', bio: 'Traduz mudanças em hardware, software e serviços digitais para decisões práticas de compra e uso.' },
  'lila-dev': { role: 'Desenvolvedora e educadora', bio: 'Escreve sobre programação com exemplos aplicáveis, trade-offs e manutenção de projetos reais.' },
  'maya-pixel': { role: 'Designer de produto', bio: 'Analisa interfaces, sistemas de design e ferramentas de criação com foco em acessibilidade e fluxo de trabalho.' },
  'bia-mobile': { role: 'Analista mobile', bio: 'Investiga recursos de smartphones, privacidade e experiências móveis para o público brasileiro.' },
};

export function getAuthorProfile(name: string): AuthorProfile {
  const known = PROFILES[authorSlug(name)];
  return {
    name,
    role: known?.role ?? 'Colaborador Doug Design',
    bio: known?.bio ?? 'Colaborador do Doug Design, com foco em informação verificável e utilidade para o leitor.',
  };
}
