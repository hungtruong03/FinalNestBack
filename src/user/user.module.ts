import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_KEY', // Thay bằng biến môi trường nếu cần
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
          process.env.SUPABASE_URL, // Đảm bảo có biến môi trường này
          process.env.SUPABASE_ANON_KEY, // Đảm bảo có biến môi trường này
        );
      },
    },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
