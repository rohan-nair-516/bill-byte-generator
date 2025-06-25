
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, FileText, Share } from 'lucide-react';
import { BillData, BillItem } from '../pages/Index';
import { saveRestaurantProfile, getRestaurantProfile } from '../utils/storage';
import { useToast } from '@/hooks/use-toast';

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
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, price: 0 });
  const { toast } = useToast();

  // Load saved restaurant profile on component mount
  useEffect(() => {
    const savedProfile = getRestaurantProfile();
    if (savedProfile) {
      updateBillData({
        restaurantInfo: savedProfile
      });
      toast({
        title: "Profile Loaded",
        description: "Restaurant profile loaded successfully.",
      });
    }
  }, [updateBillData, toast]);

  // Auto-save restaurant profile when it changes
  useEffect(() => {
    const { name, address, phone, gstNumber } = billData.restaurantInfo;
    if (name || address || phone || gstNumber) {
      saveRestaurantProfile(billData.restaurantInfo);
    }
  }, [billData.restaurantInfo]);

  const addItem = () => {
    if (!newItem.name || newItem.price <= 0) {
      toast({
        title: "Invalid Item",
        description: "Please enter valid item name and price.",
        variant: "destructive",
      });
      return;
    }

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
    
    toast({
      title: "Item Added",
      description: `${item.name} added to bill.`,
    });
  };

  const removeItem = (id: string) => {
    const updatedItems = billData.items.filter(item => item.id !== id);
    calculateTotals(updatedItems, billData.gstRate);
  };

  const updateRestaurantInfo = (field: string, value: string) => {
    updateBillData({
      restaurantInfo: {
        ...billData.restaurantInfo,
        [field]: value
      }
    });
  };

  const shareViaWhatsApp = () => {
    const message = `Bill from ${billData.restaurantInfo.name}\n` +
      `Table: ${billData.tableNumber}\n` +
      `Date: ${billData.date}\n\n` +
      billData.items.map(item => 
        `${item.name} x${item.quantity} - ₹${item.total}`
      ).join('\n') +
      `\n\nSubtotal: ₹${billData.subtotal}\n` +
      `GST (${billData.gstRate}%): ₹${billData.gstAmount.toFixed(2)}\n` +
      `Total: ₹${billData.grandTotal.toFixed(2)}\n\n` +
      `Thank you for dining with us!`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Restaurant Information */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800">Restaurant Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="restaurant-name">Restaurant Name</Label>
              <Input
                id="restaurant-name"
                type="text"
                value={billData.restaurantInfo.name}
                onChange={(e) => updateRestaurantInfo('name', e.target.value)}
                placeholder="Enter restaurant name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={billData.restaurantInfo.phone}
                onChange={(e) => updateRestaurantInfo('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              value={billData.restaurantInfo.address}
              onChange={(e) => updateRestaurantInfo('address', e.target.value)}
              placeholder="Enter restaurant address"
            />
          </div>
          <div>
            <Label htmlFor="gst">GST Number</Label>
            <Input
              id="gst"
              type="text"
              value={billData.restaurantInfo.gstNumber}
              onChange={(e) => updateRestaurantInfo('gstNumber', e.target.value)}
              placeholder="Enter GST number"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bill Details */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800">Bill Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="table-number">Table Number</Label>
              <Input
                id="table-number"
                type="text"
                value={billData.tableNumber}
                onChange={(e) => updateBillData({ tableNumber: e.target.value })}
                placeholder="Enter table number"
              />
            </div>
            <div>
              <Label htmlFor="customer-name">Customer Name (Optional)</Label>
              <Input
                id="customer-name"
                type="text"
                value={billData.customerName}
                onChange={(e) => updateBillData({ customerName: e.target.value })}
                placeholder="Enter customer name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Items */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800">Add Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Enter item name"
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
              />
            </div>
          </div>
          <Button onClick={addItem} className="w-full bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </CardContent>
      </Card>

      {/* Items List */}
      {billData.items.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800">Bill Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {billData.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 ml-2">x{item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-orange-600">₹{item.total}</span>
                    <Button
                      onClick={() => removeItem(item.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* GST Settings */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800">Tax Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="gst-rate">GST Rate (%)</Label>
            <Select
              value={billData.gstRate.toString()}
              onValueChange={(value) => {
                const rate = parseFloat(value);
                updateBillData({ gstRate: rate });
                calculateTotals(billData.items, rate);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0% (No Tax)</SelectItem>
                <SelectItem value="5">5% GST</SelectItem>
                <SelectItem value="12">12% GST</SelectItem>
                <SelectItem value="18">18% GST</SelectItem>
                <SelectItem value="28">28% GST</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onPreview} className="flex-1 bg-orange-500 hover:bg-orange-600">
          <FileText className="w-4 h-4 mr-2" />
          Preview Bill
        </Button>
        <Button onClick={shareViaWhatsApp} variant="outline" className="flex-1 border-orange-300 hover:bg-orange-50">
          <Share className="w-4 h-4 mr-2" />
          Share via WhatsApp
        </Button>
      </div>
    </div>
  );
};
