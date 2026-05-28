import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TeacherCategoriesScreen from '../../src/features/teacherHome/presentation/screens/TeacherCategoriesScreen';
import { AllTheProviders } from '../test.utils/test.utils';

import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDI } from '@/src/core/di/diProvider';
import { useEvaluacionesController } from '@/src/features/evaluaciones/presentation/context/useEvaluacionesController';

jest.mock('@expo/vector-icons/FontAwesome6', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => <View />;
});

jest.mock('@/src/core/di/diProvider', () => ({
  DIProvider: ({ children }: any) => children,
  useDI: jest.fn(),
}));

jest.mock('@/src/core/di/tokens', () => ({
  TOKENS: { CursoRepo: 'CursoRepo' },
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
  useFocusEffect: jest.fn(),
}));

jest.mock('@/src/features/auth/presentation/context/authContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: any) => children,
}));

jest.mock('@/src/features/evaluaciones/presentation/context/useEvaluacionesController', () => ({
  useEvaluacionesController: jest.fn(),
}));

jest.mock('@react-native-community/datetimepicker', () => ({
  DateTimePickerAndroid: { open: jest.fn() },
}));

const mockCurso = { id: 'NRC-001', nombre: 'Diseno de Software' };

const mockCategorias = [
  { idcat: 1, nombre: 'Proyecto' },
  { idcat: 2, nombre: 'Parcial' },
];

describe('TeacherCategoriesScreen', () => {
  const mockNavigate = jest.fn();
  const mockGoBack = jest.fn();

  const mockCursoRepo = {
    getCategoriasByCurso: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockCursoRepo.getCategoriasByCurso.mockResolvedValue(mockCategorias);

    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate, goBack: mockGoBack });
    (useRoute as jest.Mock).mockReturnValue({ params: { curso: mockCurso } });

    (useFocusEffect as jest.Mock).mockImplementation((cb: () => void) => {
      React.useEffect(cb, []);
    });

    (useDI as jest.Mock).mockReturnValue({
      resolve: jest.fn().mockReturnValue(mockCursoRepo),
    });

    (useEvaluacionesController as jest.Mock).mockReturnValue({
      crearEvaluacion: jest.fn(),
      isCreating: false,
    });
  });

  it('deberia renderizar el nombre del curso', async () => {
    const { findByText } = render(<TeacherCategoriesScreen />, { wrapper: AllTheProviders });
    await findByText('Diseno de Software');
  });

  it('deberia listar las categorias tras la carga', async () => {
    const { findByText } = render(<TeacherCategoriesScreen />, { wrapper: AllTheProviders });
    await findByText('Proyecto');
    await findByText('Parcial');
  });

  it('deberia mostrar estado vacio si no hay categorias', async () => {
    mockCursoRepo.getCategoriasByCurso.mockResolvedValue([]);

    const { findByText } = render(<TeacherCategoriesScreen />, { wrapper: AllTheProviders });
    // The screen renders "No hay categorías creadas." with accented char — match with regex
    await findByText(/No hay categor/);
  });

  it('deberia mostrar ActivityIndicator mientras carga', () => {
    mockCursoRepo.getCategoriasByCurso.mockReturnValue(new Promise(() => {}));

    const { UNSAFE_getByType } = render(<TeacherCategoriesScreen />, { wrapper: AllTheProviders });
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('deberia navegar a TeacherCategoryDetails al presionar una categoria', async () => {
    const { findByText } = render(<TeacherCategoriesScreen />, { wrapper: AllTheProviders });

    const card = await findByText('Proyecto');
    fireEvent.press(card);

    expect(mockNavigate).toHaveBeenCalledWith('TeacherCategoryDetails', {
      categoria: mockCategorias[0],
      curso: mockCurso,
    });
  });

  it('deberia llamar a goBack al presionar el boton de retroceso', async () => {
    const { findByText, getByLabelText } = render(<TeacherCategoriesScreen />, { wrapper: AllTheProviders });

    await findByText('Diseno de Software');

    // Appbar.BackAction renders with testID "appbar-back-action"
    fireEvent.press(getByLabelText("Back"));

    expect(mockGoBack).toHaveBeenCalled();
  });
});
