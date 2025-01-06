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
        status: string;
        message: string;
        user: any;
    } | {
        status: string;
        message: any;
        user?: undefined;
    }>;
    private decodeGoogleToken;
    getProfile(req: any): Promise<{
        email: any;
        name: any;
        birthday: any;
    }>;
}
