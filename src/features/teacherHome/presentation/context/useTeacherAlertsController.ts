// src/features/teacherHome/presentation/context/useTeacherAlertsController.ts

import { useEffect, useState } from "react";
import { ReporteController } from "@/src/features/reportes/presentation/context/ReporteController";
import { CursoCurso } from "@/src/features/cursos/domain/entities/CursoCurso";

export function useTeacherAlertsController(
    cursos: CursoCurso[],
    reporteController: ReporteController
) {
    const [cantidadAlertas, setCantidadAlertas] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // 🔥 equivalente a onInit + ever(cursoCtrl.cursos)
    useEffect(() => {
        const calcularAlertasTotales = async () => {
            try {
                setIsLoading(true);

                let totalBajoRendimiento = 0;

                for (const curso of cursos) {
                    const alertasCurso =
                        await reporteController.getEstudiantesBajoRendimiento(
                            curso.id.toString()
                        );

                    totalBajoRendimiento += alertasCurso.length;
                }

                setCantidadAlertas(totalBajoRendimiento);

            } catch (e) {
                console.error("Error en TeacherAlertsController:", e);
            } finally {
                setIsLoading(false);
            }
        };

        if (cursos.length > 0) {
            calcularAlertasTotales();
        } else {
            setCantidadAlertas(0);
        }

    }, [cursos]); // 🔥 equivalente a ever()

    return {
        cantidadAlertas,
        isLoading,
    };
}