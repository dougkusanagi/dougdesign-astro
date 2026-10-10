// Repassa a meta do LivePix ao navegador. A API do LivePix não envia CORS para o nosso domínio,
// então o cartão (src/components/LivePixGoal.astro) lê esta rota e atualiza a barra ao vivo.
const WIDGET_ID = '0776a902-0b92-40c3-bcd2-c1291a81b995';

export default async function handler(req, res) {
  try {
    const upstream = await fetch(`https://webservice.livepix.gg/widgets/${WIDGET_ID}`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(6000),
    });
    if (!upstream.ok) throw new Error(`LivePix respondeu ${upstream.status}`);
    const data = await upstream.json();
    const goal = data?.config?.goal;
    const current = data?.data?.current;
    if (!goal?.value || !current || typeof current.value !== 'number') throw new Error('Resposta sem meta');

    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
    res.status(200).json({
      message: String(data.config?.message ?? '').trim(),
      current: String(current.formatted ?? ''),
      goal: String(goal.formatted ?? ''),
      percent: Math.max(0, Math.min(100, Math.round((current.value / goal.value) * 100))),
    });
  } catch {
    res.setHeader('Cache-Control', 'public, s-maxage=30');
    res.status(502).json({ error: 'indisponivel' });
  }
}
