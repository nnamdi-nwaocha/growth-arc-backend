import { IsNotEmpty, IsOptional, IsNumber, IsString, IsBoolean, IsDate, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ClassCategory } from '../enums';
import { ClassSchedule } from '../interface';


export class CreateClassDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsEnum(ClassCategory)
    category: ClassCategory;

    @IsOptional()
    dates_held: ClassSchedule[];

    @IsNotEmpty()
    @IsDate()
    start_date: Date;

    @IsNotEmpty()
    @IsDate()
    end_date: Date;

    @IsNotEmpty()
    @IsNumber()
    max_participants: number;

    @IsNotEmpty()
    @IsBoolean()
    is_paid: boolean;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsNotEmpty()
    @IsString({ each: true })
    prerequisites: string[];

    @IsNotEmpty()
    @IsString()
    target_audience: string;

    @IsNotEmpty()
    @IsString({ each: true })
    learning_outcomes: string[];

    @IsNotEmpty()
    @IsString()
    resources_provided: string;
}

export class UpdateClassDTO extends PartialType(CreateClassDTO) { }