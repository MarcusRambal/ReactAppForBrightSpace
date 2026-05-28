import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import GroupDetailsScreen from '../../src/features/studentHome/presentation/screens/GroupDetailsScreen';
import { AllTheProviders } from '../test.utils/test.utils';

import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/src/features/auth/presentation/context/authContext';
import { useGroupDetailsController } from '@/src/features/studentHome/presentation/context/useGroupDetailsController';
import { useEvaluacionesController } from '@/src/features/evaluaciones/presentation/context/useEvaluacionesController';
import { useDI } from '@/src/core/di/diProvider';

jest.mock('@expo/vector-icons/FontAwesome6', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ testID }: any) => <View testID={testID} />;
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

jest.mock('@/src/features/studentHome/presentation/context/useGroupDetailsController', () => ({
  useGroupDetailsController: jest.fn(),
}));

jest.mock('@/src/features/evaluaciones/presentation/context/useEvaluacionesController', () => ({
  useEvaluacionesController: jest.fn(),
}));

// Flush all pending promises so async state updates reach React
const flushPromises = () => act(async () => {
  await new Promise<void>(resolve => setImmediate(resolve));
});

const mockGrupo = { idCat: 'CAT-PARCIAL', categoriaNombre: 'Parcial 1', grupoNombre: 'Grupo C' };
const mockCursoMatriculado = { curso: { id: 'NRC-1010', nombre: 'Arquitectura' }, grupos: [mockGrupo] };

describe('GroupDetailsScreen', () => {
  const mockNavigate = jest.fn();
  const mockGoBack = jest.fn();
  const mockCargarEvaluaciones = jest.fn();
  const mockCargarIncompletas = jest.fn();

  const baseEvaluacionesController = {
    evaluaciones: [],
    evaluacionesIncompletas: [],
    cargarEvaluaciones: mockCargarEvaluaciones,
    cargarEvaluacionesIncompletasPorGrupos: mockCargarIncompletas,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate, goBack: mockGoBack });
    (useRoute as jest.Mock).mockReturnValue({ params: { grupo: mockGrupo, cursoMatriculado: mockCursoMatriculado } });
    (useAuth as jest.Mock).mockReturnValue({ loggedUser: { email: 'test@uninorte.edu.co' } });

    // Fire only once on mount, not on every re-render
    (useFocusEffect as jest.Mock).mockImplementation((cb: () => void) => {
      React.useEffect(cb, []);
    });

    (useDI as jest.Mock).mockReturnValue({ resolve: jest.fn().mockReturnValue({}) });
    (useGroupDetailsController as jest.Mock).mockReturnValue({ companeros: [], isLoading: false });
    (useEvaluacionesController as jest.Mock).mockReturnValue(baseEvaluacionesController);

    mockCargarEvaluaciones.mockResolvedValue(null);
    mockCargarIncompletas.mockResolvedValue(null);
  });

  it('deberia mostrar ActivityIndicator mientras carga evaluaciones', () => {
    // Promesa que nunca resuelve: la pantalla se queda en loading
    mockCargarEvaluaciones.mockReturnValue(new Promise(() => {}));

    const { UNSAFE_getByType } = render(<GroupDetailsScreen />, { wrapper: AllTheProviders });
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('deberia disparar los metodos de carga al enfocarse', async () => {
    render(<GroupDetailsScreen />, { wrapper: AllTheProviders });
    await flushPromises();

    expect(mockCargarEvaluaciones).toHaveBeenCalledWith('CAT-PARCIAL');
    expect(mockCargarIncompletas).toHaveBeenCalledWith([mockGrupo]);
  });

  it('deberia reflejar los estados vacios en evaluaciones y companeros', async () => {
    const { getByTestId, getByText } = render(<GroupDetailsScreen />, { wrapper: AllTheProviders });
    await flushPromises();

    expect(getByTestId('empty-evaluations-container')).toBeTruthy();
    expect(getByTestId('empty-companions-container')).toBeTruthy();
    expect(getByText('No hay evaluaciones disponibles.')).toBeTruthy();
  });

  it('deberia mostrar ActivityIndicator en companeros mientras isLoading es true', async () => {
    (useGroupDetailsController as jest.Mock).mockReturnValue({ companeros: [], isLoading: true });

    const { UNSAFE_getByType } = render(<GroupDetailsScreen />, { wrapper: AllTheProviders });
    await flushPromises();

    // isScreenLoading ya es false, pero isLoading de companeros es true
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('deberia listar companeros correctamente tras resolver isLoading', async () => {
    (useGroupDetailsController as jest.Mock).mockReturnValue({
      companeros: ['juan@uninorte.edu.co', 'maria@uninorte.edu.co'],
      isLoading: false,
    });

    const { getByTestId } = render(<GroupDetailsScreen />, { wrapper: AllTheProviders });
    await flushPromises();

    expect(getByTestId('companion-row-juan@uninorte.edu.co')).toBeTruthy();
    expect(getByTestId('companion-row-maria@uninorte.edu.co')).toBeTruthy();
  });

  it('deberia renderizar evaluaciones y navegar al detalle al presionar', async () => {
    const mockListaEvaluaciones = [
      { id: 'EV-01', nom: 'Quiz 1', tipo: 'Practico', esPrivada: false },
      { id: 'EV-02', nom: 'Parcial F', tipo: 'Teorico', esPrivada: true },
    ];
    const mockListaIncompletas = [{ id: 'EV-02', nom: 'Parcial F', tipo: 'Teorico', esPrivada: true }];

    (useEvaluacionesController as jest.Mock).mockReturnValue({
      ...baseEvaluacionesController,
      evaluaciones: mockListaEvaluaciones,
      evaluacionesIncompletas: mockListaIncompletas,
    });

    const { getByTestId, getByText } = render(<GroupDetailsScreen />, { wrapper: AllTheProviders });
    await flushPromises();

    expect(getByTestId('group-details-screen')).toBeTruthy();
    expect(getByText('Quiz 1')).toBeTruthy();
    expect(getByTestId('status-icon-complete-EV-01')).toBeTruthy();
    expect(getByText('Parcial F')).toBeTruthy();
    expect(getByTestId('status-icon-pending-EV-02')).toBeTruthy();

    fireEvent.press(getByTestId('evaluation-card-EV-01'));

    expect(mockNavigate).toHaveBeenCalledWith('EvaluacionDetail', {
      evaluacion: mockListaEvaluaciones[0],
      grupo: mockGrupo,
      cursoMatriculado: mockCursoMatriculado,
    });
  });
});
