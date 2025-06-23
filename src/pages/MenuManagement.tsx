
import React, { useState } from 'react';
import { RestaurantHeader } from '../components/RestaurantHeader';
import { Navigation } from '../components/Navigation';
import { MenuEditor } from '../components/MenuEditor';
import { MenuPreview } from '../components/MenuPreview';

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
  const [categories, setCategories] = useState<MenuCategory[]>([
    { id: '1', name: 'Appetizers', description: 'Start your meal with these delicious appetizers', order: 1 },
    { id: '2', name: 'Main Course', description: 'Our signature main dishes', order: 2 },
    { id: '3', name: 'Desserts', description: 'Sweet endings to your meal', order: 3 },
    { id: '4', name: 'Beverages', description: 'Refreshing drinks and beverages', order: 4 }
  ]);

  const handleUpdateItems = (items: MenuItem[]) => {
    setMenuItems(items);
  };

  const handleUpdateCategories = (newCategories: MenuCategory[]) => {
    setCategories(newCategories);
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
