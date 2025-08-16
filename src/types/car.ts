export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  description: string;
  pricePerDay: number;
  pricePerHour: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  category: string;
  categorySlug: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  seatingCapacity: number;
  rating: number;
  reviewCount: number;
  available: boolean;
  features: string[];
  tags?: string[];
  featured?: boolean;
  popular?: boolean;
  mileage: string;
  engineSize: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  carCount: number;
}

export interface CarFilters {
  query?: string;
  category?: string;
  brand?: string;
  fuelType?: string;
  transmission?: string;
  priceMin?: number;
  priceMax?: number;
  seatingCapacity?: number;
  available?: boolean;
  sortBy?: 'name' | 'price' | 'rating' | 'year' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface Booking {
  id: number;
  carId: number;
  userId: number;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  duration: number;
  durationType: 'days' | 'hours';
  totalCost: number;
  pickupLocation: string;
  dropoffLocation: string;
  driverAge: number;
  licenseNumber: string;
  contactPhone: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  carId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
}