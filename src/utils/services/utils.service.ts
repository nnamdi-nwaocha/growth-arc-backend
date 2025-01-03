import { Injectable } from "@nestjs/common";
import { ulid } from "ulid";


@Injectable()
export class UtilsService {

    generateULID = () => {
        return ulid();
    };
}