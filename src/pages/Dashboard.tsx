
import React, { useState, useEffect } from 'react';
import { RestaurantHeader } from '../components/RestaurantHeader';
import { Navigation } from '../components/Navigation';
import { SalesChart } from '../components/SalesChart';
import { SalesSummary } from '../components/SalesSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  useEffect(() => {
    // Generate sample sales data
    const generateSampleData = () => {
      const data: SalesData[] = [];
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 5000) + 2000,
          orders: Math.floor(Math.random() * 50) + 20,
          customers: Math.floor(Math.random() * 40) + 15
        });
      }
      
      return data;
    };

    setSalesData(generateSampleData());
  }, []);

  const getTotalStats = () => {
    const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
    const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
    const totalCustomers = salesData.reduce((sum, day) => sum + day.customers, 0);
    const avgRevenue = salesData.length > 0 ? totalRevenue / salesData.length : 0;

    return { totalRevenue, totalOrders, totalCustomers, avgRevenue };
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <RestaurantHeader />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Sales Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Track your restaurant's performance and growth
          </p>
        </div>

        {/* Period Selection */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 bg-white p-2 rounded-lg border border-orange-200">
            <Button
              onClick={() => setSelectedPeriod('daily')}
              variant={selectedPeriod === 'daily' ? 'default' : 'outline'}
              size="sm"
              className={selectedPeriod === 'daily' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              Daily
            </Button>
            <Button
              onClick={() => setSelectedPeriod('weekly')}
              variant={selectedPeriod === 'weekly' ? 'default' : 'outline'}
              size="sm"
              className={selectedPeriod === 'weekly' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              Weekly
            </Button>
            <Button
              onClick={() => setSelectedPeriod('monthly')}
              variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
              size="sm"
              className={selectedPeriod === 'monthly' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              Monthly
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Daily Revenue</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{Math.round(stats.avgRevenue).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Per day average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Summary */}
        <div className="grid lg:grid-cols-2 gap-8">
          <SalesChart data={salesData} period={selectedPeriod} />
          <SalesSummary data={salesData} period={selectedPeriod} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
