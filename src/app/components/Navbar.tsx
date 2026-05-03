import { Link, useLocation } from 'react-router';
import { User, Crown, Menu, X, Home, Compass } from 'lucide-react';
import { getCart } from '../../utils/storage';
import { useState, useEffect } from 'react';

export function Navbar() {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setCartCount(getCart().length);
    setMenuOpen(false);
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
          {/* Logo */}
          <div className="flex items-center gap-6">
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

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className={`${linkClass('/')} flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors`}>
                <Home className="w-4 h-4" />
                Inicio
              </Link>
              <Link to="/cards" className={`${linkClass('/cards')} flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors`}>
                <Compass className="w-4 h-4" />
                Explorar
              </Link>
              <Link to="/top10" className={`${linkClass('/top10')} flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors`}>
                <Crown className="w-4 h-4 text-[var(--gold)]" />
                Top 10
              </Link>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              to="/cart"
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all font-medium text-sm ${
                location.pathname === '/cart'
                  ? 'bg-[var(--wine-red)] text-white border-[var(--wine-red)]'
                  : 'border-gray-200 text-[var(--charcoal)] hover:border-[var(--wine-red)] hover:text-[var(--wine-red)]'
              }`}
            >
              <span>🛒</span>
              <span className="hidden sm:inline">Carrito</span>
              {cartCount > 0 && (
                <span
                  className="w-5 h-5 bg-[var(--wine-red)] text-white text-xs rounded-full flex items-center justify-center font-semibold leading-none"
                  style={location.pathname === '/cart' ? { background: 'white', color: 'var(--wine-red)' } : {}}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/inventory"
              className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-[var(--wine-red)] to-[var(--deep-red)] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all text-sm"
            >
              <User className="w-4 h-4" />
              <span>Mi Inventario</span>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-[var(--charcoal)] hover:bg-gray-100 transition-colors"
              aria-label="Menú"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 font-medium text-[var(--charcoal)] transition-colors">
            <Home className="w-4 h-4 text-gray-400" />
            Inicio
          </Link>
          <Link to="/cards" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 font-medium text-[var(--charcoal)] transition-colors">
            <Compass className="w-4 h-4 text-gray-400" />
            Explorar Cartas
          </Link>
          <Link to="/top10" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 font-medium text-[var(--charcoal)] transition-colors">
            <Crown className="w-4 h-4 text-[var(--gold)]" />
            Top 10 Premium
          </Link>
          <Link to="/inventory" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 font-medium text-[var(--charcoal)] transition-colors">
            <User className="w-4 h-4" />
            Mi Inventario
          </Link>
        </div>
      )}
    </nav>
  );
}
