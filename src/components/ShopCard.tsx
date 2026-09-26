import React from 'react';
import { CoffeeShop } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Footprints, Clock, ArrowRight } from 'lucide-react';

interface ShopCardProps {
  shop: CoffeeShop;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const { setSelectedShop } = useApp();

  return (
    <div 
      onClick={() => setSelectedShop(shop)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-amber-900/30 hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1"
    >
      {/* Visual Slot */}
      <div className="relative h-48 w-full overflow-hidden bg-stone-100">
        <img
          src={shop.thumbnail || shop.coverImage}
          alt={shop.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
        
        {/* Walk distance overlay marker */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900/85 backdrop-blur-md text-stone-100 text-xs font-medium">
          <Footprints className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono-numbers">{shop.walkMinutesFromUser} хв пішки</span>
          <span className="text-stone-400">({shop.distanceMeters} м)</span>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-stone-900 text-xs font-semibold shadow-xs">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="font-mono-numbers">{shop.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Unboxed metadata as per zero-pill discipline */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 font-medium">
            <span>{shop.neighborhood}</span>
            <span aria-hidden="true">·</span>
            <span>{shop.metro || 'Центр'}</span>
          </div>

          <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors font-display">
            {shop.name}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-1 mt-1">
            {shop.address}
          </p>

          <p className="text-xs text-amber-950/80 bg-amber-50/80 p-2 rounded-lg mt-3 border border-amber-200/50">
            <span className="font-semibold">Зерно:</span> {shop.specialtyRoast}
          </p>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-500">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{shop.openHours}</span>
          </div>

          <span className="text-amber-900 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            Замовити
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
