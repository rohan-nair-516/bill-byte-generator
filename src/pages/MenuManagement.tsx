
import React, { useState, useEffect } from 'react';
import { RestaurantHeader } from '../components/RestaurantHeader';
import { Navigation } from '../components/Navigation';
import { MenuEditor } from '../components/MenuEditor';
import { MenuPreview } from '../components/MenuPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
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

  useEffect(() => {
    // Load menu data from localStorage
    const savedMenu = localStorage.getItem('restaurant-menu');
    const savedCategories = localStorage.getItem('restaurant-categories');
    
    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu));
    } else {
      // Initialize with sample data
      const sampleItems: MenuItem[] = [
        {
          id: '1',
          name: 'Paneer Tikka',
          description: 'Grilled cottage cheese with spices',
          price: 180,
          category: 'appetizers',
          available: true
        },
        {
          id: '2',
          name: 'Butter Chicken',
          description: 'Creamy tomato-based chicken curry',
          price: 320,
          category: 'main-course',
          available: true
        },
        {
          id: '3',
          name: 'Gulab Jamun',
          description: 'Sweet milk dumplings in syrup',
          price: 80,
          category: 'desserts',
          available: true
        }
      ];
      setMenuItems(sampleItems);
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Initialize with sample categories
      const sampleCategories: MenuCategory[] = [
        { id: 'appetizers', name: 'Appetizers', description: 'Start your meal right', order: 1 },
        { id: 'main-course', name: 'Main Course', description: 'Hearty main dishes', order: 2 },
        { id: 'desserts', name: 'Desserts', description: 'Sweet endings', order: 3 },
        { id: 'beverages', name: 'Beverages', description: 'Refreshing drinks', order: 4 }
      ];
      setCategories(sampleCategories);
    }
  }, []);

  const saveMenu = () => {
    localStorage.setItem('restaurant-menu', JSON.stringify(menuItems));
    localStorage.setItem('restaurant-categories', JSON.stringify(categories));
    toast({
      title: "Menu Saved",
      description: "Your menu has been saved successfully.",
    });
  };

  const exportMenu = () => {
    const menuData = {
      items: menuItems,
      categories: categories,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(menuData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `restaurant-menu-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Menu Exported",
      description: "Your menu has been downloaded as a JSON file.",
    });
  };

  const importMenu = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const menuData = JSON.parse(result);
        
        if (menuData.items && menuData.categories) {
          setMenuItems(menuData.items);
          setCategories(menuData.categories);
          toast({
            title: "Menu Imported",
            description: "Your menu has been imported successfully.",
          });
        } else {
          throw new Error('Invalid menu format');
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import menu. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <RestaurantHeader />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Menu Management
          </h1>
          <p className="text-lg text-gray-600">
            Centralized menu updates and synchronization
          </p>
        </div>

        {/* Action Buttons */}
        <Card className="border-orange-200 mb-8">
          <CardHeader>
            <CardTitle>Menu Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={saveMenu} className="bg-orange-500 hover:bg-orange-600">
                <Save className="w-4 h-4 mr-2" />
                Save Menu
              </Button>
              <Button onClick={exportMenu} variant="outline" className="border-orange-300">
                <Download className="w-4 h-4 mr-2" />
                Export Menu
              </Button>
              <div className="relative">
                <Button variant="outline" className="border-orange-300">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Menu
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importMenu}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Editor and Preview */}
        <div className="grid lg:grid-cols-2 gap-8">
          <MenuEditor
            menuItems={menuItems}
            categories={categories}
            onUpdateItems={setMenuItems}
            onUpdateCategories={setCategories}
          />
          <MenuPreview
            menuItems={menuItems}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
