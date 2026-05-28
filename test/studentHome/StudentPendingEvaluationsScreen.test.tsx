import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StudentPendingEvaluationsScreen from '../../src/features/studentHome/presentation/screens/StudentPendingEvaluationsScreen'; 
import { AllTheProviders } from '../test.utils/test.utils';

import { useEvaluacionesController } from '@/src/features/evaluaciones/presentation/context/useEvaluacionesController';
import { useNavigation, useRoute } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('@/src/features/evaluaciones/presentation/context/useEvaluacionesController', () => ({
  useEvaluacionesController: jest.fn(),
}));

const mockCursoMatriculado = {
  curso: { id: 'NRC-1234', nombre: 'Diseño de Software' },
  grupos: [
    { idCat: 'CAT-A', categoriaNombre: 'Parciales', grupoNombre: 'Grupo 1' }
  ],
};

const mockEvaluaciones = [
  { id: 'EVAL-01', nom: 'Parcial 1', idCategoria: 'CAT-A', tipo: 'Teórico' }
];

describe('StudentPendingEvaluationsScreen', () => {
  const mockNavigate = jest.fn();
  const mockCargarEvaluaciones = jest.fn();
  let focusCallback: () => void;

  const mockNavigation = {
    navigate: mockNavigate,
    addListener: jest.fn((event, callback) => {
      if (event === 'focus') {
        focusCallback = callback;
      }
      return jest.fn(); 
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    
    (useRoute as jest.Mock).mockReturnValue({
      params: { cursoMatriculado: mockCursoMatriculado },
    });
  });



  it('debería disparar la carga de datos cuando la pantalla recibe el foco', () => {
    (useEvaluacionesController as jest.Mock).mockReturnValue({
      isLoading: false,
      evaluacionesIncompletas: [],
      cargarEvaluacionesIncompletasPorGrupos: mockCargarEvaluaciones,
    });

    render(<StudentPendingEvaluationsScreen />, {
      wrapper: AllTheProviders,
    });

    if (focusCallback) focusCallback();

    expect(mockCargarEvaluaciones).toHaveBeenCalledWith(mockCursoMatriculado.grupos);
  });

  it('debería mostrar el mensaje de que no hay evaluaciones si la lista viene vacía', () => {
    (useEvaluacionesController as jest.Mock).mockReturnValue({
      isLoading: false,
      evaluacionesIncompletas: [],
      cargarEvaluacionesIncompletasPorGrupos: mockCargarEvaluaciones,
    });

    const { getByTestId } = render(<StudentPendingEvaluationsScreen />, {
      wrapper: AllTheProviders,
    });

    expect(getByTestId('empty-evaluations-message')).toBeTruthy();
  });

  it('debería listar las evaluaciones correctamente y navegar al detalle al presionar una', () => {
    (useEvaluacionesController as jest.Mock).mockReturnValue({
      isLoading: false,
      evaluacionesIncompletas: mockEvaluaciones,
      cargarEvaluacionesIncompletasPorGrupos: mockCargarEvaluaciones,
    });

    const { getByTestId, getByText } = render(<StudentPendingEvaluationsScreen />, {
      wrapper: AllTheProviders,
    });

    expect(getByTestId('pending-evaluations-screen')).toBeTruthy();
    expect(getByText('Parcial 1')).toBeTruthy();
    expect(getByText('Categoría: Parciales')).toBeTruthy();


    fireEvent.press(getByTestId('evaluation-card-EVAL-01'));

    expect(mockNavigate).toHaveBeenCalledWith('EvaluacionDetail', {
      evaluacion: mockEvaluaciones[0],
      grupo: mockCursoMatriculado.grupos[0],
      cursoMatriculado: mockCursoMatriculado,
    });
  });
});