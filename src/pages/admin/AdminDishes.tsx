import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { dishes as initialDishes } from '../../data/dishes';
import { Dish } from '../../types';

const AdminDishes = () => {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDish, setEditingDish] = useState<string | null>(null);
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'Main Course',
    cuisine: 'American',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    preparationTime: 20,
  });

  const handleAddDish = () => {
    const dish: Dish = {
      id: `dish-${Date.now()}`,
      ...newDish,
      rating: 4.0,
      reviews: [],
      availability: true,
    };

    setDishes([...dishes, dish]);
    setNewDish({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'Main Course',
      cuisine: 'American',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      preparationTime: 20,
    });
    setShowAddForm(false);
  };

  const handleEditDish = (dishId: string, updatedData: Partial<Dish>) => {
    setDishes(dishes.map(dish => 
      dish.id === dishId ? { ...dish, ...updatedData } : dish
    ));
    setEditingDish(null);
  };

  const handleDeleteDish = (dishId: string) => {
    setDishes(dishes.filter(dish => dish.id !== dishId));
  };

  const toggleAvailability = (dishId: string) => {
    setDishes(dishes.map(dish =>
      dish.id === dishId ? { ...dish, availability: !dish.availability } : dish
    ));
  };

  const categories = ['Main Course', 'Appetizer', 'Salad', 'Dessert', 'Healthy'];
  const cuisines = ['Italian', 'Indian', 'Japanese', 'American', 'Mexican', 'Thai', 'Greek', 'Vegan', 'British'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dishes Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Dish
        </button>
      </div>

      {/* Add Dish Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Add New Dish</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={newDish.name}
                onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                step="0.01"
                value={newDish.price}
                onChange={(e) => setNewDish({ ...newDish, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newDish.description}
                onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={newDish.image}
                onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Time (min)</label>
              <input
                type="number"
                value={newDish.preparationTime}
                onChange={(e) => setNewDish({ ...newDish, preparationTime: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newDish.category}
                onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
              <select
                value={newDish.cuisine}
                onChange={(e) => setNewDish({ ...newDish, cuisine: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-4">Dietary Options</label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newDish.isVegetarian}
                    onChange={(e) => setNewDish({ ...newDish, isVegetarian: e.target.checked })}
                    className="mr-2"
                  />
                  Vegetarian
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newDish.isVegan}
                    onChange={(e) => setNewDish({ ...newDish, isVegan: e.target.checked })}
                    className="mr-2"
                  />
                  Vegan
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newDish.isGlutenFree}
                    onChange={(e) => setNewDish({ ...newDish, isGlutenFree: e.target.checked })}
                    className="mr-2"
                  />
                  Gluten Free
                </label>
              </div>
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
              onClick={handleAddDish}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Dish
            </button>
          </div>
        </div>
      )}

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map(dish => (
          <div key={dish.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative">
              <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover" />
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => toggleAvailability(dish.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    dish.availability
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {dish.availability ? 'Available' : 'Unavailable'}
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">{dish.name}</h3>
                <span className="text-xl font-bold text-orange-500">${dish.price}</span>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{dish.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded-full">{dish.category}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full">{dish.cuisine}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingDish(dish.id)}
                  className="text-blue-500 hover:text-blue-600 p-2"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteDish(dish.id)}
                  className="text-red-500 hover:text-red-600 p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDishes;