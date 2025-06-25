
import React, { useState, useEffect } from 'react';
import { RestaurantHeader } from '../components/RestaurantHeader';
import { Navigation } from '../components/Navigation';
import { MenuEditor } from '../components/MenuEditor';
import { MenuPreview } from '../components/MenuPreview';
import { saveMenuItems, getMenuItems, saveMenuCategories, getMenuCategories } from '../utils/storage';
import { useToast } from '@/hooks/use-toast';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  order: number;
}

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const { toast } = useToast();

  // Load saved data on component mount
  useEffect(() => {
    const savedItems = getMenuItems();
    const savedCategories = getMenuCategories();
    
    setMenuItems(savedItems);
    setCategories(savedCategories);
    
    if (savedItems.length > 0) {
      toast({
        title: "Menu Loaded",
        description: `${savedItems.length} menu items loaded successfully.`,
      });
    }
  }, [toast]);

  const handleUpdateItems = (items: MenuItem[]) => {
    setMenuItems(items);
    saveMenuItems(items);
    console.log('Menu items auto-saved:', items.length);
  };

  const handleUpdateCategories = (newCategories: MenuCategory[]) => {
    setCategories(newCategories);
    saveMenuCategories(newCategories);
    console.log('Menu categories auto-saved:', newCategories.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <RestaurantHeader />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Menu Management Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Add, edit, and manage your restaurant menu items
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <MenuEditor 
              menuItems={menuItems}
              categories={categories}
              onUpdateItems={handleUpdateItems}
              onUpdateCategories={handleUpdateCategories}
            />
          </div>
          
          <div className="lg:sticky lg:top-8">
            <MenuPreview 
              menuItems={menuItems}
              categories={categories}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
