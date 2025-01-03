import { Request } from "express";
import { ITokenPayload } from "../interfaces";
import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../services/auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService, // Fixed injection
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.Refresh,
            ]),
            secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'), // Uses injected service
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: ITokenPayload) {
        return await this.authService.verifyUserRefreshToken(
            request.cookies?.Refresh,
            payload.userId
        );
    }
}
