"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const common_2 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const google_auth_library_1 = require("google-auth-library");
let UserService = class UserService {
    constructor(supabase, jwtService) {
        this.supabase = supabase;
        this.jwtService = jwtService;
        this.googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    async register(email, password, username) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (data) {
            throw new common_1.ConflictException('Email đã tồn tại.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const { data: insertData, error: insertError } = await this.supabase
            .from('users')
            .insert([{ username: username, email: email, pass: hashedPassword }]);
        if (insertError) {
            console.error('Error inserting user:', insertError);
            throw new Error('Đã xảy ra lỗi khi đăng ký người dùng.');
        }
        return 'Đăng ký thành công!';
    }
    async login(email, password) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error || !data) {
            throw new common_1.UnauthorizedException('Thông tin đăng nhập không hợp lệ.');
        }
        const valid = await bcrypt.compare(password, data.pass);
        if (!valid) {
            throw new common_1.UnauthorizedException('Thông tin đăng nhập không hợp lệ.');
        }
        const payload = { email, sub: data.id };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const { sub: userId, email } = payload;
            const newAccessToken = this.jwtService.sign({ email, sub: userId }, { expiresIn: '15m' });
            return { accessToken: newAccessToken };
        }
        catch (error) {
            console.error('Invalid refresh token:', error);
            throw new common_1.UnauthorizedException('Refresh token không hợp lệ.');
        }
    }
    async validateUser(userId) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) {
            console.error('Error validating user:', error);
            throw new Error('Không tìm thấy người dùng.');
        }
        return data;
    }
    async findOne(userId) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) {
            console.error('Error finding user:', error);
            throw new Error('Không tìm thấy người dùng.');
        }
        return data;
    }
    async loginWithGoogle(payload) {
        const { email, name, googleId } = payload;
        try {
            let { data: user, error: fetchError } = await this.supabase
                .from('usersgg')
                .select('*')
                .eq('email', email)
                .single();
            if (fetchError || !user) {
                const { error: insertError } = await this.supabase
                    .from('usersgg')
                    .insert([{ email, username: name, googleId }]);
                if (insertError) {
                    console.error('Error inserting user:', insertError);
                    throw new Error('Đã xảy ra lỗi khi đăng ký người dùng Google.');
                }
                const { data, error: refetchError } = await this.supabase
                    .from('usersgg')
                    .select('*')
                    .eq('email', email)
                    .single();
                if (refetchError || !data) {
                    throw new Error('Đã xảy ra lỗi khi lấy thông tin người dùng Google sau khi tạo.');
                }
                user = data;
            }
            return {
                status: 'success',
                message: 'Đăng nhập thành công!',
                user,
            };
        }
        catch (error) {
            console.error('Error in loginWithGoogle:', error);
            return {
                status: 'error',
                message: error.message || 'Đã xảy ra lỗi khi xử lý yêu cầu.',
            };
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('SUPABASE_CLIENT')),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map