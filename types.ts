
export type UserRole = 'FARMER' | 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  location?: { lat: number; lng: number; address: string };
  profileImage?: string;
  farmName?: string;
}

export interface Product {
  id: string;
  farmerId: string;
  name: string;
  category: 'EGGS' | 'MEAT' | 'LIVE_BIRDS' | 'CHICKS' | 'MANURE';
  description: string;
  price: number;
  unit: string;
  stock: number;
  images: string[];
  isOrganic: boolean;
  isFreeRange: boolean;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  timestamp: Date;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  wind: string;
}

export interface VaccineReminder {
  id: string;
  birdType: string;
  vaccineName: string;
  scheduledDate: string;
  status: 'PENDING' | 'COMPLETED';
  ageWeek: number;
  description: string;
}
