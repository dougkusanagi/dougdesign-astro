export function validateScheduledDate(value: string, now = new Date()): string {
  const match = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  const stamp = Date.parse(value);
  if (!match || !Number.isFinite(stamp)) throw new Error('Agendamento exige ISO válido com fuso e segundos, como 2026-10-05T12:00:00-03:00.');
  const zone = match[2];
  const offset = zone === 'Z' ? 0 : (zone[0] === '+' ? 1 : -1) * (Number(zone.slice(1, 3)) * 60 + Number(zone.slice(4)));
  if (Math.abs(offset) > 14 * 60 || (zone !== 'Z' && Number(zone.slice(4)) > 59) || new Date(stamp + offset * 60000).toISOString().slice(0, 19) !== match[1]) {
    throw new Error('Data ou fuso de agendamento inválidos.');
  }
  if (stamp <= now.getTime()) throw new Error('A data de agendamento deve ser futura.');
  return value;
}
