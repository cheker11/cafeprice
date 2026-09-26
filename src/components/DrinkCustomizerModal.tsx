import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMMON_MILK_OPTIONS, COMMON_BEANS_OPTIONS, COMMON_SYRUP_OPTIONS } from '../data/mockData';
import { OrderItemCustomization } from '../types';
import { X, Check, Coffee, Sparkles, HeartHandshake } from 'lucide-react';

export const DrinkCustomizerModal: React.FC = () => {
  const { customizerItem, closeCustomizer, addToCart } = useApp();

  if (!customizerItem) return null;

  const [selectedVolume, setSelectedVolume] = useState(
    customizerItem.volumeOptions?.[0]?.volume || 'Стандарт'
  );
  const [selectedMilk, setSelectedMilk] = useState(COMMON_MILK_OPTIONS[0].label);
  const [selectedBeans, setSelectedBeans] = useState(COMMON_BEANS_OPTIONS[0].label);
  const [selectedSyrup, setSelectedSyrup] = useState(COMMON_SYRUP_OPTIONS[0].label);
  const [temperature, setTemperature] = useState<'Гарячий' | 'Айс'>('Гарячий');
  const [sugar, setSugar] = useState('Без цукру');
  const [reusableCup, setReusableCup] = useState(false);
  const [specialNotes, setSpecialNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Price Calculation
  const volumeDiff = customizerItem.volumeOptions?.find(v => v.volume === selectedVolume)?.priceDiff || 0;
  const milkDiff = customizerItem.allowsMilk 
    ? (COMMON_MILK_OPTIONS.find(m => m.label === selectedMilk)?.price || 0) 
    : 0;
  const beansDiff = customizerItem.allowsBeans 
    ? (COMMON_BEANS_OPTIONS.find(b => b.label === selectedBeans)?.price || 0) 
    : 0;
  const syrupDiff = customizerItem.allowsSyrup 
    ? (COMMON_SYRUP_OPTIONS.find(s => s.label === selectedSyrup)?.price || 0) 
    : 0;
  
  // Note: -10₴ for reusable cup
  const reusableCupDiscount = reusableCup ? 10 : 0;

  const unitPrice = Math.max(
    20, 
    customizerItem.basePrice + volumeDiff + milkDiff + beansDiff + syrupDiff - reusableCupDiscount
  );

  const handleConfirm = () => {
    const customization: OrderItemCustomization = {
      volume: selectedVolume,
      milk: customizerItem.allowsMilk ? selectedMilk : undefined,
      beans: customizerItem.allowsBeans ? selectedBeans : undefined,
      syrup: customizerItem.allowsSyrup && selectedSyrup !== 'Без сиропу' ? selectedSyrup : undefined,
      temperature: customizerItem.allowsTemperature ? temperature : undefined,
      sugar,
      reusableCup,
      specialNotes: specialNotes.trim() || undefined,
    };

    addToCart(customizerItem, customization, unitPrice, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with image preview */}
        <div className="relative h-44 w-full bg-stone-100 shrink-0">
          <img
            src={customizerItem.image}
            alt={customizerItem.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
          
          <button
            onClick={closeCustomizer}
            className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900 transition-colors"
            aria-label="Закрити"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
              {customizerItem.category}
            </span>
            <h2 className="text-xl font-bold font-display leading-tight">{customizerItem.name}</h2>
          </div>
        </div>

        {/* Scrollable Customization options */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {customizerItem.description}
          </p>

          {/* Size / Volume */}
          {customizerItem.volumeOptions && customizerItem.volumeOptions.length > 1 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Розмір порції
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {customizerItem.volumeOptions.map(opt => (
                  <button
                    key={opt.volume}
                    type="button"
                    onClick={() => setSelectedVolume(opt.volume)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                      selectedVolume === opt.volume
                        ? 'border-amber-900 bg-amber-50/70 text-amber-950 ring-1 ring-amber-900 font-semibold'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
                    }`}
                  >
                    <span className="font-medium">{opt.label} ({opt.volume})</span>
                    <span className="text-stone-500 font-mono-numbers mt-1">
                      {opt.priceDiff > 0 ? `+${opt.priceDiff} ₴` : 'Базовий'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Temperature (Гарячий чи Айс) */}
          {customizerItem.allowsTemperature && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Подача
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTemperature('Гарячий')}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    temperature === 'Гарячий'
                      ? 'border-amber-900 bg-amber-50/70 text-amber-950 font-semibold ring-1 ring-amber-900'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
                  }`}
                >
                  🔥 Гарячий (65°C шовковиста пінка)
                </button>
                <button
                  type="button"
                  onClick={() => setTemperature('Айс')}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    temperature === 'Айс'
                      ? 'border-amber-900 bg-amber-50/70 text-amber-950 font-semibold ring-1 ring-amber-900'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
                  }`}
                >
                  🧊 З льодом (Iced brew)
                </button>
              </div>
            </div>
          )}

          {/* Specialty Milk Options */}
          {customizerItem.allowsMilk && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Оберіть молоко
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COMMON_MILK_OPTIONS.map(opt => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSelectedMilk(opt.label)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                      selectedMilk === opt.label
                        ? 'border-amber-900 bg-amber-50/70 text-amber-950 ring-1 ring-amber-900 font-semibold'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
                    }`}
                  >
                    <span className="truncate pr-1">{opt.label}</span>
                    <span className="text-stone-500 font-mono-numbers shrink-0">
                      {opt.price > 0 ? `+${opt.price} ₴` : 'Включено'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Specialty Beans Terroir */}
          {customizerItem.allowsBeans && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Зерно свіжого обсмажування
                </label>
                <span className="text-[11px] text-amber-800 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3" />
                  100% Арабіка
                </span>
              </div>
              <div className="space-y-1.5">
                {COMMON_BEANS_OPTIONS.map(opt => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSelectedBeans(opt.label)}
                    className={`w-full p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                      selectedBeans === opt.label
                        ? 'border-amber-900 bg-amber-50/70 text-amber-950 ring-1 ring-amber-900 font-semibold'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
                    }`}
                  >
                    <span className="truncate pr-2">{opt.label}</span>
                    <span className="text-stone-500 font-mono-numbers shrink-0">
                      {opt.price > 0 ? `+${opt.price} ₴` : 'Включено'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Syrups */}
          {customizerItem.allowsSyrup && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Крафтовий сироп (за бажанням)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COMMON_SYRUP_OPTIONS.map(opt => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSelectedSyrup(opt.label)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                      selectedSyrup === opt.label
                        ? 'border-amber-900 bg-amber-50/70 text-amber-950 ring-1 ring-amber-900 font-semibold'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    <span className="text-stone-500 font-mono-numbers shrink-0">
                      {opt.price > 0 ? `+${opt.price} ₴` : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Eco discount for own cup */}
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-800 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 block">
                  Прийду зі своїм горнятком / тамблером
                </span>
                <span className="text-[11px] text-emerald-800">
                  Бариста наллє у ваш улюблений термос. Екологічно та знижка -10 ₴.
                </span>
              </div>
            </div>
            <input 
              type="checkbox"
              id="reusableCupCheckbox"
              checked={reusableCup}
              onChange={(e) => setReusableCup(e.target.checked)}
              className="w-5 h-5 rounded border-emerald-400 text-emerald-700 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Sugar */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              Цукор
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Без цукру', '1 стік тростинного', '2 стіки', 'Стевія'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSugar(s)}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    sugar === s 
                      ? 'bg-amber-900 text-white font-medium border-amber-900' 
                      : 'border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and special instruction */}
          <div className="pt-2 flex items-center justify-between border-t border-stone-200">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Кількість</span>
            <div className="flex items-center gap-3 bg-stone-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded bg-white text-stone-900 font-bold flex items-center justify-center hover:bg-stone-200"
              >
                -
              </button>
              <span className="w-6 text-center font-mono-numbers font-semibold text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="w-7 h-7 rounded bg-white text-stone-900 font-bold flex items-center justify-center hover:bg-stone-200"
              >
                +
              </button>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-xs text-stone-500 block">Вартість позиції</span>
            <span className="text-xl font-bold font-mono-numbers text-stone-950">
              {unitPrice * quantity} ₴
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 max-w-xs py-3 px-4 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Coffee className="w-4 h-4" />
            <span>Додати до замовлення</span>
          </button>
        </div>
      </div>
    </div>
  );
};
