import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    requestOTP(body: {
        email: string;
    }): Promise<{
        success: boolean;
    }>;
    requestPasswordReset(email: string): Promise<{
        success: boolean;
    }>;
    verifyResetCode(key: string): Promise<{
        email: string;
    }>;
    resetPassword(body: {
        email: string;
        newPassword: string;
        resetCode: string;
    }): Promise<{
        success: boolean;
    }>;
    register(body: {
        email: string;
        password: string;
        username: string;
        otp: string;
    }): Promise<string>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    loginWithGoogle(body: {
        token: string;
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
    private decodeGoogleToken;
    getProfile(req: any): Promise<any>;
    addRating(req: any, body: {
        rating: number;
    }, movieId: number): Promise<{
        vote_average: number;
        vote_count: number;
    }>;
    getUserRating(req: any, movieId: number): Promise<number>;
    addWatchList(req: any, movieId: number): Promise<{
        success: boolean;
    }>;
    getWatchList(req: any, page: string): Promise<{
        movies: import("../movie/movie.schema").Movie[];
        totalPages: number;
    }>;
    deleteFromWatchlist(req: any, movieId: number): Promise<{
        message: string;
        success: boolean;
    }>;
    addFavourite(req: any, movieId: number): Promise<{
        success: boolean;
    }>;
    getFavourite(req: any, page: string): Promise<{
        movies: import("../movie/movie.schema").Movie[];
        totalPages: number;
    }>;
    deleteFavourite(req: any, movieId: number): Promise<{
        message: string;
        success: boolean;
    }>;
    getRecommendations(req: any): Promise<any[]>;
}
