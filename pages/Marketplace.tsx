
import React, { useState } from 'react';
import { Search, MapPin, Filter, Star, ChevronRight } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_FARMERS } from '../mockData';
import { Link } from 'react-router-dom';

const Marketplace: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'EGGS', 'MEAT', 'LIVE_BIRDS', 'CHICKS'];

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    (selectedCategory === 'ALL' || p.category === selectedCategory) &&
    (p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 space-y-6">
      {/* Search and Location */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded-lg text-sm font-medium">
          <MapPin className="w-4 h-4" />
          <span>Delivering to: Nairobi Central</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search eggs, meat, or farms..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat 
              ? 'bg-green-600 text-white shadow-md' 
              : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map(product => {
          const farm = MOCK_FARMERS.find(f => f.id === product.farmerId);
          return (
            <Link key={product.id} to={`/product/${product.id}`} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  {product.isOrganic && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Organic</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm text-gray-800 line-clamp-1">{product.name}</h3>
                  <p className="text-[11px] text-gray-500 mb-2 flex items-center gap-1">
                    <span className="font-medium text-green-700">{farm?.farmName}</span>
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-lg font-bold text-gray-900">KES {product.price}</span>
                      <span className="text-[10px] text-gray-400 block">/ {product.unit}</span>
                    </div>
                    <button className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition">
                      <Filter className="w-4 h-4 rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recommended Farms Section */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">Top Rated Farms</h2>
          <button className="text-green-600 text-sm font-semibold">See all</button>
        </div>
        <div className="space-y-3">
          {MOCK_FARMERS.map(farmer => (
            <div key={farmer.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
              <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden">
                <img src={`https://picsum.photos/seed/${farmer.id}/100/100`} alt="farm" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{farmer.farmName}</h4>
                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span>4.9 (120+ reviews)</span>
                  <span className="mx-1">•</span>
                  <span>{farmer.location?.address}</span>
                </div>
              </div>
              {/* Fix: ChevronRight must be imported from lucide-react */}
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Marketplace;
