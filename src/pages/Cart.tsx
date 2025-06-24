import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import { PaymentMethod } from '../types';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  // Mock payment methods - in real app, these would come from user profile
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'pm-1',
      type: 'credit-card',
      name: 'Visa ending in 4242',
      details: '**** **** **** 4242',
      isDefault: true,
    },
    {
      id: 'pm-2',
      type: 'paypal',
      name: 'PayPal Account',
      details: 'user@example.com',
      isDefault: false,
    },
    {
      id: 'pm-3',
      type: 'cash-on-delivery',
      name: 'Cash on Delivery',
      details: 'Pay when your order arrives',
      isDefault: false,
    },
  ];

  React.useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethod) {
      setSelectedPaymentMethod(paymentMethods.find(pm => pm.isDefault) || paymentMethods[0]);
    }
  }, []);

  const deliveryFee = 3.99;
  const subtotal = getTotalAmount();
  const promoDiscount = appliedPromo ? calculatePromoDiscount(subtotal, appliedPromo) : 0;
  const tax = (subtotal - promoDiscount) * 0.08;
  const total = subtotal - promoDiscount + deliveryFee + tax;

  function calculatePromoDiscount(amount: number, promo: any) {
    switch (promo.type) {
      case 'percentage':
        const discount = (amount * promo.value) / 100;
        return promo.maxDiscountAmount ? Math.min(discount, promo.maxDiscountAmount) : discount;
      case 'fixed-amount':
        return Math.min(promo.value, amount);
      case 'free-delivery':
        return 0; // Handled separately
      default:
        return 0;
    }
  }

  const handleApplyPromo = () => {
    setPromoError('');
    
    // Mock promo codes
    const mockPromos = {
      'WEEKEND20': {
        type: 'percentage',
        value: 20,
        minOrderAmount: 25,
        maxDiscountAmount: 10,
        title: 'Weekend Special'
      },
      'SAVE5': {
        type: 'fixed-amount',
        value: 5,
        minOrderAmount: 20,
        title: '$5 Off'
      },
      'FREEDEL30': {
        type: 'free-delivery',
        value: 0,
        minOrderAmount: 30,
        title: 'Free Delivery'
      }
    };

    const promo = mockPromos[promoCode.toUpperCase() as keyof typeof mockPromos];
    
    if (!promo) {
      setPromoError('Invalid promo code');
      return;
    }

    if (subtotal < promo.minOrderAmount) {
      setPromoError(`Minimum order amount is $${promo.minOrderAmount}`);
      return;
    }

    setAppliedPromo(promo);
    setPromoCode('');
  };

  const handleCheckout = async () => {
    if (!user?.addresses.length) {
      navigate('/profile');
      return;
    }

    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setLoading(true);
    
    // Simulate order processing
    setTimeout(() => {
      const order = {
        id: `order-${Date.now()}`,
        userId: user.id,
        items: [...items],
        totalAmount: total,
        deliveryAddress: user.addresses.find(addr => addr.isDefault) || user.addresses[0],
        paymentMethod: selectedPaymentMethod,
        status: 'pending' as const,
        orderDate: new Date().toISOString(),
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        deliveryFee: appliedPromo?.type === 'free-delivery' ? 0 : deliveryFee,
        tax,
        statusHistory: [
          {
            status: 'pending' as const,
            timestamp: new Date().toISOString(),
            message: 'Order placed successfully'
          }
        ],
        trackingInfo: {
          estimatedArrival: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        },
        promotionApplied: appliedPromo,
        discountAmount: promoDiscount,
      };

      // Save order to user's history
      const updatedUser = {
        ...user,
        orderHistory: [order, ...user.orderHistory],
      };

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      clearCart();
      setLoading(false);
      navigate('/profile');
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.dish.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={item.dish.image}
                    alt={item.dish.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{item.dish.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.dish.description}</p>
                    <p className="text-orange-500 font-bold">${item.dish.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    
                    <span className="font-medium text-lg w-8 text-center">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-200 transition-colors text-orange-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">
                      ${(item.dish.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.dish.id)}
                      className="text-red-500 hover:text-red-600 transition-colors mt-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 space-y-6">
              {/* Promo Code */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Promo Code</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-sm mt-2">{promoError}</p>
                )}
                {appliedPromo && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-green-600" />
                      <span className="text-green-800 text-sm font-medium">
                        {appliedPromo.title} applied!
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <PaymentMethodSelector
                  paymentMethods={paymentMethods}
                  selectedMethod={selectedPaymentMethod}
                  onSelectMethod={setSelectedPaymentMethod}
                  onAddMethod={() => setShowPaymentMethods(true)}
                />
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Order Summary</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedPromo && promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedPromo.title})</span>
                      <span>-${promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      {appliedPromo?.type === 'free-delivery' ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t pt-3 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-500">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || !selectedPaymentMethod}
                  className={`w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors ${
                    loading || !selectedPaymentMethod ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  {!user?.addresses.length && (
                    'Add a delivery address in your profile before checkout'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;