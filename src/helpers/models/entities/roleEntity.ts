import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GenericTable } from './genericTable';

@Entity({ name: 'role' })
export class Role extends GenericTable {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false, length: 100 })
    private name: string;

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }
}
