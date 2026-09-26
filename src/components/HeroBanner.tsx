import React from 'react';
import { useApp } from '../context/AppContext';
import { CITIES, TIMING_OPTIONS, HERO_IMAGE } from '../data/mockData';
import { CityId } from '../types';
import { Clock, Navigation, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { 
    selectedCityId, 
    setSelectedCityId, 
    arrivalMinutes, 
    setArrivalMinutes, 
    orders, 
    setIsOrderTrackerOpen,
    setIsMapModalOpen 
  } = useApp();

  const activeLiveOrder = orders.find(o => o.status !== 'completed' && o.status !== 'cancelled');

  return (
    <div className="relative overflow-hidden bg-stone-900 text-stone-100">
      {/* Background image with measured contrast scrim as per frontend design constitution */}
      <div className="absolute inset-0 z-0">
        <img 
          src={HERO_IMAGE} 
          alt="Спешелті кавʼярня в Києві"
          className="w-full h-full object-cover object-center opacity-30 brightness-75 scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-900/85 to-stone-950/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {/* Active Order Highlight Alert if customer has a live order */}
        {activeLiveOrder && (
          <div className="mb-8 p-4 rounded-xl bg-amber-950/80 border border-amber-600/40 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Активне передзамовлення {activeLiveOrder.orderNumber}</p>
                <p className="text-sm font-medium text-stone-100">
                  {activeLiveOrder.shopName} · {activeLiveOrder.status === 'received' ? 'Прийнято кавʼярнею' : activeLiveOrder.status === 'brewing' ? 'Бариста варить каву' : 'Вже на стійці видачі!'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOrderTrackerOpen(true)}
              className="px-4 py-2 text-xs font-semibold bg-amber-500 text-stone-950 hover:bg-amber-400 rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Відкрити таймер & QR-код</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Кавова культура нового ритму в Україні</span>
              <span aria-hidden="true">·</span>
              <span>Без черг біля каси</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-display" style={{ textWrap: 'balance' }}>
              Кава свіжа та гаряча точно до твого приходу.
            </h1>

            <p className="text-base sm:text-lg text-stone-300 max-w-xl leading-relaxed">
              Замовляєш за 5 хвилин до дверей — бариста змелює зерно свіжого обсмажування та збиває шовковисте молоко під твій крок. Заходиш, називаєш номер і відразу насолоджуєшся.
            </p>

            {/* City Selection Tabs */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                Оберіть місто для замовлення:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {CITIES.map((city) => {
                  const isSelected = selectedCityId === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCityId(city.id as CityId)}
                      className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                        isSelected 
                          ? 'bg-amber-600 text-white font-semibold shadow-sm' 
                          : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700/80 hover:text-white border border-stone-700/60'
                      }`}
                    >
                      {city.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Claim to Proof adjacency (Anti-Slop standard) */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-stone-800/80 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-stone-100">0 хв</div>
                <div className="text-xs text-stone-400 mt-0.5">очікування в черзі</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-amber-400">65°C</div>
                <div className="text-xs text-stone-400 mt-0.5">ідеальна подача</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-stone-100">-10 ₴</div>
                <div className="text-xs text-stone-400 mt-0.5">за своє горнятко</div>
              </div>
            </div>

          </div>

          {/* Quick Timing Widget card */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-700/70 backdrop-blur-md shadow-2xl space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div>
                  <h3 className="text-base font-semibold text-white">Таймінг прибуття</h3>
                  <p className="text-xs text-stone-400">Коли ви переступите поріг кав'ярні?</p>
                </div>
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Показати на карті</span>
                </button>
              </div>

              {/* Timing selector list */}
              <div className="space-y-2.5">
                {TIMING_OPTIONS.map((opt) => {
                  const isCurrent = arrivalMinutes === opt.minutes;
                  return (
                    <button
                      key={opt.minutes}
                      onClick={() => setArrivalMinutes(opt.minutes)}
                      className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between border ${
                        isCurrent
                          ? 'bg-amber-950/60 border-amber-600/80 text-white ring-1 ring-amber-600'
                          : 'bg-stone-800/40 border-stone-700/40 text-stone-300 hover:bg-stone-800/70 hover:border-stone-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{opt.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{opt.title}</span>
                            {opt.isRecommended && (
                              <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-900/60 px-1.5 py-0.5 rounded border border-amber-700/50">
                                Рекомендовано
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400">{opt.subtitle}</p>
                        </div>
                      </div>
                      <div className="font-mono-numbers text-xs font-semibold px-2 py-1 rounded bg-stone-800 text-stone-200">
                        {opt.minutes} хв
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800 text-xs text-stone-400 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Бариста запускає екстракцію за 3 хвилини до обраного часу, щоб молочна глянцева текстура не розшарувалася.
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
