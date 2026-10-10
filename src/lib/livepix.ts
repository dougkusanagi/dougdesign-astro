// Dados públicos da meta do LivePix. A API não envia CORS para o nosso domínio, então a leitura
// acontece no build (SSG); se falhar, o cartão aparece sem a barra de progresso.
const WIDGET_ID = '0776a902-0b92-40c3-bcd2-c1291a81b995';
const ENDPOINT = `https://webservice.livepix.gg/widgets/${WIDGET_ID}`;

export const LIVEPIX_PROFILE_URL = 'https://livepix.gg/dougkusanagi';

export interface LivePixGoal {
  message: string;
  current: string;
  goal: string;
  percent: number;
}

let cached: Promise<LivePixGoal | null> | undefined;

async function load(): Promise<LivePixGoal | null> {
  try {
    const response = await fetch(ENDPOINT, { signal: AbortSignal.timeout(8000), headers: { accept: 'application/json' } });
    if (!response.ok) return null;
    const data = await response.json();
    const goal = data?.config?.goal;
    const current = data?.data?.current;
    if (!goal?.value || !current || typeof current.value !== 'number') return null;
    const percent = Math.max(0, Math.min(100, Math.round((current.value / goal.value) * 100)));
    return {
      message: String(data.config?.message ?? '').trim(),
      current: String(current.formatted ?? ''),
      goal: String(goal.formatted ?? ''),
      percent,
    };
  } catch {
    return null;
  }
}

export function getLivePixGoal(): Promise<LivePixGoal | null> {
  cached ??= load();
  return cached;
}
