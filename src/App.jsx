import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import React from 'react';
import {LogBox} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RootNavigator from './navigation';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './utils/navigations';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppSwitcherProvider} from './hooks/appSwitcher';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import 'react-native-get-random-values';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './store';
import FlashMessage from 'react-native-flash-message';

const App = () => {
  LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <KeyboardProvider>
            <SafeAreaProvider>
              <AppSwitcherProvider>
                <NavigationContainer ref={navigationRef}>
                  <StatusBar barStyle={'dark-content'} translucent />
                  <BottomSheetModalProvider>
                    <RootNavigator />
                    <FlashMessage position="top" />
                  </BottomSheetModalProvider>
                </NavigationContainer>
              </AppSwitcherProvider>
            </SafeAreaProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;
