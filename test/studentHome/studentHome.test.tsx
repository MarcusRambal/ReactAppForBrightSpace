import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import StudentHomeScreen from '../../src/features/studentHome/presentation/screens/StudentHomeScreen'; 
import { AllTheProviders } from '../test.utils/test.utils';

// Importamos los hooks para poder tipar y modificar sus retornos dentro de los tests
import { useAuth } from '@/src/features/auth/presentation/context/authContext';
import { useStudentHomeController } from '@/src/features/studentHome/presentation/context/studentHomeController';
import { useEvaluacionesController } from '@/src/features/evaluaciones/presentation/context/useEvaluacionesController';
import { useNavigation } from '@react-navigation/native';

// 1. Mocks de los módulos e infraestructura preservando el comportamiento real del resto
jest.mock('@/src/features/auth/presentation/context/authContext', () => ({
  ...jest.requireActual('@/src/features/auth/presentation/context/authContext'),
  useAuth: jest.fn(),
}));

jest.mock('@/src/features/studentHome/presentation/context/studentHomeController', () => ({
  useStudentHomeController: jest.fn(),
}));

jest.mock('@/src/features/evaluaciones/presentation/context/useEvaluacionesController', () => ({
  useEvaluacionesController: jest.fn(),
}));

// Mock selectivo de React Navigation para controlar la navegación por pantalla
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
  // Forzamos a queuseFocusEffect ejecute el callback inmediatamente en el test
  useFocusEffect: (callback: () => void) => callback(), 
}));

// Mock de la data de prueba (Fixture)
const mockCursos = [
  {
    curso: { id: 'NRC-1234', nombre: 'Diseño de Software' },
    grupos: [{ categoriaNombre: 'Proyecto', grupoNombre: 'Grupo 3A' }],
  },
];

describe('StudentHomeScreen', () => {
  const mockLogout = jest.fn();
  const mockNavigate = jest.fn();
  const mockCargarEvaluaciones = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup base de navegación
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });

    // Setup base de Auth
    (useAuth as jest.Mock).mockReturnValue({
      loggedUser: { email: 'usuario@uninorte.edu.co' },
      logout: mockLogout,
    });

    // Setup base de evaluaciones
    (useEvaluacionesController as jest.Mock).mockReturnValue({
      isLoading: false,
      evaluacionesIncompletas: [],
      cargarEvaluacionesIncompletasPorGrupos: mockCargarEvaluaciones,
    });
  });

  it('debería renderizar los cursos y disparar la carga de evaluaciones', async () => {
    (useStudentHomeController as jest.Mock).mockReturnValue({
      cursos: mockCursos,
      isLoading: false,
    });

    const { getByTestId, getByText } = render(<StudentHomeScreen />, {
      wrapper: AllTheProviders,
    });

    // Verificar que la pantalla principal renderizó
    expect(getByTestId('student-home-screen')).toBeTruthy();
    expect(getByText('Diseño de Software')).toBeTruthy();
    expect(getByText('NRC: NRC-1234')).toBeTruthy();

    // El useEffect/useFocusEffect debería invocar la carga de evaluaciones
    expect(mockCargarEvaluaciones).toHaveBeenCalledWith(mockCursos[0].grupos);
  });

  it('debería llamar a la función logout al presionar el botón de cerrar sesión', () => {
    (useStudentHomeController as jest.Mock).mockReturnValue({
      cursos: mockCursos,
      isLoading: false,
    });

    const { getByTestId } = render(<StudentHomeScreen />, {
      wrapper: AllTheProviders,
    });

    fireEvent.press(getByTestId('logout-button'));

    expect(mockLogout).toHaveBeenCalled();
  });

  it('debería navegar a los detalles del curso con los parámetros correspondientes', () => {
    (useStudentHomeController as jest.Mock).mockReturnValue({
      cursos: mockCursos,
      isLoading: false,
    });

    const { getByTestId } = render(<StudentHomeScreen />, {
      wrapper: AllTheProviders,
    });

    fireEvent.press(getByTestId('btn-course-details-NRC-1234'));

    expect(mockNavigate).toHaveBeenCalledWith('StudentCourseDetails', {
      cursoMatriculado: mockCursos[0],
    });
  });

  it('debería navegar a las evaluaciones pendientes del curso seleccionado', () => {
    (useStudentHomeController as jest.Mock).mockReturnValue({
      cursos: mockCursos,
      isLoading: false,
    });

    const { getByTestId } = render(<StudentHomeScreen />, {
      wrapper: AllTheProviders,
    });

    fireEvent.press(getByTestId('btn-pending-evaluations-NRC-1234'));

    expect(mockNavigate).toHaveBeenCalledWith('StudentPendingEvaluationsScreen', {
      cursoMatriculado: mockCursos[0],
    });
  });
});