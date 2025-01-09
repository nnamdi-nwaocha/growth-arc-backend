import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '../models/user.entity';
import { becomeATeacherDTO } from '../dto/users.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('')
    findOne(@CurrentUser() user: User) {
        return this.usersService.findById(user.user_id);
    }

    @Patch('profile-picture')
    async updateProfilePicture(
        @Body('profileUrl') profileUrl: string,
        @CurrentUser() user: User,
    ) {
        return this.usersService.updateProfilePicture(user.user_id, profileUrl);
    }

    @Patch('become-a-teacher')
    async becomeATeacher(
        @CurrentUser() user: User,
        @Body() body: becomeATeacherDTO
    ) {
        if (user.is_teacher) {
            throw new Error('User is already a teacher');
        }
        return this.usersService.updateUser(user.user_id, { is_teacher: true, teacher_bio: body.teacher_bio });
    }
}
