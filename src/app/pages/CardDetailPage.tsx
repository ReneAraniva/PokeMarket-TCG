import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useCard } from '../../hooks/useTCGdex';
import { isPurchased, isWishlisted, toggleWishlist, isInCart, addToCart, removeFromCart } from '../../utils/storage';
import { categoryColors, categoryLabels } from '../../utils/priceSystem';
import { Heart, Star, ArrowLeft, Loader2, Zap, ShoppingCart, Check } from 'lucide-react';

export function CardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { card, loading, notFound } = useCard(id ?? '');

  const [purchased] = useState(() => isPurchased(id ?? ''));
  const [wishlisted, setWishlisted] = useState(() => isWishlisted(id ?? ''));
  const [inCart, setInCart] = useState(() => isInCart(id ?? ''));

  const handleWishlist = () => {
    if (!id) return;
    setWishlisted(toggleWishlist(id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[var(--wine-red)] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando carta...</p>
        </div>
      </div>
    );
  }

  if (notFound || !card) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--cream)] gap-4">
        <p className="text-2xl text-gray-500">Carta no encontrada</p>
        <button
          onClick={() => navigate('/cards')}
          className="text-[var(--wine-red)] font-semibold hover:text-[var(--deep-red)]"
        >
          ← Volver al explorador
        </button>
      </div>
    );
  }

  const rarityColor = categoryColors[card.priceCategory];
  const rarityLabel = categoryLabels[card.priceCategory];
  const isLegendary = card.priceCategory === 'legendary';

  return (
    <div className="min-h-screen bg-[var(--cream)] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-[var(--wine-red)] hover:text-[var(--deep-red)] font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left: Image */}
            <div
              className="relative p-4 md:p-8 flex items-center justify-center min-h-[240px] md:min-h-[480px]"
              style={{
                background: `linear-gradient(135deg, ${rarityColor}18, ${rarityColor}06)`,
              }}
            >
              {isLegendary && (
                <div
                  className="absolute inset-0"
                  style={{
                    boxShadow: 'inset 0 0 80px rgba(255,215,0,0.12)',
                  }}
                />
              )}
              <div className="relative">
                {isLegendary && (
                  <div
                    className="absolute -inset-6 rounded-2xl blur-3xl opacity-35"
                    style={{
                      background:
                        'radial-gradient(ellipse, rgba(255,215,0,0.5), transparent)',
                    }}
                  />
                )}
                <img
                  src={card.image}
                  alt={card.name}
                  className="relative w-44 md:w-72 rounded-2xl shadow-2xl"
                  style={
                    isLegendary
                      ? { boxShadow: '0 0 25px rgba(255,215,0,0.35)' }
                      : {}
                  }
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/300x420/f5f5f5/aaa?text=Card';
                  }}
                />
              </div>
              {/* Wishlist overlay */}
              <button
                onClick={handleWishlist}
                className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              >
                <Heart
                  className="w-6 h-6"
                  fill={wishlisted ? '#D72638' : 'none'}
                  stroke={wishlisted ? '#D72638' : '#1E1E1E'}
                />
              </button>
            </div>

            {/* Right: Details */}
            <div className="p-4 md:p-8 space-y-4 md:space-y-6">
              <div>
                <h1
                  className="text-xl md:text-3xl font-bold text-[var(--charcoal)] mb-3"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {card.name}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="px-3 py-1 rounded-lg text-sm font-semibold text-white"
                    style={{ backgroundColor: rarityColor }}
                  >
                    {rarityLabel}
                  </span>
                  {isLegendary && (
                    <span className="text-sm font-semibold text-[var(--gold)]">
                      👑 Collector's Choice
                    </span>
                  )}
                  {card.rarity && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded font-mono">
                      {card.rarity}
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-br from-[var(--wine-red)] to-[var(--deep-red)] rounded-2xl p-6 text-white">
                <p className="text-white/70 text-sm mb-1">Precio de mercado</p>
                <p className="text-2xl md:text-4xl font-bold">
                  ${card.price.toLocaleString()}
                </p>
                <p className="text-white/60 text-xs mt-1">USD · Autenticidad garantizada</p>
              </div>

              {/* Specs */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-[var(--charcoal)] mb-3">
                  Especificaciones
                </h3>
                {card.hp != null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">HP</span>
                    <span className="font-semibold text-red-600">
                      {card.hp} HP
                    </span>
                  </div>
                )}
                {card.types && card.types.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tipo</span>
                    <span className="font-semibold">
                      {card.types.join(', ')}
                    </span>
                  </div>
                )}
                {card.setName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Set</span>
                    <span className="font-semibold">{card.setName}</span>
                  </div>
                )}
                {card.evolvesFrom && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Evoluciona de</span>
                    <span className="font-semibold">{card.evolvesFrom}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Número</span>
                  <span className="font-semibold font-mono">{card.localId}</span>
                </div>
              </div>

              {/* Attacks */}
              {card.attacks && card.attacks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[var(--charcoal)] mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Ataques
                  </h3>
                  <div className="space-y-2">
                    {card.attacks.map((atk) => (
                      <div
                        key={atk.name}
                        className="bg-gray-50 rounded-lg p-3 flex justify-between items-center"
                      >
                        <span className="font-medium text-sm">{atk.name}</span>
                        {atk.damage && (
                          <span className="text-red-600 font-bold text-sm">
                            {atk.damage}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-2">
                {purchased ? (
                  <div className="w-full bg-green-50 border border-green-200 text-green-700 py-4 rounded-xl font-semibold text-center flex items-center justify-center space-x-2">
                    <Star className="w-5 h-5" fill="currentColor" />
                    <span>Ya adquirida</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (inCart) {
                        removeFromCart(id ?? '');
                        setInCart(false);
                      } else {
                        addToCart({ id: id ?? '', name: card.name, priceCategory: card.priceCategory, price: card.price, image: card.image, type: card.types?.[0] });
                        setInCart(true);
                      }
                    }}
                    className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                      inCart
                        ? 'bg-green-600 hover:bg-red-600 text-white'
                        : 'bg-gradient-to-r from-[var(--wine-red)] to-[var(--deep-red)] text-white hover:shadow-lg'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>En carrito — quitar</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Agregar al carrito · ${card.price.toLocaleString()}</span>
                      </>
                    )}
                  </button>
                )}

                {inCart && (
                  <Link
                    to="/cart"
                    className="w-full border-2 border-[var(--wine-red)] text-[var(--wine-red)] py-3 rounded-xl font-semibold text-center flex items-center justify-center space-x-2 hover:bg-red-50 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Ir al carrito</span>
                  </Link>
                )}

                <button
                  onClick={handleWishlist}
                  className={`w-full border-2 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    wishlisted
                      ? 'border-[#D72638] text-[#D72638] bg-red-50'
                      : 'border-gray-200 text-gray-600 hover:border-[#D72638] hover:text-[#D72638]'
                  }`}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={wishlisted ? '#D72638' : 'none'}
                    stroke={wishlisted ? '#D72638' : 'currentColor'}
                  />
                  <span>
                    {wishlisted ? 'En tu wishlist' : 'Agregar a wishlist'}
                  </span>
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
                <p className="font-semibold text-green-900">✓ Carta auténtica</p>
                <p className="text-green-700">
                  Autenticidad garantizada · Envío premium asegurado
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
