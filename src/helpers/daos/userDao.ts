import 'reflect-metadata'
import { User } from "@/helpers/models/entities/userEntity";
import { Repository } from "typeorm";
import { ConnectionSource } from '../../../ormconfig';

const userRepository: Repository<User> = ConnectionSource.getRepository(User);

export const findUserByUuid = async (uuid: string): Promise<User | null> => {
    const query = userRepository.createQueryBuilder('user')
        .where('user.uuid = :uuid', { uuid: uuid })
        .getOne();
    return query;
}