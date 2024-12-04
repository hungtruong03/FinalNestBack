import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    register(body: {
        email: string;
        password: string;
        username: string;
    }): Promise<string>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logingg(body: {
        token: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(req: any): Promise<{
        email: any;
        name: any;
        birthday: any;
    }>;
}
