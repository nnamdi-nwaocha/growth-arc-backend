import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';
import { ClassesModule } from './classes/classes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables globally

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule
      inject: [ConfigService], // Inject ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'), // Use connection string if available
        // ssl: { rejectUnauthorized: false }, // For Neon
        autoLoadEntities: true,
        synchronize: true, // Disable in production
        logging: ['error', 'warn', 'query'], // Enable logs for debugging
      }),

    }),
    UsersModule,
    AuthModule,
    UtilsModule,
    ClassesModule,
  ],
})
export class AppModule { }
