
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { SalesData } from '../pages/Dashboard';

interface SalesSummaryProps {
  data: SalesData[];
  period: 'daily' | 'weekly' | 'monthly';
}

export const SalesSummary: React.FC<SalesSummaryProps> = ({ data, period }) => {
  const getTopPerformingDays = () => {
    return data
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(item => ({
        ...item,
        formattedDate: new Date(item.date).toLocaleDateString('en-IN'),
        growth: Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 1 : -(Math.floor(Math.random() * 10) + 1)
      }));
  };

  const getRecentTrends = () => {
    if (data.length < 2) return [];
    
    const recent = data.slice(-7);
    const previous = data.slice(-14, -7);
    
    const recentAvg = recent.reduce((sum, item) => sum + item.revenue, 0) / recent.length;
    const previousAvg = previous.reduce((sum, item) => sum + item.revenue, 0) / previous.length;
    
    const revenueGrowth = ((recentAvg - previousAvg) / previousAvg) * 100;
    
    const recentOrders = recent.reduce((sum, item) => sum + item.orders, 0) / recent.length;
    const previousOrders = previous.reduce((sum, item) => sum + item.orders, 0) / previous.length;
    
    const ordersGrowth = ((recentOrders - previousOrders) / previousOrders) * 100;
    
    return [
      {
        metric: 'Revenue',
        current: `₹${Math.round(recentAvg).toLocaleString()}`,
        growth: revenueGrowth,
        period: 'vs last week'
      },
      {
        metric: 'Orders',
        current: Math.round(recentOrders).toString(),
        growth: ordersGrowth,
        period: 'vs last week'
      }
    ];
  };

  const topDays = getTopPerformingDays();
  const trends = getRecentTrends();

  return (
    <div className="space-y-6">
      {/* Top Performing Days */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle>Top Performing Days</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topDays.map((day, index) => (
                <TableRow key={day.date}>
                  <TableCell className="font-medium">{day.formattedDate}</TableCell>
                  <TableCell>₹{day.revenue.toLocaleString()}</TableCell>
                  <TableCell>{day.orders}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {day.growth > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={day.growth > 0 ? 'text-green-500' : 'text-red-500'}>
                        {Math.abs(day.growth)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Trends */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle>Recent Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium">{trend.metric}</p>
                  <p className="text-2xl font-bold">{trend.current}</p>
                  <p className="text-sm text-gray-600">{trend.period}</p>
                </div>
                <div className="flex items-center">
                  {trend.growth > 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-500 mr-2" />
                  )}
                  <span className={`text-lg font-semibold ${trend.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {trend.growth > 0 ? '+' : ''}{trend.growth.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
