export async function triggerDeploy(): Promise<{ ok: boolean; status: number }> {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) {
    throw new Error('VERCEL_DEPLOY_HOOK_URL ausente.');
  }
  const response = await fetch(hook, { method: 'POST' });
  return { ok: response.ok, status: response.status };
}
