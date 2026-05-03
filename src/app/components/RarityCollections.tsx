import type { ReactNode } from 'react';
import { Sparkles, Diamond, Circle, Star, Crown } from 'lucide-react';
import { useHomeCards } from '../../hooks/useTCGdex';
import type { TCGCard } from '../../hooks/useTCGdex';
import type { PriceCategory } from '../../utils/priceSystem';
import { categoryColors } from '../../utils/priceSystem';
import { PokemonCard } from './PokemonCard';
import { Link } from 'react-router';

interface SectionConfig {
  category: PriceCategory;
  title: string;
  subtitle: string;
  icon: ReactNode;
  iconBg: string;
}

const SECTIONS: SectionConfig[] = [
  {
    category: 'common',
    title: 'Cartas Comunes',
    subtitle: 'Perfectas para comenzar tu colección',
    iconBg: 'linear-gradient(135deg, #9CA3AF, #6B7280)',
    icon: <Circle className="w-6 h-6 text-white" />,
  },
  {
    category: 'uncommon',
    title: 'Cartas Poco Comunes',
    subtitle: 'Más difíciles de encontrar, más valiosas',
    iconBg: 'linear-gradient(135deg, #6EE7B7, #3FA34D)',
    icon: <Star className="w-6 h-6 text-white" />,
  },
  {
    category: 'rare',
    title: 'Cartas Raras',
    subtitle: 'Ediciones especiales de alta demanda',
    iconBg: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
    icon: <Sparkles className="w-6 h-6 text-white" />,
  },
  {
    category: 'ultra-rare',
    title: 'Cartas Ultra Raras',
    subtitle: 'Las joyas más valiosas de tu colección',
    iconBg: 'linear-gradient(135deg, #D4AF37, #F59E0B)',
    icon: <Diamond className="w-6 h-6 text-white" />,
  },
  {
    category: 'legendary',
    title: 'Cartas Legendarias',
    subtitle: 'Piezas únicas para el coleccionista élite',
    iconBg: 'linear-gradient(135deg, #B8860B, #D4AF37)',
    icon: <Crown className="w-6 h-6 text-white" />,
  },
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-md">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

function RaritySection({
  config,
  cards,
}: {
  config: SectionConfig;
  cards: TCGCard[];
}) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: config.iconBg }}
          >
            {config.icon}
          </div>
          <div>
            <h2
              className="text-3xl font-bold text-[var(--charcoal)]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {config.title}
            </h2>
            <p className="text-gray-500">{config.subtitle}</p>
          </div>
        </div>
        <Link
          to={`/cards?rarity=${config.category}`}
          className="hidden sm:flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 hover:border-[var(--wine-red)] hover:text-[var(--wine-red)] transition-colors"
          style={{ color: categoryColors[config.category] }}
        >
          Ver todas →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <PokemonCard
            key={card.id}
            id={card.id}
            name={card.name}
            type={card.types?.[0] ?? card.setName ?? ''}
            rarity={card.priceCategory}
            price={card.price}
            image={card.image}
            hp={card.hp}
            navigable
          />
        ))}
      </div>
    </div>
  );
}

export function RarityCollections() {
  const { byCategory, loading } = useHomeCards(4);

  return (
    <div className="py-16 px-4 space-y-16">
      {SECTIONS.map((section) => {
        const cards = byCategory[section.category] ?? [];

        if (loading) {
          return (
            <div key={section.category} className="max-w-7xl mx-auto">
              <div className="flex items-center space-x-3 mb-8">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: section.iconBg }}
                >
                  {section.icon}
                </div>
                <div>
                  <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          );
        }

        if (cards.length === 0) return null;

        return <RaritySection key={section.category} config={section} cards={cards} />;
      })}
    </div>
  );
}
