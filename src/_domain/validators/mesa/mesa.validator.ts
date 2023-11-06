export function isValidMesa(object: any): object is Mesa {
  return object.hasOwnProperty('mesaId') && typeof object.mesaId === 'string';
}

export function isValidMesasResponse(object: any): object is MesasBody {
  return (
    object.hasOwnProperty('mesas') &&
    Array.isArray(object.mesas) &&
    object.mesas.every(isValidMesa)
  );
}