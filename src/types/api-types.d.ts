
export interface ActasRequest {
  imagenActa: File;
  mesaId: string;
  conteoLla: number;
  conteoUp: number;
  votosImpugnados: number;
  votosNulos: number;
  votosEnBlanco: number;
  votosRecurridos: number;
  votosEnTotal: number;
  userId: string;
}

export type ActasResponse = {
  mesaId: string;
  url: string;
};
