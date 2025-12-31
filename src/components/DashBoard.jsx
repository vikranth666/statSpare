import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Activity, Calendar } from 'lucide-react';

// MOCK DATA - In real app, this comes from API
const generateSalesData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    sales: Math.floor(Math.random() * 50000) + 30000,
    profit: Math.floor(Math.random() * 20000) + 10000,
    expenses: Math.floor(Math.random() * 15000) + 8000,
  }));
};

const categoryData = [
  { name: 'Electronics', value: 35, color: '#3b82f6' },
  { name: 'Clothing', value: 25, color: '#8b5cf6' },
  { name: 'Food', value: 20, color: '#10b981' },
  { name: 'Books', value: 12, color: '#f59e0b' },
  { name: 'Other', value: 8, color: '#6b7280' },
];

const recentOrders = [
  { id: '1001', customer: 'John Doe', product: 'Laptop', amount: 1299, status: 'Completed' },
  { id: '1002', customer: 'Jane Smith', product: 'Headphones', amount: 199, status: 'Processing' },
  { id: '1003', customer: 'Bob Johnson', product: 'Mouse', amount: 49, status: 'Completed' },
  { id: '1004', customer: 'Alice Brown', product: 'Keyboard', amount: 149, status: 'Shipped' },
  { id: '1005', customer: 'Charlie Wilson', product: 'Monitor', amount: 399, status: 'Completed' },
];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('year');
  const [selectedMetric, setSelectedMetric] = useState('sales');
  
  // MEMOIZED DATA - Recalculates only when dependencies change
  const salesData = useMemo(() => generateSalesData(), []);
  
  const stats = useMemo(() => {
    const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
    const totalProfit = salesData.reduce((sum, item) => sum + item.profit, 0);
    const avgSales = Math.floor(totalSales / salesData.length);
    
    return {
      revenue: { value: totalSales, change: 12.5, trend: 'up' },
      profit: { value: totalProfit, change: 8.3, trend: 'up' },
      customers: { value: 12543, change: -2.4, trend: 'down' },
      orders: { value: 8942, change: 5.7, trend: 'up' },
    };
  }, [salesData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here's your business overview.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="text-gray-400" size={20} />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* STATS GRID - Component Composition */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${(stats.revenue.value / 1000).toFixed(1)}K`}
            change={stats.revenue.change}
            trend={stats.revenue.trend}
            icon={DollarSign}
            color="blue"
          />
          <StatCard
            title="Net Profit"
            value={`$${(stats.profit.value / 1000).toFixed(1)}K`}
            change={stats.profit.change}
            trend={stats.profit.trend}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Total Customers"
            value={stats.customers.value.toLocaleString()}
            change={stats.customers.change}
            trend={stats.customers.trend}
            icon={Users}
            color="purple"
          />
          <StatCard
            title="Total Orders"
            value={stats.orders.value.toLocaleString()}
            change={stats.orders.change}
            trend={stats.orders.trend}
            icon={ShoppingCart}
            color="orange"
          />
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* MAIN CHART - 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Sales Overview</h2>
              <div className="flex gap-2">
                {['sales', 'profit', 'expenses'].map(metric => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                      selectedMetric === metric
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {metric}
                  </button>
                ))}
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorMetric)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART - 1/3 width */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Sales by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {categoryData.map(cat => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-gray-700">{cat.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BAR CHART */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Monthly Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="profit" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.product}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">${order.amount}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// STAT CARD COMPONENT - Reusable with props
function StatCard({ title, value, change, trend, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  const isPositive = trend === 'up';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="text-white" size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {Math.abs(change)}%
        </div>
      </div>
      
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// STATUS BADGE COMPONENT
function StatusBadge({ status }) {
  const styles = {
    Completed: 'bg-green-100 text-green-700',
    Processing: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}