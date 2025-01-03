import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '../models/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('')
    findOne(@CurrentUser() user: User) {
        return this.usersService.findById(user.user_id);
    }

    @Patch(':id/profile-picture')
    async updateProfilePicture(
        @Param('id') id: string,
        @Body('profileUrl') profileUrl: string,
    ) {
        return this.usersService.updateProfilePicture(id, profileUrl);
    }
}
