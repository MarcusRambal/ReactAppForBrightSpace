//src/core/di/diProvider.tsx
import React, { createContext, useContext, useMemo } from "react";

import { TOKENS } from "./tokens";

import { AuthenticatioSourceService } from "@/src/features/auth/data/dataSources/authenticationSourceService";
import { AuthRepository } from "@/src/features/auth/data/repositories/authRepository";

import { CursoSourceService } from "@/src/features/cursos/data/dataSources/cursoSourceService";
import { CursoRepository } from "@/src/features/cursos/data/repositories/cursoRepository";

import { LocalPreferencesAsyncStorage } from "@/src/core/LocalPreferencesAsyncStorage";

import { Container } from "./container";

const DIContext = createContext<Container | null>(null);

export function DIProvider({ children }: { children: React.ReactNode }) {

    const container = useMemo(() => {
        const c = new Container();

        // 🔐 AUTH
        const authDS = new AuthenticatioSourceService();
        const authRepo = new AuthRepository(authDS);

        c.register(TOKENS.AuthRemoteDS, authDS)
         .register(TOKENS.AuthRepo, authRepo);

        // 📚 CURSOS (🔥 AÑADIDO)
        const prefs = LocalPreferencesAsyncStorage.getInstance();

        const cursoDS = new CursoSourceService(
            prefs,
            authDS // usamos el mismo authService
        );

        const cursoRepo = new CursoRepository(cursoDS);

        c.register(TOKENS.CursoSource, cursoDS)
         .register(TOKENS.CursoRepo, cursoRepo);

        return c;
    }, []);

    return <DIContext.Provider value={container}>{children}</DIContext.Provider>;
}

export function useDI() {
    const c = useContext(DIContext);
    if (!c) throw new Error("DIProvider missing");
    return c;
}