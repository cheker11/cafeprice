import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Coffee, Store, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    cartCount, 
    setIsCartOpen, 
    setSelectedShop, 
    orders, 
    setIsOrderTrackerOpen,
    setIsMapModalOpen 
  } = useApp();

  const activeLiveOrder = orders.find(o => o.status !== 'completed' && o.status !== 'cancelled');

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => {
            setSelectedShop(null);
            setActiveView('customer');
          }}
          className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 hover:text-amber-900 transition-colors flex items-center gap-2 text-left"
        >
          <span className="font-display">НаЧасі</span>
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold px-2 py-0.5 rounded bg-amber-100/70 hidden sm:inline-block">
            Кава до приходу
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button 
            onClick={() => {
              setSelectedShop(null);
              setActiveView('customer');
            }}
            className={`hover:text-stone-900 transition-colors ${activeView === 'customer' && !activeLiveOrder ? 'text-stone-950 font-semibold' : ''}`}
          >
            Кав'ярні поруч
          </button>
          
          <button 
            onClick={() => setIsMapModalOpen(true)}
            className="hover:text-stone-900 transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-stone-400" />
            <span>Мапа пішої ходи</span>
          </button>

          {activeLiveOrder && (
            <button 
              onClick={() => setIsOrderTrackerOpen(true)}
              className="text-amber-800 font-semibold hover:text-amber-900 transition-colors flex items-center gap-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              <span>Моє замовлення {activeLiveOrder.orderNumber}</span>
            </button>
          )}

          <a 
            href="#how-it-works"
            className="hover:text-stone-900 transition-colors"
          >
            Як це працює
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Switcher: Customer vs Barista Station */}
          <button
            onClick={() => setActiveView(activeView === 'customer' ? 'barista' : 'customer')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 border ${
              activeView === 'barista'
                ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
            title="Перемкнути на екран замовлень кав'ярні"
          >
            {activeView === 'barista' ? (
              <>
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Екран Баристи</span>
                <span className="sm:hidden">Бариста</span>
              </>
            ) : (
              <>
                <Store className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Для кавʼярень</span>
                <span className="sm:hidden">Кавʼярням</span>
              </>
            )}
          </button>

          {/* Cart Trigger */}
          {activeView === 'customer' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-amber-900 hover:bg-amber-800 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              aria-label="Кошик передзамовлення"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Кошик</span>
              {cartCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-amber-500 text-stone-950 font-bold text-xs rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
