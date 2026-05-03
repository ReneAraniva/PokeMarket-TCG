import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTopCards } from '../../hooks/useTCGdex';
import {
  isWishlisted,
  toggleWishlist,
  isPurchased,
} from '../../utils/storage';
import { categoryColors, categoryLabels } from '../../utils/priceSystem';
import { Crown, Loader2, Heart } from 'lucide-react';
import type { TCGCard } from '../../hooks/useTCGdex';

function TopCard({ card, rank }: { card: TCGCard; rank: number }) {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(() => isWishlisted(card.id));
  const purchased = isPurchased(card.id);
  const isLegendary = card.priceCategory === 'legendary';
  const isUltra = card.priceCategory === 'ultra-rare';
  const rarityColor = categoryColors[card.priceCategory];

  const badges: string[] = [];
  if (isLegendary) {
    badges.push("👑 Collector's Choice", '🔥 Legendary');
  } else if (isUltra) {
    badges.push('💎 Ultra Premium');
  }

  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300"
      style={{
        boxShadow: isLegendary
          ? '0 0 25px rgba(255,215,0,0.35), 0 8px 24px rgba(0,0,0,0.2)'
          : '0 8px 24px rgba(0,0,0,0.12)',
        border: isLegendary
          ? '2px solid rgba(212,175,55,0.4)'
          : '1px solid #f1f1f1',
      }}
      onClick={() => navigate(`/cards/${card.id}`)}
    >
      {/* Rank badge */}
      <div className="absolute top-3 left-3 z-10 w-8 h-8 bg-gradient-to-br from-[var(--gold)] to-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-[var(--charcoal)] shadow-lg">
        {rank}
      </div>

      {/* Wishlist */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setWishlisted(toggleWishlist(card.id));
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
              'radial-gradient(ellipse at center, rgba(255,215,0,0.12), transparent 70%)',
          }}
        />
      )}

      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/300x420/f5f5f5/aaa?text=Card';
          }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${rarityColor}20, transparent)`,
          }}
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {badges.map((b) => (
              <span
                key={b}
                className="text-xs font-semibold text-[var(--gold)] bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200"
              >
                {b}
              </span>
            ))}
          </div>
        )}
        <h3
          className="font-bold text-[var(--charcoal)] line-clamp-1 text-sm"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {card.name}
        </h3>
        <div className="flex items-center justify-between">
          <span
            className="px-2 py-0.5 rounded text-xs font-semibold text-white"
            style={{ backgroundColor: rarityColor }}
          >
            {categoryLabels[card.priceCategory]}
          </span>
          <span className="text-base font-bold text-[var(--wine-red)]">
            ${card.price.toLocaleString()}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/cards/${card.id}`);
          }}
          disabled={purchased}
          className="w-full bg-gradient-to-r from-[var(--wine-red)] to-[var(--deep-red)] text-white py-2 rounded-xl text-xs font-semibold hover:shadow-lg transition-all disabled:opacity-60"
        >
          {purchased ? '✓ Adquirida' : 'Ver detalle'}
        </button>
      </div>
    </div>
  );
}

export function Top10Page() {
  const { cards, loading } = useTopCards();

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--charcoal)] via-[#2a1a1f] to-[var(--wine-red)] py-10 md:py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute top-10 left-16 w-48 h-48 bg-[var(--gold)] rounded-full blur-3xl" />
          <div className="absolute bottom-8 right-20 w-36 h-36 bg-[var(--gold)] rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--gold)] to-yellow-300 rounded-xl flex items-center justify-center shadow-xl mx-auto mb-5">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-3xl md:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Top 10 Premium
          </h1>
          <p className="text-white/70 text-lg mb-5">
            Las cartas más valiosas · Legendarias · Secret Rares
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-[var(--gold)] bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
              👑 Collector's Choice
            </span>
            <span className="text-xs font-semibold text-orange-300 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              🔥 Legendary
            </span>
            <span className="text-xs font-semibold text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              💎 Ultra Premium
            </span>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-[var(--gold)] animate-spin mb-4" />
            <p className="text-gray-500">Cargando cartas premium...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {cards.map((card, i) => (
              <TopCard key={card.id} card={card} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
