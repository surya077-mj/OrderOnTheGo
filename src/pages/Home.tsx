import React from 'react';
import Hero from '../components/Hero';
import DishCard from '../components/DishCard';
import { dishes } from '../data/dishes';

const Home = () => {
  const featuredDishes = dishes.slice(0, 6);

  return (
    <div>
      <Hero />
      
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Featured Dishes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular dishes loved by customers worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDishes.map(dish => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Why Choose OrderOnTheGo?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Lightning Fast Delivery</h3>
                    <p className="text-gray-600">Get your favorite food delivered in 30 minutes or less, guaranteed.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Fresh & Quality</h3>
                    <p className="text-gray-600">We partner with the best restaurants to ensure fresh, high-quality meals.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Available</h3>
                    <p className="text-gray-600">Late-night cravings? Weekend treats? We're always here for you.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg" 
                alt="Food delivery"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;