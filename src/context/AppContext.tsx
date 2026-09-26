import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CityId, 
  CoffeeShop, 
  MenuItem, 
  CartItem, 
  Order, 
  OrderStatus, 
  OrderItemCustomization 
} from '../types';
import { COFFEE_SHOPS, SAMPLE_INITIAL_ORDER } from '../data/mockData';

interface AppContextType {
  selectedCityId: CityId;
  setSelectedCityId: (id: CityId) => void;
  selectedShop: CoffeeShop | null;
  setSelectedShop: (shop: CoffeeShop | null) => void;
  activeView: 'customer' | 'barista';
  setActiveView: (view: 'customer' | 'barista') => void;
  
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (menuItem: MenuItem, customization: OrderItemCustomization, unitPrice: number, quantity: number) => void;
  updateCartItemQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartDiscount: number;
  cartCount: number;

  // Customizer Modal
  customizerItem: MenuItem | null;
  openCustomizer: (item: MenuItem) => void;
  closeCustomizer: () => void;

  // Arrival timing
  arrivalMinutes: number;
  setArrivalMinutes: (mins: number) => void;

  // Orders
  orders: Order[];
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  placeOrder: (customerName: string, customerPhone: string, paymentMethod: 'apple_pay' | 'google_pay' | 'monobank' | 'card') => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  markGuestAtDoor: (orderId: string) => void;
  delayOrder: (orderId: string, extraMins: number) => void;

  // Modals
  isOrderTrackerOpen: boolean;
  setIsOrderTrackerOpen: (open: boolean) => void;
  isMapModalOpen: boolean;
  setIsMapModalOpen: (open: boolean) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategoryFilter: string;
  setActiveCategoryFilter: (cat: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCityId, setSelectedCityId] = useState<CityId>('kyiv');
  const [selectedShop, setSelectedShop] = useState<CoffeeShop | null>(null);
  const [activeView, setActiveView] = useState<'customer' | 'barista'>('customer');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizerItem, setCustomizerItem] = useState<MenuItem | null>(null);
  const [arrivalMinutes, setArrivalMinutes] = useState<number>(5);

  const [orders, setOrders] = useState<Order[]>([SAMPLE_INITIAL_ORDER]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(SAMPLE_INITIAL_ORDER.id);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Усі');

  // Automatic simulation ticker for active orders (brewing -> ready when countdown reaches ~1 min)
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.status === 'received') {
            // transition to brewing after 15 seconds
            if (Date.now() - order.createdAt > 15000) {
              return { ...order, status: 'brewing' };
            }
          } else if (order.status === 'brewing') {
            // transition to ready when less than 75 seconds left until target pickup
            const remainingMs = order.targetPickupTimestamp - Date.now();
            if (remainingMs <= 60000 && remainingMs > -600000) {
              return { ...order, status: 'ready_at_counter' };
            }
          }
          return order;
        })
      );
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const openCustomizer = (item: MenuItem) => {
    setCustomizerItem(item);
  };

  const closeCustomizer = () => {
    setCustomizerItem(null);
  };

  const addToCart = (
    menuItem: MenuItem, 
    customization: OrderItemCustomization, 
    unitPrice: number, 
    quantity: number
  ) => {
    if (!selectedShop) return;

    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      shopId: selectedShop.id,
      menuItem,
      customization,
      unitPrice,
      quantity,
    };

    setCart(prev => [...prev, newItem]);
    closeCustomizer();
    setIsCartOpen(true);
  };

  const updateCartItemQty = (id: string, delta: number) => {
    setCart(prev => 
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  
  // Apply 10₴ discount if customer chose reusable own cup
  const cartDiscount = cart.reduce((sum, item) => {
    return sum + (item.customization.reusableCup ? 10 * item.quantity : 0);
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = (
    customerName: string, 
    customerPhone: string, 
    paymentMethod: 'apple_pay' | 'google_pay' | 'monobank' | 'card'
  ): Order => {
    const shop = selectedShop || COFFEE_SHOPS.find(s => s.id === cart[0]?.shopId) || COFFEE_SHOPS[0];
    const finalTotal = Math.max(0, cartTotal - cartDiscount);
    const targetTimestamp = Date.now() + arrivalMinutes * 60 * 1000;
    const orderNum = `#НЧ-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      shopId: shop.id,
      shopName: shop.name,
      shopAddress: shop.address,
      customerName: customerName.trim() || 'Гість',
      customerPhone: customerPhone.trim() || '+380 50 123 4567',
      items: [...cart],
      subtotal: cartTotal,
      discount: cartDiscount,
      total: finalTotal,
      arrivalMinutes: arrivalMinutes,
      createdAt: Date.now(),
      targetPickupTimestamp: targetTimestamp,
      status: 'received',
      paymentMethod,
      delayedMinutes: 0,
      guestArrivedAtDoor: false,
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    setCart([]);
    setIsCartOpen(false);
    setIsOrderTrackerOpen(true);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => 
      prev.map(ord => ord.id === orderId ? { ...ord, status } : ord)
    );
  };

  const markGuestAtDoor = (orderId: string) => {
    setOrders(prev => 
      prev.map(ord => ord.id === orderId ? { ...ord, guestArrivedAtDoor: true } : ord)
    );
  };

  const delayOrder = (orderId: string, extraMins: number) => {
    setOrders(prev => 
      prev.map(ord => {
        if (ord.id === orderId) {
          const addedMs = extraMins * 60 * 1000;
          return {
            ...ord,
            delayedMinutes: (ord.delayedMinutes || 0) + extraMins,
            targetPickupTimestamp: ord.targetPickupTimestamp + addedMs,
          };
        }
        return ord;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        selectedCityId,
        setSelectedCityId,
        selectedShop,
        setSelectedShop,
        activeView,
        setActiveView,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        cartTotal,
        cartDiscount,
        cartCount,
        customizerItem,
        openCustomizer,
        closeCustomizer,
        arrivalMinutes,
        setArrivalMinutes,
        orders,
        activeOrderId,
        setActiveOrderId,
        placeOrder,
        updateOrderStatus,
        markGuestAtDoor,
        delayOrder,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
        isMapModalOpen,
        setIsMapModalOpen,
        searchQuery,
        setSearchQuery,
        activeCategoryFilter,
        setActiveCategoryFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
