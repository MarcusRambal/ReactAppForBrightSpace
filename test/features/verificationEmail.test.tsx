import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import VerificationEmail from '../../src/features/auth/presentation/screens/verificationEmail';
import { AllTheProviders } from '../test.utils/test.utils';
import { useAuth } from '../../src/features/auth/presentation/context/authContext';

// Mokeamos SOLO el hook useAuth, manteniendo el resto del módulo real
jest.mock('../../src/features/auth/presentation/context/authContext', () => ({
  ...jest.requireActual('../../src/features/auth/presentation/context/authContext'),
  useAuth: jest.fn(),
}));

describe('VerificationEmail Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('llama a la función validate al presionar el botón con código válido', async () => {
    const mockValidate = jest.fn().mockResolvedValue(true);
    const mockSignup = jest.fn();

    const mockNavigation = {
      navigate: jest.fn(),
      reset: jest.fn(),
      goBack: jest.fn(),
    };

    (useAuth as jest.Mock).mockReturnValue({
      validate: mockValidate,
      signup: mockSignup,
      error: null,
      clearError: jest.fn(),
      emailToVerify: 'user@uninorte.edu.co',
      name: 'John Doe',
      password: 'SecurePass!1',
    });

    const { getByTestId } = render(<VerificationEmail navigation={mockNavigation as any} />, { wrapper: AllTheProviders });

    fireEvent.changeText(getByTestId('code-input'), '123456');

    fireEvent.press(getByTestId('verify-button'));


    await waitFor(() => {
      expect(mockValidate).toHaveBeenCalledWith('user@uninorte.edu.co', '123456');
    });
  });

  it('navega a Login después de validación exitosa', async () => {
    const mockValidate = jest.fn().mockResolvedValue(true);
    const mockSignup = jest.fn();

    const mockNavigation = {
      navigate: jest.fn(),
      reset: jest.fn(),
      goBack: jest.fn(),
    };

    (useAuth as jest.Mock).mockReturnValue({
      validate: mockValidate,
      signup: mockSignup,
      error: null,
      clearError: jest.fn(),
      emailToVerify: 'user@uninorte.edu.co',
      name: 'John Doe',
      password: 'SecurePass!1',
    });

    const { getByTestId } = render(<VerificationEmail navigation={mockNavigation as any} />, { wrapper: AllTheProviders });

    fireEvent.changeText(getByTestId('code-input'), '123456');
    fireEvent.press(getByTestId('verify-button'));

    await waitFor(() => {
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    });
  });

  it('llama a signup al presionar reenviar código', async () => {
    const mockValidate = jest.fn();
    const mockSignup = jest.fn().mockResolvedValue(true);

    const mockNavigation = {
      navigate: jest.fn(),
      reset: jest.fn(),
      goBack: jest.fn(),
    };

    (useAuth as jest.Mock).mockReturnValue({
      validate: mockValidate,
      signup: mockSignup,
      error: null,
      clearError: jest.fn(),
      emailToVerify: 'user@uninorte.edu.co',
      name: 'John Doe',
      password: 'SecurePass!1',
    });

    const { getByTestId } = render(<VerificationEmail navigation={mockNavigation as any} />, { wrapper: AllTheProviders });
    fireEvent.press(getByTestId('resend-button'));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('John Doe', 'user@uninorte.edu.co', 'SecurePass!1');
    });
  });

  it('navega a SignUp al presionar volver al registro', () => {
    const mockValidate = jest.fn();
    const mockSignup = jest.fn();

    const mockNavigation = {
      navigate: jest.fn(),
      reset: jest.fn(),
      goBack: jest.fn(),
    };

    (useAuth as jest.Mock).mockReturnValue({
      validate: mockValidate,
      signup: mockSignup,
      error: null,
      clearError: jest.fn(),
      emailToVerify: 'user@uninorte.edu.co',
      name: 'John Doe',
      password: 'SecurePass!1',
    });

    const { getByTestId } = render(<VerificationEmail navigation={mockNavigation as any} />, { wrapper: AllTheProviders });

    fireEvent.press(getByTestId('back-to-signup-button'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('SignUp');
  });

  it('solo permite ingresar números en el código de verificación', () => {
    const mockValidate = jest.fn();
    const mockSignup = jest.fn();

    const mockNavigation = {
      navigate: jest.fn(),
      reset: jest.fn(),
      goBack: jest.fn(),
    };

    (useAuth as jest.Mock).mockReturnValue({
      validate: mockValidate,
      signup: mockSignup,
      error: null,
      clearError: jest.fn(),
      emailToVerify: 'user@uninorte.edu.co',
      name: 'John Doe',
      password: 'SecurePass!1',
    });

    const { getByTestId } = render(<VerificationEmail navigation={mockNavigation as any} />, { wrapper: AllTheProviders });

    const codeInput = getByTestId('code-input');
    
    fireEvent.changeText(codeInput, 'abc123!@#');

    expect(codeInput.props.value).toBe('123');
  });
});
