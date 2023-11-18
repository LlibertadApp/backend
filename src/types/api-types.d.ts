
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

export interface IdentificadorMesa {
  mesaId: string;
}

export interface UserToken {
  iat: number;
  exp: number;
  user_id: string;
  mesas: IdentificadorMesa[];
}

export interface Scrutiny {
  userId: string;
  imagenPath: string;
  conteoLla: number;
  conteoUp: number;
  votosImpugnados: number;
  votosNulos: number;
  votosEnBlanco: number;
  votosRecurridos: number;
  votosEnTotal: number;
}

export interface EscrutionioMesaResponse {
  data: Scrutiny;
}

export interface ListActasResponse {
  data: Array<Scrutiny>;
}
