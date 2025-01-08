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
exports.HomeapiController = void 0;
const common_1 = require("@nestjs/common");
const homeapi_service_1 = require("./homeapi.service");
const movie_service_1 = require("../movie/movie.service");
let HomeapiController = class HomeapiController {
    constructor(homeapiService, movieService) {
        this.homeapiService = homeapiService;
        this.movieService = movieService;
    }
    async getTrendingDay(limit) {
        return this.homeapiService.fetchTrendingDay(limit);
    }
    async getTrendingWeek(limit) {
        return this.homeapiService.fetchTrendingWeek(limit);
    }
    async getPopular(limit) {
        return this.homeapiService.fetchPopular(limit);
    }
    async getUpcoming(limit) {
        return this.homeapiService.fetchUpcoming(limit);
    }
    async getTrailers(id) {
        return this.movieService.getTrailers(id);
    }
    async getPeople(id) {
        return this.homeapiService.fetchPeople(id);
    }
};
exports.HomeapiController = HomeapiController;
__decorate([
    (0, common_1.Get)('trending/day'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HomeapiController.prototype, "getTrendingDay", null);
__decorate([
    (0, common_1.Get)('trending/week'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HomeapiController.prototype, "getTrendingWeek", null);
__decorate([
    (0, common_1.Get)('popular'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HomeapiController.prototype, "getPopular", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HomeapiController.prototype, "getUpcoming", null);
__decorate([
    (0, common_1.Get)('movie/:id/trailers'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HomeapiController.prototype, "getTrailers", null);
__decorate([
    (0, common_1.Get)('people/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HomeapiController.prototype, "getPeople", null);
exports.HomeapiController = HomeapiController = __decorate([
    (0, common_1.Controller)('homeapi'),
    __metadata("design:paramtypes", [homeapi_service_1.HomeapiService,
        movie_service_1.MovieService])
], HomeapiController);
//# sourceMappingURL=homeapi.controller.js.map