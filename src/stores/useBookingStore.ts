import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookingItem {
  carId: number;
  carName: string;
  carImage: string;
  pricePerDay: number;
  pricePerHour: number;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  duration: number;
  durationType: 'days' | 'hours';
  totalCost: number;
  pickupLocation: string;
  dropoffLocation: string;
}

interface BookingStore {
  currentBooking: BookingItem | null;
  bookingHistory: BookingItem[];
  setCurrentBooking: (booking: BookingItem) => void;
  clearCurrentBooking: () => void;
  addToHistory: (booking: BookingItem) => void;
  calculateCost: (pricePerDay: number, pricePerHour: number, duration: number, durationType: 'days' | 'hours') => number;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      currentBooking: null,
      bookingHistory: [],

      setCurrentBooking: (booking) => {
        set({ currentBooking: booking });
      },

      clearCurrentBooking: () => {
        set({ currentBooking: null });
      },

      addToHistory: (booking) => {
        set(state => ({
          bookingHistory: [booking, ...state.bookingHistory],
          currentBooking: null
        }));
      },

      calculateCost: (pricePerDay, pricePerHour, duration, durationType) => {
        if (durationType === 'days') {
          return pricePerDay * duration;
        } else {
          return pricePerHour * duration;
        }
      },
    }),
    {
      name: 'booking-storage',
    }
  )
);