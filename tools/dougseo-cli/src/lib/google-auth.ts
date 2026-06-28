import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './config';

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const SEARCH_CONSOLE_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
}

let cachedAccessToken: { token: string; expiresAt: number; fingerprint: string } | null = null;

function base64UrlEncode(value: Buffer | string): string {
  return Buffer.from(value)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function readJson(value: string): ServiceAccountCredentials {
  const parsed = JSON.parse(value) as Partial<ServiceAccountCredentials>;
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('Credenciais de service account invalidas: faltam client_email ou private_key.');
  }
  return { client_email: parsed.client_email, private_key: parsed.private_key };
}

function readServiceAccountCredentials(): ServiceAccountCredentials {
  const encoded = process.env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON_B64;
  if (encoded) return readJson(Buffer.from(encoded, 'base64').toString('utf8'));

  const rawJson = process.env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON;
  if (rawJson) return readJson(rawJson);

  const filePath = process.env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_FILE || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (filePath) {
    const resolved = path.isAbsolute(filePath) ? filePath : path.join(REPO_ROOT, filePath);
    return readJson(fs.readFileSync(resolved, 'utf8'));
  }

  throw new Error('Nenhuma credencial de service account configurada.');
}

async function mintServiceAccountAccessToken(credentials: ServiceAccountCredentials): Promise<{ token: string; expiresIn: number }> {
  const now = Math.floor(Date.now() / 1000);
  const unsignedJwt = [
    base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
    base64UrlEncode(JSON.stringify({
      iss: credentials.client_email,
      scope: SEARCH_CONSOLE_SCOPE,
      aud: TOKEN_ENDPOINT,
      iat: now,
      exp: now + 3600,
    })),
  ].join('.');

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedJwt);
  signer.end();
  const jwt = `${unsignedJwt}.${base64UrlEncode(signer.sign(credentials.private_key))}`;

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const payload = await response.json() as { access_token?: string; expires_in?: number; error?: string; error_description?: string };
  if (!response.ok) {
    throw new Error(`Falha ao obter token do Google: ${payload.error_description || payload.error || response.statusText}`);
  }
  if (!payload.access_token || !payload.expires_in) {
    throw new Error('Resposta do Google sem access_token ou expires_in.');
  }

  return { token: payload.access_token, expiresIn: payload.expires_in };
}

export async function resolveSearchConsoleAccessToken(): Promise<string> {
  const explicitToken = process.env.GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN || process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
  if (explicitToken) return explicitToken;

  const credentials = readServiceAccountCredentials();
  const fingerprint = crypto.createHash('sha256').update(`${credentials.client_email}\n${credentials.private_key}`).digest('hex');
  const now = Date.now();

  if (cachedAccessToken && cachedAccessToken.fingerprint === fingerprint && now < cachedAccessToken.expiresAt - 60_000) {
    return cachedAccessToken.token;
  }

  const { token, expiresIn } = await mintServiceAccountAccessToken(credentials);
  cachedAccessToken = {
    token,
    expiresAt: now + expiresIn * 1000,
    fingerprint,
  };

  return token;
}
