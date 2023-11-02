export type GetUsersResponse = {
    email: string;
    rol: number;
    fecha_creacion: Date;
}

export type PostResultadosResponse = {
    result: string;
    mesa_id: string;
}

export type ResultadosInput = {
    mesa_id: string;
    fiscal_lla: number;
    fiscal_uxp: number;
    fiscal_blanco: number;
    fiscal_comando: number;
    fiscal_impugnado: number;
    fiscal_nulo: number;
    fiscal_recurrido: number;
  };