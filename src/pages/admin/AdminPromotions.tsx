import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Calendar, DollarSign } from 'lucide-react';
import { Promotion } from '../../types';

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 'promo-1',
      title: 'Weekend Special',
      description: '20% off on all orders above $25',
      type: 'percentage',
      value: 20,
      minOrderAmount: 25,
      maxDiscountAmount: 10,
      validFrom: '2024-01-01T00:00:00Z',
      validUntil: '2024-12-31T23:59:59Z',
      isActive: true,
      usedCount: 45,
      code: 'WEEKEND20'
    },
    {
      id: 'promo-2',
      title: 'Free Delivery',
      description: 'Free delivery on orders above $30',
      type: 'free-delivery',
      value: 0,
      minOrderAmount: 30,
      validFrom: '2024-01-01T00:00:00Z',
      validUntil: '2024-12-31T23:59:59Z',
      isActive: true,
      usedCount: 123,
      code: 'FREEDEL30'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<string | null>(null);
  const [newPromotion, setNewPromotion] = useState({
    title: '',
    description: '',
    type: 'percentage' as Promotion['type'],
    value: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    validFrom: '',
    validUntil: '',
    code: '',
  });

  const handleAddPromotion = () => {
    const promotion: Promotion = {
      id: `promo-${Date.now()}`,
      ...newPromotion,
      isActive: true,
      usedCount: 0,
    };

    setPromotions([...promotions, promotion]);
    setNewPromotion({
      title: '',
      description: '',
      type: 'percentage',
      value: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      validFrom: '',
      validUntil: '',
      code: '',
    });
    setShowAddForm(false);
  };

  const togglePromotionStatus = (promotionId: string) => {
    setPromotions(promotions.map(promo =>
      promo.id === promotionId ? { ...promo, isActive: !promo.isActive } : promo
    ));
  };

  const deletePromotion = (promotionId: string) => {
    setPromotions(promotions.filter(promo => promo.id !== promotionId));
  };

  const getTypeIcon = (type: Promotion['type']) => {
    switch (type) {
      case 'percentage': return '%';
      case 'fixed-amount': return '$';
      case 'free-delivery': return '🚚';
      case 'buy-one-get-one': return '2x1';
      default: return '%';
    }
  };

  const getTypeColor = (type: Promotion['type']) => {
    switch (type) {
      case 'percentage': return 'bg-blue-100 text-blue-800';
      case 'fixed-amount': return 'bg-green-100 text-green-800';
      case 'free-delivery': return 'bg-purple-100 text-purple-800';
      case 'buy-one-get-one': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Promotions & Deals</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Create Promotion
        </button>
      </div>

      {/* Add Promotion Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Create New Promotion</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={newPromotion.title}
                onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
              <input
                type="text"
                value={newPromotion.code}
                onChange={(e) => setNewPromotion({ ...newPromotion, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., SAVE20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newPromotion.description}
                onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={newPromotion.type}
                onChange={(e) => setNewPromotion({ ...newPromotion, type: e.target.value as Promotion['type'] })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="percentage">Percentage Discount</option>
                <option value="fixed-amount">Fixed Amount Off</option>
                <option value="free-delivery">Free Delivery</option>
                <option value="buy-one-get-one">Buy One Get One</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {newPromotion.type === 'percentage' ? 'Discount %' : 
                 newPromotion.type === 'fixed-amount' ? 'Amount ($)' : 'Value'}
              </label>
              <input
                type="number"
                value={newPromotion.value}
                onChange={(e) => setNewPromotion({ ...newPromotion, value: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={newPromotion.type === 'free-delivery'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Amount ($)</label>
              <input
                type="number"
                value={newPromotion.minOrderAmount}
                onChange={(e) => setNewPromotion({ ...newPromotion, minOrderAmount: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {newPromotion.type === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount Amount ($)</label>
                <input
                  type="number"
                  value={newPromotion.maxDiscountAmount}
                  onChange={(e) => setNewPromotion({ ...newPromotion, maxDiscountAmount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
              <input
                type="datetime-local"
                value={newPromotion.validFrom}
                onChange={(e) => setNewPromotion({ ...newPromotion, validFrom: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
              <input
                type="datetime-local"
                value={newPromotion.validUntil}
                onChange={(e) => setNewPromotion({ ...newPromotion, validUntil: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPromotion}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Promotion
            </button>
          </div>
        </div>
      )}

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map(promotion => (
          <div key={promotion.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getTypeColor(promotion.type)}`}>
                  {getTypeIcon(promotion.type)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{promotion.title}</h3>
                  <p className="text-sm text-gray-600">{promotion.code}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => togglePromotionStatus(promotion.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    promotion.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {promotion.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{promotion.description}</p>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Min Order:</span>
                <span>${promotion.minOrderAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Used:</span>
                <span>{promotion.usedCount} times</span>
              </div>
              <div className="flex justify-between">
                <span>Valid Until:</span>
                <span>{new Date(promotion.validUntil).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingPromotion(promotion.id)}
                className="text-blue-500 hover:text-blue-600 p-2"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => deletePromotion(promotion.id)}
                className="text-red-500 hover:text-red-600 p-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPromotions;