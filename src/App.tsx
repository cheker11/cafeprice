import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ShopCard } from './components/ShopCard';
import { ShopDetailView } from './components/ShopDetailView';
import { DrinkCustomizerModal } from './components/DrinkCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { LiveOrderTrackerModal } from './components/LiveOrderTrackerModal';
import { BaristaTerminalView } from './components/BaristaTerminalView';
import { InteractiveMapModal } from './components/InteractiveMapModal';
import { HowItWorksSection } from './components/HowItWorksSection';
import { Footer } from './components/Footer';
import { COFFEE_SHOPS } from './data/mockData';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Clock, 
  Coffee, 
  Footprints,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    activeView, 
    selectedShop, 
    selectedCityId, 
    orders, 
    setIsOrderTrackerOpen,
    setIsMapModalOpen 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterFastOnly, setFilterFastOnly] = useState(false); // <= 5 mins walk
  const [filterCustomCup, setFilterCustomCup] = useState(false); // eco cup discount

  // Filter coffee shops for the active city
  const cityShops = COFFEE_SHOPS.filter(s => s.cityId === selectedCityId);

  const filteredShops = cityShops.filter(shop => {
    const matchesSearch = 
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFast = !filterFastOnly || shop.walkMinutesFromUser <= 5;
    const matchesEco = !filterCustomCup || shop.tags.some(t => t.includes('горнятко'));

    return matchesSearch && matchesFast && matchesEco;
  });

  // Active in-progress order for floating quick tracker
  const activeLiveOrder = orders.find(o => o.status !== 'completed' && o.status !== 'cancelled');

  if (activeView === 'barista') {
    return <BaristaTerminalView />;
  }

  if (selectedShop) {
    return <ShopDetailView />;
  }

  return (
    <main className="min-h-screen">
      <HeroBanner />

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Пошук кав'ярні, вулиці або станції метро..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-900 bg-stone-50/50"
            />
          </div>

          {/* Interactive filter toggle buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setFilterFastOnly(!filterFastOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                filterFastOnly
                  ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              ⏱️ До 5 хв пішки
            </button>

            <button
              onClick={() => setFilterCustomCup(!filterCustomCup)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                filterCustomCup
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              🌱 Своє горнятко (-10 ₴)
            </button>

            <button
              onClick={() => setIsMapModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Мапа</span>
            </button>
          </div>

        </div>

        {/* Section Heading with Clean Unboxed Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-stone-950">
              Спешелті кав'ярні поруч з вами
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-1 font-medium">
              <span>Доступні до миттєвого замовлення</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-numbers">{filteredShops.length} закладів</span>
              <span aria-hidden="true">·</span>
              <span>Час приготування ~3 хв</span>
            </div>
          </div>

          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-amber-800" />
            <span>Сортування за пішою доступністю</span>
          </div>
        </div>

        {/* Coffee Shop Cards Grid */}
        {filteredShops.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <Coffee className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800 font-display">Закладів не знайдено</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Спробуйте змінити фільтри або введіть іншу назву вулиці чи кав'ярні.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}

      </section>

      {/* How it works info section */}
      <HowItWorksSection />

      {/* Floating Bottom Quick Tracker Trigger if an order is currently active */}
      {activeLiveOrder && (
        <div className="fixed bottom-5 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-30 animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setIsOrderTrackerOpen(true)}
            className="w-full p-4 rounded-2xl bg-stone-950 text-white shadow-2xl border border-amber-600/40 hover:bg-stone-900 transition-all flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Передзамовлення {activeLiveOrder.orderNumber}
                </div>
                <div className="text-xs text-stone-200 font-medium">
                  {activeLiveOrder.shopName} · {activeLiveOrder.status === 'ready_at_counter' ? 'Очікує на стійці!' : 'Бариста готує'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold group-hover:translate-x-0.5 transition-transform">
              <span>Відкрити</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900 selection:bg-amber-800 selection:text-white">
        <Header />
        <div className="flex-1">
          <MainContent />
        </div>
        <Footer />

        {/* Modals & Slide-over Drawers */}
        <DrinkCustomizerModal />
        <CartDrawer />
        <LiveOrderTrackerModal />
        <InteractiveMapModal />
      </div>
    </AppProvider>
  );
}
