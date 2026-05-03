import { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import type { TCGCard } from '../../hooks/useTCGdex';
import { addToInventory, addToPurchased } from '../../utils/storage';
import { categoryLabels } from '../../utils/priceSystem';

type Phase = 'processing' | 'success' | 'error';

interface Props {
  card: TCGCard;
  onClose: () => void;
  onSuccess: () => void;
}

export function PayPalModal({ card, onClose, onSuccess }: Props) {
  const [phase, setPhase] = useState<Phase>('processing');

  useEffect(() => {
    const timer = setTimeout(() => {
      addToInventory({
        id: card.id,
        name: card.name,
        rarity: card.rarity,
        priceCategory: card.priceCategory,
        price: card.price,
        image: card.image,
        type: card.types?.[0],
        purchasedAt: new Date().toISOString(),
      });
      addToPurchased(card.id);
      setPhase('success');

      // Confetti celebration
      import('canvas-confetti').then((m) => {
        m.default({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
      });
    }, 1800);
    return () => clearTimeout(timer);
  }, [card]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* PayPal header */}
        <div className="bg-[#003087] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-white font-bold text-xl">Pay</span>
            <span className="text-[#009CDE] font-bold text-xl">Pal</span>
            <span className="text-white/50 text-sm ml-2">Sandbox</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 text-center">
          {phase === 'processing' && (
            <>
              <div className="w-16 h-16 border-4 border-[#003087] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Procesando pago
              </h3>
              <p className="text-gray-500 mb-6">
                Conectando con PayPal Sandbox...
              </p>
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{card.name}</span>
                  <span className="font-semibold">
                    ${card.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rareza</span>
                  <span>{categoryLabels[card.priceCategory]}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-[#003087]">
                    ${card.price.toLocaleString()} USD
                  </span>
                </div>
              </div>
            </>
          )}

          {phase === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Compra realizada con éxito! 🎉
              </h3>
              <p className="text-gray-500 mb-1">
                <span className="font-semibold text-gray-700">
                  {card.name}
                </span>{' '}
                fue agregada a tu inventario.
              </p>
              <p className="text-3xl font-bold text-green-600 mb-6">
                ${card.price.toLocaleString()}
              </p>
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Ver mi inventario
              </button>
            </>
          )}

          {phase === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Transacción fallida ❌
              </h3>
              <p className="text-gray-500 mb-6">
                No se pudo procesar el pago. Por favor intenta de nuevo.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-[var(--wine-red)] text-white py-3 rounded-xl font-semibold"
              >
                Reintentar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
