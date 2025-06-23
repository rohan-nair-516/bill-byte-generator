
import React from 'react';
import { ChefHat, Receipt } from 'lucide-react';

export const RestaurantHeader = () => {
  return (
    <header className="bg-white shadow-md border-b-4 border-orange-400">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-orange-500 p-2 rounded-full">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Restaurant Billing System</h1>
            <p className="text-sm text-gray-600">Professional • Fast • Reliable</p>
          </div>
          <div className="bg-orange-500 p-2 rounded-full">
            <Receipt className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};
