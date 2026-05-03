import { ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { useTopCards } from '../../hooks/useTCGdex';
import type { PriceCategory } from '../../utils/priceSystem';
import { PokemonCard } from './PokemonCard';

const BADGE: Record<PriceCategory, string> = {
  legendary: '👑 Legendaria',
  'ultra-rare': '💎 Premium',
  rare: '⭐ Destacada',
  uncommon: '✦ Poco Común',
  common: '',
};

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-44 sm:w-56 md:w-72 bg-white rounded-2xl overflow-hidden animate-pulse shadow-md">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-7 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export function TopPremium() {
  const navigate = useNavigate();
  const { cards, loading } = useTopCards();
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardWidth = 304; // w-72 + gap-6

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-10 md:py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--gold)] to-yellow-300 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--charcoal)]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Top 10 Premium
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">Las cartas más valiosas del mercado</p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => navigate('/top10')}
              className="hidden sm:block text-sm font-semibold text-[var(--wine-red)] hover:text-[var(--deep-red)] transition-colors mr-2"
            >
              Ver todas →
            </button>
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : cards.map((card) => (
                <div key={card.id} className="flex-shrink-0 w-44 sm:w-56 md:w-72">
                  <PokemonCard
                    id={card.id}
                    name={card.name}
                    type={card.types?.[0] ?? card.setName ?? ''}
                    rarity={card.priceCategory}
                    price={card.price}
                    image={card.image}
                    hp={card.hp}
                    badge={BADGE[card.priceCategory] || undefined}
                    navigable
                  />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
