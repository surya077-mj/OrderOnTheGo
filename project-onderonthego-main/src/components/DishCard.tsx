import React, { useState } from 'react';
import { Star, Clock, Plus, Leaf, Shield, MessageCircle, Tag } from 'lucide-react';
import { Dish } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ReviewModal from './ReviewModal';

interface DishCardProps {
  dish: Dish;
  onReviewSubmit?: (dishId: string, rating: number, comment: string) => void;
}

const DishCard = ({ dish, onReviewSubmit }: DishCardProps) => {
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(dish);
  };

  const handleReviewClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowReviewModal(true);
  };

  const handleReviewSubmit = (dishId: string, rating: number, comment: string) => {
    if (onReviewSubmit) {
      onReviewSubmit(dishId, rating, comment);
    }
  };

  // Check if user has ordered this dish
  const userHasOrdered = user?.orderHistory.some(order => 
    order.items.some(item => item.dish.id === dish.id)
  ) || false;

  const hasPromotion = dish.originalPrice && dish.originalPrice > dish.price;
  const discountPercentage = hasPromotion 
    ? Math.round(((dish.originalPrice! - dish.price) / dish.originalPrice!) * 100)
    : 0;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
        <div className="relative">
          <img 
            src={dish.image} 
            alt={dish.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {dish.isVegetarian && (
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Leaf size={12} />
                Veg
              </div>
            )}
            {dish.isVegan && (
              <div className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs">
                Vegan
              </div>
            )}
            {dish.isGlutenFree && (
              <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Shield size={12} />
                GF
              </div>
            )}
          </div>
          
          {hasPromotion && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Tag size={12} />
              {discountPercentage}% OFF
            </div>
          )}
          
          {!hasPromotion && (
            <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="text-yellow-500" size={14} fill="currentColor" />
              <span className="text-sm font-medium">{dish.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{dish.name}</h3>
            <div className="text-right">
              {hasPromotion && (
                <div className="text-sm text-gray-500 line-through">
                  ${dish.originalPrice?.toFixed(2)}
                </div>
              )}
              <span className="text-xl font-bold text-orange-500">${dish.price.toFixed(2)}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{dish.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{dish.preparationTime} min</span>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{dish.cuisine}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleReviewClick}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-500 transition-colors"
            >
              <MessageCircle size={16} />
              <span>{dish.reviews.length} reviews</span>
            </button>
            <div className="flex items-center gap-1">
              <Star className="text-yellow-500" size={14} fill="currentColor" />
              <span className="text-sm font-medium">{dish.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={20} />
            Add to Cart
          </button>
        </div>
      </div>

      <ReviewModal
        dish={dish}
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmitReview={handleReviewSubmit}
        userHasOrdered={userHasOrdered}
      />
    </>
  );
};

export default DishCard;