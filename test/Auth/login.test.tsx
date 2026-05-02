import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LogIn from '../../src/features/auth/presentation/screens/logIn'; 
import { AllTheProviders } from '../test.utils/test.utils';
import {useAuth } from '../../src/features/auth/presentation/context/authContext';
import { waitFor } from '@testing-library/react-native'

// 1. "Mokeamos" SOLO el hook useAuth, manteniendo el resto del módulo real
jest.mock('../../src/features/auth/presentation/context/authContext', () => ({
  ...jest.requireActual('../../src/features/auth/presentation/context/authContext'),
  useAuth: jest.fn(),
}));


describe('Login Screen', () => {
  it('llama a la función login al presionar el botón', async () => {
    // 2. Creamos una función espía (mock function)
    const mockLogin = jest.fn();

    const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
    };
    
    // 3. Configuramos el mock para que devuelva nuestra función espía
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin.mockResolvedValue(true),
      error: null,
      clearError: jest.fn(),
    });

    const { getByTestId } = render(<LogIn navigation={mockNavigation as any}/>, { wrapper: AllTheProviders })

    fireEvent.changeText(getByTestId('email-input'), 'usuario@uninorte.edu.co');
    fireEvent.changeText(getByTestId('password-input'), 'ThePassword!1.');
    fireEvent.press(getByTestId('submit-login-button'));

    

    
    expect(mockLogin).toHaveBeenCalledWith('usuario@uninorte.edu.co', 'ThePassword!1.');
  });

  it('debería navegar a la pantalla de SignUp al presionar el botón correspondiente', () => {

    const mockNavigation = {
      navigate: jest.fn(),
    };

    const { getByTestId } = render(
      <LogIn navigation={mockNavigation as any} />, 
      { wrapper: AllTheProviders }
    );

    fireEvent.press(getByTestId('go-to-signup-button'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('SignUp');
  });

});