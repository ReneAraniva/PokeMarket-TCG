import { useNavigate } from 'react-router';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--wine-red)] via-[var(--deep-red)] to-[#8B2635] py-8 md:py-20 px-4">
      {/* Background blurs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-52 h-52 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full blur-3xl" />
      </div>

      {/* Golden particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--gold)] rounded-full blur-sm animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-[var(--gold)] rounded-full blur-sm animate-pulse delay-100" />
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-[var(--gold)] rounded-full blur-sm animate-pulse delay-200" />
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-[var(--gold)] rounded-full blur-sm animate-pulse delay-300" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-[var(--gold)] rounded-full blur-sm animate-pulse delay-150" />
      </div>

      {/* Blurred bg cards — hidden on small screens */}
      <div className="absolute inset-0 opacity-10 pointer-events-none hidden sm:block">
        <img
          src="https://images.unsplash.com/photo-1632459250885-76cc46ca1dcd?w=300"
          alt=""
          className="absolute top-10 left-10 w-32 h-44 object-cover rounded-lg blur-md rotate-12"
        />
        <img
          src="https://images.unsplash.com/photo-1647892591880-58c55fd726d8?w=300"
          alt=""
          className="absolute bottom-20 right-32 w-28 h-40 object-cover rounded-lg blur-md -rotate-6"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-5 md:gap-12 items-center">
          {/* Left content */}
          <div className="text-left space-y-4 md:space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full text-white border border-white/20 shadow-lg">
              <span className="text-[var(--gold)]">✦</span>
              <span className="text-xs sm:text-sm tracking-wide">
                Rarezas · Sets · Legendarias
              </span>
            </div>

            <div>
              <h1
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-1"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Construye tu colección
              </h1>
              <h1
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[var(--gold)] via-yellow-300 to-[var(--gold)] bg-clip-text text-transparent leading-tight"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                de cartas legendarias
              </h1>
            </div>

            <p className="text-xs sm:text-base md:text-lg text-white/80 max-w-xl leading-relaxed">
              Descubre cartas exclusivas, rarezas únicas y piezas premium para
              verdaderos coleccionistas. Paga de forma segura con PayPal.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-2 md:gap-4 pt-1 md:pt-2">
              <button
                onClick={() => navigate('/cards')}
                className="flex-1 md:flex-none bg-[var(--gold)] hover:bg-yellow-400 text-[var(--charcoal)] px-4 md:px-8 py-2.5 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
              >
                Explorar Catálogo
              </button>
              <button
                onClick={() => navigate('/top10')}
                className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-4 md:px-8 py-2.5 md:py-4 rounded-xl font-semibold text-sm md:text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                👑 Top 10 Premium
              </button>
            </div>

            {/* Stats row */}
            <div className="flex gap-4 md:gap-8">
              <div>
                <p className="text-lg md:text-2xl font-bold text-[var(--gold)]">400+</p>
                <p className="text-xs md:text-sm text-white/60">Cartas disponibles</p>
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold text-[var(--gold)]">5</p>
                <p className="text-xs md:text-sm text-white/60">Niveles de rareza</p>
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold text-[var(--gold)]">100%</p>
                <p className="text-xs md:text-sm text-white/60">Pago seguro</p>
              </div>
            </div>
          </div>

          {/* Right: Floating card */}
          <div className="flex justify-center items-center mt-2 md:mt-0">
            <div className="relative">
              <div className="absolute -inset-4 md:-inset-8 bg-gradient-to-r from-[var(--gold)] to-yellow-300 rounded-3xl blur-3xl opacity-30 animate-pulse" />
              <div
                className="relative transform hover:scale-105 transition-all duration-500"
                style={{
                  transform: 'perspective(1000px) rotateY(-10deg) rotateX(5deg)',
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-black/40 rounded-2xl blur-2xl transform translate-y-8 translate-x-4" />
                  <div className="relative bg-white/5 backdrop-blur-sm border-2 border-[var(--gold)]/30 rounded-2xl p-2 shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1611931960487-4932667079f1?w=500"
                      alt="Carta Premium"
                      className="w-36 h-48 md:w-80 md:h-[28rem] object-cover rounded-xl"
                    />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-[var(--gold)] to-yellow-300 text-[var(--charcoal)] px-3 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center space-x-1">
                      <span>★</span>
                      <span>LEGENDARIA</span>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--gold)] rounded-full blur-sm animate-ping" />
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-yellow-300 rounded-full blur-sm animate-ping delay-150" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 via-black/10 to-transparent pointer-events-none" />
    </section>
  );
}
