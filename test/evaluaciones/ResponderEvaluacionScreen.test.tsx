import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ResponderEvaluacionScreen from '../../src/features/evaluaciones/presentation/screen/ResponderEvaluacionScreen';
import { AllTheProviders } from '../test.utils/test.utils';

import { useRoute, useNavigation } from '@react-navigation/native';
import { useDI } from '@/src/core/di/diProvider';
import { useEvaluacionesController } from '@/src/features/evaluaciones/presentation/context/useEvaluacionesController';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@/src/core/di/diProvider', () => ({
  DIProvider: ({ children }: any) => children,
  useDI: jest.fn(),
}));

jest.mock('@/src/core/di/tokens', () => ({
  TOKENS: {
    LocalPreferences: 'LocalPreferences',
    ReporteService: 'ReporteService',
  },
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('@/src/features/auth/presentation/context/authContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: any) => children,
}));

jest.mock('@/src/features/evaluaciones/presentation/context/useEvaluacionesController', () => ({
  useEvaluacionesController: jest.fn(),
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockEvaluacion = { id: 'EV-01', nom: 'Evaluación Parcial' };

const mockPreguntas = [
  { idPregunta: 1, pregunta: '¿Cómo fue la puntualidad?', tipo: 'puntualidad' },
  { idPregunta: 2, pregunta: '¿Cómo fue la contribución?', tipo: 'contribucion' },
];

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('ResponderEvaluacionScreen', () => {
  const mockGoBack = jest.fn();
  const mockCargarPreguntas = jest.fn();
  const mockEnviarRespuestas = jest.fn();

  const mockLocalPrefs = {
    retrieveData: jest.fn().mockResolvedValue('user-id-123'),
  };

  const mockReporteService = {
    generarTodo: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigation as jest.Mock).mockReturnValue({ goBack: mockGoBack });
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        evaluacion: mockEvaluacion,
        evaluadoCorreo: 'evaluado@uninorte.edu.co',
        grupoNombre: 'Grupo A',
        idCat: 'CAT-01',
        idCurso: 'NRC-1234',
      },
    });

    (useDI as jest.Mock).mockReturnValue({
      resolve: jest.fn().mockImplementation((token: string) => {
        if (token === 'LocalPreferences') return mockLocalPrefs;
        if (token === 'ReporteService') return mockReporteService;
        return {};
      }),
    });

    mockCargarPreguntas.mockResolvedValue(undefined);
    mockEnviarRespuestas.mockResolvedValue(undefined);

    (useEvaluacionesController as jest.Mock).mockReturnValue({
      preguntas: mockPreguntas,
      isLoadingPreguntas: false,
      cargarPreguntas: mockCargarPreguntas,
      enviarRespuestasDirecto: mockEnviarRespuestas,
      isCreating: false,
    });
  });

  it('debería mostrar ActivityIndicator mientras carga el userId o las preguntas', () => {
    (useEvaluacionesController as jest.Mock).mockReturnValue({
      preguntas: [],
      isLoadingPreguntas: true,
      cargarPreguntas: mockCargarPreguntas,
      enviarRespuestasDirecto: mockEnviarRespuestas,
    });

    const { UNSAFE_getByType } = render(<ResponderEvaluacionScreen />, { wrapper: AllTheProviders });
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('debería mostrar "No hay preguntas" si la lista está vacía y no carga', async () => {
    (useEvaluacionesController as jest.Mock).mockReturnValue({
      preguntas: [],
      isLoadingPreguntas: false,
      cargarPreguntas: mockCargarPreguntas,
      enviarRespuestasDirecto: mockEnviarRespuestas,
    });

    // Necesitamos que miId esté seteado (retrieveData resuelve)
    const { findByText } = render(<ResponderEvaluacionScreen />, { wrapper: AllTheProviders });

    await findByText('No hay preguntas');
  });

  it('debería renderizar el encabezado con el correo evaluado y la primera pregunta', async () => {
    const { findByText } = render(<ResponderEvaluacionScreen />, { wrapper: AllTheProviders });

    await findByText('Evaluando a evaluado@uninorte.edu.co');
    await findByText('¿Cómo fue la puntualidad?');
  });

  it('debería mostrar las 4 opciones de respuesta', async () => {
    const { findByText } = render(<ResponderEvaluacionScreen />, { wrapper: AllTheProviders });

    await findByText('Excelente (5)');
    await findByText('Bueno (4)');
    await findByText('Adecuado (3)');
    await findByText('Podría mejorar (2)');
  });

  it('debería avanzar a la siguiente pregunta al seleccionar una opción', async () => {
    const { findByText } = render(<ResponderEvaluacionScreen />, { wrapper: AllTheProviders });

    const opcion = await findByText('Excelente (5)');
    fireEvent.press(opcion);

    await findByText('¿Cómo fue la contribución?');
  });

  it('debería mostrar el botón "Finalizar evaluación" en la última pregunta', async () => {
    const { findByText } = render(<ResponderEvaluacionScreen />, { wrapper: AllTheProviders });

    // Responder primera pregunta para ir a la última
    const opcion = await findByText('Excelente (5)');
    fireEvent.press(opcion);

    await findByText('Finalizar evaluación');
  });

  it('debería llamar a goBack al finalizar la evaluación', async () => {
    const { findByText } = render(<ResponderEvaluacionScreen />, { wrapper: AllTheProviders });

    // Responder primera pregunta
    const op1 = await findByText('Excelente (5)');
    fireEvent.press(op1);

    // Responder segunda (última) pregunta
    const op2 = await findByText('Bueno (4)');
    fireEvent.press(op2);

    const finalizar = await findByText('Finalizar evaluación');
    await act(async () => { fireEvent.press(finalizar); });

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('debería mostrar el progreso de la pregunta actual', async () => {
    const { findByText } = render(<ResponderEvaluacionScreen />, { wrapper: AllTheProviders });

    await findByText(`Pregunta 1 de ${mockPreguntas.length}`);
  });
});
