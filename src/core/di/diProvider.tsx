import React, { createContext, useContext, useMemo } from "react";

import { TOKENS } from "./tokens";

import { AuthenticatioSourceService } from "@/src/features/auth/data/dataSources/authenticationSourceService";
import { AuthRepository } from "@/src/features/auth/data/repositories/authRepository";
import { Container } from "./container";
const DIContext = createContext<Container | null>(null);

export function DIProvider({ children }: { children: React.ReactNode }) {
    //useMemo is a React Hook that lets you cache the result of a calculation between re-renders.
    const container = useMemo(() => {
        const c = new Container();

        const authDS = new AuthenticatioSourceService();
        const authRepo = new AuthRepository(authDS);

        c.register(TOKENS.AuthRemoteDS, authDS)
            .register(TOKENS.AuthRepo, authRepo);


        return c;
    }, []);

    return <DIContext.Provider value={container}>{children}</DIContext.Provider>;
}

export function useDI() {
    const c = useContext(DIContext);
    if (!c) throw new Error("DIProvider missing");
    return c;
}