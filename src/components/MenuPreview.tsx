
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MenuItem, MenuCategory } from '../pages/MenuManagement';

interface MenuPreviewProps {
  menuItems: MenuItem[];
  categories: MenuCategory[];
}

export const MenuPreview: React.FC<MenuPreviewProps> = ({ menuItems, categories }) => {
  const getItemsByCategory = (categoryId: string) => {
    return menuItems.filter(item => item.category === categoryId && item.available);
  };

  const sortedCategories = categories.sort((a, b) => a.order - b.order);

  return (
    <Card className="border-orange-200 sticky top-8">
      <CardHeader className="bg-orange-50">
        <CardTitle className="text-center text-orange-800">Menu Preview</CardTitle>
        <p className="text-center text-sm text-orange-600">
          How your menu will appear to customers
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {sortedCategories.map((category) => {
            const categoryItems = getItemsByCategory(category.id);
            
            if (categoryItems.length === 0) return null;
            
            return (
              <div key={category.id} className="border-b border-gray-200 last:border-b-0">
                <div className="p-4 bg-orange-25">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {category.name}
                  </h2>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
                
                <div className="p-4 space-y-4">
                  {categoryItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          {!item.available && (
                            <Badge variant="destructive" className="text-xs">
                              Unavailable
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-orange-600 text-lg">
                          ₹{item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {menuItems.filter(item => item.available).length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>No menu items available</p>
              <p className="text-sm mt-2">Add some items to see your menu preview</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
