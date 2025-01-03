import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ITokenPayload } from '../interfaces';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authservice: AuthService,
        private readonly configService: ConfigService,
        private readonly userService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.Authentication,
            ]),
            secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        });
    }

    async validate(payload: ITokenPayload) {
        return await this.userService.findById(payload.userId);
    }
}