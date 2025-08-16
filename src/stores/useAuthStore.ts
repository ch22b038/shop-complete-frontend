import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  isAdmin?: boolean;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

// Mock user data
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@store.com',
    password: 'admin123',
    name: 'Admin User',
    isAdmin: true,
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'user123',
    name: 'John Doe',
    isAdmin: false,
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (user) {
          const token = `mock-token-${user.id}`;
          set({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              isAdmin: user.isAdmin,
            },
            token,
            isAuthenticated: true,
          });
          return true;
        }
        
        return false;
      },

      register: async (email, password, name) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user already exists
        const existingUser = MOCK_USERS.find(u => u.email === email);
        if (existingUser) {
          return false;
        }

        // Create new user
        const newUser = {
          id: MOCK_USERS.length + 1,
          email,
          name,
          isAdmin: false,
        };

        const token = `mock-token-${newUser.id}`;
        set({
          user: newUser,
          token,
          isAuthenticated: true,
        });

        return true;
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateProfile: (updates) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updates },
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);