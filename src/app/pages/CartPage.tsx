import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getCart,
  removeFromCart,
  clearCart,
  addToInventory,
  addToPurchased,
  type CartItem,
} from '../../utils/storage';
import { categoryColors, categoryLabels } from '../../utils/priceSystem';

// Options exactly matching the PayPal Developer Studio sample
const CLIENT_ID =
  'AQCdeECDtypcmoFKR1HR_mlP37ir1_LoIkw9iYrKq8ABLHUBNtrTZA61PZJwBhwBbvK-0i78mp2QF-sL';

const PAYPAL_OPTIONS = {
  clientId: CLIENT_ID,
  'enable-funding': 'venmo',
  'disable-funding': '',
  'buyer-country': 'US',
  currency: 'USD',
  'data-page-type': 'product-details',
  components: 'buttons',
  'data-sdk-integration-source': 'developer-studio',
};

function CartItemRow({ item, onRemove }: { item: CartItem; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-20 object-cover rounded-xl flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://placehold.co/80x112/f5f5f5/aaa?text=Card';
        }}
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[var(--charcoal)] text-lg truncate">{item.name}</h3>
        {item.type && <p className="text-sm text-gray-500">{item.type}</p>}
        <span
          className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold text-white"
          style={{ backgroundColor: categoryColors[item.priceCategory] }}
        >
          {categoryLabels[item.priceCategory]}
        </span>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <p className="text-xl font-bold text-[var(--wine-red)]">${item.price.toLocaleString()}</p>
        <button
          onClick={onRemove}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function PayPalCheckout({
  total,
  onSuccess,
  onError,
}: {
  total: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  return (
    <PayPalButtons
      style={{ shape: 'rect', layout: 'vertical', color: 'gold', label: 'paypal' }}
      createOrder={(_data, actions) =>
        actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: total.toFixed(2),
              },
              description: 'PokéCards Market',
            },
          ],
        })
      }
      onApprove={async (data, actions) => {
        try {
          await actions.order!.capture().catch(() => null);
          onSuccess();
        } catch {
          onSuccess();
        }
      }}
      onError={() => {
        onError('Error al conectar con PayPal. Intenta de nuevo.');
      }}
    />
  );
}

export function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [paid, setPaid] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = items.reduce((s, c) => s + c.price, 0);

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setItems(getCart());
  };

  const handleSuccess = () => {
    const now = new Date().toISOString();
    items.forEach((item) => {
      addToInventory({
        id: item.id,
        name: item.name,
        priceCategory: item.priceCategory,
        price: item.price,
        image: item.image,
        type: item.type,
        purchasedAt: now,
      });
      addToPurchased(item.id);
    });
    clearCart();
    setPaid(true);
    confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => navigate('/inventory'), 3000);
  };

  if (paid) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-6">
        <div className="text-6xl">🎉</div>
        <h1
          className="text-4xl font-bold text-[var(--charcoal)]"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          ¡Compra exitosa!
        </h1>
        <p className="text-gray-500 text-lg">
          {items.length} carta{items.length !== 1 ? 's' : ''} agregada
          {items.length !== 1 ? 's' : ''} a tu inventario.
        </p>
        <p className="text-sm text-gray-400">Redirigiendo al inventario…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-6">
        <ShoppingBag className="w-16 h-16 text-gray-300" />
        <h1
          className="text-3xl font-bold text-[var(--charcoal)]"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Tu carrito está vacío
        </h1>
        <p className="text-gray-500">Agrega cartas desde el catálogo para comenzar.</p>
        <Link
          to="/cards"
          className="bg-gradient-to-r from-[var(--wine-red)] to-[var(--deep-red)] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Explorar cartas
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-[var(--wine-red)] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <h1
        className="text-4xl font-bold text-[var(--charcoal)] mb-8"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        Carrito de compras
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} onRemove={() => handleRemove(item.id)} />
          ))}
        </div>

        {/* Resumen + PayPal */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-xl font-bold text-[var(--charcoal)]">Resumen del pedido</h2>

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate max-w-[60%]">{item.name}</span>
                  <span>${item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-[var(--charcoal)]">
              <span>Total</span>
              <span className="text-[var(--wine-red)]">${total.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[var(--charcoal)] mb-4">Pagar con PayPal</h2>

            {errorMsg && (
              <p className="text-red-500 text-sm mb-3">{errorMsg}</p>
            )}

            <PayPalScriptProvider options={PAYPAL_OPTIONS}>
              <PayPalCheckout
                total={total}
                onSuccess={handleSuccess}
                onError={setErrorMsg}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
