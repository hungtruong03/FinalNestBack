import { SupabaseClient } from '@supabase/supabase-js';
import { JwtService } from '@nestjs/jwt';
import * as Redis from 'ioredis';
import { Model } from 'mongoose';
import { Movie } from '../movie/movie.schema';
export declare class UserService {
    private readonly supabase;
    private readonly jwtService;
    private readonly redisClient;
    private readonly movieModel1;
    constructor(supabase: SupabaseClient, jwtService: JwtService, redisClient: Redis, movieModel1: Model<Movie>);
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
    findOne(email: string): Promise<any>;
    loginWithGoogle(payload: {
        email: string;
        name: string;
        googleId: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        status?: undefined;
        message?: undefined;
    } | {
        status: string;
        message: any;
        accessToken?: undefined;
        refreshToken?: undefined;
    }>;
    requestPasswordReset(email: string): Promise<{
        success: boolean;
    }>;
    verifyResetCode(resetCode: string): Promise<{
        email: string;
    }>;
    resetPassword(resetCode: string, email: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    private updateUserPassword;
    addRating(userId: number, movieId: number, rating: number): Promise<{
        success: boolean;
    }>;
    addToWatchlist(email: string, movieID: number): Promise<{
        success: boolean;
    }>;
    getWatchList(email: string, page: number): Promise<{
        movies: Movie[];
        totalPages: number;
    }>;
    deleteFromWatchlist(email: string, movieID: number): Promise<{
        success: boolean;
    }>;
    getFavourite(email: string, page: number): Promise<{
        movies: Movie[];
        totalPages: number;
    }>;
    deleteFavourite(email: string, movieID: number): Promise<{
        success: boolean;
    }>;
    addFavourite(email: string, movieID: number): Promise<{
        success: boolean;
    }>;
}
