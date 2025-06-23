
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { SalesData } from '../pages/Dashboard';

interface SalesChartProps {
  data: SalesData[];
  period: 'daily' | 'weekly' | 'monthly';
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#f97316",
  },
  orders: {
    label: "Orders",
    color: "#ea580c",
  },
};

export const SalesChart: React.FC<SalesChartProps> = ({ data, period }) => {
  const formatData = () => {
    if (period === 'daily') {
      return data.slice(-7).map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        })
      }));
    }
    
    if (period === 'weekly') {
      const weeklyData: { [key: string]: SalesData } = {};
      data.forEach(item => {
        const date = new Date(item.date);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {
            date: weekKey,
            revenue: 0,
            orders: 0,
            customers: 0
          };
        }
        
        weeklyData[weekKey].revenue += item.revenue;
        weeklyData[weekKey].orders += item.orders;
        weeklyData[weekKey].customers += item.customers;
      });
      
      return Object.values(weeklyData).slice(-4).map(item => ({
        ...item,
        date: `Week of ${new Date(item.date).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        })}`
      }));
    }
    
    // Monthly data
    const monthlyData: { [key: string]: SalesData } = {};
    data.forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          date: monthKey,
          revenue: 0,
          orders: 0,
          customers: 0
        };
      }
      
      monthlyData[monthKey].revenue += item.revenue;
      monthlyData[monthKey].orders += item.orders;
      monthlyData[monthKey].customers += item.customers;
    });
    
    return Object.values(monthlyData).slice(-3).map(item => ({
      ...item,
      date: new Date(item.date + '-01').toLocaleDateString('en-IN', { 
        month: 'long', 
        year: 'numeric' 
      })
    }));
  };

  const chartData = formatData();

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="text-center">Revenue & Orders Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickMargin={10}
              />
              <YAxis 
                yAxisId="revenue"
                orientation="left"
                fontSize={12}
              />
              <YAxis 
                yAxisId="orders"
                orientation="right"
                fontSize={12}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={{ fill: "var(--color-revenue)" }}
              />
              <Line
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                stroke="var(--color-orders)"
                strokeWidth={2}
                dot={{ fill: "var(--color-orders)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
