import React from 'react';
import { CreditCard, Smartphone, DollarSign, Check } from 'lucide-react';
import { PaymentMethod } from '../types';

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  onAddMethod: () => void;
}

const PaymentMethodSelector = ({ 
  paymentMethods, 
  selectedMethod, 
  onSelectMethod, 
  onAddMethod 
}: PaymentMethodSelectorProps) => {
  const getPaymentIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'credit-card':
      case 'debit-card':
        return CreditCard;
      case 'paypal':
      case 'apple-pay':
      case 'google-pay':
        return Smartphone;
      case 'cash-on-delivery':
        return DollarSign;
      default:
        return CreditCard;
    }
  };

  const getPaymentLabel = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'credit-card': return 'Credit Card';
      case 'debit-card': return 'Debit Card';
      case 'paypal': return 'PayPal';
      case 'apple-pay': return 'Apple Pay';
      case 'google-pay': return 'Google Pay';
      case 'cash-on-delivery': return 'Cash on Delivery';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Payment Method</h3>
        <button
          onClick={onAddMethod}
          className="text-orange-500 hover:text-orange-600 text-sm font-medium"
        >
          + Add New Method
        </button>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = getPaymentIcon(method.type);
          const isSelected = selectedMethod?.id === method.id;

          return (
            <div
              key={method.id}
              onClick={() => onSelectMethod(method)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon size={20} className={isSelected ? 'text-orange-600' : 'text-gray-600'} />
                  <div>
                    <p className={`font-medium ${isSelected ? 'text-orange-800' : 'text-gray-800'}`}>
                      {method.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {getPaymentLabel(method.type)}
                      {method.details && ` • ${method.details}`}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <Check size={20} className="text-orange-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {paymentMethods.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No payment methods added yet.</p>
          <button
            onClick={onAddMethod}
            className="mt-2 text-orange-500 hover:text-orange-600 font-medium"
          >
            Add your first payment method
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;