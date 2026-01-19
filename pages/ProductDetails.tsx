
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Heart, ShieldCheck, Truck, Star, CreditCard } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_FARMERS } from '../mockData';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = MOCK_PRODUCTS.find(p => p.id === id);
  const farmer = MOCK_FARMERS.find(f => f.id === product?.farmerId);

  if (!product || !farmer) return <div className="p-10 text-center">Product not found</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Top Action Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between p-4 max-w-lg mx-auto pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white/80 backdrop-blur rounded-full shadow-lg pointer-events-auto"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="flex gap-2">
          <button className="p-2 bg-white/80 backdrop-blur rounded-full shadow-lg pointer-events-auto">
            <Share2 className="w-6 h-6 text-gray-800" />
          </button>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 bg-white/80 backdrop-blur rounded-full shadow-lg pointer-events-auto"
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="w-full aspect-square relative">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-6 h-1 bg-white rounded-full"></div>
          <div className="w-2 h-1 bg-white/50 rounded-full"></div>
          <div className="w-2 h-1 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold">FREE RANGE</span>
                {product.isOrganic && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">ORGANIC</span>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-green-700">KES {product.price}</p>
              <p className="text-[10px] text-gray-400 font-bold">PER {product.unit.toUpperCase()}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mt-4">
            {product.description}
          </p>
        </div>

        {/* Farm Section */}
        <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
            <img src={`https://picsum.photos/seed/${farmer.id}/100/100`} alt="farm" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm">{farmer.farmName}</h4>
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span>4.9 (124 reviews)</span>
            </div>
          </div>
          <button className="text-xs bg-white text-green-600 px-3 py-1.5 rounded-lg font-bold border border-gray-100 shadow-sm">
            Visit Farm
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Delivery</p>
              <p className="text-xs font-bold">Available</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Verified</p>
              <p className="text-xs font-bold">Direct Source</p>
            </div>
          </div>
        </div>

        {/* Quantity and Order */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] max-w-lg mx-auto z-40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-xl">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center font-bold text-lg text-gray-600 hover:bg-white rounded-lg transition"
              >
                -
              </button>
              <span className="font-bold w-6 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center font-bold text-lg text-gray-600 hover:bg-white rounded-lg transition"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Total Cost</p>
              <p className="text-xl font-black text-gray-900">KES {product.price * quantity}</p>
            </div>
          </div>
          <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-[0.98] transition">
            <CreditCard className="w-5 h-5" />
            Order with M-Pesa
          </button>
        </div>
        <div className="h-24"></div> {/* Spacer for fixed footer */}
      </div>
    </div>
  );
};

export default ProductDetails;
