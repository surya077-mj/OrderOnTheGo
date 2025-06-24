import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import DishCard from '../components/DishCard';
import { dishes, categories, cuisines } from '../data/dishes';
import { useAuth } from '../context/AuthContext';

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const { user, updateUser } = useAuth();

  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dish.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
      const matchesCuisine = selectedCuisine === 'All' || dish.cuisine === selectedCuisine;
      
      return matchesSearch && matchesCategory && matchesCuisine;
    });
  }, [searchTerm, selectedCategory, selectedCuisine]);

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

    // In a real app, this would update the dish in the backend
    // For demo purposes, we'll just show a success message
    console.log('Review submitted:', review);
    alert('Thank you for your review!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Menu</h1>
          
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Filters</h3>
              
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-700 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-orange-100 text-orange-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-3">Cuisine</h4>
                <div className="space-y-2">
                  {cuisines.map(cuisine => (
                    <button
                      key={cuisine}
                      onClick={() => setSelectedCuisine(cuisine)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCuisine === cuisine
                          ? 'bg-orange-100 text-orange-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {filteredDishes.length} dish{filteredDishes.length !== 1 ? 'es' : ''} found
              </p>
            </div>

            {filteredDishes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No dishes found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDishes.map(dish => (
                  <DishCard 
                    key={dish.id} 
                    dish={dish} 
                    onReviewSubmit={handleReviewSubmit}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;