import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    // Create a new user
    async create(userData: Partial<User>): Promise<User> {
        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }

    // Find a user by email
    async findByEmail(email: string): Promise<User | undefined> {
        try {
            return this.usersRepository.findOne({ where: { email } });
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }

    // Find a user by ID
    async findById(id: string): Promise<User | undefined> {
        const user = this.usersRepository.findOne({ where: { user_id: id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    // Update user data (e.g., refresh token)
    async updateUser(id: string, updateData: Partial<User>): Promise<void> {
        await this.usersRepository.update(id, updateData);
    }

    async updateProfilePicture(userId: string, profileUrl: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { user_id: userId } });
        if (!user) throw new NotFoundException('User not found');
        user.profile_picture_url = profileUrl;
        return this.usersRepository.save(user);
    }

}
