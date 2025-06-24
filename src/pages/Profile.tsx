import React, { useState } from 'react';
import { User, MapPin, Clock, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Address } from '../types';
import OrderTracking from '../components/OrderTracking';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleProfileUpdate = () => {
    if (user) {
      updateUser(profileData);
      setEditingProfile(false);
    }
  };

  const handleAddAddress = () => {
    if (user && newAddress.label && newAddress.street && newAddress.city) {
      const address: Address = {
        id: `addr-${Date.now()}`,
        ...newAddress,
        isDefault: user.addresses.length === 0,
      };
      
      updateUser({
        addresses: [...user.addresses, address],
      });
      
      setNewAddress({
        label: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
      });
      setShowAddressForm(false);
    }
  };

  const setDefaultAddress = (addressId: string) => {
    if (user) {
      const updatedAddresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));
      updateUser({ addresses: updatedAddresses });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReviewSubmit = (dishId: string, rating: number, comment: string) => {
    if (!user) return;

    const review = {
      id: `review-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      date: new Date().toISOString(),
      dishId,
    };

    // In a real app, this would be sent to the backend
    console.log('Review submitted:', review);
    
    // For demo purposes, we'll just show a success message
    alert('Review submitted successfully!');
  };

  if (!user) return null;

  const selectedOrder = selectedOrderId ? user.orderHistory.find(order => order.id === selectedOrderId) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'addresses', label: 'Addresses', icon: MapPin },
                { id: 'orders', label: 'Order History', icon: Clock },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
                  <button
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    {editingProfile ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {editingProfile ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800 text-lg">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {editingProfile ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800 text-lg">{user.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    {editingProfile ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800 text-lg">{user.phone}</p>
                    )}
                  </div>

                  {editingProfile && (
                    <button
                      onClick={handleProfileUpdate}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Delivery Addresses</h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    {showAddressForm ? 'Cancel' : 'Add Address'}
                  </button>
                </div>

                {showAddressForm && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Address Label (e.g., Home, Office)"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleAddAddress}
                      className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Save Address
                    </button>
                  </div>
                )}

                {user.addresses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No addresses added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {user.addresses.map(address => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-gray-800">{address.label}</h3>
                              {address.isDefault && (
                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600">
                              {address.street}, {address.city}, {address.state} {address.zipCode}
                            </p>
                          </div>
                          {!address.isDefault && (
                            <button
                              onClick={() => setDefaultAddress(address.id)}
                              className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order History</h2>
                
                {selectedOrder ? (
                  <div>
                    <button
                      onClick={() => setSelectedOrderId(null)}
                      className="mb-4 text-orange-500 hover:text-orange-600 font-medium"
                    >
                      ← Back to Order History
                    </button>
                    <OrderTracking order={selectedOrder} />
                  </div>
                ) : (
                  <>
                    {user.orderHistory.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No orders yet.</p>
                    ) : (
                      <div className="space-y-6">
                        {user.orderHistory.map(order => (
                          <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-medium text-gray-800">Order #{order.id.slice(-6)}</h3>
                                <p className="text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                  {order.status.replace('-', ' ').toUpperCase()}
                                </span>
                                <button
                                  onClick={() => setSelectedOrderId(order.id)}
                                  className="block mt-2 text-orange-500 hover:text-orange-600 text-sm font-medium"
                                >
                                  Track Order
                                </button>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              {order.items.map(item => (
                                <div key={`${order.id}-${item.dish.id}`} className="flex justify-between items-center text-sm">
                                  <span>{item.quantity}x {item.dish.name}</span>
                                  <span>${(item.dish.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            
                            {order.promotionApplied && (
                              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-800 text-sm font-medium">
                                  {order.promotionApplied.title} - Saved ${order.discountAmount?.toFixed(2)}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                              <span className="font-medium text-gray-800">Total</span>
                              <span className="text-lg font-bold text-orange-500">${order.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;