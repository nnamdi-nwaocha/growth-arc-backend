import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/models/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { UtilsService } from 'src/utils/services/utils.service';
import { ISetTokensResponse, ITokenPayload } from '../interfaces';
import { Response } from 'express';
import { MailService } from './confirmation-email.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private readonly utils: UtilsService,
        private readonly configService: ConfigService,
        private jwtService: JwtService,
        private readonly mailService: MailService
    ) { }

    private async setTokens(user: User, response: Response): Promise<ISetTokensResponse> {
        const expiresAccessToken = new Date();
        expiresAccessToken.setMilliseconds(expiresAccessToken.getTime() +
            parseInt(
                this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
            ));
        const expiresRefreshToken = new Date();
        expiresRefreshToken.setMilliseconds(expiresAccessToken.getTime() +
            parseInt(
                this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
            ));

        const tokenPayload: ITokenPayload = {
            userId: user.user_id
        }

        const accessToken = this.jwtService.sign(tokenPayload, {
            secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS')}ms`
        });
        const refreshToken = this.jwtService.sign(tokenPayload, {
            secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: `${this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS')}ms`
        });
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersService.updateUser(user.user_id, { refresh_token: hashedRefreshToken });

        response.cookie('Authentication', accessToken, {
            expires: expiresAccessToken,
            httpOnly: true,
            // secure: true,
        });
        response.cookie('Refresh', refreshToken, {
            expires: expiresRefreshToken,
            httpOnly: true,
            // secure: true,
        });

        return {
            accessToken,
            refreshToken
        }
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        console.log('email:', email);
        console.log('password:', password);
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async register(registerDto: RegisterDto, response: Response): Promise<User> {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists'); // Prevent duplicates
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10); // Hash password
        const user = await this.usersService.create({
            user_id: `USER-${this.utils.generateULID()}`,
            email: registerDto.email,
            password: hashedPassword,
            firstname: registerDto.firstname,
            lastname: registerDto.lastname,
        });

        const confirmationToken = this.jwtService.sign({ email: user.email }, { secret: this.configService.get<string>('JWT_CONFIRMATION_TOKEN_SECRET'), expiresIn: '1d' });
        await this.mailService.sendConfirmationEmail(user.email, confirmationToken);

        return user
    }

    async confirmEmail(token: string): Promise<void> {
        try {
            const payload = this.jwtService.verify(token, { secret: this.configService.get<string>('JWT_CONFIRMATION_TOKEN_SECRET') });
            const user = await this.usersService.findByEmail(payload.email);
            if (!user) {
                throw new UnauthorizedException('Invalid token');
            }

            await this.usersService.updateUser(user.user_id, { is_email_confirmed: true });
        } catch (error) {
            throw new UnauthorizedException('Invalid confirmation token');
        }
    }

    async login(user: User, response: Response) {
        await this.setTokens(user, response)
    }

    async verifyUserRefreshToken(refreshToken: string, userId: string): Promise<User> {
        try {
            console.log('refreshToken:', refreshToken);
            console.log('userId:', userId);
            const user = await this.usersService.findById(userId);
            const authenticated = await bcrypt.compare(refreshToken, user.refresh_token);
            if (!authenticated) {
                console.log('Invalid refresh token');
                throw new UnauthorizedException('Invalid refresh token');
            }
            return user;
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
