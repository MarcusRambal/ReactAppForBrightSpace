import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TeacherHomeScreen from '../../src/features/teacherHome/presentation/screens/TeacherHomeScreen';
import { AllTheProviders } from '../test.utils/test.utils';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/src/features/auth/presentation/context/authContext';
import { useDI } from '@/src/core/di/diProvider';
import { useTeacherHomeController } from '@/src/features/teacherHome/presentation/context/useTeacherHomeController';
import { useGrupoImportController } from '@/src/features/grupo/presentation/context/useGrupoImportController';
import { useTeacherAlertsController } from '@/src/features/teacherHome/presentation/context/useTeacherAlertsController';

// ─── Mocks ───────────────────────────────────────────────────────────────────

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
  TOKENS: {
    CursoRepo: 'CursoRepo',
    GrupoRepo: 'GrupoRepo',
    ReporteSource: 'ReporteSource',
    ReporteController: 'ReporteController',
  },
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}));

jest.mock('@/src/features/auth/presentation/context/authContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: any) => children,
}));

jest.mock('@/src/features/teacherHome/presentation/context/useTeacherHomeController', () => ({
  useTeacherHomeController: jest.fn(),
}));

jest.mock('@/src/features/grupo/presentation/context/useGrupoImportController', () => ({
  useGrupoImportController: jest.fn(),
}));

jest.mock('@/src/features/teacherHome/presentation/context/useTeacherAlertsController', () => ({
  useTeacherAlertsController: jest.fn(),
}));

// Portal/Modal de react-native-paper puede necesitar un mock simple
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  return {
    ...actual,
    Portal: ({ children }: any) => children,
  };
});

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockCursos = [
  { id: 'NRC-001', nombre: 'Diseño de Software' },
  { id: 'NRC-002', nombre: 'Arquitectura' },
];

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('TeacherHomeScreen', () => {
  const mockNavigate = jest.fn();
  const mockLogout = jest.fn();
  const mockFetchCursos = jest.fn();
  const mockCrearCurso = jest.fn();
  const mockEliminarCurso = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (useFocusEffect as jest.Mock).mockImplementation((cb) => cb());
    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });

    (useDI as jest.Mock).mockReturnValue({
      resolve: jest.fn().mockReturnValue({}),
    });

    (useTeacherHomeController as jest.Mock).mockReturnValue({
      cursos: mockCursos,
      isLoading: false,
      crearCurso: mockCrearCurso,
      eliminarCurso: mockEliminarCurso,
      fetchCursos: mockFetchCursos,
    });

    (useGrupoImportController as jest.Mock).mockReturnValue({
      isImporting: false,
      importProgress: '',
      importarCSV: jest.fn(),
      actualizarCursoConNuevoCSV: jest.fn(),
    });

    (useTeacherAlertsController as jest.Mock).mockReturnValue({
      cantidadAlertas: 3,
      isLoading: false,
    });
  });

  it('debería renderizar el título "Hola, Profesor"', () => {
    const { getByText } = render(<TeacherHomeScreen />, { wrapper: AllTheProviders });
    expect(getByText('Hola, Profesor')).toBeTruthy();
  });

  it('debería mostrar la cantidad de cursos en el resumen', () => {
    const { getByText } = render(<TeacherHomeScreen />, { wrapper: AllTheProviders });
    expect(getByText(mockCursos.length.toString())).toBeTruthy();
  });

  it('debería mostrar la cantidad de alertas dinámicas', () => {
    const { getByText } = render(<TeacherHomeScreen />, { wrapper: AllTheProviders });
    expect(getByText('3')).toBeTruthy();
  });

  it('debería listar los cursos correctamente', () => {
    const { getByText } = render(<TeacherHomeScreen />, { wrapper: AllTheProviders });
    expect(getByText('Diseño de Software')).toBeTruthy();
    expect(getByText('Arquitectura')).toBeTruthy();
  });

  it('debería llamar a fetchCursos al entrar en pantalla', () => {
    render(<TeacherHomeScreen />, { wrapper: AllTheProviders });
    expect(mockFetchCursos).toHaveBeenCalled();
  });

  it('debería mostrar estado vacío cuando no hay cursos', () => {
    (useTeacherHomeController as jest.Mock).mockReturnValue({
      cursos: [],
      isLoading: false,
      crearCurso: mockCrearCurso,
      eliminarCurso: mockEliminarCurso,
      fetchCursos: mockFetchCursos,
    });

    const { getByText } = render(<TeacherHomeScreen />, { wrapper: AllTheProviders });
    expect(getByText('No tienes cursos asignados.')).toBeTruthy();
  });

  it('debería mostrar ActivityIndicator cuando isLoading es true', () => {
    (useTeacherHomeController as jest.Mock).mockReturnValue({
      cursos: [],
      isLoading: true,
      crearCurso: mockCrearCurso,
      eliminarCurso: mockEliminarCurso,
      fetchCursos: mockFetchCursos,
    });

    const { UNSAFE_getByType } = render(<TeacherHomeScreen />, { wrapper: AllTheProviders });
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('debería navegar a TeacherAlerts al presionar la caja de alertas', () => {
    const { getByText } = render(<TeacherHomeScreen />, { wrapper: AllTheProviders });

    fireEvent.press(getByText('Alertas'));

    expect(mockNavigate).toHaveBeenCalledWith('TeacherAlerts');
  });

  it('debería navegar a TeacherCategories al presionar el nombre de un curso', () => {
    const { getByText } = render(<TeacherHomeScreen />, { wrapper: AllTheProviders });

    fireEvent.press(getByText('Diseño de Software'));

    expect(mockNavigate).toHaveBeenCalledWith('TeacherCategories', { curso: mockCursos[0] });
  });

  it('debería llamar a logout al presionar el botón de cierre de sesión', () => {
    const { UNSAFE_getAllByType } = render(<TeacherHomeScreen />, { wrapper: AllTheProviders });
    const { TouchableOpacity } = require('react-native');
    const botones = UNSAFE_getAllByType(TouchableOpacity);
    // El primer botón del header es logout
    fireEvent.press(botones[0]);
    expect(mockLogout).toHaveBeenCalled();
  });

  it('debería mostrar "..." en alertas mientras loadingAlertas es true', () => {
    (useTeacherAlertsController as jest.Mock).mockReturnValue({
      cantidadAlertas: 0,
      isLoading: true,
    });

    const { getByText } = render(<TeacherHomeScreen />, { wrapper: AllTheProviders });
    expect(getByText('...')).toBeTruthy();
  });
});
