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
exports.MovieController = void 0;
const common_1 = require("@nestjs/common");
const movie_service_1 = require("./movie.service");
let MovieController = class MovieController {
    constructor(movieService) {
        this.movieService = movieService;
    }
    async getMovie(id) {
        const tmdb_id = parseInt(id, 10);
        console.log(tmdb_id);
        return this.movieService.getMovieById(tmdb_id);
    }
    async getMovieCredits(id) {
        const tmdb_id = parseInt(id, 10);
        return this.movieService.getMovieCredits(tmdb_id);
    }
    async searchMovie(query) {
        const filters = {
            keyword: query.keyword || '',
            minVoteAverage: parseFloat(query.minVoteAverage) || 0,
            minVoteCount: parseInt(query.minVoteCount, 10) || 0,
            releaseDateFrom: query.releaseDateFrom || '',
            releaseDateTo: query.releaseDateTo || '',
            genres: query.genres ? query.genres.split(',') : [],
            sortBy: query.sortBy || 'vote_average',
            sortOrder: query.sortOrder || 'desc',
            limit: parseInt(query.limit, 10) || 10,
            page: parseInt(query.page, 10) || 1,
        };
        const result = await this.movieService.searchMovies(filters);
        return {
            movies: result.movies,
            totalPages: result.total,
        };
    }
    async getMovieReviews(id) {
        const tmdb_id = parseInt(id, 10);
        return this.movieService.getMovieReviews(tmdb_id);
    }
    async getMovieByObjectId(objectId) {
        return this.movieService.getMovieByObjectId(objectId);
    }
};
exports.MovieController = MovieController;
__decorate([
    (0, common_1.Get)('detail/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "getMovie", null);
__decorate([
    (0, common_1.Get)('credits/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "getMovieCredits", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "searchMovie", null);
__decorate([
    (0, common_1.Get)('reviews/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "getMovieReviews", null);
__decorate([
    (0, common_1.Get)('byObjectId/:objectId'),
    __param(0, (0, common_1.Param)('objectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "getMovieByObjectId", null);
exports.MovieController = MovieController = __decorate([
    (0, common_1.Controller)('movies'),
    __metadata("design:paramtypes", [movie_service_1.MovieService])
], MovieController);
//# sourceMappingURL=movie.controller.js.map