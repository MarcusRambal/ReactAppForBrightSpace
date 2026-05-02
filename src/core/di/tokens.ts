//src/core/di/tokens.ts
export const TOKENS = {
  AuthRemoteDS: Symbol("AuthRemoteDS"),
  AuthRepo: Symbol("AuthRepo"),
  ProductRemoteDS: Symbol("ProductRemoteDS"),
  ProductRepo: Symbol("ProductRepo"),
  // Add Product tokens if you want to DI those too...
  CursoSource: Symbol("CursoSource"),
  CursoRepo: Symbol("CursoRepo"),

  EvaluacionSource: Symbol("EvaluacionSource"),
  EvaluacionRepo: Symbol("EvaluacionRepo"),

  LocalPreferences: Symbol("LocalPreferences"),

  GrupoSource: Symbol("GrupoSource"),
  GrupoRepo: Symbol("GrupoRepo"),

  ReporteSource: Symbol("ReporteSource"),
  ReporteRepo: Symbol("ReporteRepo"),
  ReporteService: Symbol("ReporteService"),
  ReporteController: Symbol("ReporteController"),
} as const;