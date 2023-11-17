import 'reflect-metadata';
import { Scrutiny } from "@/helpers/models/entities/scrutinyEntity";
import { Repository } from "typeorm";
import { ConnectionSource } from '../../../ormconfig';

export const findScrutiniesByUserId = async (userId: string): Promise<Scrutiny[] | null> => {
    try {
        if (!ConnectionSource.isInitialized) {
            await ConnectionSource.initialize();
            console.log('Database connected');
        }

        const scrutinyRepository: Repository<Scrutiny> = ConnectionSource.getRepository(Scrutiny);

        const query = await scrutinyRepository.createQueryBuilder('Actas')
            .where('Actas.userId = :userId', { userId: userId })
            .getMany();

        return query;

    } catch (error) {
        console.error('Error in findScrutiniesByUserId:', error);
        return null;
    }
};

export const findScrutiniesByMesaId = async (mesaId: string): Promise<Scrutiny[] | null> => {
    try {
        if (!ConnectionSource.isInitialized) {
            await ConnectionSource.initialize();
            console.log('Database connected');
        }

        const scrutinyRepository: Repository<Scrutiny> = ConnectionSource.getRepository(Scrutiny);

        const query = await scrutinyRepository.createQueryBuilder('Actas')
            .where('Actas.mesaId = :mesaId', { mesaId: mesaId })
            .getMany();

        return query;

    } catch (error) {
        console.error('Error in findScrutiniesByMesaId:', error);
        return null;
    }
};

export const createScutiny = async (scrutinyData: Partial<Scrutiny>): Promise<Scrutiny | null> => {
    try {
        if (!ConnectionSource.isInitialized) {
            await ConnectionSource.initialize();
            console.log('Database connected');
        }

        const scrutinyRepository: Repository<Scrutiny> = ConnectionSource.getRepository(Scrutiny);

        const scrutiny = scrutinyRepository.create(scrutinyData);

        await scrutinyRepository.save(scrutiny);

        return scrutiny;

    } catch (error) {
        console.error('Error in createScrutiny:', error);
        return null;
    }
};
