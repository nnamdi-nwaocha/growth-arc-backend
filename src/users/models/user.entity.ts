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
  is_email_confirmed: boolean;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ default: false })
  is_teacher: boolean;

  @Column({ nullable: true })
  teacher_bio?: string;

  @Column({ nullable: true })
  profile_picture_url?: string;
}
