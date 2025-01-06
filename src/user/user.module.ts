import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as Redis from 'ioredis';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),

  ],
  providers: [
    UserService,
    JwtStrategy,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (): SupabaseClient => {
        return createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_ANON_KEY,
        );
      },
    },
    {
      provide: 'REDIS_CLIENT',
      useFactory: (): Redis => {
        return new Redis(process.env.REDIS_URL, {
          tls: { rejectUnauthorized: false },
        });
      },
    },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
