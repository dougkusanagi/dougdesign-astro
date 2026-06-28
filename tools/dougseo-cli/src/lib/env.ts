import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './config';

const ENV_FILES = [
  path.join(REPO_ROOT, '.env'),
  path.join(REPO_ROOT, '.env.local'),
  path.join(REPO_ROOT, 'tools', 'dougseo-cli', '.env'),
  path.join(REPO_ROOT, 'tools', 'dougseo-cli', '.env.local'),
];

function parseEnvFile(contents: string): Record<string, string> {
  const entries: Record<string, string> = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const normalized = line.startsWith('export ') ? line.slice(7).trim() : line;
    const equalsIndex = normalized.indexOf('=');
    if (equalsIndex === -1) continue;

    const key = normalized.slice(0, equalsIndex).trim();
    let value = normalized.slice(equalsIndex + 1).trim();
    if (!key) continue;

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
      value = value.replaceAll('\\n', '\n').replaceAll('\\r', '\r').replaceAll('\\"', '"').replaceAll("\\'", "'").replaceAll('\\\\', '\\');
    } else {
      const hashIndex = value.indexOf(' #');
      if (hashIndex !== -1) value = value.slice(0, hashIndex).trim();
    }

    entries[key] = value;
  }

  return entries;
}

export function loadRepoEnv(): void {
  const merged: Record<string, string> = {};

  for (const filePath of ENV_FILES) {
    if (!fs.existsSync(filePath)) continue;
    Object.assign(merged, parseEnvFile(fs.readFileSync(filePath, 'utf8')));
  }

  for (const [key, value] of Object.entries(merged)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
