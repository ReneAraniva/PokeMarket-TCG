export type PriceCategory = 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';

const rarityMap: Record<string, PriceCategory> = {
  Common: 'common',
  Uncommon: 'uncommon',
  Rare: 'rare',
  'Rare Holo': 'rare',
  Promo: 'rare',
  'Rare Holo V': 'ultra-rare',
  'Rare Holo VMAX': 'legendary',
  'Rare Holo VSTAR': 'ultra-rare',
  'Amazing Rare': 'ultra-rare',
  'Rare Rainbow': 'legendary',
  'Rare Secret': 'legendary',
  'Rare Shiny': 'legendary',
  'Rare Shiny GX': 'legendary',
  'Rare Ultra': 'ultra-rare',
  'Rare Holo GX': 'ultra-rare',
  'Rare Holo EX': 'ultra-rare',
  'Trainer Gallery Rare Holo': 'ultra-rare',
  'Rare BREAK': 'rare',
  'Rare Prism Star': 'ultra-rare',
  'Rare Holo LV.X': 'ultra-rare',
  LEGEND: 'legendary',
};

const priceRanges: Record<PriceCategory, [number, number]> = {
  common: [10, 40],
  uncommon: [50, 120],
  rare: [150, 400],
  'ultra-rare': [500, 1500],
  legendary: [2000, 5000],
};

export const categoryColors: Record<PriceCategory, string> = {
  common: '#8E8E8E',
  uncommon: '#3FA34D',
  rare: '#4A90E2',
  'ultra-rare': '#D4AF37',
  legendary: '#B8860B',
};

export const categoryLabels: Record<PriceCategory, string> = {
  common: 'Común',
  uncommon: 'Poco Común',
  rare: 'Rara',
  'ultra-rare': 'Ultra Rara',
  legendary: 'Legendaria',
};

export function rarityToCategory(rarity?: string): PriceCategory {
  if (!rarity) return 'common';
  return rarityMap[rarity] ?? 'rare';
}

export function getCardPrice(cardId: string, category: PriceCategory): number {
  const [min, max] = priceRanges[category];
  let hash = 0;
  for (let i = 0; i < cardId.length; i++) {
    hash = ((hash << 5) - hash + cardId.charCodeAt(i)) | 0;
  }
  const ratio = (Math.abs(hash) % 100) / 100;
  return Math.round(min + ratio * (max - min));
}

export function getCategoryFromPosition(localId: number, setTotal: number): PriceCategory {
  const ratio = localId / setTotal;
  if (ratio < 0.4) return 'common';
  if (ratio < 0.65) return 'uncommon';
  if (ratio < 0.85) return 'rare';
  if (ratio < 0.95) return 'ultra-rare';
  return 'legendary';
}
