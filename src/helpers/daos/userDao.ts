import 'reflect-metadata';
import { User } from "@/helpers/models/entities/userEntity";
import { Repository, DataSource } from "typeorm";
import { ConnectionSource } from '../../../ormconfig';

export const findUserByUuid = async (uuid: string): Promise<User | null> => {
    try {
        if (!ConnectionSource.isInitialized) {
            await ConnectionSource.initialize();
            console.log('Database connected');
        }

        const userRepository: Repository<User> = ConnectionSource.getRepository(User);

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
        if (!ConnectionSource.isInitialized) {
            await ConnectionSource.initialize();
            console.log('Database connected');
        }

        const userRepository: Repository<User> = ConnectionSource.getRepository(User);

        // Creating a new user instance with the provided data
        const user = userRepository.create(userData);

        // Saving the new user instance to the database
        await userRepository.save(user);

        return user;

    } catch (error) {
        console.error('Error in createUser:', error);
        return null;
    }
};
