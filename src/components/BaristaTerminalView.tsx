import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { 
  Coffee, 
  Clock, 
  CheckCircle, 
  Bell, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Check, 
  RefreshCw,
  HeartHandshake
} from 'lucide-react';

export const BaristaTerminalView: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    setActiveView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'ready' | 'completed'>('pending');
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingOrders = orders.filter(
    o => o.status === 'received' || o.status === 'brewing'
  );
  const readyOrders = orders.filter(o => o.status === 'ready_at_counter');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const displayedOrders = activeTab === 'pending'
    ? pendingOrders
    : activeTab === 'ready'
      ? readyOrders
      : completedOrders;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Terminal Bar Top Bar */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-stone-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-bold">
            <Coffee className="w-4 h-4" />
            <span>Екран бару та зони передзамовлень</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            Барна станція: Yellow Place (Київ)
          </h1>
          <p className="text-xs text-stone-400">
            Замовлення, що надходять за 3-5 хвилин до приходу гостей.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('customer')}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700 hover:text-white transition-colors border border-stone-700"
          >
            ← Повернутися до вибору кав'ярні
          </button>
        </div>
      </div>

      {/* Segmented Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-amber-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <span>В черзі на приготування</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-800 text-amber-100 font-mono-numbers text-[11px]">
            {pendingOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ready')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ready'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <span>На стійці Pick-up (Очікують гостя)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-700 text-emerald-100 font-mono-numbers text-[11px]">
            {readyOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'bg-stone-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <span>Видано (Історія)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-stone-700 text-stone-200 font-mono-numbers text-[11px]">
            {completedOrders.length}
          </span>
        </button>
      </div>

      {/* Orders Grid */}
      {displayedOrders.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
          <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-display">Черга чиста!</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Наразі немає замовлень у цій категорії. Нові надходження з'являться тут миттєво.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedOrders.map((order: Order) => {
            const remainingSecs = Math.max(0, Math.floor((order.targetPickupTimestamp - currentTime) / 1000));
            const mins = Math.floor(remainingSecs / 60);
            const secs = remainingSecs % 60;
            const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

            const isUrgent = remainingSecs <= 120 && order.status !== 'ready_at_counter' && order.status !== 'completed';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl border transition-all flex flex-col justify-between overflow-hidden shadow-sm ${
                  order.guestArrivedAtDoor
                    ? 'ring-2 ring-amber-500 border-amber-400 bg-amber-50/20'
                    : isUrgent
                      ? 'border-amber-300 ring-1 ring-amber-300'
                      : 'border-stone-200'
                }`}
              >
                {/* Header card with ETA */}
                <div className={`p-4 border-b flex items-center justify-between ${
                  order.guestArrivedAtDoor 
                    ? 'bg-amber-500 text-stone-950 font-bold' 
                    : isUrgent 
                      ? 'bg-amber-100/70 text-amber-950' 
                      : 'bg-stone-50 text-stone-900'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-numbers font-black text-sm tracking-wider">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs font-semibold">· {order.customerName}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono-numbers font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{remainingSecs === 0 ? 'Час настав' : `${timeFormatted}`}</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-4 flex-1">
                  
                  {/* Flashing alert if guest clicked "I'm at the door" */}
                  {order.guestArrivedAtDoor && (
                    <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-xs font-bold text-amber-950 flex items-center gap-2 animate-bounce">
                      <Bell className="w-4 h-4 text-amber-800" />
                      <span>ГІСТЬ ВЖЕ БІЛЯ ДВЕРЕЙ ЗАВЕДЕННЯ!</span>
                    </div>
                  )}

                  {/* Delay notification */}
                  {order.delayedMinutes && order.delayedMinutes > 0 && (
                    <div className="p-2 rounded-lg bg-stone-100 text-stone-700 text-[11px] flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-stone-500" />
                      <span>Гість попередив про затримку на +{order.delayedMinutes} хв</span>
                    </div>
                  )}

                  {/* Order Items list */}
                  <div className="space-y-3">
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                      Напої до видачі:
                    </span>
                    
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                        <div className="flex items-center justify-between text-sm font-bold text-stone-900">
                          <span>{item.quantity}x {item.menuItem.name}</span>
                          <span className="text-xs font-mono-numbers text-stone-500">{item.unitPrice * item.quantity} ₴</span>
                        </div>

                        <div className="text-xs text-stone-600 space-y-0.5">
                          {item.customization.volume && (
                            <div>Розмір: <strong className="text-stone-900">{item.customization.volume}</strong></div>
                          )}
                          {item.customization.milk && (
                            <div>Молоко: <strong className="text-amber-900">{item.customization.milk}</strong></div>
                          )}
                          {item.customization.beans && (
                            <div>Зерно: <strong className="text-stone-800">{item.customization.beans}</strong></div>
                          )}
                          {item.customization.syrup && (
                            <div>Сироп: <strong>{item.customization.syrup}</strong></div>
                          )}
                          {item.customization.temperature && (
                            <div>Подача: <strong>{item.customization.temperature}</strong></div>
                          )}
                          {item.customization.reusableCup && (
                            <div className="text-emerald-700 font-bold flex items-center gap-1 mt-1">
                              <HeartHandshake className="w-3.5 h-3.5" />
                              <span>Гість зі своїм горнятком / тамблером!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-xs text-stone-500 flex justify-between border-t border-stone-100">
                    <span>Тел: {order.customerPhone}</span>
                    <span className="font-semibold text-stone-800 uppercase">{order.paymentMethod.replace('_', ' ')}: ОПЛАЧЕНО</span>
                  </div>

                </div>

                {/* Footer Action Buttons */}
                <div className="p-4 bg-stone-50 border-t border-stone-200">
                  {order.status === 'received' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'brewing')}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <Coffee className="w-4 h-4" />
                      <span>Почати готувати (Змелювання & Еспресо)</span>
                    </button>
                  )}

                  {order.status === 'brewing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready_at_counter')}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Поставити на стійку "НаЧасі" (Готово)</span>
                    </button>
                  )}

                  {order.status === 'ready_at_counter' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Видано гостю (Закрити замовлення)</span>
                    </button>
                  )}

                  {order.status === 'completed' && (
                    <div className="text-center text-xs font-semibold text-stone-500 py-1 flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Замовлення завершено та видано</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
