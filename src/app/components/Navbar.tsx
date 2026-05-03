import { Link, useLocation } from 'react-router';
import { User, Crown } from 'lucide-react';
import { getCart } from '../../utils/storage';
import { useState, useEffect } from 'react';

export function Navbar() {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCart().length);
  }, [location]);

  const linkClass = (path: string) =>
    `transition-colors font-medium ${
      location.pathname === path
        ? 'text-[var(--wine-red)] font-semibold'
        : 'text-[var(--charcoal)] hover:text-[var(--wine-red)]'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pokebola-pokeball-png-0.png/960px-Pokebola-pokeball-png-0.png"
                alt="Pokeball"
                className="w-8 h-8 object-contain"
              />
              <span
                className="text-xl font-bold bg-gradient-to-r from-[var(--wine-red)] to-[var(--deep-red)] bg-clip-text text-transparent"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                PokéCards
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className={linkClass('/')}>Inicio</Link>
              <Link to="/cards" className={linkClass('/cards')}>Explorar</Link>
              <Link to="/top10" className={`${linkClass('/top10')} flex items-center gap-1`}>
                <Crown className="w-4 h-4 text-[var(--gold)]" />
                Top 10
              </Link>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-3">
            {/* Single cart button with badge */}
            <Link
              to="/cart"
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-medium text-sm ${
                location.pathname === '/cart'
                  ? 'bg-[var(--wine-red)] text-white border-[var(--wine-red)]'
                  : 'border-gray-200 text-[var(--charcoal)] hover:border-[var(--wine-red)] hover:text-[var(--wine-red)]'
              }`}
            >
              <span>🛒</span>
              <span className="hidden sm:inline">Carrito</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 bg-[var(--wine-red)] text-white text-xs rounded-full flex items-center justify-center font-semibold leading-none"
                  style={location.pathname === '/cart' ? { background: 'white', color: 'var(--wine-red)' } : {}}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/inventory"
              className="flex items-center space-x-2 bg-gradient-to-r from-[var(--wine-red)] to-[var(--deep-red)] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all text-sm"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Inventario</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
