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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const common_2 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const google_auth_library_1 = require("google-auth-library");
const Redis = require("ioredis");
const nodemailer = require("nodemailer");
const uuid_1 = require("uuid");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const movie_schema_1 = require("../movie/movie.schema");
const similar_schema_1 = require("../similar/similar.schema");
let UserService = class UserService {
    constructor(supabase, jwtService, redisClient, movieModel1, similarModel) {
        this.supabase = supabase;
        this.jwtService = jwtService;
        this.redisClient = redisClient;
        this.movieModel1 = movieModel1;
        this.similarModel = similarModel;
        this.googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    async requestOTP(email) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (data) {
            throw new common_1.ConflictException('Email đã tồn tại.');
        }
        const otpKey = `otp:${email}`;
        const cooldownKey = `otpCooldown:${email}`;
        const cooldown = await this.redisClient.get(cooldownKey);
        if (cooldown) {
            throw new common_1.BadRequestException('Yêu cầu quá nhiều lần vui lòng thử lại sau.');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.redisClient.set(otpKey, otp, 'EX', 300);
        await this.redisClient.set(cooldownKey, '1', 'EX', 30);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSKEY,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Movies Recommender Code',
            text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong vòng 5 phút.`,
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Đã gửi ${otp} đến ${email}`);
        }
        catch (error) {
            console.error('Error sending OTP via email:', error);
            throw new common_1.BadRequestException('Có lỗi xảy ra khi gửi OTP. Hãy thử lại sau.');
        }
        return { success: true };
    }
    async verifyOtp(email, otp) {
        const otpKey = `otp:${email}`;
        const storedOtp = await this.redisClient.get(otpKey);
        if (!storedOtp || storedOtp !== otp) {
            return false;
        }
        return true;
    }
    async deleteOtp(email, otp) {
        const otpKey = `otp:${email}`;
        const storedOtp = await this.redisClient.get(otpKey);
        if (!storedOtp || storedOtp !== otp) {
            return;
        }
        await this.redisClient.del(otpKey);
    }
    async register(email, password, username, otp) {
        const isOtpValid = await this.verifyOtp(email, otp);
        if (!isOtpValid) {
            throw new common_1.BadRequestException('OTP không tồn tại hoặc đã hết hạn.');
        }
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
        await this.verifyOtp(email, otp);
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
        const payload = { email, isGoogleAccount: false };
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
    async findOne(email) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error) {
            console.error('Error finding user:', error);
            throw new common_1.NotFoundException('Không tìm thấy người dùng.');
        }
        return {
            email: data.email,
            username: data.username,
        };
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
            const signpayload = { email, isGoogleAccount: true };
            const accessToken = this.jwtService.sign(signpayload, { expiresIn: '15m' });
            const refreshToken = this.jwtService.sign(signpayload, { expiresIn: '7d' });
            return {
                accessToken,
                refreshToken
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
    async requestPasswordReset(email) {
        const resetCode = (0, uuid_1.v4)();
        const resetLink = `https://final-react-front-rho.vercel.app/resetpassword?key=${resetCode}`;
        await this.redisClient.set(`password-reset:${resetCode}`, email, 'EX', 86400);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSKEY,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Movies Recommender Password Reset',
            text: `Đường dẫn reset password sau có hiệu lực trong vòng 1 ngày: ${resetLink}`,
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Đã gửi ${resetLink} đến ${email}`);
        }
        catch (error) {
            console.error('Error sending reset link via email:', error);
            throw new common_1.BadRequestException('Có lỗi xảy ra khi gửi Reset Link. Hãy thử lại sau.');
        }
        return { success: true };
    }
    async verifyResetCode(resetCode) {
        const email = await this.redisClient.get(`password-reset:${resetCode}`);
        if (email) {
            return { email };
        }
        else {
            throw new common_1.NotFoundException('Reset code không hợp lệ.');
        }
    }
    async resetPassword(resetCode, email, newPassword) {
        const storedEmail = await this.redisClient.get(`password-reset:${resetCode}`);
        if (storedEmail !== email) {
            throw new common_1.BadRequestException('Email không hợp lệ.');
        }
        const result = await this.updateUserPassword(email, newPassword);
        if (result) {
            await this.redisClient.del(`password-reset:${resetCode}`);
            return { success: true };
        }
        throw new common_1.BadRequestException('Có lỗi xảy ra khi cập nhật mật khẩu.');
    }
    async updateUserPassword(email, newPassword) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error || !data) {
            return false;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const { error: updateError } = await this.supabase
            .from('users')
            .update({ pass: hashedPassword })
            .eq('email', email);
        if (updateError) {
            return false;
        }
        return true;
    }
    async getUserRating(userId, movieId) {
        const { data: existingRating, error } = await this.supabase
            .from('rating')
            .select('point')
            .eq('userID', userId)
            .eq('movieID', movieId)
            .single();
        if (error || !existingRating) {
            return null;
        }
        return existingRating.point;
    }
    async addRating(userId, movieId, rating) {
        if (rating < 1 || rating > 10) {
            throw new common_1.BadRequestException('Điểm đánh giá phải từ 1 đến 10.');
        }
        const { data: existingRating } = await this.supabase
            .from('rating')
            .select('*')
            .eq('userID', userId)
            .eq('movieID', movieId)
            .single();
        const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id: movieId }).exec();
        const movie = movieFromDb1;
        if (!movie) {
            throw new common_1.NotFoundException('Không tìm thấy phim.');
        }
        if (existingRating) {
            const oldRating = existingRating.point;
            const adjustedVoteAverage = ((movie.vote_average * movie.vote_count) - oldRating + rating) / movie.vote_count;
            movie.vote_average = adjustedVoteAverage;
            await movie.save();
            await this.supabase
                .from('rating')
                .update({ point: rating, date: new Date() })
                .eq('userID', userId)
                .eq('movieID', movieId);
            return { vote_average: movie.vote_average, vote_count: movie.vote_count };
        }
        const newVoteCount = movie.vote_count + 1;
        const newVoteAverage = ((movie.vote_average * movie.vote_count) + rating) / newVoteCount;
        movie.vote_average = newVoteAverage;
        movie.vote_count = newVoteCount;
        await movie.save();
        await this.supabase
            .from('rating')
            .insert([{ userID: userId, movieID: movieId, point: rating, date: new Date() }]);
        return { vote_average: movie.vote_average, vote_count: movie.vote_count };
    }
    async addToWatchlist(email, movieID) {
        try {
            const { data, error } = await this.supabase
                .from('watchlist')
                .select('*')
                .eq('email', email)
                .eq('movieID', movieID)
                .single();
            if (data) {
                console.log("Phim đã có trong danh sách theo dõi");
                return { success: false };
            }
            console.log(email, movieID);
            const { error: insertError } = await this.supabase
                .from('watchlist')
                .insert([{ email: email, movieID: movieID }]);
            if (insertError) {
                console.error('Error adding to watchlist:', insertError);
                throw new Error('Đã xảy ra lỗi khi thêm vào danh sách theo dõi.');
            }
            return { success: true };
        }
        catch (error) {
            console.error('Error in addToWatchlist:', error);
            throw error;
        }
    }
    async getWatchList(email, page) {
        try {
            const { data: watchList, error } = await this.supabase
                .from('watchlist')
                .select('movieID')
                .eq('email', email);
            if (error) {
                console.error('Error fetching watch list from Supabase:', error);
                throw new common_1.NotFoundException('Không tìm thấy danh sách xem.');
            }
            if (!watchList || watchList.length === 0) {
                throw new common_1.NotFoundException('Danh sách xem trống.');
            }
            const skip = (page - 1) * 12;
            const totalPages = Math.ceil(watchList.length / 12);
            const paginatedWatchList = watchList.slice(skip, skip + 12);
            const moviePromises = paginatedWatchList.map(async (item) => {
                const movieId = item.movieID;
                const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id: movieId }).exec();
                if (movieFromDb1)
                    return movieFromDb1;
                throw new common_1.NotFoundException(`Không tìm thấy phim với ID: ${movieId}`);
            });
            const movies = await Promise.all(moviePromises);
            return { movies, totalPages };
        }
        catch (error) {
            console.error('Error in getWatchList:', error.message || error);
            throw new common_1.NotFoundException('Có lỗi xảy ra khi lấy danh sách xem.');
        }
    }
    async deleteFromWatchlist(email, movieID) {
        try {
            const { error } = await this.supabase
                .from('watchlist')
                .delete()
                .eq('email', email)
                .eq('movieID', movieID);
            if (error) {
                console.error('Error deleting from watchlist:', error);
                throw new Error('Đã xảy ra lỗi khi xóa phim khỏi danh sách theo dõi.');
            }
            return { success: true };
        }
        catch (error) {
            console.error('Error in deleteFromWatchlist:', error);
            throw error;
        }
    }
    async getFavourite(email, page) {
        try {
            const { data: favourite, error } = await this.supabase
                .from('favourite')
                .select('movieID')
                .eq('email', email);
            if (error) {
                console.error('Error fetching favourite list from Supabase:', error);
                throw new common_1.NotFoundException('Không tìm thấy danh sách xem.');
            }
            if (!favourite || favourite.length === 0) {
                throw new common_1.NotFoundException('Danh sách xem trống.');
            }
            const skip = (page - 1) * 12;
            const totalPages = Math.ceil(favourite.length / 12);
            const paginatedWatchList = favourite.slice(skip, skip + 12);
            const moviePromises = paginatedWatchList.map(async (item) => {
                const movieId = item.movieID;
                const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id: movieId }).exec();
                if (movieFromDb1)
                    return movieFromDb1;
                throw new common_1.NotFoundException(`Không tìm thấy phim với ID: ${movieId}`);
            });
            const movies = await Promise.all(moviePromises);
            return { movies, totalPages };
        }
        catch (error) {
            console.error('Error in favourite:', error.message || error);
            throw new common_1.NotFoundException('Có lỗi xảy ra khi lấy danh sách xem.');
        }
    }
    async deleteFavourite(email, movieID) {
        try {
            const { error } = await this.supabase
                .from('favourite')
                .delete()
                .eq('email', email)
                .eq('movieID', movieID);
            if (error) {
                console.error('Error deleting from favourite:', error);
                throw new Error('Đã xảy ra lỗi khi xóa phim khỏi danh sách theo dõi.');
            }
            return { success: true };
        }
        catch (error) {
            console.error('Error in deleteFromWatchlist:', error);
            throw error;
        }
    }
    async addFavourite(email, movieID) {
        try {
            const { data, error } = await this.supabase
                .from('favourite')
                .select('*')
                .eq('email', email)
                .eq('movieID', movieID)
                .single();
            if (data) {
                console.log("Phim đã có trong danh sách favourite");
                return { success: false };
            }
            console.log(email, movieID);
            const { error: insertError } = await this.supabase
                .from('favourite')
                .insert([{ email: email, movieID: movieID }]);
            if (insertError) {
                console.error('Error adding to favourite:', insertError);
                throw new Error('Đã xảy ra lỗi khi thêm vào danh sách favourite.');
            }
            return { success: true };
        }
        catch (error) {
            console.error('Error in addTofavourite:', error);
            throw error;
        }
    }
    async getRecommendations(email) {
        const watchlistMovies = await this.getAllWatchList(email);
        if (!watchlistMovies.length) {
            throw new common_1.NotFoundException('Watchlist trống, không thể tạo recommendation.');
        }
        const recommendations = [];
        for (const movie of watchlistMovies) {
            const similarData = await this.similarModel.findOne({ tmdb_id: movie.tmdb_id }).exec();
            if (similarData && similarData.similar_movies) {
                recommendations.push(...similarData.similar_movies);
            }
        }
        const uniqueRecommendations = Array.from(new Set(recommendations.map((movie) => movie.id))).map((id) => recommendations.find((movie) => movie.id === id));
        console.log(uniqueRecommendations.slice(0, 20));
        return uniqueRecommendations.slice(0, 20);
    }
    async getAllWatchList(email) {
        try {
            console.log(email);
            const { data: watchList, error } = await this.supabase
                .from('watchlist')
                .select('movieID')
                .eq('email', email);
            if (error) {
                console.error('Error fetching watch list from Supabase:', error);
                throw new common_1.NotFoundException('Không tìm thấy danh sách xem.');
            }
            if (!watchList || watchList.length === 0) {
                throw new common_1.NotFoundException('Danh sách xem trống.');
            }
            const moviePromises = watchList.map(async (item) => {
                const movieId = item.movieID;
                const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id: movieId }).exec();
                if (movieFromDb1)
                    return movieFromDb1;
                throw new common_1.NotFoundException(`Không tìm thấy phim với ID: ${movieId}`);
            });
            const movies = await Promise.all(moviePromises);
            return movies;
        }
        catch (error) {
            console.error('Error in getAllWatchList:', error.message || error);
            throw new common_1.NotFoundException('Có lỗi xảy ra khi lấy danh sách xem.');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('SUPABASE_CLIENT')),
    __param(2, (0, common_2.Inject)('REDIS_CLIENT')),
    __param(3, (0, mongoose_1.InjectModel)(movie_schema_1.Movie.name, 'movie1Connection')),
    __param(4, (0, mongoose_1.InjectModel)(similar_schema_1.Similar.name, 'similarConnection')),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient,
        jwt_1.JwtService, typeof (_a = typeof Redis !== "undefined" && Redis) === "function" ? _a : Object, mongoose_2.Model,
        mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map