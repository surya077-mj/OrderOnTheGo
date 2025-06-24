import React from 'react';
import { Clock, CheckCircle, Truck, MapPin, Phone } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingProps {
  order: Order;
}

const OrderTracking = ({ order }: OrderTrackingProps) => {
  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'preparing', label: 'Preparing', icon: Clock },
    { key: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === order.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStepStatus = (stepIndex: number) => {
    if (order.status === 'cancelled') return 'cancelled';
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'current': return 'bg-orange-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-500';
    }
  };

  const getConnectorColor = (stepIndex: number) => {
    if (order.status === 'cancelled') return 'bg-red-200';
    if (stepIndex < currentStepIndex) return 'bg-green-500';
    return 'bg-gray-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Order Tracking</h3>
        <span className="text-sm text-gray-600">
          Order #{order.id.slice(-8)}
        </span>
      </div>

      {order.status === 'cancelled' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium">Order Cancelled</p>
          <p className="text-red-600 text-sm">This order has been cancelled.</p>
        </div>
      )}

      {/* Progress Steps */}
      <div className="relative">
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(index);
          const isLast = index === statusSteps.length - 1;

          return (
            <div key={step.key} className="relative flex items-center">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepColor(status)}`}>
                  <Icon size={20} />
                </div>
                <div className="ml-4">
                  <p className={`font-medium ${status === 'current' ? 'text-orange-600' : status === 'completed' ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.label}
                  </p>
                  {order.statusHistory.find(h => h.status === step.key) && (
                    <p className="text-sm text-gray-500">
                      {new Date(order.statusHistory.find(h => h.status === step.key)!.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              
              {!isLast && (
                <div className={`absolute left-5 top-10 w-0.5 h-8 ${getConnectorColor(index)}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Delivery Info */}
      {order.status === 'out-for-delivery' && order.trackingInfo && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-3">Delivery Information</h4>
          <div className="space-y-2 text-sm">
            {order.trackingInfo.driverName && (
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-blue-600" />
                <span>Driver: {order.trackingInfo.driverName}</span>
              </div>
            )}
            {order.trackingInfo.driverPhone && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-blue-600" />
                <span>{order.trackingInfo.driverPhone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-600" />
              <span>
                Estimated arrival: {new Date(order.trackingInfo.estimatedArrival).toLocaleTimeString()}
              </span>
            </div>
            {order.trackingInfo.currentLocation && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />
                <span>Current location: {order.trackingInfo.currentLocation}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Messages */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-800 mb-3">Status Updates</h4>
        <div className="space-y-2">
          {order.statusHistory.map((update, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{update.message}</span>
              <span className="text-gray-500">
                {new Date(update.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;