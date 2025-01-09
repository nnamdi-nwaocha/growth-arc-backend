import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../models/class.entity';
import { CreateClassDTO, UpdateClassDTO } from '../dto/classes.dto';
import { User } from 'src/users/models/user.entity';
import { UtilsService } from 'src/utils/services/utils.service';


@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(Class)
        private classRepository: Repository<Class>,
        private readonly utils: UtilsService,

    ) { }

    async create(payload: CreateClassDTO): Promise<Class> {

        const newClass = this.classRepository.create({
            class_id: `CLASS-${this.utils.generateULID()}`,
            ...payload
        });
        return this.classRepository.save(newClass);
    }

    async findAll(user: User): Promise<Class[]> {
        return this.classRepository.find({
            where: {
                teacher: {
                    user_id: user.user_id
                }
            }
        });
    }

    async findOne(id: string): Promise<Class> {
        const classEntity = await this.classRepository.findOne({
            where: {
                class_id: id
            }
        });
        if (!classEntity) {
            throw new NotFoundException(`Class with ID ${id} not found`);
        }
        return classEntity;
    }

    async update(id: string, updateClassDto: UpdateClassDTO): Promise<Class> {
        await this.classRepository.update(id, updateClassDto);
        const updatedClass = await this.classRepository.findOne({
            where: {
                class_id: id
            }
        });
        if (!updatedClass) {
            throw new NotFoundException(`Class with ID ${id} not found`);
        }
        return updatedClass;
    }

    async remove(id: string): Promise<void> {
        const result = await this.classRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Class with ID ${id} not found`);
        }
    }
}