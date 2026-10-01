/**
 * "Equipamento recomendado" da sidebar.
 *
 * Produtos reais da Amazon.com.br (ASIN conferido em 30/09/2026). Preços não são
 * exibidos: mudam o tempo todo e o contrato do Programa de Associados exige
 * preços atualizados quando exibidos. Para ativar a comissão, preencha
 * AMAZON_ASSOCIATE_TAG com o ID de rastreamento da conta de Associado
 * (ex.: "dougdesign-20"); enquanto estiver vazio, os links são simples.
 */
export const AMAZON_ASSOCIATE_TAG = 'douglopesreal-20';

export interface GearItem {
  asin: string;
  name: string;
  note: string;
}

export const GEAR: GearItem[] = [
  { asin: 'B09HM94VDS', name: 'Logitech MX Master 3S', note: 'Mouse sem fio, 8K DPI, cliques silenciosos, USB-C e Bluetooth' },
  { asin: 'B0DFG9HB6V', name: 'Keychron K2 Max', note: 'Teclado mecânico sem fio, 2,4 GHz e Bluetooth, QMK/VIA' },
  { asin: 'B0DG9X4WHW', name: 'HyperX QuadCast 2 S', note: 'Microfone USB com iluminação RGB para streaming e podcast' },
  { asin: 'B0CQKLS4RP', name: 'Controle DualSense (PS5)', note: 'Controle sem fio do PlayStation 5' },
];

export function gearUrl(item: GearItem): string {
  const base = `https://www.amazon.com.br/dp/${item.asin}`;
  return AMAZON_ASSOCIATE_TAG ? `${base}?tag=${encodeURIComponent(AMAZON_ASSOCIATE_TAG)}` : base;
}
