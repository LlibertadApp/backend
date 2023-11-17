import 'reflect-metadata';
import { User } from "@/helpers/models/entities/userEntity";
import { Repository } from "typeorm";
import { ConnectionSourceRead } from '../../../ormconfigread';
import { ConnectionSourceWrite } from '../../../ormconfigwrite';

export const findUserByUuid = async (uuid: string): Promise<User | null> => {
    try {
        if (!ConnectionSourceRead.isInitialized) {
            await ConnectionSourceRead.initialize();
            console.log('Database connected');
        }

        const userRepository: Repository<User> = ConnectionSourceRead.getRepository(User);

        const query = await userRepository.createQueryBuilder('user')
            .where('user.uuid = :uuid', { uuid: uuid })
            .getOne();
        return query;

    } catch (error) {
        console.error('Error in findUserByUuid:', error);
        return null;
    }
};

export const createUser = async (userData: Partial<User>): Promise<User | null> => {
    try {
        if (!ConnectionSourceWrite.isInitialized) {
            await ConnectionSourceWrite.initialize();
            console.log('Database connected');
        }

        const userRepository: Repository<User> = ConnectionSourceWrite.getRepository(User);

        const user = userRepository.create(userData);

        await userRepository.save(user);

        return user;

    } catch (error) {
        console.error('Error in createUser:', error);
        return null;
    }
};
