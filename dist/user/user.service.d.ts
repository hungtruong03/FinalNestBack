import { SupabaseClient } from '@supabase/supabase-js';
import { JwtService } from '@nestjs/jwt';
import * as Redis from 'ioredis';
export declare class UserService {
    private readonly supabase;
    private readonly jwtService;
    private readonly redisClient;
    constructor(supabase: SupabaseClient, jwtService: JwtService, redisClient: Redis);
    private googleClient;
    requestOTP(email: string): Promise<{
        success: boolean;
    }>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    deleteOtp(email: string, otp: string): Promise<void>;
    register(email: string, password: string, username: string, otp: string): Promise<string>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    validateUser(userId: number): Promise<any>;
    findOne(userId: number): Promise<any>;
    loginWithGoogle(payload: {
        email: string;
        name: string;
        googleId: string;
    }): Promise<{
        status: string;
        message: string;
        user: any;
    } | {
        status: string;
        message: any;
        user?: undefined;
    }>;
}
