import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingScreen from '../../src/features/settings/settingScreen';
import { AllTheProviders } from '../test.utils/test.utils';

import { useAuth } from '@/src/features/auth/presentation/context/authContext';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@/src/features/auth/presentation/context/authContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: any) => children,
}));

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('SettingScreen', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
  });

  it('debería renderizar el título "Profile"', () => {
    const { getByText } = render(<SettingScreen />, { wrapper: AllTheProviders });
    expect(getByText('Profile')).toBeTruthy();
  });

  it('debería renderizar el texto "Profile settings..."', () => {
    const { getByText } = render(<SettingScreen />, { wrapper: AllTheProviders });
    expect(getByText('Profile settings...')).toBeTruthy();
  });

  
});
