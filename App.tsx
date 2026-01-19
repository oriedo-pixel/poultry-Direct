
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Users, 
  BookOpen, 
  User as UserIcon, 
  Menu, 
  Bell,
  ChevronRight,
  Plus
} from 'lucide-react';

import Marketplace from './pages/Marketplace';
import Community from './pages/Community';
import Resources from './pages/Resources';
import FarmerDashboard from './pages/FarmerDashboard';
import ProductDetails from './pages/ProductDetails';
import { User, UserRole } from './types';
import { MOCK_USER } from './mockData';

const Layout: React.FC<{ children: React.ReactNode; user: User; toggleRole: () => void }> = ({ children, user, toggleRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Shop', path: '/', icon: ShoppingBag },
    { label: 'Community', path: '/community', icon: Users },
    { label: 'Resources', path: '/resources', icon: BookOpen },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ];

  if (user.role === 'FARMER') {
    navItems.splice(0, 1, { label: 'Dashboard', path: '/', icon: Home });
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <ShoppingBag className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-green-800">PoultryDirect</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button onClick={toggleRole} className="text-xs bg-gray-200 px-2 py-1 rounded-md font-medium text-gray-700">
            Switch to {user.role === 'FARMER' ? 'Customer' : 'Farmer'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-50 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 ${isActive ? 'text-green-600' : 'text-gray-400'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User>(MOCK_USER);

  const toggleRole = () => {
    setUser(prev => ({
      ...prev,
      role: prev.role === 'FARMER' ? 'CUSTOMER' : 'FARMER'
    }));
  };

  return (
    <Router>
      <Layout user={user} toggleRole={toggleRole}>
        <Routes>
          <Route path="/" element={user.role === 'FARMER' ? <FarmerDashboard farmer={user} /> : <Marketplace />} />
          <Route path="/community" element={<Community user={user} />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile" element={
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-gray-500 text-sm">{user.role} Account</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-sm font-medium">Notification Settings</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-sm font-medium">Payment Methods</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-sm font-medium">Privacy Policy</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <button className="w-full py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition">
                Log Out
              </button>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
