import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DrinkCategory, MenuItem } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Star, 
  Footprints, 
  Phone, 
  ShoppingBag, 
  Plus, 
  Sparkles,
  Check
} from 'lucide-react';

export const ShopDetailView: React.FC = () => {
  const { 
    selectedShop, 
    setSelectedShop, 
    openCustomizer, 
    cartCount, 
    cartTotal, 
    cartDiscount, 
    setIsCartOpen,
    arrivalMinutes,
    setArrivalMinutes
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('Усі');

  if (!selectedShop) return null;

  const categories: string[] = [
    'Усі',
    'Класика еспресо',
    'Фільтр & Альтернатива',
    'Авторські & Чай',
    'Свіжа випічка & Сендвічі'
  ];

  const filteredMenu = selectedCategory === 'Усі'
    ? selectedShop.menu
    : selectedShop.menu.filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top back navigation */}
      <button
        onClick={() => setSelectedShop(null)}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Назад до списку кав'ярень</span>
      </button>

      {/* Coffee Shop Hero Card */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="relative h-64 sm:h-72 w-full bg-stone-900">
          <img
            src={selectedShop.coverImage}
            alt={selectedShop.name}
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold tracking-wide">
                <span>{selectedShop.neighborhood}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedShop.metro || 'Центральна зона'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-tight">
                {selectedShop.name}
              </h1>
              <p className="text-xs sm:text-sm text-stone-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{selectedShop.address}</span>
              </p>
            </div>

            {/* Quick metrics in hero */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-3 py-1.5 rounded-xl bg-stone-900/80 backdrop-blur-md border border-stone-700/60 text-xs font-medium text-stone-100 flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono-numbers">{selectedShop.walkMinutesFromUser} хв пішки</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/90 text-stone-950 text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-stone-950" />
                <span className="font-mono-numbers">{selectedShop.rating}</span>
                <span className="text-[10px] font-normal text-stone-800">({selectedShop.reviewsCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cafe Information Bar */}
        <div className="p-6 bg-stone-50/60 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-stone-500 block mb-0.5 font-medium">Години роботи</span>
            <div className="flex items-center gap-1.5 text-stone-900 font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-800" />
              <span>{selectedShop.openHours}</span>
            </div>
          </div>

          <div>
            <span className="text-stone-500 block mb-0.5 font-medium">Спешелті зерно</span>
            <div className="flex items-center gap-1.5 text-stone-900 font-semibold truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-800 shrink-0" />
              <span className="truncate">{selectedShop.specialtyRoast}</span>
            </div>
          </div>

          <div>
            <span className="text-stone-500 block mb-0.5 font-medium">Контактний телефон</span>
            <div className="flex items-center gap-1.5 text-stone-900 font-semibold">
              <Phone className="w-3.5 h-3.5 text-amber-800" />
              <span>{selectedShop.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timing selector prior to building the order */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-xs uppercase font-bold tracking-wider text-amber-900">
            Таймінг вашого приходу:
          </span>
          <p className="text-xs text-amber-950/80">
            Оберіть через скільки хвилин ви будете біля дверей закладу
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[3, 5, 10, 15].map(mins => {
            const isSelected = arrivalMinutes === mins;
            return (
              <button
                key={mins}
                onClick={() => setArrivalMinutes(mins)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected 
                    ? 'bg-amber-900 text-white shadow-xs' 
                    : 'bg-white text-stone-700 border border-amber-200 hover:bg-amber-100/50'
                }`}
              >
                Через {mins} хв {mins === 5 && '⭐️'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Categories tabs (Functional segmented buttons) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="text-xl font-bold font-display text-stone-950">
            Меню свіжого приготування
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            {filteredMenu.length} позицій
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-stone-900 text-stone-50 shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-950 hover:bg-stone-200/70'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item: MenuItem) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden hover:border-amber-900/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-stone-950/75 backdrop-blur-md text-[11px] font-mono-numbers text-stone-200">
                    ~{item.defaultPrepMinutes} хв
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-stone-900 leading-snug font-display">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">Ціна від</span>
                  <span className="text-lg font-bold font-mono-numbers text-stone-950">
                    {item.basePrice} ₴
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openCustomizer(item)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-stone-900 hover:bg-amber-900 text-white transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Налаштувати</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Cart Bar if items exist */}
      {cartCount > 0 && (
        <div className="fixed bottom-5 left-4 right-4 max-w-3xl mx-auto z-30 animate-in slide-in-from-bottom duration-300">
          <div className="bg-stone-950 text-white rounded-2xl p-4 shadow-2xl border border-stone-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center font-bold text-stone-950 text-sm">
                {cartCount}
              </div>
              <div>
                <div className="text-sm font-bold font-display">У кошику {cartCount} поз.</div>
                <div className="text-xs text-stone-400 flex items-center gap-1.5">
                  <span>До сплати:</span>
                  <span className="text-white font-mono-numbers font-semibold">
                    {Math.max(0, cartTotal - cartDiscount)} ₴
                  </span>
                  {cartDiscount > 0 && (
                    <span className="text-emerald-400 text-[11px]">(-{cartDiscount} ₴ своє горнятко)</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Оформити передзамовлення</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
