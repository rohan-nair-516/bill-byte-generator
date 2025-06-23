
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Store, User, Hash, Percent } from 'lucide-react';
import { BillData, BillItem } from '../pages/Index';

interface BillFormProps {
  billData: BillData;
  updateBillData: (data: Partial<BillData>) => void;
  calculateTotals: (items: BillItem[], gstRate: number) => void;
  onPreview: () => void;
}

export const BillForm: React.FC<BillFormProps> = ({
  billData,
  updateBillData,
  calculateTotals,
  onPreview
}) => {
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    price: 0
  });

  const addItem = () => {
    if (!newItem.name || newItem.price <= 0) return;

    const item: BillItem = {
      id: Date.now().toString(),
      name: newItem.name,
      quantity: newItem.quantity,
      price: newItem.price,
      total: newItem.quantity * newItem.price
    };

    const updatedItems = [...billData.items, item];
    calculateTotals(updatedItems, billData.gstRate);
    
    setNewItem({ name: '', quantity: 1, price: 0 });
  };

  const removeItem = (id: string) => {
    const updatedItems = billData.items.filter(item => item.id !== id);
    calculateTotals(updatedItems, billData.gstRate);
  };

  const updateGSTRate = (rate: number) => {
    updateBillData({ gstRate: rate });
    calculateTotals(billData.items, rate);
  };

  return (
    <div className="space-y-6">
      {/* Restaurant Information */}
      <Card className="border-orange-200 shadow-lg">
        <CardHeader className="bg-orange-50">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Store className="w-5 h-5" />
            Restaurant Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input
                id="restaurantName"
                value={billData.restaurantInfo.name}
                onChange={(e) => updateBillData({
                  restaurantInfo: { ...billData.restaurantInfo, name: e.target.value }
                })}
                placeholder="Enter restaurant name"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={billData.restaurantInfo.phone}
                onChange={(e) => updateBillData({
                  restaurantInfo: { ...billData.restaurantInfo, phone: e.target.value }
                })}
                placeholder="Enter phone number"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={billData.restaurantInfo.address}
              onChange={(e) => updateBillData({
                restaurantInfo: { ...billData.restaurantInfo, address: e.target.value }
              })}
              placeholder="Enter restaurant address"
              className="border-orange-200 focus:border-orange-400"
            />
          </div>
          <div>
            <Label htmlFor="gstNumber">GST Number</Label>
            <Input
              id="gstNumber"
              value={billData.restaurantInfo.gstNumber}
              onChange={(e) => updateBillData({
                restaurantInfo: { ...billData.restaurantInfo, gstNumber: e.target.value }
              })}
              placeholder="Enter GST number"
              className="border-orange-200 focus:border-orange-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bill Details */}
      <Card className="border-orange-200 shadow-lg">
        <CardHeader className="bg-orange-50">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <User className="w-5 h-5" />
            Bill Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tableNumber" className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Table Number
              </Label>
              <Input
                id="tableNumber"
                value={billData.tableNumber}
                onChange={(e) => updateBillData({ tableNumber: e.target.value })}
                placeholder="Enter table number"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
            <div>
              <Label htmlFor="customerName">Customer Name (Optional)</Label>
              <Input
                id="customerName"
                value={billData.customerName}
                onChange={(e) => updateBillData({ customerName: e.target.value })}
                placeholder="Enter customer name"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>
          <div className="w-32">
            <Label htmlFor="gstRate" className="flex items-center gap-2">
              <Percent className="w-4 h-4" />
              GST Rate (%)
            </Label>
            <Input
              id="gstRate"
              type="number"
              value={billData.gstRate}
              onChange={(e) => updateGSTRate(parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.1"
              className="border-orange-200 focus:border-orange-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Items */}
      <Card className="border-orange-200 shadow-lg">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-orange-800">Add Items</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Enter item name"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                min="1"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>
          <Button 
            onClick={addItem}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={!newItem.name || newItem.price <= 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </CardContent>
      </Card>

      {/* Items List */}
      {billData.items.length > 0 && (
        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-orange-800">Bill Items</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {billData.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      {item.quantity} × ₹{item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-gray-800">
                      ₹{item.total.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => removeItem(item.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-lg mb-2">
                <span>Subtotal:</span>
                <span>₹{billData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg mb-2">
                <span>GST ({billData.gstRate}%):</span>
                <span>₹{billData.gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-orange-600 border-t pt-2">
                <span>Grand Total:</span>
                <span>₹{billData.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              onClick={onPreview}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white text-lg py-3"
              disabled={billData.items.length === 0}
            >
              Generate Bill
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
