import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/dtos/guards/auth.guard';
import { ClaimsGuard } from './auth/dtos/guards/claims.guard';

@Module({
  imports: [    
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('HOSTDB'),
        port: config.get<number>('PORTDB'),
        username: config.get('USERNAMEDB'),
        password: config.get('PASSWORDDB'),
        database: config.get('DATABASEDB'),
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    
    UserModule, 
    PostModule, 
    CommentModule, 
    AuthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: ClaimsGuard
    }
  ]
})
export class AppModule {}
