
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import {MenuItem, MenuCategory } from '../pages/MenuManagement';
import { useToast } from '@/hooks/use-toast';

interface MenuEditorProps {
  menuItems: MenuItem[];
  categories: MenuCategory[];
  onUpdateItems: (items: MenuItem[]) => void;
  onUpdateCategories: (categories: MenuCategory[]) => void;
}

export const MenuEditor: React.FC<MenuEditorProps> = ({
  menuItems,
  categories,
  onUpdateItems,
  onUpdateCategories
}) => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    available: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingItem) {
      // Update existing item
      const updatedItems = menuItems.map(item =>
        item.id === editingItem.id ? { ...editingItem, ...formData } as MenuItem : item
      );
      onUpdateItems(updatedItems);
      toast({
        title: "Item Updated",
        description: "Menu item has been updated successfully.",
      });
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: formData.name!,
        description: formData.description || '',
        price: formData.price!,
        category: formData.category!,
        available: formData.available ?? true
      };
      onUpdateItems([...menuItems, newItem]);
      toast({
        title: "Item Added",
        description: "New menu item has been added successfully.",
      });
    }

    resetForm();
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddForm(true);
  };

  const handleDelete = (itemId: string) => {
    const updatedItems = menuItems.filter(item => item.id !== itemId);
    onUpdateItems(updatedItems);
    toast({
      title: "Item Deleted",
      description: "Menu item has been deleted successfully.",
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      available: true
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <Card className="border-orange-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {editingItem ? 'Edit Menu Item' : 'Add New Item'}
            </CardTitle>
            {!showAddForm && (
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            )}
            {showAddForm && (
              <Button onClick={resetForm} variant="outline" size="sm">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        {showAddForm && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="item-name">Item Name *</Label>
                  <Input
                    id="item-name"
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter item name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="item-price">Price (₹) *</Label>
                  <Input
                    id="item-price"
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="item-description">Description</Label>
                <Textarea
                  id="item-description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="item-category">Category *</Label>
                  <Select
                    value={formData.category || ''}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="item-available"
                    checked={formData.available ?? true}
                    onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                  />
                  <Label htmlFor="item-available">Available</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
                <Button type="button" onClick={resetForm} variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Menu Items List */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle>Current Menu Items ({menuItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {menuItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No menu items added yet.</p>
            ) : (
              menuItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-bold text-orange-600">₹{item.price}</span>
                      <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        {categories.find(cat => cat.id === item.category)?.name || item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(item)} size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(item.id)} size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
