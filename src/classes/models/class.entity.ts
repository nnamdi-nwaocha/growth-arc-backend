import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { IsEnum, IsDate, IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';
import { User } from 'src/users/models/user.entity';
import { ClassCategory } from '../enums';
import { ClassSchedule } from '../interface';

@Entity()
export class Class {
    @PrimaryColumn()
    class_id: string;

    @Column()
    @IsString()
    title: string;

    @Column({ type: 'enum', enum: ClassCategory })
    @IsEnum(ClassCategory)
    category: ClassCategory;

    @Column('json')
    @IsOptional()
    dates_held: ClassSchedule[];

    @Column()
    @IsDate()
    start_date: Date;

    @Column()
    @IsDate()
    end_date: Date;

    @Column()
    @IsNumber()
    max_participants: number;

    @Column({ default: false })
    @IsBoolean()
    is_paid: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    @IsOptional()
    @IsNumber()
    price?: number;

    @Column('simple-array')
    @IsOptional()
    @IsString({ each: true })
    prerequisites?: string[];

    @Column()
    @IsString()
    target_audience: string;

    @Column('simple-array')
    @IsOptional()
    @IsString({ each: true })
    learning_outcomes: string[];

    @Column()
    @IsString()
    resources_provided: string;

    @ManyToOne(() => User, (user) => user.user_id)
    teacher: User;
}