
import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Search, 
  Plus,
  Filter,
  Users
} from 'lucide-react';
import { MOCK_FORUM } from '../mockData';
import { User } from '../types';

const Community: React.FC<{ user: User }> = ({ user }) => {
  const [posts, setPosts] = useState(MOCK_FORUM);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Health & Disease', 'Feed & Nutrition', 'Equipment', 'Marketing'];

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Farmer Forum</h1>
        <button className="bg-green-600 text-white p-2 rounded-full shadow-lg">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Group Stats Card */}
      <div className="bg-blue-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium opacity-80">Community Members</p>
            <p className="text-xl font-bold">2,450+</p>
          </div>
        </div>
        <button className="bg-white text-blue-600 px-4 py-1.5 rounded-lg text-xs font-bold">Invite</button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search discussions..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filter === cat 
                ? 'bg-gray-800 text-white' 
                : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Forum Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorName}`} alt="avatar" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">{post.authorName}</h4>
                <p className="text-[10px] text-gray-400">{post.timestamp.toLocaleDateString()} • <span className="text-green-600 font-semibold">{post.category}</span></p>
              </div>
            </div>
            
            <h3 className="font-bold text-gray-900 leading-tight">{post.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>

            <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-gray-400">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-xs font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-medium">{post.comments}</span>
                </button>
              </div>
              <button className="hover:text-gray-600">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
