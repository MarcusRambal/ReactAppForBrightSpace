import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TeacherCourseDetailsScreen from '../../src/features/teacherHome/presentation/screens/TeacherCourseDetailsScreen';
import { AllTheProviders } from '../test.utils/test.utils';

import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useDI } from '@/src/core/di/diProvider';
import { useTeacherCourseDetailsController } from '@/src/features/teacherHome/presentation/context/useTeacherCourseDetailsController';
import { useEvaluacionesController } from '@/src/features/evaluaciones/presentation/context/useEvaluacionesController';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@/src/core/di/diProvider', () => ({
  DIProvider: ({ children }: any) => children,
  useDI: jest.fn(),
}));

jest.mock('@/src/core/di/tokens', () => ({
  TOKENS: {
    CursoRepo: 'CursoRepo',
    EvaluacionRepo: 'EvaluacionRepo',
  },
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

jest.mock('@/src/features/teacherHome/presentation/context/useTeacherCourseDetailsController', () => ({
  useTeacherCourseDetailsController: jest.fn(),
}));

jest.mock('@/src/features/evaluaciones/presentation/context/useEvaluacionesController', () => ({
  useEvaluacionesController: jest.fn(),
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockCurso = { id: 'NRC-001', nombre: 'Ingeniería de Software' };

const mockCategorias = [
  { idcat: '1', nombre: 'Proyecto' },
  { idcat: '2', nombre: 'Parcial' },
];

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('TeacherCourseDetailsScreen', () => {
  const mockNavigate = jest.fn();
  const mockFetchCategorias = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (useRoute as jest.Mock).mockReturnValue({ params: { curso: mockCurso } });
    (useFocusEffect as jest.Mock).mockImplementation((cb) => cb());

    (useDI as jest.Mock).mockReturnValue({
      resolve: jest.fn().mockReturnValue({}),
    });

    (useTeacherCourseDetailsController as jest.Mock).mockReturnValue({
      categorias: mockCategorias,
      isLoadingCategorias: false,
      fetchCategorias: mockFetchCategorias,
    });

    (useEvaluacionesController as jest.Mock).mockReturnValue({
      crearEvaluacion: jest.fn(),
      isCreating: false,
    });
  });

  it('debería renderizar el título "Categorías"', () => {
    const { getByText } = render(<TeacherCourseDetailsScreen />, { wrapper: AllTheProviders });
    expect(getByText('Categorías')).toBeTruthy();
  });

  it('debería listar las categorías del curso', () => {
    const { getByText } = render(<TeacherCourseDetailsScreen />, { wrapper: AllTheProviders });
    expect(getByText('Proyecto')).toBeTruthy();
    expect(getByText('Parcial')).toBeTruthy();
  });

  it('debería mostrar ActivityIndicator mientras carga categorías', () => {
    (useTeacherCourseDetailsController as jest.Mock).mockReturnValue({
      categorias: [],
      isLoadingCategorias: true,
      fetchCategorias: mockFetchCategorias,
    });

    const { UNSAFE_getByType } = render(<TeacherCourseDetailsScreen />, { wrapper: AllTheProviders });
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('debería mostrar "No hay categorías disponibles" cuando la lista está vacía', () => {
    (useTeacherCourseDetailsController as jest.Mock).mockReturnValue({
      categorias: [],
      isLoadingCategorias: false,
      fetchCategorias: mockFetchCategorias,
    });

    const { getByText } = render(<TeacherCourseDetailsScreen />, { wrapper: AllTheProviders });
    expect(getByText('No hay categorías disponibles')).toBeTruthy();
  });

  it('debería llamar a fetchCategorias al entrar en pantalla', () => {
    render(<TeacherCourseDetailsScreen />, { wrapper: AllTheProviders });
    expect(mockFetchCategorias).toHaveBeenCalledWith(mockCurso.id);
  });

  it('debería navegar a TeacherCategoryDetails al presionar una categoría', () => {
    const { getByText } = render(<TeacherCourseDetailsScreen />, { wrapper: AllTheProviders });

    fireEvent.press(getByText('Proyecto'));

    expect(mockNavigate).toHaveBeenCalledWith('TeacherCategoryDetails', {
      categoriaId: '1',
      nombreCategoria: 'Proyecto',
    });
  });
});
