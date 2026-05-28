import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EvaluacionDetailScreen from '../../src/features/studentHome/presentation/screens/EvaluacionDetailScreen';
import { AllTheProviders } from '../test.utils/test.utils';

import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/src/features/auth/presentation/context/authContext';
import { useDI } from '@/src/core/di/diProvider';
import { useEvaluacionesController } from '@/src/features/evaluaciones/presentation/context/useEvaluacionesController';
import { useGroupDetailsController } from '@/src/features/studentHome/presentation/context/useGroupDetailsController';

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
  TOKENS: { EvaluacionRepo: 'EvaluacionRepo', CursoRepo: 'CursoRepo' },
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

jest.mock('@/src/features/studentHome/presentation/context/useGroupDetailsController', () => ({
  useGroupDetailsController: jest.fn(),
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockEvaluacion = {
  id: 'EV-01',
  nom: 'Evaluación Parcial',
  tipo: 'Teórico',
  esPrivada: false,
  fechaCreacion: new Date(Date.now() - 86400000).toISOString(), // ayer → ya inició
  fechaFinalizacion: new Date(Date.now() + 86400000).toISOString(), // mañana → no cerró
};

const mockGrupo = { idCat: 'CAT-01', grupoNombre: 'Grupo A' };
const mockCursoMatriculado = { curso: { id: 'NRC-1234', nombre: 'Ingeniería de Software' } };

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('EvaluacionDetailScreen', () => {
  const mockNavigate = jest.fn();
  const mockYaEvaluo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (useRoute as jest.Mock).mockReturnValue({
      params: { evaluacion: mockEvaluacion, grupo: mockGrupo, cursoMatriculado: mockCursoMatriculado },
    });
    (useAuth as jest.Mock).mockReturnValue({ loggedUser: { email: 'estudiante@uninorte.edu.co' } });
    (useFocusEffect as jest.Mock).mockImplementation((cb) => cb());

    (useDI as jest.Mock).mockReturnValue({
      resolve: jest.fn().mockReturnValue({}),
    });

    (useEvaluacionesController as jest.Mock).mockReturnValue({
      yaEvaluo: mockYaEvaluo,
    });

    (useGroupDetailsController as jest.Mock).mockReturnValue({
      companeros: [],
      isLoading: false,
    });

    mockYaEvaluo.mockResolvedValue(false);
  });

  it('debería renderizar el nombre, fecha de inicio y fecha de finalización', () => {
    const { getByText } = render(<EvaluacionDetailScreen />, { wrapper: AllTheProviders });

    expect(getByText('Evaluación Parcial')).toBeTruthy();
    expect(getByText(/Inicia:/)).toBeTruthy();
    expect(getByText(/Finaliza:/)).toBeTruthy();
  });

  it('debería renderizar el botón "VER MIS RESULTADOS"', () => {
    const { getByText } = render(<EvaluacionDetailScreen />, { wrapper: AllTheProviders });
    expect(getByText('VER MIS RESULTADOS')).toBeTruthy();
  });

  it('debería navegar a StudentReport al presionar "VER MIS RESULTADOS"', () => {
    const { getByText } = render(<EvaluacionDetailScreen />, { wrapper: AllTheProviders });

    fireEvent.press(getByText('VER MIS RESULTADOS'));

    expect(mockNavigate).toHaveBeenCalledWith('StudentReport', {
      idEvaluacion: mockEvaluacion.id,
      nombreEvaluacion: mockEvaluacion.nom,
      esPrivada: mockEvaluacion.esPrivada,
    });
  });

  it('debería mostrar ActivityIndicator mientras isLoading es true', () => {
    (useGroupDetailsController as jest.Mock).mockReturnValue({
      companeros: [],
      isLoading: true,
    });

    const { UNSAFE_getByType } = render(<EvaluacionDetailScreen />, { wrapper: AllTheProviders });
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('debería mostrar "No hay compañeros" cuando la lista está vacía', () => {
    (useGroupDetailsController as jest.Mock).mockReturnValue({
      companeros: [],
      isLoading: false,
    });

    const { getByText } = render(<EvaluacionDetailScreen />, { wrapper: AllTheProviders });
    expect(getByText('No hay compañeros')).toBeTruthy();
  });

  it('debería listar los compañeros y mostrar botón Evaluar para los no evaluados', async () => {
    mockYaEvaluo.mockResolvedValue(false);

    (useGroupDetailsController as jest.Mock).mockReturnValue({
      companeros: ['companero@uninorte.edu.co'],
      isLoading: false,
    });

    const { getByText, findByText } = render(<EvaluacionDetailScreen />, { wrapper: AllTheProviders });

    expect(getByText('companero@uninorte.edu.co')).toBeTruthy();

    // Una vez que se resuelve yaEvaluo(false), debería aparecer el botón Evaluar
    await findByText('Evaluar');
  });

  it('debería mostrar ✔ para compañeros ya evaluados', async () => {
    mockYaEvaluo.mockResolvedValue(true);

    (useGroupDetailsController as jest.Mock).mockReturnValue({
      companeros: ['evaluado@uninorte.edu.co'],
      isLoading: false,
    });

    const { findByText } = render(<EvaluacionDetailScreen />, { wrapper: AllTheProviders });

    await findByText('✔');
  });

  it('debería navegar a ResponderEvaluacion al presionar Evaluar', async () => {
    mockYaEvaluo.mockResolvedValue(false);

    (useGroupDetailsController as jest.Mock).mockReturnValue({
      companeros: ['companero@uninorte.edu.co'],
      isLoading: false,
    });

    const { findByText } = render(<EvaluacionDetailScreen />, { wrapper: AllTheProviders });

    const boton = await findByText('Evaluar');
    fireEvent.press(boton);

    expect(mockNavigate).toHaveBeenCalledWith('ResponderEvaluacion', {
      evaluacion: mockEvaluacion,
      evaluadoCorreo: 'companero@uninorte.edu.co',
      grupoNombre: mockGrupo.grupoNombre,
      idCat: mockGrupo.idCat,
      idCurso: mockCursoMatriculado.curso.id,
    });
  });
});
