import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn()
    user_id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({ default: false })
    isEmailConfirmed: boolean;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    refresh_token: string;

    @Column({ nullable: true })
    profile_picture_url?: string;
}
