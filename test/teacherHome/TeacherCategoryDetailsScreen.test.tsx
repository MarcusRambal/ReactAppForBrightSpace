import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TeacherCategoryDetailsScreen from '../../src/features/teacherHome/presentation/screens/TeacherCategoryDetailsScreen';
import { AllTheProviders } from '../test.utils/test.utils';

import { useRoute, useNavigation } from '@react-navigation/native';
import { useDI } from '@/src/core/di/diProvider';
import { useEvaluacionesController } from '@/src/features/evaluaciones/presentation/context/useEvaluacionesController';

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
  TOKENS: { CursoRepo: 'CursoRepo' },
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

const mockCategoria = { idcat: 1, nombre: 'Proyecto Final' };

const mockGruposRaw = [
  { nombre: 'Grupo A', Correo: 'estudiante1@uninorte.edu.co' },
  { nombre: 'Grupo A', Correo: 'estudiante2@uninorte.edu.co' },
  { nombre: 'Grupo B', Correo: 'estudiante3@uninorte.edu.co' },
];

const mockEvaluaciones = [
  { id: 'EV-01', nom: 'Evaluación 1', tipo: 'Teórico', esPrivada: false },
  { id: 'EV-02', nom: 'Evaluación 2', tipo: 'Práctico', esPrivada: true },
];

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('TeacherCategoryDetailsScreen', () => {
  const mockNavigate = jest.fn();
  const mockGoBack = jest.fn();
  const mockCambiarPrivacidad = jest.fn();

  const mockCursoRepo = {
    getDatosDeGruposPorCategoria: jest.fn().mockResolvedValue(mockGruposRaw),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate, goBack: mockGoBack });
    (useRoute as jest.Mock).mockReturnValue({ params: { categoria: mockCategoria } });

    (useDI as jest.Mock).mockReturnValue({
      resolve: jest.fn().mockReturnValue(mockCursoRepo),
    });

    (useEvaluacionesController as jest.Mock).mockReturnValue({
      evaluaciones: mockEvaluaciones,
      isLoading: false,
      cambiarPrivacidad: mockCambiarPrivacidad,
    });
  });

  it('debería renderizar el nombre de la categoría en el header', async () => {
    const { findByText } = render(<TeacherCategoryDetailsScreen />, { wrapper: AllTheProviders });
    await findByText('Proyecto Final');
  });

  it('debería listar los grupos organizados', async () => {
    const { findByText } = render(<TeacherCategoryDetailsScreen />, { wrapper: AllTheProviders });

    await findByText('Grupo A');
    await findByText('Grupo B');
  });

  it('debería listar los integrantes dentro de cada grupo', async () => {
    const { findByText } = render(<TeacherCategoryDetailsScreen />, { wrapper: AllTheProviders });

    await findByText('• estudiante1@uninorte.edu.co');
    await findByText('• estudiante2@uninorte.edu.co');
    await findByText('• estudiante3@uninorte.edu.co');
  });

  it('debería listar las evaluaciones de la categoría', async () => {
    const { findByText } = render(<TeacherCategoryDetailsScreen />, { wrapper: AllTheProviders });

    await findByText('Evaluación 1');
    await findByText('Evaluación 2');
  });

  it('debería mostrar la badge de privacidad correctamente', async () => {
    const { findByText } = render(<TeacherCategoryDetailsScreen />, { wrapper: AllTheProviders });

    await findByText('Pública');
    await findByText('Privada');
  });

  it('debería mostrar estado vacío si no hay grupos', async () => {
    mockCursoRepo.getDatosDeGruposPorCategoria.mockResolvedValue([]);

    const { findByText } = render(<TeacherCategoryDetailsScreen />, { wrapper: AllTheProviders });

    await findByText('No hay grupos disponibles.');
  });

  it('debería mostrar estado vacío si no hay evaluaciones', async () => {
    (useEvaluacionesController as jest.Mock).mockReturnValue({
      evaluaciones: [],
      isLoading: false,
      cambiarPrivacidad: mockCambiarPrivacidad,
    });

    const { findByText } = render(<TeacherCategoryDetailsScreen />, { wrapper: AllTheProviders });

    await findByText('No hay evaluaciones en esta categoría.');
  });

  it('debería navegar a TeacherReport al presionar RESULTADOS', async () => {
    const { findAllByText } = render(<TeacherCategoryDetailsScreen />, { wrapper: AllTheProviders });

    const botones = await findAllByText('RESULTADOS');
    fireEvent.press(botones[0]);

    expect(mockNavigate).toHaveBeenCalledWith('TeacherReport', {
      idEvaluacion: mockEvaluaciones[0].id,
      nombreEvaluacion: mockEvaluaciones[0].nom,
      idCategoria: mockCategoria.idcat,
    });
  });

  it('debería llamar a cambiarPrivacidad al presionar Publicar/Privar', async () => {
    const { findAllByText } = render(<TeacherCategoryDetailsScreen />, { wrapper: AllTheProviders });

    // Evaluación 1 es pública → botón "Privar"; Evaluación 2 es privada → botón "Publicar"
    const publicarBtn = await findAllByText('Publicar');
    fireEvent.press(publicarBtn[0]);

    expect(mockCambiarPrivacidad).toHaveBeenCalledWith(
      mockEvaluaciones[1].id,
      mockEvaluaciones[1].esPrivada
    );
  });
});
