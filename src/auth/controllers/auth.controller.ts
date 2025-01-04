import {
    Controller,
    Post,
    Body,
    Req,
    UseGuards,
    UnauthorizedException,
    Res,
    Get,
    Query
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto'; // Import DTO for registration
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from 'src/users/models/user.entity';
import { Response } from 'express';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // **Register endpoint**
    @Post('register')
    async register(
        @Body() body: RegisterDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        return await this.authService.register(body, response); // Delegate to AuthService
    }

    @Get('confirm-email')
    async confirmEmail(@Query('token') token: string) {
        await this.authService.confirmEmail(token);
        return { message: 'Email confirmed successfully' };
    }

    // **Login endpoint**
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) response: Response,
    ) {
        if (!user.isEmailConfirmed) {
            throw new UnauthorizedException('Please confirm your email address');
        }
        await this.authService.login(user, response);
        return user;
    }

    @Post('refresh')
    @UseGuards(JwtRefreshAuthGuard)
    async refresh(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) response: Response,
    ) {
        await this.authService.login(user, response);
        return user;
    }
}
