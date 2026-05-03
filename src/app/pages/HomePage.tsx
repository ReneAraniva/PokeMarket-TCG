import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { HeroSection } from '../components/HeroSection';
import { TopPremium } from '../components/TopPremium';
import { RarityCollections } from '../components/RarityCollections';

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <HeroSection />

      <FadeIn>
        <TopPremium />
      </FadeIn>

      <FadeIn delay={0.1}>
        <RarityCollections />
      </FadeIn>

      {/* CTA Banner */}
      <FadeIn delay={0.1}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-[var(--wine-red)] to-[var(--deep-red)] rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2
                className="text-4xl font-bold mb-3"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                ¿Listo para explorar?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Accede al catálogo completo con cartas reales de TCGdex, filtros
                por rareza y compra con PayPal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/cards')}
                  className="bg-white text-[var(--wine-red)] px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
                >
                  Explorar Cartas
                </button>
                <button
                  onClick={() => navigate('/top10')}
                  className="bg-white/20 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all"
                >
                  👑 Top 10 Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </>
  );
}
