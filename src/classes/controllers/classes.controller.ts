import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { Class } from '../models/class.entity';
import { ClassService } from '../services/classes.service';
import { CreateClassDTO, UpdateClassDTO } from '../dto/classes.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/models/user.entity';
import { TeacherGuard } from '../guard/classes.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, TeacherGuard)
@Controller('classes')
export class ClassController {
    constructor(private readonly classService: ClassService) { }

    @Post()
    async create(@Body() createClassDto: CreateClassDTO, @CurrentUser() user: User): Promise<Class> {
        return this.classService.create(createClassDto);
    }

    @Get()
    async findAll(
        @CurrentUser() user: User
    ): Promise<Class[]> {
        return this.classService.findAll(user);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Class> {
        return this.classService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateClassDto: UpdateClassDTO
    ): Promise<Class> {
        return this.classService.update(id, updateClassDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.classService.remove(id);
    }
}