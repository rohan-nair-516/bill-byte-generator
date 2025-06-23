import React, { useState } from 'react';
import { BillForm } from '../components/BillForm';
import { BillPreview } from '../components/BillPreview';
import { RestaurantHeader } from '../components/RestaurantHeader';
import { Navigation } from '../components/Navigation';

export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  gstNumber: string;
}

export interface BillData {
  restaurantInfo: RestaurantInfo;
  tableNumber: string;
  customerName: string;
  items: BillItem[];
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  grandTotal: number;
  date: string;
}

const Index = () => {
  const [billData, setBillData] = useState<BillData>({
    restaurantInfo: {
      name: '',
      address: '',
      phone: '',
      gstNumber: ''
    },
    tableNumber: '',
    customerName: '',
    items: [],
    subtotal: 0,
    gstRate: 5,
    gstAmount: 0,
    grandTotal: 0,
    date: new Date().toLocaleDateString('en-IN')
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateBillData = (newData: Partial<BillData>) => {
    setBillData(prev => ({ ...prev, ...newData }));
  };

  const calculateTotals = (items: BillItem[], gstRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const gstAmount = (subtotal * gstRate) / 100;
    const grandTotal = subtotal + gstAmount;
    
    updateBillData({
      items,
      subtotal,
      gstAmount,
      grandTotal
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <RestaurantHeader />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Smart Bill Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create professional restaurant bills in seconds
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <BillForm 
              billData={billData}
              updateBillData={updateBillData}
              calculateTotals={calculateTotals}
              onPreview={() => setShowPreview(true)}
            />
          </div>
          
          <div className="lg:sticky lg:top-8">
            <BillPreview 
              billData={billData}
              showPreview={showPreview}
              onClose={() => setShowPreview(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
