import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useCards, type CardFilters } from '../../hooks/useTCGdex';
import { isWishlisted, toggleWishlist, isPurchased } from '../../utils/storage';
import { categoryColors, categoryLabels, type PriceCategory } from '../../utils/priceSystem';
import { Search, SlidersHorizontal, Loader2, Heart } from 'lucide-react';

const RARITIES: { value: PriceCategory | ''; label: string }[] = [
  { value: '', label: 'Todas las rarezas' },
  { value: 'common', label: 'Común' },
  { value: 'uncommon', label: 'Poco Común' },
  { value: 'rare', label: 'Rara' },
  { value: 'ultra-rare', label: 'Ultra Rara' },
  { value: 'legendary', label: 'Legendaria' },
];

const PRICE_RANGES: { label: string; min?: number; max?: number }[] = [
  { label: 'Todos los precios' },
  { label: 'Menor a $50', max: 50 },
  { label: '$50 – $150', min: 50, max: 150 },
  { label: '$150 – $500', min: 150, max: 500 },
  { label: '$500 – $1,500', min: 500, max: 1500 },
  { label: 'Mayor a $1,500', min: 1500 },
];

interface CardItemProps {
  id: string;
  name: string;
  image: string;
  priceCategory: PriceCategory;
  price: number;
  types?: string[];
}

function CardItem({ id, name, image, priceCategory, price, types }: CardItemProps) {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(() => isWishlisted(id));
  const purchased = isPurchased(id);
  const isLegendary = priceCategory === 'legendary';
  const rarityColor = categoryColors[priceCategory];

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl"
      style={{
        boxShadow: isLegendary
          ? '0 0 20px rgba(255,215,0,0.25), 0 8px 24px rgba(0,0,0,0.15)'
          : '0 8px 24px rgba(0,0,0,0.10)',
        border: isLegendary
          ? '1.5px solid rgba(212,175,55,0.35)'
          : '1px solid #f1f1f1',
      }}
      onClick={() => navigate(`/cards/${id}`)}
    >
      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setWishlisted(toggleWishlist(id));
        }}
        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
      >
        <Heart
          className="w-5 h-5"
          fill={wishlisted ? '#D72638' : 'none'}
          stroke={wishlisted ? '#D72638' : '#1E1E1E'}
        />
      </button>

      {/* Legendary hover glow */}
      {isLegendary && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255,215,0,0.08), transparent 70%)',
          }}
        />
      )}

      {/* Card image */}
      <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/300x420/f5f5f5/aaa?text=Card';
          }}
        />
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm text-[var(--charcoal)] line-clamp-1">
          {name}
        </h3>
        {types && types.length > 0 && (
          <p className="text-xs text-gray-500">{types.join(' · ')}</p>
        )}
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-semibold text-white px-2 py-0.5 rounded"
            style={{ backgroundColor: rarityColor }}
          >
            {categoryLabels[priceCategory]}
          </span>
          <span className="font-bold text-[var(--wine-red)] text-sm">
            ${price.toLocaleString()}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/cards/${id}`);
          }}
          disabled={purchased}
          className="w-full bg-gradient-to-r from-[var(--wine-red)] to-[var(--deep-red)] text-white py-2 rounded-xl text-xs font-semibold hover:shadow-md transition-all disabled:opacity-60"
        >
          {purchased ? '✓ Adquirida' : 'Ver detalle'}
        </button>
      </div>
    </div>
  );
}

export function CardsPage() {
  const [searchParams] = useSearchParams();

  // input state (what the user is typing)
  const [inputSearch, setInputSearch] = useState(searchParams.get('search') ?? '');
  const [rarity, setRarity] = useState<PriceCategory | ''>(
    (searchParams.get('rarity') as PriceCategory) ?? ''
  );
  const [priceIdx, setPriceIdx] = useState(0);

  // applied filter state (only changes on button click / enter / URL param change)
  const [appliedSearch, setAppliedSearch] = useState(searchParams.get('search') ?? '');

  useEffect(() => {
    const q = searchParams.get('search') ?? '';
    setInputSearch(q);
    setAppliedSearch(q);
    const r = searchParams.get('rarity') as PriceCategory | null;
    if (r) setRarity(r);
  }, [searchParams]);

  const handleSearch = () => setAppliedSearch(inputSearch.trim());

  const handleClear = () => {
    setInputSearch('');
    setAppliedSearch('');
    setRarity('');
    setPriceIdx(0);
  };

  const priceRange = PRICE_RANGES[priceIdx];
  const filters: CardFilters = {
    search: appliedSearch,
    priceCategory: rarity,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
  };

  const { cards, loading, error } = useCards(filters);

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--wine-red)] via-[var(--deep-red)] to-[#8B2635] py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1
            className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Explorar Cartas
          </h1>
          <p className="text-white/80 text-lg">
            Cartas reales de TCGdex · Rarezas · Colecciones
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 mb-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <form
            className="flex flex-col md:flex-row gap-4"
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                placeholder="Buscar carta por nombre..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--wine-red)] focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                type="submit"
                className="px-5 py-3 bg-gradient-to-r from-[var(--wine-red)] to-[var(--deep-red)] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Buscar</span>
              </button>
              <select
                value={rarity}
                onChange={(e) =>
                  setRarity(e.target.value as PriceCategory | '')
                }
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--wine-red)] cursor-pointer min-w-[150px]"
              >
                {RARITIES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <select
                value={priceIdx}
                onChange={(e) => setPriceIdx(Number(e.target.value))}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--wine-red)] cursor-pointer min-w-[160px]"
              >
                {PRICE_RANGES.map((p, i) => (
                  <option key={i} value={i}>
                    {p.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden lg:inline">Limpiar</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-[var(--wine-red)] animate-spin mb-4" />
            <p className="text-gray-500">Cargando cartas desde TCGdex...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-24">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-gray-500 mb-6 text-sm">
              {cards.length} carta{cards.length !== 1 ? 's' : ''} encontrada
              {cards.length !== 1 ? 's' : ''}
            </p>
            {cards.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-gray-400 text-xl">
                  No se encontraron cartas con esos filtros.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {cards.map((card) => (
                  <CardItem
                    key={card.id}
                    id={card.id}
                    name={card.name}
                    image={card.image}
                    priceCategory={card.priceCategory}
                    price={card.price}
                    types={card.types}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
