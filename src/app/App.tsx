import { BrowserRouter, Routes, Route } from 'react-router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CardsPage } from './pages/CardsPage';
import { CardDetailPage } from './pages/CardDetailPage';
import { InventoryPage } from './pages/InventoryPage';
import { Top10Page } from './pages/Top10Page';
import { CartPage } from './pages/CartPage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/cards"
          element={
            <Layout>
              <CardsPage />
            </Layout>
          }
        />
        <Route
          path="/cards/:id"
          element={
            <Layout>
              <CardDetailPage />
            </Layout>
          }
        />
        <Route
          path="/inventory"
          element={
            <Layout>
              <InventoryPage />
            </Layout>
          }
        />
        <Route
          path="/top10"
          element={
            <Layout>
              <Top10Page />
            </Layout>
          }
        />
        <Route
          path="/cart"
          element={
            <Layout>
              <CartPage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
