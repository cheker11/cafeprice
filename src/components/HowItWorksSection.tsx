import React from 'react';
import { Footprints, Coffee, Clock, HeartHandshake, ShieldCheck } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 border-t border-stone-200/80 bg-stone-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section title with zero-pill unboxed text */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs uppercase tracking-widest text-amber-800 font-bold">
            Концепція сервісу
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900 tracking-tight" style={{ textWrap: 'balance' }}>
            Як працює передзамовлення "До твого приходу"
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Ми поєднали швидкість сучасного міста з повагою до ремесла баристи. Справжня спешелті кава не чекає на вас холодній стійці півгодини — вона вариться суворо під ваш крок.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center font-black font-display text-lg">
              01
            </div>
            <h3 className="text-base font-bold text-stone-900 font-display">
              Обираєш заклад по дорозі
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              За 3–5 хвилин до приходу (на виході з метро чи офісу) відкриваєш найближчу улюблену кав'ярню на мапі.
            </p>
            <div className="pt-2 text-xs text-stone-400 flex items-center gap-1.5 border-t border-stone-100">
              <Footprints className="w-3.5 h-3.5 text-amber-800" />
              <span>Розрахунок пішої відстані</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center font-black font-display text-lg">
              02
            </div>
            <h3 className="text-base font-bold text-stone-900 font-display">
              Налаштовуєш чашку та оплачуєш
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Обираєш зерно (Ефіопія, Колумбія), молоко (вівсяне чи безлактозне), своє горнятко для знижки. Оплата в 1 клік через Apple Pay або Monobank.
            </p>
            <div className="pt-2 text-xs text-stone-400 flex items-center gap-1.5 border-t border-stone-100">
              <Coffee className="w-3.5 h-3.5 text-amber-800" />
              <span>Бариста готує точно за таймінгом</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center font-black font-display text-lg">
              03
            </div>
            <h3 className="text-base font-bold text-stone-900 font-display">
              Забираєш без черги біля каси
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Заходиш у кав'ярню. Твоя чашка вже чекає на стійці видачі з твоїм іменем та ідеальною піною 65°C. Жодної секунди в черзі!
            </p>
            <div className="pt-2 text-xs text-stone-400 flex items-center gap-1.5 border-t border-stone-100">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>0 секунд втраченого часу</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
