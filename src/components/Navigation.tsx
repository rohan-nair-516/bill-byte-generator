
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, BarChart3, Menu } from 'lucide-react';

export const Navigation = () => {
  const location = useLocation();

  return (
    <div className="container mx-auto px-4 py-4">
      <Card className="border-orange-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              asChild
              className={location.pathname === '/' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-500 hover:bg-orange-600'}
            >
              <Link to="/">
                <Receipt className="w-4 h-4 mr-2" />
                Bill Generator
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="border-orange-300 hover:bg-orange-50"
            >
              <Link to="/dashboard">
                <BarChart3 className="w-4 h-4 mr-2" />
                Sales Dashboard
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="border-orange-300 hover:bg-orange-50"
            >
              <Link to="/menu">
                <Menu className="w-4 h-4 mr-2" />
                Menu Management
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
