import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { GenericTable } from "./genericTable";

export enum ScrutinyStatus {
  ENVIADO = "ENVIADO",
  ANOMALIA = "ANOMALIA",
  OK = "OK",
}

@Entity({ name: 'Actas' })
export class Scrutiny extends GenericTable {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Index()
    @Column({ nullable: false })
    private mesaId: string;

    @Index()
    @Column({ nullable: false })
    private userId: string;

    @Column({ nullable: false })
    private conteoLla: number;

    @Column({ nullable: false })
    private conteoUp: number;

    @Column({ nullable: false })
    private votosImpugnados: number;

    @Column({ nullable: false })
    private votosNulos: number;

    @Column({ nullable: false })
    private votosEnBlanco: number;

    @Column({ nullable: false })
    private votosRecurridos: number;

    @Column({ nullable: false })
    private votosEnTotal: number;

    @Column({ nullable: false })
    private sobres: number;

    @Column({ nullable: false })
    private votantes: number;

    @Column({ nullable: false, select: false })
    private imagenActa: string;

    @Column({
        type: "enum",
        enum: ScrutinyStatus,
        default: ScrutinyStatus.ENVIADO,
    })
    private estado: ScrutinyStatus;
}
