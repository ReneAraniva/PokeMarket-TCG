import { useState, useEffect } from 'react';
import {
  getCategoryFromPosition,
  getCardPrice,
  rarityToCategory,
  type PriceCategory,
} from '../utils/priceSystem';

export interface TCGCard {
  id: string;
  localId: string;
  name: string;
  image: string;
  rarity?: string;
  hp?: number;
  types?: string[];
  priceCategory: PriceCategory;
  price: number;
  setName?: string;
  set?: { id: string; name: string };
  evolvesFrom?: string;
  description?: string;
  attacks?: { name: string; damage?: string; description?: string }[];
}

const TYPE_TRANSLATIONS: Record<string, string> = {
  Fire: 'Fuego',
  Water: 'Agua',
  Grass: 'Planta',
  Lightning: 'Eléctrico',
  Psychic: 'Psíquico',
  Fighting: 'Lucha',
  Darkness: 'Oscuro',
  Metal: 'Metal',
  Fairy: 'Hada',
  Dragon: 'Dragón',
  Colorless: 'Normal',
};

export function translateType(type: string): string {
  return TYPE_TRANSLATIONS[type] ?? type;
}

export function cardImageUrl(base: string): string {
  if (!base) return '';
  return `${base}/high.webp`;
}

const BASE = 'https://api.tcgdex.net/v2/en';
// Sets for the full catalog page
const SETS_TO_LOAD = ['swsh1', 'swsh3', 'swsh4', 'swsh5', 'swsh7', 'swsh9'];
// Sets sampled for the home page rarity grid (chosen for range diversity)
const HOME_SETS = ['swsh1', 'swsh5', 'swsh7', 'swsh9'];

interface RawBrief {
  id: string;
  localId: string;
  name: string;
  image: string;
}

interface RawSet {
  id: string;
  name: string;
  cards: RawBrief[];
}

async function fetchSet(setId: string): Promise<TCGCard[]> {
  const res = await fetch(`${BASE}/sets/${setId}`);
  if (!res.ok) throw new Error(`Set ${setId} failed`);
  const data: RawSet = await res.json();
  const total = data.cards.length;
  return data.cards.map((c) => {
    const localNum = parseInt(c.localId, 10);
    const priceCategory = isNaN(localNum)
      ? 'common'
      : getCategoryFromPosition(localNum, total);
    return {
      id: c.id,
      localId: c.localId,
      name: c.name,
      image: cardImageUrl(c.image),
      priceCategory,
      price: getCardPrice(c.id, priceCategory),
      setName: data.name,
    };
  });
}

export async function fetchCardDetail(id: string): Promise<TCGCard | null> {
  try {
    const res = await fetch(`${BASE}/cards/${id}`);
    if (!res.ok) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = await res.json();
    const priceCategory = rarityToCategory(c.rarity);
    return {
      id: c.id,
      localId: c.localId,
      name: c.name,
      image: cardImageUrl(c.image),
      rarity: c.rarity,
      hp: c.hp,
      types: (c.types ?? []).map(translateType),
      priceCategory,
      price: getCardPrice(c.id, priceCategory),
      setName: c.set?.name,
      set: c.set,
      evolvesFrom: c.evolveFrom,
      description: c.description,
      attacks: c.attacks,
    };
  } catch {
    return null;
  }
}

export interface CardFilters {
  search?: string;
  priceCategory?: PriceCategory | '';
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}

const cache: Record<string, TCGCard[]> = {};

const PER_CATEGORY: Record<PriceCategory, number> = {
  common: 20,
  uncommon: 18,
  rare: 18,
  'ultra-rare': 12,
  legendary: 12,
};

function sampleByRarity(set: TCGCard[]): TCGCard[] {
  const buckets: Partial<Record<PriceCategory, TCGCard[]>> = {};
  for (const card of set) {
    if (!buckets[card.priceCategory]) buckets[card.priceCategory] = [];
    buckets[card.priceCategory]!.push(card);
  }
  return (Object.keys(PER_CATEGORY) as PriceCategory[]).flatMap(
    (cat) => (buckets[cat] ?? []).slice(0, PER_CATEGORY[cat])
  );
}

async function loadSet(setId: string): Promise<TCGCard[]> {
  if (cache[setId]) return cache[setId];
  const cards = await fetchSet(setId);
  cache[setId] = cards;
  return cards;
}

export function useCards(filters: CardFilters = {}) {
  const [allCards, setAllCards] = useState<TCGCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const settled = await Promise.allSettled(SETS_TO_LOAD.map(loadSet));
        settled.forEach((r, i) => {
          if (r.status === 'rejected') console.error(`Set ${SETS_TO_LOAD[i]} failed:`, r.reason);
        });
        const results = settled
          .filter((r): r is PromiseFulfilledResult<TCGCard[]> => r.status === 'fulfilled')
          .map((r) => r.value);
        if (!cancelled) {
          if (results.length === 0) {
            setError('No se pudieron cargar las cartas. Intenta de nuevo.');
          } else {
            setAllCards(results.flatMap(sampleByRarity));
          }
        }
      } catch {
        if (!cancelled) setError('No se pudieron cargar las cartas. Intenta de nuevo.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = allCards.filter((c) => {
    if (
      filters.search &&
      !c.name.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    if (filters.priceCategory && c.priceCategory !== filters.priceCategory)
      return false;
    if (
      filters.type &&
      c.types &&
      !c.types.some((t) =>
        t.toLowerCase().includes(filters.type!.toLowerCase())
      )
    )
      return false;
    if (filters.minPrice != null && c.price < filters.minPrice) return false;
    if (filters.maxPrice != null && c.price > filters.maxPrice) return false;
    return true;
  });

  return { cards, loading, error, total: allCards.length };
}

export function useCard(id: string) {
  const [card, setCard] = useState<TCGCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    // The catalog uses position-based pricing which is authoritative.
    // Always prefer the cached priceCategory/price over the API's rarity string.
    const cached = Object.values(cache).flat().find((c) => c.id === id) ?? null;

    fetchCardDetail(id).then((data) => {
      if (!cancelled) {
        if (data) {
          const finalCard = cached
            ? { ...data, priceCategory: cached.priceCategory, price: cached.price }
            : data;
          setCard(finalCard);
          setNotFound(false);
        } else {
          setCard(cached);
          setNotFound(!cached);
        }
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { card, loading, notFound };
}

export function useHomeCards(perCategory = 4) {
  const [byCategory, setByCategory] = useState<Partial<Record<PriceCategory, TCGCard[]>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const settled = await Promise.allSettled(HOME_SETS.map(loadSet));
        if (cancelled) return;
        const all = settled
          .filter((r): r is PromiseFulfilledResult<TCGCard[]> => r.status === 'fulfilled')
          .flatMap((r) => r.value);
        const buckets: Partial<Record<PriceCategory, TCGCard[]>> = {};
        for (const card of all) {
          const cat = card.priceCategory;
          if (!buckets[cat]) buckets[cat] = [];
          if (buckets[cat]!.length < perCategory) buckets[cat]!.push(card);
        }
        setByCategory(buckets);
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [perCategory]);

  return { byCategory, loading };
}

export function useTopPremiumCards(count = 10) {
  const [cards, setCards] = useState<TCGCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const settled = await Promise.allSettled(HOME_SETS.map(loadSet));
        if (cancelled) return;
        const all = settled
          .filter((r): r is PromiseFulfilledResult<TCGCard[]> => r.status === 'fulfilled')
          .flatMap((r) => r.value);
        const sorted = [...all].sort((a, b) => b.price - a.price);
        setCards(sorted.slice(0, count));
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [count]);

  return { cards, loading };
}

export function useTopCards() {
  const [cards, setCards] = useState<TCGCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const set = await loadSet('swsh3');
        if (!cancelled) {
          const sorted = [...set].sort(
            (a, b) => parseInt(b.localId, 10) - parseInt(a.localId, 10)
          );
          setCards(sorted.slice(0, 10));
        }
      } catch {
        // silent fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { cards, loading };
}
