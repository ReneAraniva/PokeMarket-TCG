import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="bg-[var(--charcoal)] text-white py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pokebola-pokeball-png-0.png/960px-Pokebola-pokeball-png-0.png"
                alt="Pokeball"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                PokéCards Market
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              La plataforma premium para coleccionistas de cartas Pokémon.
              Autenticidad garantizada · Pago seguro con PayPal.
            </p>
          </div>

          {/* Explorar */}
          <div>
            <h3 className="font-semibold mb-4">Explorar</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/cards" className="hover:text-white transition-colors">Todas las cartas</Link></li>
              <li><Link to="/top10" className="hover:text-white transition-colors">Top 10 Premium</Link></li>
              <li><Link to="/cards?rarity=legendary" className="hover:text-white transition-colors">Cartas Legendarias</Link></li>
              <li><Link to="/cards?rarity=ultra-rare" className="hover:text-white transition-colors">Ultra Raras</Link></li>
            </ul>
          </div>

          {/* Mi Cuenta */}
          <div>
            <h3 className="font-semibold mb-4">Mi Cuenta</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/inventory" className="hover:text-white transition-colors">Mi Inventario</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Carrito de compras</Link></li>
              <li><Link to="/inventory" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/cards" className="hover:text-white transition-colors">Buscar cartas</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <p>© 2026 PokéCards Market. Todos los derechos reservados.</p>
          <p>Datos de cartas proporcionados por <span className="text-gray-400">TCGdex API</span></p>
        </div>
      </div>
    </footer>
  );
}
