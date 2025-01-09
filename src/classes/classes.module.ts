import { Module } from '@nestjs/common';
import { ClassService } from './services/classes.service';
import { ClassController } from './controllers/classes.controller';
import { User } from 'src/users/models/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './models/class.entity';

@Module({
    providers: [ClassService],
    imports: [TypeOrmModule.forFeature([User, Class])],
    controllers: [ClassController],
    exports: []
})
export class ClassesModule { }
