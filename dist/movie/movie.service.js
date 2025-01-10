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
exports.MovieService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const movie_schema_1 = require("./movie.schema");
let MovieService = class MovieService {
    constructor(movieModel1, movieModel2) {
        this.movieModel1 = movieModel1;
        this.movieModel2 = movieModel2;
    }
    async getMovieById(tmdb_id) {
        console.log(`Searching for movie with tmdb_id2: ${tmdb_id}`);
        const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id }).exec();
        if (movieFromDb1) {
            console.log('Found in movie1Connection');
            return movieFromDb1;
        }
        const movieFromDb2 = await this.movieModel2.findOne({ tmdb_id }).exec();
        if (movieFromDb2) {
            console.log('Found in movie2Connection');
            return movieFromDb2;
        }
        throw new common_1.NotFoundException('Movie not found in either database');
    }
    async getMovieCredits(tmdb_id) {
        console.log(`Searching for movie with tmdb_id1: ${tmdb_id}`);
        const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id }).exec();
        if (movieFromDb1) {
            console.log('Found in movie1Connection');
            return movieFromDb1.credits;
        }
        const movieFromDb2 = await this.movieModel2.findOne({ tmdb_id }).exec();
        if (movieFromDb2) {
            console.log('Found in movie2Connection');
            return movieFromDb2.credits;
        }
        throw new common_1.NotFoundException('Movie not found in either database');
    }
    async getTrailers(tmdb_id) {
        const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id }).exec();
        const movieFromDb2 = await this.movieModel2.findOne({ tmdb_id }).exec();
        let movie = null;
        if (movieFromDb1) {
            movie = movieFromDb1;
        }
        else {
            movie = movieFromDb2;
        }
        if (!movie)
            throw new common_1.NotFoundException('Movie not found.');
        return movie.trailers;
    }
    async searchMovies(filters) {
        const { keyword, minVoteAverage, minVoteCount, releaseDateFrom, releaseDateTo, genres, sortBy = 'vote_average', sortOrder = 'desc', limit = 10, page = 1, } = filters;
        try {
            const query = {};
            if (keyword) {
                query.title = { $regex: keyword, $options: 'i' };
            }
            if (minVoteAverage !== undefined) {
                query.vote_average = { $gte: minVoteAverage };
            }
            if (minVoteCount !== undefined) {
                query.vote_count = { $gte: minVoteCount };
            }
            if (releaseDateFrom || releaseDateTo) {
                query.release_date = {};
                if (releaseDateFrom)
                    query.release_date.$gte = releaseDateFrom;
                if (releaseDateTo)
                    query.release_date.$lte = releaseDateTo;
            }
            if (genres && genres.length > 0) {
                query.genres = { $elemMatch: { name: { $in: genres } } };
            }
            const skip = (page - 1) * limit;
            const moviesFromDb1 = await this.movieModel1
                .find(query)
                .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const countDb1 = await this.movieModel1.countDocuments(query).exec();
            let moviesFromDb2 = [];
            if (skip + limit > countDb1) {
                if (skip > countDb1) {
                    const skip2 = skip - countDb1;
                    moviesFromDb2 = await this.movieModel2
                        .find(query)
                        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
                        .skip(skip2)
                        .limit(limit)
                        .exec();
                }
                else {
                    const skip2 = (skip + limit) - countDb1;
                    moviesFromDb2 = await this.movieModel2
                        .find(query)
                        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
                        .skip(0)
                        .limit(skip2)
                        .exec();
                }
            }
            const countDb2 = await this.movieModel2.countDocuments(query).exec();
            const combinedMovies = [...moviesFromDb1, ...moviesFromDb2];
            const total = Math.ceil((countDb1 + countDb2) / limit);
            console.log('duoc ở BES');
            return { movies: combinedMovies, total };
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.MovieService = MovieService;
exports.MovieService = MovieService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(movie_schema_1.Movie.name, 'movie1Connection')),
    __param(1, (0, mongoose_1.InjectModel)(movie_schema_1.Movie.name, 'movie2Connection')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MovieService);
//# sourceMappingURL=movie.service.js.map