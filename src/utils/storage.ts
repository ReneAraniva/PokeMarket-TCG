import type { PriceCategory } from './priceSystem';

export interface StoredCard {
  id: string;
  name: string;
  rarity?: string;
  priceCategory: PriceCategory;
  price: number;
  image: string;
  type?: string;
  purchasedAt: string;
}

export interface CartItem {
  id: string;
  name: string;
  priceCategory: PriceCategory;
  price: number;
  image: string;
  type?: string;
}

const KEYS = {
  inventory: 'pm_inventory',
  wishlist: 'pm_wishlist',
  purchased: 'pm_purchased',
  cart: 'pm_cart',
} as const;

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getInventory(): StoredCard[] {
  return safeGet<StoredCard[]>(KEYS.inventory, []);
}

export function addToInventory(card: StoredCard): void {
  const inv = getInventory();
  inv.push(card);
  localStorage.setItem(KEYS.inventory, JSON.stringify(inv));
}

export function getWishlist(): string[] {
  return safeGet<string[]>(KEYS.wishlist, []);
}

export function toggleWishlist(id: string): boolean {
  const list = getWishlist();
  const idx = list.indexOf(id);
  if (idx === -1) {
    list.push(id);
    localStorage.setItem(KEYS.wishlist, JSON.stringify(list));
    return true;
  }
  list.splice(idx, 1);
  localStorage.setItem(KEYS.wishlist, JSON.stringify(list));
  return false;
}

export function isWishlisted(id: string): boolean {
  return getWishlist().includes(id);
}

export function getPurchased(): string[] {
  return safeGet<string[]>(KEYS.purchased, []);
}

export function addToPurchased(id: string): void {
  const purchased = getPurchased();
  if (!purchased.includes(id)) {
    purchased.push(id);
    localStorage.setItem(KEYS.purchased, JSON.stringify(purchased));
  }
}

export function isPurchased(id: string): boolean {
  return getPurchased().includes(id);
}

export function getTotalInvested(): number {
  return getInventory().reduce((sum, c) => sum + c.price, 0);
}

export function getCart(): CartItem[] {
  return safeGet<CartItem[]>(KEYS.cart, []);
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  if (!cart.some((c) => c.id === item.id)) {
    cart.push(item);
    localStorage.setItem(KEYS.cart, JSON.stringify(cart));
  }
}

export function removeFromCart(id: string): void {
  const cart = getCart().filter((c) => c.id !== id);
  localStorage.setItem(KEYS.cart, JSON.stringify(cart));
}

export function clearCart(): void {
  localStorage.setItem(KEYS.cart, JSON.stringify([]));
}

export function isInCart(id: string): boolean {
  return getCart().some((c) => c.id === id);
}

export function getCartTotal(): number {
  return getCart().reduce((sum, c) => sum + c.price, 0);
}
