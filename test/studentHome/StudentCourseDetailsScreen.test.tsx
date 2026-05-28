import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StudentCourseDetailsScreen from '../../src/features/studentHome/presentation/screens/StudentCourseDetailsScreen';
import { AllTheProviders } from '../test.utils/test.utils';

import { useRoute, useNavigation } from '@react-navigation/native';


jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

const mockCursoMatriculado = {
  curso: { id: 'NRC-9999', nombre: 'Ingeniería de Requisitos' },
  grupos: [
    { idCat: 'CAT-PROY', categoriaNombre: 'Proyecto Final', grupoNombre: 'Grupo Alfa' },
    { idCat: 'CAT-LAB', categoriaNombre: 'Laboratorios', grupoNombre: 'Laboratorio B' },
  ],
};

describe('StudentCourseDetailsScreen', () => {
  const mockNavigate = jest.fn();
  const mockGoBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      goBack: mockGoBack,
    });

    (useRoute as jest.Mock).mockReturnValue({
      params: { cursoMatriculado: mockCursoMatriculado },
    });
  });

  it('debería renderizar la información estática del curso correctamente', () => {
    const { getByTestId, getByText } = render(<StudentCourseDetailsScreen />, {
      wrapper: AllTheProviders,
    });

    expect(getByTestId('student-course-details-screen')).toBeTruthy();
    expect(getByText('Ingeniería de Requisitos')).toBeTruthy();
    expect(getByText('NRC: NRC-9999')).toBeTruthy();
  });

  it('debería mapear y listar todos los grupos de trabajo asociados al curso', () => {
    const { getByTestId, getByText } = render(<StudentCourseDetailsScreen />, {
      wrapper: AllTheProviders,
    });

    // Validamos el primer grupo renderizado
    expect(getByTestId('group-card-CAT-PROY')).toBeTruthy();
    expect(getByText('Proyecto Final')).toBeTruthy();
    expect(getByText('Asignación: Grupo Alfa')).toBeTruthy();

    // Validamos el segundo grupo renderizado
    expect(getByTestId('group-card-CAT-LAB')).toBeTruthy();
    expect(getByText('Laboratorios')).toBeTruthy();
    expect(getByText('Asignación: Laboratorio B')).toBeTruthy();
  });



  it('debería navegar a los detalles del grupo específico con los parámetros correspondientes', () => {
    const { getByTestId } = render(<StudentCourseDetailsScreen />, {
      wrapper: AllTheProviders,
    });

    // Simulamos la presión de la card del Proyecto Final
    fireEvent.press(getByTestId('group-card-CAT-PROY'));

    expect(mockNavigate).toHaveBeenCalledWith('GroupDetails', {
      grupo: mockCursoMatriculado.grupos[0],
      cursoMatriculado: mockCursoMatriculado,
    });
  });
});