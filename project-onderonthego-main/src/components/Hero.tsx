import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Truck, Star } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Delicious Food, <br />
            <span className="text-yellow-300">Delivered Fast</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Order your favorite dishes from the best restaurants in town. 
            From comfort food to gourmet cuisine, we deliver it all to your doorstep.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/menu"
              className="bg-white text-orange-500 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105"
            >
              Order Now
            </Link>
            <Link 
              to="/menu"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-orange-500 transition-colors transform hover:scale-105"
            >
              View Menu
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-200">Get your food delivered in 30 minutes or less</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Food</h3>
              <p className="text-gray-200">Fresh ingredients and expert preparation</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Service</h3>
              <p className="text-gray-200">Late-night cravings? We've got you covered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;