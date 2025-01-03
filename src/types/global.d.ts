import { Request } from "express";
import { User } from "src/users/models/user.entity";

declare global {
    interface RequestWithUserPayload extends Request {
        user: User;
    }

    interface ModifiedRequest extends Request {
        user: User;
        refreshToken: string;
    }

}