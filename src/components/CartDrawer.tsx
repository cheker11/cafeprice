import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TIMING_OPTIONS } from '../data/mockData';
import { 
  X, 
  Trash2, 
  Clock, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  Sparkles,
  ShoppingBag,
  HeartHandshake
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartItemQty, 
    removeFromCart, 
    clearCart,
    cartTotal, 
    cartDiscount,
    arrivalMinutes,
    setArrivalMinutes,
    placeOrder 
  } = useApp();

  const [customerName, setCustomerName] = useState('Олександр');
  const [customerPhone, setCustomerPhone] = useState('+380 67 555 4231');
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'google_pay' | 'monobank' | 'card'>('apple_pay');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCartOpen) return null;

  const finalTotal = Math.max(0, cartTotal - cartDiscount);

  const handleCheckout = (chosenPayment?: 'apple_pay' | 'google_pay' | 'monobank' | 'card') => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    const method = chosenPayment || paymentMethod;

    setTimeout(() => {
      placeOrder(customerName, customerPhone, method);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-900" />
            <h2 className="text-lg font-bold font-display text-stone-900">Ваше передзамовлення</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
            aria-label="Закрити кошик"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-900 font-display">Кошик порожній</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Оберіть улюблену кав'ярню та додайте свіжозварені напої або випічку.
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Обрані напої та страви
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-stone-400 hover:text-rose-600 transition-colors"
                  >
                    Очистити все
                  </button>
                </div>

                <div className="space-y-2.5">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-stone-200/90 bg-stone-50/50 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-baseline justify-between">
                          <h4 className="text-sm font-bold text-stone-900 font-display">
                            {item.menuItem.name}
                          </h4>
                          <span className="text-xs font-bold font-mono-numbers text-stone-950">
                            {item.unitPrice * item.quantity} ₴
                          </span>
                        </div>

                        {/* Customization pills/tags */}
                        <div className="text-[11px] text-stone-500 space-y-0.5">
                          {item.customization.volume && (
                            <div>Розмір: {item.customization.volume}</div>
                          )}
                          {item.customization.milk && (
                            <div>Молоко: {item.customization.milk}</div>
                          )}
                          {item.customization.beans && (
                            <div>Зерно: {item.customization.beans}</div>
                          )}
                          {item.customization.syrup && (
                            <div>Сироп: {item.customization.syrup}</div>
                          )}
                          {item.customization.temperature && (
                            <div>Подача: {item.customization.temperature}</div>
                          )}
                          {item.customization.reusableCup && (
                            <div className="text-emerald-700 font-medium flex items-center gap-1">
                              <HeartHandshake className="w-3 h-3" />
                              <span>Своє горнятко (-10 ₴ знижки)</span>
                            </div>
                          )}
                        </div>

                        {/* Quantity Stepper */}
                        <div className="pt-2 flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-md px-1.5 py-0.5">
                            <button
                              type="button"
                              onClick={() => updateCartItemQty(item.id, -1)}
                              className="text-stone-600 hover:text-stone-900 px-1 font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-mono-numbers font-semibold w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartItemQty(item.id, 1)}
                              className="text-stone-600 hover:text-stone-900 px-1 font-bold text-xs"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                            title="Видалити"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrival timing picker */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-800" />
                    <span>Час до приходу в кав'ярню</span>
                  </label>
                  <span className="text-xs font-mono-numbers font-bold text-amber-900">
                    через {arrivalMinutes} хв
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {TIMING_OPTIONS.map((opt) => {
                    const isSelected = arrivalMinutes === opt.minutes;
                    return (
                      <button
                        key={opt.minutes}
                        type="button"
                        onClick={() => setArrivalMinutes(opt.minutes)}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                          isSelected
                            ? 'bg-amber-950 text-white border-amber-950 font-semibold ring-1 ring-amber-950'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt.minutes} хвилин</span>
                          <span>{opt.icon}</span>
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                          {opt.minutes === 5 ? 'Ідеальна пінка 65°C' : opt.subtitle}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sticker Name & Phone */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    Ім'я для наліпки на стаканчик
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Наприклад: Олена або Максим"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-900 bg-white"
                  />
                  <p className="text-[11px] text-stone-400">
                    Бариста напише це ім'я на кришці або стійці самовивозу
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    Телефон для SMS повідомлення
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+380"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-900 bg-white"
                  />
                </div>
              </div>

              {/* Payment methods */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Спосіб оплати
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-stone-950 text-white border-stone-950'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span> Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('google_pay')}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'google_pay'
                        ? 'bg-stone-950 text-white border-stone-950'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('monobank')}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'monobank'
                        ? 'bg-stone-900 text-white border-stone-900 ring-1 ring-stone-900'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>🐈 monobank</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-stone-950 text-white border-stone-950'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Картка онлайн</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with totals and action */}
        {cart.length > 0 && (
          <div className="p-5 bg-stone-50 border-t border-stone-200 space-y-3 shrink-0">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Вартість страв та напоїв</span>
                <span className="font-mono-numbers">{cartTotal} ₴</span>
              </div>
              
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Знижка (власне горнятко)</span>
                  <span className="font-mono-numbers">-{cartDiscount} ₴</span>
                </div>
              )}

              <div className="flex justify-between text-stone-950 font-bold text-base pt-2 border-t border-stone-200">
                <span>Разом до сплати</span>
                <span className="font-mono-numbers text-lg">{finalTotal} ₴</span>
              </div>
            </div>

            {/* Apple Pay 1-tap checkout button */}
            {paymentMethod === 'apple_pay' && (
              <button
                type="button"
                onClick={() => handleCheckout('apple_pay')}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-black hover:bg-stone-900 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Оплата через Apple Pay...</span>
                ) : (
                  <>
                    <span className="text-base">Pay</span>
                    <span>· Сплатити {finalTotal} ₴</span>
                  </>
                )}
              </button>
            )}

            {paymentMethod === 'monobank' && (
              <button
                type="button"
                onClick={() => handleCheckout('monobank')}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-[#222222] hover:bg-black text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Підтвердження в monobank...</span>
                ) : (
                  <>
                    <span>🐈 Сплатити в monobank {finalTotal} ₴</span>
                  </>
                )}
              </button>
            )}

            {(paymentMethod === 'google_pay' || paymentMethod === 'card') && (
              <button
                type="button"
                onClick={() => handleCheckout()}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Оформлення передзамовлення...</span>
                ) : (
                  <>
                    <span>Оплатити {finalTotal} ₴ та замовити</span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Швидка видача за {arrivalMinutes} хв без черги</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
