import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class becomeATeacherDTO {
    @IsNotEmpty()
    @IsString()
    @MaxLength(256)
    teacher_bio: string
}