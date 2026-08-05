import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('database.host', 'localhost'),
  port: configService.get<number>('database.port', 5432),
  username: configService.get<string>('database.username', 'postgres'),
  password: configService.get<string>('database.password', 'postgres'),
  database: configService.get<string>('database.database', 'scada'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: configService.get<boolean>('database.synchronize', false),
  logging: configService.get<boolean>('database.logging', false),
  autoLoadEntities: true,
});
