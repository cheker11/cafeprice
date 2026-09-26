import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COFFEE_SHOPS } from '../data/mockData';
import { CoffeeShop } from '../types';
import { X, MapPin, Footprints, Star, Navigation, ArrowRight } from 'lucide-react';

export const InteractiveMapModal: React.FC = () => {
  const { 
    isMapModalOpen, 
    setIsMapModalOpen, 
    selectedCityId, 
    setSelectedShop 
  } = useApp();

  const cityShops = COFFEE_SHOPS.filter(s => s.cityId === selectedCityId);
  const [activePinShop, setActivePinShop] = useState<CoffeeShop | null>(cityShops[0] || null);

  if (!isMapModalOpen) return null;

  // Relative visual positions for stylized city map grid
  const pinCoordinates = [
    { top: '35%', left: '48%' },
    { top: '55%', left: '38%' },
    { top: '65%', left: '60%' },
    { top: '25%', left: '68%' },
    { top: '45%', left: '25%' },
  ];

  const handleSelectShop = (shop: CoffeeShop) => {
    setSelectedShop(shop);
    setIsMapModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-amber-900" />
            <div>
              <h2 className="text-lg font-bold font-display text-stone-900">
                Мапа кав'ярень у зоні 5-хвилинного приходу
              </h2>
              <p className="text-xs text-stone-500">
                Радіус пішої ходи від вашої поточної геопозиції
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMapModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
            aria-label="Закрити мапу"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Styled Visual Map Container */}
        <div className="relative flex-1 min-h-[380px] bg-[#EBE7DF] overflow-hidden select-none">
          {/* Subtle street grids & park areas */}
          <div className="absolute inset-0 opacity-40">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#D3CDC2" strokeWidth="1.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Stylized metro line / river representation */}
              <path d="M -50 180 Q 200 320 500 240 T 1100 360" fill="none" stroke="#BFD7ED" strokeWidth="16" />
              <path d="M 120 -50 Q 240 200 380 600" fill="none" stroke="#C8D6AF" strokeWidth="24" strokeOpacity="0.6" />
            </svg>
          </div>

          {/* Isochrone Walk Radius Rings around User */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
          >
            {/* 3 mins radius circle */}
            <div className="w-48 h-48 rounded-full border-2 border-dashed border-amber-600/50 bg-amber-500/5 flex items-start justify-center pt-2">
              <span className="text-[10px] uppercase font-bold text-amber-900 bg-white/90 px-1.5 py-0.5 rounded shadow-xs">
                3 хв пішки (250м)
              </span>
            </div>
            {/* 5 mins radius circle */}
            <div className="absolute w-80 h-80 rounded-full border border-stone-400/60 flex items-start justify-center pt-2">
              <span className="text-[10px] uppercase font-bold text-stone-700 bg-white/90 px-1.5 py-0.5 rounded shadow-xs">
                5 хв пішки (420м) — Золотий таймінг
              </span>
            </div>
            {/* 10 mins radius circle */}
            <div className="absolute w-[460px] h-[460px] rounded-full border border-stone-300/60 hidden md:block" />
          </div>

          {/* User's Center Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 ring-4 ring-white shadow-md"></span>
            </span>
            <span className="mt-1 px-2 py-0.5 rounded bg-stone-900 text-white text-[10px] font-bold shadow-md whitespace-nowrap">
              Ви тут
            </span>
          </div>

          {/* Cafe Pins */}
          {cityShops.map((shop, idx) => {
            const coords = pinCoordinates[idx % pinCoordinates.length];
            const isSelected = activePinShop?.id === shop.id;

            return (
              <div
                key={shop.id}
                style={{ top: coords.top, left: coords.left }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
                onClick={() => setActivePinShop(shop)}
              >
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl shadow-lg border transition-all ${
                  isSelected
                    ? 'bg-amber-950 text-white border-amber-950 ring-2 ring-amber-500 scale-105'
                    : 'bg-white text-stone-900 border-stone-300 hover:border-amber-800'
                }`}>
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-amber-800'}`} />
                  <span className="text-xs font-bold whitespace-nowrap">{shop.name}</span>
                  <span className={`text-[10px] font-mono-numbers px-1 rounded ${
                    isSelected ? 'bg-amber-800 text-amber-100' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {shop.walkMinutesFromUser} хв
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Cafe Drawer Footer */}
        {activePinShop && (
          <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={activePinShop.thumbnail}
                alt={activePinShop.name}
                className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-display text-stone-900">
                    {activePinShop.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>{activePinShop.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-stone-500">{activePinShop.address}</p>
                <div className="text-xs text-amber-900 font-semibold flex items-center gap-2 pt-0.5">
                  <Footprints className="w-3.5 h-3.5" />
                  <span>{activePinShop.walkMinutesFromUser} хв пішки ({activePinShop.distanceMeters} метрів)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectShop(activePinShop)}
              className="py-2.5 px-5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
            >
              <span>Обрати та відкрити меню</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
