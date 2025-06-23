
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, BarChart3, Menu } from 'lucide-react';

export const Navigation = () => {
  const handleNavigation = (page: string) => {
    // For now, we'll use simple navigation - in a real app you'd use React Router
    if (page === 'dashboard') {
      window.location.href = '/dashboard';
    } else if (page === 'menu') {
      window.location.href = '/menu';
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <Card className="border-orange-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Receipt className="w-4 h-4 mr-2" />
              Bill Generator
            </Button>
            <Button 
              onClick={() => handleNavigation('dashboard')}
              variant="outline"
              className="border-orange-300 hover:bg-orange-50"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Sales Dashboard
            </Button>
            <Button 
              onClick={() => handleNavigation('menu')}
              variant="outline"
              className="border-orange-300 hover:bg-orange-50"
            >
              <Menu className="w-4 h-4 mr-2" />
              Menu Management
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
