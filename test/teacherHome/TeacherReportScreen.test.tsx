import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import TeacherReportScreen from '../../src/features/teacherHome/presentation/screens/TeacherReportScreen';
import { AllTheProviders } from '../test.utils/test.utils';

import { useRoute } from '@react-navigation/native';
import { useDI } from '@/src/core/di/diProvider';

jest.mock('@/src/features/auth/presentation/context/authContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: any) => children,
}));

jest.mock('@/src/core/di/diProvider', () => ({
  DIProvider: ({ children }: any) => children,
  useDI: jest.fn(),
}));

jest.mock('@/src/core/di/tokens', () => ({
  TOKENS: { CursoRepo: 'CursoRepo', AuthRemoteDS: 'AuthRemoteDS' },
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: jest.fn(),
}));

global.fetch = jest.fn();

const flushPromises = () => act(async () => {
  await new Promise<void>(resolve => setImmediate(resolve));
});

const mockRespuestasAPI = [
  { idEvaluado: 'estudiante1@uninorte.edu.co', tipo: 'puntualidad',  valor_comentario: '5' },
  { idEvaluado: 'estudiante1@uninorte.edu.co', tipo: 'contribucion', valor_comentario: '4' },
  { idEvaluado: 'estudiante1@uninorte.edu.co', tipo: 'actitud',      valor_comentario: '3' },
  { idEvaluado: 'estudiante1@uninorte.edu.co', tipo: 'compromiso',   valor_comentario: '4' },
];

describe('TeacherReportScreen', () => {
  const mockCursoRepo = {
    getDatosDeGruposPorCategoria: jest.fn(),
    getCompanerosDeGrupo: jest.fn(),
  };

  const mockAuthService = {
    getValidToken: jest.fn().mockResolvedValue('mock-token'),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockCursoRepo.getDatosDeGruposPorCategoria.mockResolvedValue([
      { nombre: 'Grupo A', Correo: 'estudiante1@uninorte.edu.co' },
    ]);
    mockCursoRepo.getCompanerosDeGrupo.mockResolvedValue(['estudiante1@uninorte.edu.co']);

    (useRoute as jest.Mock).mockReturnValue({
      params: {
        idEvaluacion: 'EV-01',
        nombreEvaluacion: 'Evaluacion Final',
        idCategoria: 'CAT-01',
      },
    });

    (useDI as jest.Mock).mockReturnValue({
      resolve: jest.fn().mockImplementation((token: string) => {
        if (token === 'CursoRepo') return mockCursoRepo;
        if (token === 'AuthRemoteDS') return mockAuthService;
        return {};
      }),
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockRespuestasAPI),
    });
  });

  it('deberia mostrar ActivityIndicator mientras carga', () => {
    mockCursoRepo.getDatosDeGruposPorCategoria.mockReturnValue(new Promise(() => {}));

    const { UNSAFE_getByType } = render(<TeacherReportScreen />, { wrapper: AllTheProviders });
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('deberia renderizar el nombre de la evaluacion tras cargar', async () => {
    const { getByText } = render(<TeacherReportScreen />, { wrapper: AllTheProviders });
    await flushPromises();
    expect(getByText('Evaluacion Final')).toBeTruthy();
  });

  it('deberia mostrar la seccion Desempeno por grupos', async () => {
    const { getByText } = render(<TeacherReportScreen />, { wrapper: AllTheProviders });
    await flushPromises();
    expect(getByText(/[Dd]esempe/)).toBeTruthy();
  });

  it('deberia renderizar la tarjeta del grupo', async () => {
    const { getByText } = render(<TeacherReportScreen />, { wrapper: AllTheProviders });
    await flushPromises();
    expect(getByText('Grupo: Grupo A')).toBeTruthy();
  });

  it('deberia mostrar el correo del estudiante con su reporte', async () => {
    const { getByText } = render(<TeacherReportScreen />, { wrapper: AllTheProviders });
    await flushPromises();
    expect(getByText('estudiante1@uninorte.edu.co')).toBeTruthy();
  });

  it('deberia mostrar Pendiente para estudiantes sin reporte', async () => {
    mockCursoRepo.getCompanerosDeGrupo.mockResolvedValue(['sinevaluar@uninorte.edu.co']);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue([]),
    });

    const { getByText } = render(<TeacherReportScreen />, { wrapper: AllTheProviders });
    await flushPromises();
    expect(getByText(/Pendiente/)).toBeTruthy();
  });

  it('deberia mostrar el boton Actualizar y recalcular al presionarlo', async () => {
    const { getByText } = render(<TeacherReportScreen />, { wrapper: AllTheProviders });
    await flushPromises();

    fireEvent.press(getByText('Actualizar'));
    await flushPromises();

    expect(mockCursoRepo.getDatosDeGruposPorCategoria).toHaveBeenCalledTimes(2);
  });

  it('deberia manejar error de fetch sin lanzar excepcion', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { getByText } = render(<TeacherReportScreen />, { wrapper: AllTheProviders });
    await flushPromises();
    expect(getByText('Evaluacion Final')).toBeTruthy();
  });
});
