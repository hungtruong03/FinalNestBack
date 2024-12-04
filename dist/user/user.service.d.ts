import { SupabaseClient } from '@supabase/supabase-js';
import { JwtService } from '@nestjs/jwt';
export declare class UserService {
    private readonly supabase;
    private readonly jwtService;
    constructor(supabase: SupabaseClient, jwtService: JwtService);
    private googleClient;
    register(email: string, password: string, username: string): Promise<string>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    validateUser(userId: number): Promise<any>;
    findOne(userId: number): Promise<any>;
    loginWithGoogle(idToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
