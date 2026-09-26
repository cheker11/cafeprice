import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Clock, 
  MapPin, 
  Coffee, 
  Bell, 
  CheckCircle2, 
  QrCode, 
  AlertCircle,
  Footprints,
  Sparkles,
  Minimize2
} from 'lucide-react';

export const LiveOrderTrackerModal: React.FC = () => {
  const { 
    isOrderTrackerOpen, 
    setIsOrderTrackerOpen, 
    orders, 
    activeOrderId,
    markGuestAtDoor,
    delayOrder 
  } = useApp();

  const [timeLeftSecs, setTimeLeftSecs] = useState<number>(300);
  const [doorAlertSent, setDoorAlertSent] = useState(false);
  const [delaySuccessMsg, setDelaySuccessMsg] = useState<string | null>(null);

  const activeOrder = orders.find(o => o.id === activeOrderId) || orders[0];

  useEffect(() => {
    if (!activeOrder) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((activeOrder.targetPickupTimestamp - Date.now()) / 1000));
      setTimeLeftSecs(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeOrder]);

  if (!isOrderTrackerOpen || !activeOrder) return null;

  const minutes = Math.floor(timeLeftSecs / 60);
  const seconds = timeLeftSecs % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isReady = activeOrder.status === 'ready_at_counter' || timeLeftSecs === 0;

  const handleImAtDoor = () => {
    markGuestAtDoor(activeOrder.id);
    setDoorAlertSent(true);
    setTimeout(() => setDoorAlertSent(false), 5000);
  };

  const handleDelay = (extraMins: number) => {
    delayOrder(activeOrder.id, extraMins);
    setDelaySuccessMsg(`Додано +${extraMins} хв. Бариста зберіг таймінг приготування.`);
    setTimeout(() => setDelaySuccessMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
              Живий трекер видачі "НаЧасі"
            </span>
          </div>

          <button
            onClick={() => setIsOrderTrackerOpen(false)}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
            title="Згорнути трекер"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          
          {/* Shop & Order identity */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black font-display text-stone-950">
              {activeOrder.shopName}
            </h2>
            <p className="text-xs text-stone-500 flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{activeOrder.shopAddress}</span>
            </p>
          </div>

          {/* Large Countdown or Pickup Ready Banner */}
          <div className={`p-6 rounded-2xl border text-center transition-all ${
            isReady
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 ring-2 ring-emerald-500'
              : 'bg-amber-50/70 border-amber-200 text-amber-950'
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider block mb-1 text-stone-500">
              {isReady ? '🎉 Ваша кава чекає на стійці видачі!' : 'Таймер до вашого приходу'}
            </span>

            <div className="text-4xl sm:text-5xl font-extrabold font-mono-numbers tracking-tight py-1">
              {isReady ? 'ГОТОВО' : formattedTime}
            </div>

            <p className="text-xs text-stone-600 mt-2 max-w-xs mx-auto leading-relaxed">
              {isReady 
                ? 'Підійдіть до бару "НаЧасі" та покажіть цей екран або назвіть код замовлення.'
                : 'Бариста розрахував таймінг збивання молока, щоб температура була рівно 65°C.'}
            </p>
          </div>

          {/* Real-time Order Process Stage */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Етапи приготування напою
            </span>

            <div className="space-y-2">
              {[
                { 
                  id: 'step1', 
                  title: 'Замовлення передано на планшет баристи', 
                  completed: true, 
                  active: false 
                },
                { 
                  id: 'step2', 
                  title: 'Помел свіжообсмаженої арабіки', 
                  completed: activeOrder.status !== 'received', 
                  active: activeOrder.status === 'received' 
                },
                { 
                  id: 'step3', 
                  title: 'Екстракція еспресо та збивання шовковистої пінки', 
                  completed: activeOrder.status === 'ready_at_counter' || isReady, 
                  active: activeOrder.status === 'brewing' && !isReady 
                },
                { 
                  id: 'step4', 
                  title: 'Напій запаковано на полиці експрес-видачі', 
                  completed: isReady, 
                  active: isReady 
                },
              ].map((step, idx) => (
                <div 
                  key={step.id} 
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                    step.active
                      ? 'bg-amber-100/70 border-amber-300 text-amber-950 font-semibold shadow-xs'
                      : step.completed
                        ? 'bg-stone-50 border-stone-200 text-stone-800'
                        : 'bg-white border-stone-200/50 text-stone-400 opacity-60'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    step.completed 
                      ? 'bg-emerald-600 text-white' 
                      : step.active 
                        ? 'bg-amber-600 text-white animate-pulse' 
                        : 'bg-stone-200 text-stone-600'
                  }`}>
                    {step.completed ? '✓' : idx + 1}
                  </div>
                  <span className="text-xs">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Pick-Up Pass & Code */}
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                Код видачі гостя
              </span>
              <div className="text-2xl font-black font-mono-numbers text-stone-900 tracking-wider">
                {activeOrder.orderNumber}
              </div>
              <p className="text-xs text-stone-600">
                Ім'я на стаканчику: <strong className="text-stone-900">{activeOrder.customerName}</strong>
              </p>
            </div>

            <div className="w-16 h-16 bg-white p-1 rounded-xl border border-stone-300 flex items-center justify-center shrink-0">
              <QrCode className="w-14 h-14 text-stone-900" />
            </div>
          </div>

          {/* Order items recap */}
          <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200 pt-3">
            <span className="font-bold text-stone-700 block mb-1">Склад замовлення:</span>
            {activeOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.quantity}x {item.menuItem.name} {item.customization.milk ? `(${item.customization.milk})` : ''}</span>
                <span className="font-mono-numbers font-medium text-stone-900">{item.unitPrice * item.quantity} ₴</span>
              </div>
            ))}
          </div>

          {/* Interactive Barista Pings: "I'm at the door" & "Delayed by 2 mins" */}
          <div className="space-y-2.5 pt-2 border-t border-stone-200">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Швидкий зв'язок з баром
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleImAtDoor}
                className="py-2.5 px-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Я вже біля дверей!</span>
              </button>

              <button
                type="button"
                onClick={() => handleDelay(2)}
                className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 border border-stone-200"
              >
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>Запізнююсь на +2 хв</span>
              </button>
            </div>

            {doorAlertSent && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Сигнал баристі відправлено: чашка ставиться на стійку видачі!</span>
              </div>
            )}

            {delaySuccessMsg && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{delaySuccessMsg}</span>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-stone-500">
            Оплата: <span className="font-semibold text-stone-800 uppercase">{activeOrder.paymentMethod.replace('_', ' ')}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsOrderTrackerOpen(false)}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Згорнути екран
          </button>
        </div>

      </div>
    </div>
  );
};
