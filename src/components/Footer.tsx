import React from 'react';
import { Coffee, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-display text-white">НаЧасі</span>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/60">
                Кава до твого приходу
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-md leading-relaxed">
              Платформа миттєвого передзамовлення свіжої кави в найкращих незалежних ростеріях та спешелті кав'ярнях України. Заощаджуй час без компромісів зі смаком.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-bold text-white uppercase tracking-wider block">Міста України</span>
            <ul className="space-y-1 text-stone-400">
              <li>Київ (Печерськ, Поділ, Центр, Золоті Ворота)</li>
              <li>Львів (Старе Місто, пл. Ринок, Франківський)</li>
              <li>Одеса (Центр, Преображенська, Французький б-р)</li>
              <li>Дніпро (Січових Стрільців, Набережна)</li>
              <li>Харків (Сумська, Сад Шевченка)</li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-bold text-white uppercase tracking-wider block">Для закладів</span>
            <p className="text-stone-400 leading-relaxed">
              Підключіть вашу кав'ярню до платформи "НаЧасі" та отримайте потік гостей без навантаження на касу.
            </p>
            <div className="pt-2 text-amber-400 font-medium">
              partner@nachasi.coffee
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 НаЧасі Кава. Зроблено з любовʼю до українського кавового комʼюніті.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-400 transition-colors">Політика конфіденційності</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-stone-400 transition-colors">Умови сервісу</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Знижка -10 ₴ за власне горнятко</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
