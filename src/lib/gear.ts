/**
 * "Equipamento recomendado" da sidebar.
 *
 * Produtos reais da Amazon.com.br. Catálogo inicial conferido em 30/09/2026;
 * GameSir, livro de Steve Krug e SanDisk conferidos em 01/10/2026, com links
 * gerados pelo SiteStripe da conta douglopesreal-20. Preços não são exibidos.
 * A conta ainda mostra pendência de informações fiscais a concluir pelo dono.
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
  { asin: 'B0D8KXR131', name: 'GameSir G7 SE (azul)', note: 'Controle com fio para PC, Xbox One e Xbox Series X|S; versão azul' },
  { asin: '8576088509', name: 'Não me faça pensar: atualizado', note: 'Livro de Steve Krug sobre usabilidade web; edição em português' },
  { asin: 'B0B2DCZDJZ', name: 'SanDisk Extreme microSDXC 256 GB', note: 'Cartão UHS-I de 256 GB; não é microSD Express para Switch 2' },
];

export function gearUrl(item: GearItem): string {
  const base = `https://www.amazon.com.br/dp/${item.asin}`;
  return AMAZON_ASSOCIATE_TAG ? `${base}?tag=${encodeURIComponent(AMAZON_ASSOCIATE_TAG)}` : base;
}
