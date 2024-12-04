import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { createClient } from '@supabase/supabase-js';

@Module({
  imports: [
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: () => {
        const supabaseUrl = process.env.SUPABASE_URL || 'https://ryswjkikhmyotstyscxm.supabase.co';
        const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5c3dqa2lraG15b3RzdHlzY3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMTYzNTYsImV4cCI6MjA0ODc5MjM1Nn0.ynpt_RllNm3EuWZVIAwOrRqNq0pvamkgLNdL6QTlW5o';
        return createClient(supabaseUrl, supabaseKey);
      },
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply((req, res, next) => {
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.status(200).send();
      } else {
        next();
      }
    });
  }
}
