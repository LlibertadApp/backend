export default class GetUsersResponse {
    email: string;
    rol: number;
    fecha_creacion: Date;

    constructor(email: string, rol: number, fecha_creacion: Date) {
        this.email = email;
        this.rol = rol;
        this.fecha_creacion = fecha_creacion;
    }
}