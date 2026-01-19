
import { Product, ForumPost, User } from './types';

export const MOCK_USER: User = {
  id: 'user-1',
  name: 'John Doe',
  role: 'CUSTOMER',
  location: { lat: -1.2921, lng: 36.8219, address: 'Nairobi, Kenya' }
};

export const MOCK_FARMERS: User[] = [
  {
    id: 'farmer-1',
    name: 'Samuel Kiprop',
    role: 'FARMER',
    farmName: 'Green Pastures Poultry',
    location: { lat: -1.3000, lng: 36.8300, address: 'Nairobi East' }
  },
  {
    id: 'farmer-2',
    name: 'Grace Wambui',
    role: 'FARMER',
    farmName: 'Organic Layers Ltd',
    location: { lat: -1.2800, lng: 36.8100, address: 'Westlands' }
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    farmerId: 'farmer-1',
    name: 'Organic Kienyeji Eggs',
    category: 'EGGS',
    description: 'Fresh organic eggs from free-range indigenous chickens.',
    price: 600,
    unit: 'Tray (30)',
    stock: 25,
    images: ['https://picsum.photos/seed/eggs1/400/300'],
    isOrganic: true,
    isFreeRange: true
  },
  {
    id: 'p2',
    farmerId: 'farmer-1',
    name: 'Broiler Meat (Whole)',
    category: 'MEAT',
    description: 'Freshly slaughtered 1.5kg broiler chickens.',
    price: 850,
    unit: 'kg',
    stock: 10,
    images: ['https://picsum.photos/seed/chickenmeat/400/300'],
    isOrganic: false,
    isFreeRange: false
  },
  {
    id: 'p3',
    farmerId: 'farmer-2',
    name: 'Day Old Layers',
    category: 'CHICKS',
    description: 'High-quality hybrid layers, vaccinated against Marek\'s.',
    price: 110,
    unit: 'Chicks',
    stock: 500,
    images: ['https://picsum.photos/seed/chicks1/400/300'],
    isOrganic: false,
    isFreeRange: false
  }
];

export const MOCK_FORUM: ForumPost[] = [
  {
    id: 'f1',
    authorId: 'farmer-1',
    authorName: 'Samuel Kiprop',
    title: 'Managing Heat Stress in Layers',
    content: 'With the current heat wave, my birds are panting a lot. Any recommendations for electrolyte brands?',
    category: 'Health & Disease',
    likes: 12,
    comments: 5,
    timestamp: new Date()
  },
  {
    id: 'f2',
    authorId: 'farmer-2',
    authorName: 'Grace Wambui',
    title: 'Feed Price Increases',
    content: 'Has anyone else noticed the 15% hike in starter mash prices this month? Where are you sourcing from now?',
    category: 'Feed & Nutrition',
    likes: 24,
    comments: 18,
    timestamp: new Date()
  }
];
