# PokéCards Market

Plataforma de coleccionismo de cartas Pokémon TCG con catálogo real, sistema de inventario, wishlist y pago con PayPal Sandbox.

## Deployd de PokéCards

https://poketcg-market.netlify.app/

---

## Tecnologías

| Área | Tecnología |
|------|-----------|
| Framework | React 18 + TypeScript |
| Bundler | Vite 6 |
| Estilos | Tailwind CSS v4 |
| Routing | React Router v7 |
| Animaciones | Motion (motion/react) v12 |
| Pagos | @paypal/react-paypal-js v9 |
| API de cartas | [TCGdex API](https://api.tcgdex.net/v2/en/) |
| Íconos | Lucide React |
| Efectos | canvas-confetti |
| Gestor de paquetes | pnpm |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── Navbar.tsx          # Barra de navegación con badge de carrito
│   │   ├── Footer.tsx          # Footer con links funcionales
│   │   ├── HeroSection.tsx     # Hero de la homepage con CTAs
│   │   ├── TopPremium.tsx      # Carrusel top 10 cartas premium
│   │   ├── RarityCollections.tsx  # Secciones por rareza (homepage)
│   │   ├── PokemonCard.tsx     # Tarjeta reutilizable con wishlist + carrito
│   │   └── PayPalModal.tsx     # Botones PayPal integrados
│   └── pages/
│       ├── HomePage.tsx        # Página principal con animaciones
│       ├── CardsPage.tsx       # Catálogo con filtros (nombre, rareza, precio)
│       ├── CardDetailPage.tsx  # Detalle de carta individual
│       ├── CartPage.tsx        # Carrito + checkout PayPal Sandbox
│       ├── InventoryPage.tsx   # Inventario personal + wishlist
│       └── Top10Page.tsx       # Top 10 cartas premium
├── hooks/
│   └── useTCGdex.ts            # Hooks para consumir la API de TCGdex
├── utils/
│   ├── storage.ts              # Manejo de localStorage (inventario, carrito, wishlist)
│   └── priceSystem.ts          # Sistema de precios y categorías por rareza
└── styles/
    └── index.css               # Variables CSS globales y estilos base
```

---

## Rutas

| Ruta | Página |
|------|--------|
| `/` | Inicio |
| `/cards` | Explorar catálogo |
| `/cards/:id` | Detalle de carta |
| `/cart` | Carrito de compras |
| `/inventory` | Mi inventario y wishlist |
| `/top10` | Top 10 Premium |

---

## Cómo arrancar en local

### Requisitos
- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Pasos

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo
pnpm dev
```
### Build de producción

```bash
pnpm build
```

---

## Credenciales de prueba — PayPal Sandbox

Para simular compras en el entorno de pruebas usa la cuenta **comprador** de PayPal Sandbox:

| Campo | Valor |
|-------|-------|
| Correo | `panchitoelgato@personal.example.com` |
| Contraseña | `47JS@sK>` |

> Estas credenciales son exclusivas del entorno Sandbox de PayPal. No representan dinero real.

---

## Sistema de rarezas y precios

| Rareza | Color | Rango de precio |
|--------|-------|-----------------|
| Común | Gris | $10 – $50 |
| Poco Común | Verde | $50 – $150 |
| Rara | Azul | $150 – $500 |
| Ultra Rara | Morado | $500 – $1,500 |
| Legendaria | Dorado | $1,500+ |

Los precios son asignados automáticamente según la rareza de cada carta usando `localId` como referencia.

---

## Persistencia

Todo se guarda en `localStorage` del navegador:

| Clave | Contenido |
|-------|-----------|
| `pm_inventory` | Cartas compradas |
| `pm_wishlist` | IDs en wishlist |
| `pm_purchased` | IDs de cartas adquiridas |
| `pm_cart` | Cartas en el carrito actual |

---

## API

Se consumen sets de TCGdex para el catálogo:

```
swsh1, swsh3, swsh4, swsh5, swsh7, swsh9
```

Las cartas se distribuyen de forma balanceada por rareza usando muestreo por categoría.
