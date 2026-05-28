import React from 'react';
import { render, act } from '@testing-library/react-native';
import TeacherAlertsScreen from '../../src/features/teacherHome/presentation/screens/TeacherAlertsScreen';
import { AllTheProviders } from '../test.utils/test.utils';

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
  TOKENS: {
    CursoRepo: 'CursoRepo',
    AuthRepo: 'AuthRepo',
    ReporteController: 'ReporteController',
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue('mock-token'),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

const flushPromises = () => act(async () => {
  await new Promise<void>(resolve => setImmediate(resolve));
});

const mockCursos = [{ id: 'NRC-001', nombre: 'Diseno de Software' }];

const mockEstudiantesBajos = [
  { idEstudiante: 'bajo@uninorte.edu.co', idCategoria: 'CAT-01', nota: '2.5' },
];

describe('TeacherAlertsScreen', () => {
  const mockCursoRepo = {
    getCursosByProfe: jest.fn().mockResolvedValue(mockCursos),
    getCategoriasByCurso: jest.fn().mockResolvedValue([{ idcat: 'CAT-01', nombre: 'Proyecto' }]),
    getDatosDeGruposPorCategoria: jest.fn().mockResolvedValue([
      { Correo: 'bajo@uninorte.edu.co', nombre: 'Grupo A' },
    ]),
  };

  const mockAuthRepo = {
    getToken: jest.fn().mockReturnValue('mock-token'),
  };

  const mockReporteController = {
    getEstudiantesBajoRendimiento: jest.fn().mockResolvedValue(mockEstudiantesBajos),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockCursoRepo.getCursosByProfe.mockResolvedValue(mockCursos);
    mockCursoRepo.getCategoriasByCurso.mockResolvedValue([{ idcat: 'CAT-01', nombre: 'Proyecto' }]);
    mockCursoRepo.getDatosDeGruposPorCategoria.mockResolvedValue([
      { Correo: 'bajo@uninorte.edu.co', nombre: 'Grupo A' },
    ]);
    mockReporteController.getEstudiantesBajoRendimiento.mockResolvedValue(mockEstudiantesBajos);

    (useDI as jest.Mock).mockReturnValue({
      resolve: jest.fn().mockImplementation((token: string) => {
        if (token === 'CursoRepo') return mockCursoRepo;
        if (token === 'AuthRepo') return mockAuthRepo;
        if (token === 'ReporteController') return mockReporteController;
        return {};
      }),
    });
  });

  it('deberia mostrar ActivityIndicator mientras carga', () => {
    mockCursoRepo.getCursosByProfe.mockReturnValue(new Promise(() => {}));

    const { UNSAFE_getByType } = render(<TeacherAlertsScreen />, { wrapper: AllTheProviders });
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('deberia mostrar mensaje vacio si no hay alertas', async () => {
    mockReporteController.getEstudiantesBajoRendimiento.mockResolvedValue([]);

    const { getByText } = render(<TeacherAlertsScreen />, { wrapper: AllTheProviders });
    await flushPromises();
    expect(getByText('No hay alertas de rendimiento')).toBeTruthy();
  });

  it('deberia listar las alertas de bajo rendimiento', async () => {
    const { getByText } = render(<TeacherAlertsScreen />, { wrapper: AllTheProviders });
    await flushPromises();

    expect(getByText('bajo@uninorte.edu.co')).toBeTruthy();
    expect(getByText('Curso: Diseno de Software')).toBeTruthy();
    expect(getByText('2.5')).toBeTruthy();
  });

  it('deberia manejar el caso sin token disponible sin crashear', async () => {
    mockAuthRepo.getToken.mockReturnValue(null);
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValue(null);

    const { getByText } = render(<TeacherAlertsScreen />, { wrapper: AllTheProviders });
    await flushPromises();
    expect(getByText('No hay alertas de rendimiento')).toBeTruthy();
  });
});
