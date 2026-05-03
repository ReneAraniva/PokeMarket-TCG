import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  getInventory,
  getWishlist,
  getTotalInvested,
  type StoredCard,
} from '../../utils/storage';
import { categoryColors, categoryLabels } from '../../utils/priceSystem';
import { fetchCardDetail, type TCGCard } from '../../hooks/useTCGdex';
import { Package, Heart, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';

function CardTile({ card }: { card: StoredCard }) {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300 group"
      onClick={() => navigate(`/cards/${card.id}`)}
    >
      <div className="aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/300x420/f5f5f5/aaa?text=Card';
          }}
        />
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm text-[var(--charcoal)] line-clamp-1">{card.name}</h3>
        <div className="flex items-center justify-between">
          <span
            className="text-xs text-white px-2 py-0.5 rounded"
            style={{ backgroundColor: categoryColors[card.priceCategory] }}
          >
            {categoryLabels[card.priceCategory]}
          </span>
          <span className="font-bold text-[var(--wine-red)] text-sm">${card.price.toLocaleString()}</span>
        </div>
        <p className="text-xs text-gray-400">{new Date(card.purchasedAt).toLocaleDateString('es-ES')}</p>
      </div>
    </div>
  );
}

function WishlistTile({ card }: { card: TCGCard }) {
  const navigate = useNavigate();
  const isLegendary = card.priceCategory === 'legendary';
  return (
    <div
      className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
      style={{
        boxShadow: isLegendary
          ? '0 0 16px rgba(255,215,0,0.2), 0 4px 16px rgba(0,0,0,0.1)'
          : '0 4px 16px rgba(0,0,0,0.08)',
        border: isLegendary ? '1.5px solid rgba(212,175,55,0.35)' : '1px solid #f1f1f1',
      }}
      onClick={() => navigate(`/cards/${card.id}`)}
    >
      <div className="aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/300x420/f5f5f5/aaa?text=Card';
          }}
        />
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm text-[var(--charcoal)] line-clamp-1">{card.name}</h3>
        <div className="flex items-center justify-between">
          <span
            className="text-xs text-white px-2 py-0.5 rounded"
            style={{ backgroundColor: categoryColors[card.priceCategory] }}
          >
            {categoryLabels[card.priceCategory]}
          </span>
          <span className="font-bold text-[var(--wine-red)] text-sm">${card.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function WishlistSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

export function InventoryPage() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<StoredCard[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistCards, setWishlistCards] = useState<TCGCard[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const inv = getInventory();
    const ids = getWishlist();
    setInventory(inv);
    setWishlistIds(ids);
    setTotal(getTotalInvested());

    if (ids.length > 0) {
      setWishlistLoading(true);
      Promise.all(ids.map((id) => fetchCardDetail(id))).then((results) => {
        setWishlistCards(results.filter((c): c is TCGCard => c !== null));
        setWishlistLoading(false);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-[var(--charcoal)] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
            Mi Inventario
          </h1>
          <p className="text-gray-500">Tu colección personal de cartas PokéTCG</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--wine-red)] to-[var(--deep-red)] rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-[var(--charcoal)] mb-1">{inventory.length}</h3>
            <p className="text-gray-500">Cartas adquiridas</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-[var(--charcoal)] mb-1">{wishlistIds.length}</h3>
            <p className="text-gray-500">En wishlist</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--gold)] to-yellow-300 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-[var(--charcoal)] mb-1">${total.toLocaleString()}</h3>
            <p className="text-gray-500">Total invertido</p>
          </div>
        </div>

        {/* Purchased cards */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--charcoal)]">Mis Cartas</h2>
            <button
              onClick={() => navigate('/cards')}
              className="text-[var(--wine-red)] hover:text-[var(--deep-red)] font-semibold flex items-center space-x-1 transition-colors"
            >
              <span>Explorar más</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {inventory.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-6">No tienes cartas todavía</p>
              <button
                onClick={() => navigate('/cards')}
                className="bg-gradient-to-r from-[var(--wine-red)] to-[var(--deep-red)] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Explorar cartas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {inventory.map((card) => (
                <CardTile key={`${card.id}-${card.purchasedAt}`} card={card} />
              ))}
            </div>
          )}
        </div>

        {/* Wishlist */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--charcoal)]">Wishlist</h2>
            <span className="text-gray-400 text-sm">
              {wishlistIds.length} carta{wishlistIds.length !== 1 ? 's' : ''}
            </span>
          </div>

          {wishlistIds.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">Agrega cartas a tu wishlist con el botón ❤️</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {wishlistLoading
                ? wishlistIds.map((id) => <WishlistSkeleton key={id} />)
                : wishlistCards.map((card) => <WishlistTile key={card.id} card={card} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
