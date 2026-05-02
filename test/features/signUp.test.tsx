import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUp from '../../src/features/auth/presentation/screens/signUp';
import { AllTheProviders } from '../test.utils/test.utils';
import { useAuth } from '../../src/features/auth/presentation/context/authContext';


jest.mock('../../src/features/auth/presentation/context/authContext', () => ({
  ...jest.requireActual('../../src/features/auth/presentation/context/authContext'),
  useAuth: jest.fn(),
}));

describe('SignUp Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('llama a la función signup al presionar el botón con valores válidos', async () => {
    const mockSignup = jest.fn().mockResolvedValue(true);

    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    (useAuth as jest.Mock).mockReturnValue({
      signup: mockSignup,
      error: null,
      clearError: jest.fn(),
    });

    const { getByTestId } = render(<SignUp navigation={mockNavigation as any} />, { wrapper: AllTheProviders });

    fireEvent.changeText(getByTestId('name-input'), 'Marcus');
    fireEvent.changeText(getByTestId('email-input'), 'mpreston@uninorte.edu.co');
    fireEvent.changeText(getByTestId('password-input'), 'ThePassword!1.');

    fireEvent.press(getByTestId('submit-signup-button'));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('Marcus', 'mpreston@uninorte.edu.co', 'ThePassword!1.');
    });
  });

  it('navega a VerificationEmail después de un signup exitoso', async () => {
    const mockSignup = jest.fn().mockResolvedValue(true);

    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    (useAuth as jest.Mock).mockReturnValue({
      signup: mockSignup,
      error: null,
      clearError: jest.fn(),
    });

    const { getByTestId } = render(<SignUp navigation={mockNavigation as any} />, { wrapper: AllTheProviders });

    fireEvent.changeText(getByTestId('name-input'), 'Marcus');
    fireEvent.changeText(getByTestId('email-input'), 'mpreston@uninorte.edu.co');
    fireEvent.changeText(getByTestId('password-input'), 'ThePassword!1.');

    fireEvent.press(getByTestId('submit-signup-button'));

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('VerificationEmail');
    });
  });

  it('navega a Login al presionar el botón de volver a login', () => {
    const mockSignup = jest.fn().mockResolvedValue(true);

    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    (useAuth as jest.Mock).mockReturnValue({
      signup: mockSignup,
      error: null,
      clearError: jest.fn(),
    });

    const { getByTestId } = render(<SignUp navigation={mockNavigation as any} />, { wrapper: AllTheProviders });

    fireEvent.press(getByTestId('back-to-login-button'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('no llama a signup si el formulario es inválido', async () => {
    const mockSignup = jest.fn();

    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    (useAuth as jest.Mock).mockReturnValue({
      signup: mockSignup,
      error: null,
      clearError: jest.fn(),
    });

    const { getByTestId } = render(<SignUp navigation={mockNavigation as any} />, { wrapper: AllTheProviders });

    fireEvent.changeText(getByTestId('name-input'), '123Invalid');
    fireEvent.changeText(getByTestId('email-input'), 'invalid-email');
    fireEvent.changeText(getByTestId('password-input'), 'weak');

    fireEvent.press(getByTestId('submit-signup-button'));

    expect(mockSignup).not.toHaveBeenCalled();
  });
});
