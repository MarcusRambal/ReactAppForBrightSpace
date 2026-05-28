import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import StudentReportScreen from '../../src/features/studentHome/presentation/screens/StudentReportScreen'; 
import { AllTheProviders } from '../test.utils/test.utils';

import { useRoute } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: jest.fn(),
}));


describe('StudentReportScreen', () => {
  const mockRetrieveData = jest.fn();
  const mockGetNotasPorEvaluado = jest.fn();



  it('debería mostrar la UI de Calificaciones Ocultas si la evaluación es privada', async () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        idEvaluacion: 'EVAL-PRIV',
        nombreEvaluacion: 'Parcial Oculto',
        esPrivada: true,
      },
    });

    const { getByTestId, queryByRole } = render(<StudentReportScreen />, {
      wrapper: AllTheProviders,
    });

    expect(getByTestId('locked-report-container')).toBeTruthy();
    expect(queryByRole('activityindicator')).toBeNull();
    expect(mockGetNotasPorEvaluado).not.toHaveBeenCalled();
  });

  it('debería mostrar la UI de estado vacío si no se encuentra el correo local', async () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        idEvaluacion: 'EVAL-01',
        nombreEvaluacion: 'Parcial 1',
        esPrivada: false,
      },
    });

    mockRetrieveData.mockResolvedValue(null); 

    const { getByTestId } = render(<StudentReportScreen />, {
      wrapper: AllTheProviders,
    });

    await waitFor(() => {
      expect(getByTestId('empty-report-container')).toBeTruthy();
    });
  });

  it('debería mostrar la UI de estado vacío si todos los endpoints devuelven arreglos de notas vacíos', async () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        idEvaluacion: 'EVAL-01',
        nombreEvaluacion: 'Parcial 1',
        esPrivada: false,
      },
    });

    mockRetrieveData.mockResolvedValue('alumno@uninorte.edu.co');
    mockGetNotasPorEvaluado.mockResolvedValue([]);

    const { getByTestId } = render(<StudentReportScreen />, {
      wrapper: AllTheProviders,
    });

    await waitFor(() => {
      expect(getByTestId('empty-report-container')).toBeTruthy();
    });
  });

  it('debería calcular correctamente las notas, promedios', async () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        idEvaluacion: 'EVAL-01',
        nombreEvaluacion: 'Proyecto Final',
        esPrivada: false,
      },
    });

    mockRetrieveData.mockResolvedValue('alumno@uninorte.edu.co');
    
    mockGetNotasPorEvaluado
      .mockResolvedValueOnce(['5.0', '4.0'])  
      .mockResolvedValueOnce(['4.0', '4.0']) 
      .mockResolvedValueOnce(['5.0', '5.0'])  
      .mockResolvedValueOnce(['4.5', '4.5']); 
  });
});