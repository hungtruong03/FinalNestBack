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
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const common_1 = require("@nestjs/common");
const setMetaData_1 = require("../decorators/setMetaData");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async requestOTP(body) {
        const { email } = body;
        return this.userService.requestOTP(email);
    }
    async requestPasswordReset(email) {
        return this.userService.requestPasswordReset(email);
    }
    async verifyResetCode(key) {
        return this.userService.verifyResetCode(key);
    }
    async resetPassword(body) {
        const { email, newPassword, resetCode } = body;
        return this.userService.resetPassword(resetCode, email, newPassword);
    }
    async register(body) {
        const { email, password, username, otp } = body;
        return this.userService.register(email, password, username, otp);
    }
    async login(body) {
        return this.userService.login(body.email, body.password);
    }
    async loginWithGoogle(body) {
        const { token } = body;
        const decodedToken = this.decodeGoogleToken(token);
        if (!decodedToken) {
            return {
                status: 'error',
                message: 'Token không hợp lệ hoặc không giải mã được.',
            };
        }
        return this.userService.loginWithGoogle(decodedToken);
    }
    decodeGoogleToken(token) {
        try {
            const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            return {
                email: decoded.email,
                name: decoded.name,
                googleId: decoded.sub,
            };
        }
        catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
    async getProfile(req) {
        return await this.userService.findOne(req.email);
    }
    async addRating(req, body, movieId) {
        const userId = req.email;
        const { rating } = body;
        return this.userService.addRating(userId, movieId, rating);
    }
    async getUserRating(req, movieId) {
        const userId = req.email;
        console.log(userId);
        return this.userService.getUserRating(userId, movieId);
    }
    async addWatchList(req, movieId) {
        const email = req.email;
        console.log(email);
        return this.userService.addToWatchlist(email, movieId);
    }
    async getWatchList(req, page) {
        const email = req.email;
        const pageNumber = parseInt(page, 10) || 1;
        return this.userService.getWatchList(email, pageNumber);
    }
    async deleteFromWatchlist(req, movieId) {
        const email = req.email;
        const result = await this.userService.deleteFromWatchlist(email, movieId);
        return {
            message: 'Phim đã được xóa khỏi danh sách xem.',
            success: result.success,
        };
    }
    async addFavourite(req, movieId) {
        const email = req.email;
        console.log(email);
        return this.userService.addFavourite(email, movieId);
    }
    async getFavourite(req, page) {
        const email = req.email;
        const pageNumber = parseInt(page, 10) || 1;
        return this.userService.getFavourite(email, pageNumber);
    }
    async deleteFavourite(req, movieId) {
        const email = req.email;
        const result = await this.userService.deleteFavourite(email, movieId);
        return {
            message: 'Phim đã được xóa khỏi danh sách yêu thích .',
            success: result.success,
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, setMetaData_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('requestOTP'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "requestOTP", null);
__decorate([
    (0, setMetaData_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('requestPasswordReset'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "requestPasswordReset", null);
__decorate([
    (0, setMetaData_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('verifyResetCode'),
    __param(0, (0, common_1.Query)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyResetCode", null);
__decorate([
    (0, setMetaData_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('resetPassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, setMetaData_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, setMetaData_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, setMetaData_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('logingg'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginWithGoogle", null);
__decorate([
    (0, setMetaData_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)('rate/:movieId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('movieId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addRating", null);
__decorate([
    (0, common_1.Get)('rate/:movieId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('movieId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserRating", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)('watchlist/:movieId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('movieId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addWatchList", null);
__decorate([
    (0, common_1.Get)('watchlist'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getWatchList", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Delete)('watchlist/:movieId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('movieId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteFromWatchlist", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)('favourite/:movieId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('movieId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addFavourite", null);
__decorate([
    (0, common_1.Get)('favourite'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFavourite", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Delete)('favourite/:movieId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('movieId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteFavourite", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map