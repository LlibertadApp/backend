
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
  aud: string;
  iat: number;
  exp: number;
  iss: string;
  sub: string;
  uid: string;
  claims: {
    mesas: IdentificadorMesa[];
  };
}
