import { CanActivate, ExecutionContext, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TeacherGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request: ModifiedRequest = context.switchToHttp().getRequest();
        const user = request.user;
        console.log(user)

        if (user && user.is_teacher === true) {
            return true;
        } else {
            throw new NotFoundException('Resource not found.');
        }
    }
}