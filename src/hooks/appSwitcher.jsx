import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate, resetAndNavigate} from '../utils/navigations';

const STORAGE_KEY = 'IS_SECOND_APP';
const AppSwitcherContext = createContext();

export function AppSwitcherProvider({children}) {
  const [isSecondApp, setIsSecondApp] = useState(false);

  // console.log('isSecondApp  ---->>>>', isSecondApp);

  // Load value from AsyncStorage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY);
        if (value !== null) {
          setIsSecondApp(JSON.parse(value));
        }
      } catch (e) {
        console.error('Failed to load isSecondApp from storage', e);
      }
    };
    loadState();
  }, []);

  // Toggle and save to AsyncStorage
  const toggleApp = useCallback(async () => {
    try {
      setIsSecondApp(prev => {
        const newValue = !prev;
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
        return newValue;
      });
    } catch (e) {
      console.error('Failed to toggle and save isSecondApp', e);
    }
  }, []);

  return (
    <AppSwitcherContext.Provider
      value={{isSecondApp, toggleApp, setIsSecondApp}}>
      {children}
    </AppSwitcherContext.Provider>
  );
}

export function useAppSwitcher() {
  const context = useContext(AppSwitcherContext);
  if (!context) {
    throw new Error(
      'useAppSwitcher must be used within an AppSwitcherProvider',
    );
  }
  return context;
}
