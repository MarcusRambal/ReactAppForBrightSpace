import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../../src/features/auth/presentation/context/authContext';
import { PaperProvider } from 'react-native-paper';
import { DIProvider } from '../../src/core/di/diProvider';

export const AllTheProviders = ({ children }: any) => {
  return (
    <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
      <DIProvider>
        <AuthProvider>
          <PaperProvider>
             {children}
          </PaperProvider>
        </AuthProvider>
      </DIProvider>
    </SafeAreaProvider>
  );
};