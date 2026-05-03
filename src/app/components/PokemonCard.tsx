import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { isWishlisted, toggleWishlist, isPurchased, isInCart, addToCart, removeFromCart } from '../../utils/storage';
import { categoryColors, categoryLabels, type PriceCategory } from '../../utils/priceSystem';

interface PokemonCardProps {
  id: string | number;
  name: string;
  type: string;
  rarity: PriceCategory;
  price: number;
  image: string;
  hp?: number;
  badge?: string;
  navigable?: boolean;
}

export function PokemonCard({
  id,
  name,
  type,
  rarity,
  price,
  image,
  hp,
  badge,
  navigable,
}: PokemonCardProps) {
  const navigate = useNavigate();
  const cardId = String(id);
  const [wishlisted, setWishlisted] = useState(() => isWishlisted(cardId));
  const [inCart, setInCart] = useState(() => isInCart(cardId));
  const [isHovered, setIsHovered] = useState(false);
  const purchased = isPurchased(cardId);
  const isLegendary = rarity === 'legendary';

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlisted(toggleWishlist(cardId));
  };

  const handleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCart) {
      removeFromCart(cardId);
      setInCart(false);
    } else {
      addToCart({ id: cardId, name, priceCategory: rarity, price, image, type });
      setInCart(true);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        boxShadow: isLegendary
          ? '0 0 20px rgba(255,215,0,0.25), 0 8px 24px rgba(0,0,0,0.15)'
          : '0 8px 24px rgba(0,0,0,0.10)',
        border: isLegendary
          ? '1.5px solid rgba(212,175,55,0.35)'
          : '1px solid #f1f1f1',
        cursor: navigable ? 'pointer' : 'default',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigable && navigate(`/cards/${cardId}`)}
    >
      {badge && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-[var(--gold)] to-yellow-300 text-[var(--charcoal)] px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
          <Star className="w-3 h-3" fill="currentColor" />
          <span>{badge}</span>
        </div>
      )}

      <button
        onClick={handleWishlist}
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

      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/300x420/f5f5f5/aaa?text=Card';
          }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${categoryColors[rarity]}20, transparent)`,
          }}
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-[var(--charcoal)] line-clamp-1">
              {name}
            </h3>
            <p className="text-sm text-gray-500">{type}</p>
          </div>
          {hp && (
            <div className="bg-red-50 px-2 py-1 rounded-md ml-2 flex-shrink-0">
              <span className="text-xs font-semibold text-red-600">{hp} HP</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span
            className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
            style={{ backgroundColor: categoryColors[rarity] }}
          >
            {categoryLabels[rarity]}
          </span>
          <p className="text-2xl font-bold text-[var(--wine-red)]">
            ${price.toLocaleString()}
          </p>
        </div>

        {purchased ? (
          <button
            disabled
            className="w-full bg-gray-200 text-gray-500 py-2.5 rounded-xl font-semibold flex items-center justify-center space-x-2 cursor-not-allowed"
          >
            <span>✓ Adquirida</span>
          </button>
        ) : (
          <button
            onClick={handleCart}
            className={`w-full py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 group/btn ${
              inCart
                ? 'bg-green-600 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-[var(--wine-red)] to-[var(--deep-red)] text-white hover:shadow-lg'
            }`}
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span>{inCart ? 'En carrito ✓' : 'Agregar al carrito'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
