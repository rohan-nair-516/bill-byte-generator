
export interface StoredRestaurantProfile {
  name: string;
  address: string;
  phone: string;
  gstNumber: string;
}

export interface StoredMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export interface StoredMenuCategory {
  id: string;
  name: string;
  description: string;
  order: number;
}

const STORAGE_KEYS = {
  RESTAURANT_PROFILE: 'restaurant_profile',
  MENU_ITEMS: 'menu_items',
  MENU_CATEGORIES: 'menu_categories'
};

// Restaurant Profile Storage
export const saveRestaurantProfile = (profile: StoredRestaurantProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.RESTAURANT_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save restaurant profile:', error);
  }
};

export const getRestaurantProfile = (): StoredRestaurantProfile | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESTAURANT_PROFILE);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load restaurant profile:', error);
    return null;
  }
};

// Menu Items Storage
export const saveMenuItems = (items: StoredMenuItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save menu items:', error);
  }
};

export const getMenuItems = (): StoredMenuItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load menu items:', error);
    return [];
  }
};

// Menu Categories Storage
export const saveMenuCategories = (categories: StoredMenuCategory[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MENU_CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save menu categories:', error);
  }
};

export const getMenuCategories = (): StoredMenuCategory[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MENU_CATEGORIES);
    return stored ? JSON.parse(stored) : [
      { id: '1', name: 'Appetizers', description: 'Start your meal with these delicious appetizers', order: 1 },
      { id: '2', name: 'Main Course', description: 'Our signature main dishes', order: 2 },
      { id: '3', name: 'Desserts', description: 'Sweet endings to your meal', order: 3 },
      { id: '4', name: 'Beverages', description: 'Refreshing drinks and beverages', order: 4 }
    ];
  } catch (error) {
    console.error('Failed to load menu categories:', error);
    return [];
  }
};
